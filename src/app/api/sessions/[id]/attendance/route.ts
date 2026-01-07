import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'

// GET attendance for a session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Get session with class enrollments
  const sessionData = await prisma.session.findUnique({
    where: { id },
    include: {
      class: {
        include: {
          enrollments: {
            where: { status: 'ACTIVE' },
            include: {
              student: true
            }
          }
        }
      },
      attendances: {
        include: {
          student: true,
          marker: {
            select: { id: true, name: true }
          }
        }
      }
    }
  })

  if (!sessionData) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // Map enrollments to attendance status
  const attendanceMap = new Map(
    sessionData.attendances.map(a => [a.studentId, a])
  )

  const studentsWithAttendance = sessionData.class.enrollments.map(enrollment => ({
    student: enrollment.student,
    attendance: attendanceMap.get(enrollment.studentId) || null
  }))

  // Calculate if session should be auto-locked
  const sessionDate = new Date(sessionData.date)
  const [hours, minutes] = sessionData.endTime.split(':').map(Number)
  sessionDate.setHours(hours, minutes, 0, 0)
  const lockDeadline = new Date(sessionDate.getTime() + 2 * 60 * 60 * 1000)
  const shouldAutoLock = new Date() > lockDeadline && sessionData.status === 'COMPLETED'

  return NextResponse.json({
    session: {
      id: sessionData.id,
      date: sessionData.date,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      mode: sessionData.mode,
      room: sessionData.room,
      status: sessionData.status,
      // Lock info
      isLocked: !!sessionData.lockedAt,
      lockedAt: sessionData.lockedAt,
      lockReason: sessionData.lockReason,
      shouldAutoLock,
      class: {
        id: sessionData.class.id,
        name: sessionData.class.name
      }
    },
    students: studentsWithAttendance
  })
}

// Bulk save attendance
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    // Check if session is locked
    const classSession = await prisma.session.findUnique({
      where: { id },
      select: {
        lockedAt: true,
        lockReason: true,
        status: true,
        endTime: true,
        date: true
      }
    })

    if (!classSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (classSession.lockedAt) {
      return NextResponse.json({
        error: 'Buổi học đã bị khóa. Không thể chỉnh sửa điểm danh.',
        lockedAt: classSession.lockedAt,
        lockReason: classSession.lockReason
      }, { status: 403 })
    }

    // Check if should be auto-locked
    const sessionDate = new Date(classSession.date)
    const [hours, minutes] = classSession.endTime.split(':').map(Number)
    sessionDate.setHours(hours, minutes, 0, 0)
    const lockDeadline = new Date(sessionDate.getTime() + 2 * 60 * 60 * 1000)

    if (new Date() > lockDeadline && classSession.status === 'COMPLETED') {
      // Auto-lock the session
      await prisma.session.update({
        where: { id },
        data: {
          lockedAt: new Date(),
          lockedBy: null,
          lockReason: 'Tự động khóa sau 2 giờ kết thúc'
        }
      })

      return NextResponse.json({
        error: 'Buổi học đã tự động bị khóa (quá 2 giờ sau khi kết thúc).',
        autoLocked: true
      }, { status: 403 })
    }

    const body = await request.json()
    const { attendances } = body // Array of { studentId, status, lateMinutes?, note?, attachment? }

    if (!Array.isArray(attendances)) {
      return NextResponse.json({ error: 'Invalid attendances data' }, { status: 400 })
    }

    const results = []

    for (const att of attendances) {
      const { studentId, status, lateMinutes, note, attachment } = att

      // Get existing attendance for logging
      const existingAttendance = await prisma.attendance.findUnique({
        where: {
          sessionId_studentId: {
            sessionId: id,
            studentId
          }
        }
      })

      const isCreate = !existingAttendance

      // Upsert attendance record
      const attendance = await prisma.attendance.upsert({
        where: {
          sessionId_studentId: {
            sessionId: id,
            studentId
          }
        },
        update: {
          status,
          lateMinutes: status === 'LATE' ? lateMinutes : null,
          note,
          attachment,
          markedBy: session.user.id,
          markedAt: new Date()
        },
        create: {
          sessionId: id,
          studentId,
          status,
          lateMinutes: status === 'LATE' ? lateMinutes : null,
          note,
          attachment,
          markedBy: session.user.id,
          markedAt: new Date()
        }
      })

      // Create attendance log for audit trail
      if (isCreate || existingAttendance?.status !== status || existingAttendance?.note !== note) {
        await prisma.attendanceLog.create({
          data: {
            attendanceId: attendance.id,
            action: isCreate ? 'CREATE' : 'UPDATE',
            previousStatus: existingAttendance?.status || null,
            newStatus: status,
            previousNote: existingAttendance?.note || null,
            newNote: note || null,
            changedBy: session.user.id,
            reason: null
          }
        })
      }

      await createAuditLog({
        actorId: session.user.id,
        entity: 'Attendance',
        entityId: attendance.id,
        action: isCreate ? 'CREATE' : 'UPDATE',
        before: existingAttendance || undefined,
        after: attendance
      })

      results.push(attendance)
    }

    // Update session status to IN_PROGRESS if SCHEDULED
    const updatedSession = await prisma.session.findUnique({
      where: { id },
      select: { status: true }
    })

    if (updatedSession?.status === 'SCHEDULED') {
      await prisma.session.update({
        where: { id },
        data: { status: 'IN_PROGRESS' }
      })
    }

    return NextResponse.json({ success: true, count: results.length })
  } catch (error) {
    console.error('Error saving attendance:', error)
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 })
  }
}
