import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/sessions/[id]/lock - Lock or unlock a session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, reason } = body // action: 'lock' | 'unlock'

    // Get the session
    const classSession = await prisma.session.findUnique({
      where: { id },
      include: { class: true }
    })

    if (!classSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    if (action === 'lock') {
      // Lock the session
      const updated = await prisma.session.update({
        where: { id },
        data: {
          lockedAt: new Date(),
          lockedBy: session.user.id,
          lockReason: reason || 'Auto-locked after 2 hours'
        }
      })

      return NextResponse.json({
        success: true,
        message: "Session locked successfully",
        session: updated
      })

    } else if (action === 'unlock') {
      // Only admins can unlock
      // TODO: Add role check here

      if (!reason) {
        return NextResponse.json(
          { error: "Reason is required for unlocking" },
          { status: 400 }
        )
      }

      const updated = await prisma.session.update({
        where: { id },
        data: {
          lockedAt: null,
          lockedBy: null,
          lockReason: null
        }
      })

      // Log the unlock action in audit
      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          entity: 'Session',
          entityId: id,
          action: 'UNLOCK',
          diffJson: {
            reason,
            unlockedAt: new Date().toISOString()
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: "Session unlocked successfully",
        session: updated
      })

    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'lock' or 'unlock'" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error("Error in session lock:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET /api/sessions/[id]/lock - Get lock status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const classSession = await prisma.session.findUnique({
      where: { id },
      select: {
        id: true,
        lockedAt: true,
        lockedBy: true,
        lockReason: true,
        status: true,
        endTime: true,
        date: true
      }
    })

    if (!classSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Calculate if session should be auto-locked (2 hours after end time)
    const sessionDate = new Date(classSession.date)
    const [hours, minutes] = classSession.endTime.split(':').map(Number)
    sessionDate.setHours(hours, minutes, 0, 0)

    const lockDeadline = new Date(sessionDate.getTime() + 2 * 60 * 60 * 1000) // +2 hours
    const shouldBeLocked = new Date() > lockDeadline && classSession.status === 'COMPLETED'

    return NextResponse.json({
      id: classSession.id,
      isLocked: !!classSession.lockedAt,
      lockedAt: classSession.lockedAt,
      lockedBy: classSession.lockedBy,
      lockReason: classSession.lockReason,
      shouldAutoLock: shouldBeLocked && !classSession.lockedAt
    })

  } catch (error) {
    console.error("Error getting lock status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
