import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/sessions/[id]/attendance/logs - Get all attendance logs for a session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: sessionId } = await params

    // Get all attendances for this session with their logs
    const attendances = await prisma.attendance.findMany({
      where: { sessionId },
      include: {
        student: {
          select: {
            id: true,
            fullName: true
          }
        },
        logs: {
          include: {
            changer: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { changedAt: 'desc' }
        }
      }
    })

    // Flatten logs with student info
    const allLogs = attendances.flatMap(attendance =>
      attendance.logs.map(log => ({
        id: log.id,
        studentId: attendance.student.id,
        studentName: attendance.student.fullName,
        action: log.action,
        previousStatus: log.previousStatus,
        newStatus: log.newStatus,
        previousNote: log.previousNote,
        newNote: log.newNote,
        changedBy: log.changer?.name || 'System',
        changedAt: log.changedAt,
        reason: log.reason
      }))
    )

    // Sort by changedAt descending
    allLogs.sort((a, b) =>
      new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
    )

    return NextResponse.json(allLogs)

  } catch (error) {
    console.error("Error fetching attendance logs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
