import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get('date')
  const classId = searchParams.get('classId')
  const status = searchParams.get('status')
  const teacherId = searchParams.get('teacherId')

  const where: any = {}

  if (date) {
    const dateObj = new Date(date)
    where.date = dateObj
  }

  if (classId) {
    where.classId = classId
  }

  if (status) {
    where.status = status
  }

  if (teacherId) {
    where.OR = [
      { teacherId },
      { taId: teacherId }
    ]
  }

  const sessions = await prisma.session.findMany({
    where,
    include: {
      class: {
        include: {
          course: true,
          branch: true,
          enrollments: {
            where: { status: 'ACTIVE' },
            select: { id: true }
          }
        }
      },
      teacher: {
        select: { id: true, name: true }
      },
      ta: {
        select: { id: true, name: true }
      },
      attendances: {
        select: { id: true, status: true }
      }
    },
    orderBy: [
      { date: 'desc' },
      { startTime: 'asc' }
    ]
  })

  // Calculate attendance stats
  const sessionsWithStats = sessions.map(s => {
    const totalStudents = s.class.enrollments.length
    const markedCount = s.attendances.length
    const presentCount = s.attendances.filter(a =>
      ['PRESENT', 'LATE', 'ONLINE'].includes(a.status)
    ).length

    return {
      ...s,
      stats: {
        totalStudents,
        markedCount,
        presentCount,
        attendanceRate: totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0
      }
    }
  })

  return NextResponse.json(sessionsWithStats)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { classId, date, startTime, endTime, mode, room, teacherId, taId } = body

    const sessionData = await prisma.session.create({
      data: {
        classId,
        date: new Date(date),
        startTime,
        endTime,
        mode: mode || 'OFFLINE',
        room,
        teacherId,
        taId,
        status: 'SCHEDULED'
      }
    })

    return NextResponse.json(sessionData, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
