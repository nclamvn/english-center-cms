import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { classId, periodStart, periodEnd } = body

    if (!classId || !periodStart || !periodEnd) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get billing plan for the class
    const billingPlan = await prisma.billingPlan.findFirst({
      where: {
        classId,
        status: 'ACTIVE'
      }
    })

    if (!billingPlan) {
      return NextResponse.json({ error: 'No billing plan found for this class' }, { status: 400 })
    }

    const rules = billingPlan.rulesJson as any

    // Get all active enrollments for the class
    const enrollments = await prisma.enrollment.findMany({
      where: {
        classId,
        status: 'ACTIVE'
      },
      include: {
        student: true
      }
    })

    // Get all sessions in the period
    const sessions = await prisma.session.findMany({
      where: {
        classId,
        date: {
          gte: new Date(periodStart),
          lte: new Date(periodEnd)
        },
        status: { not: 'CANCELLED' }
      },
      include: {
        attendances: true
      }
    })

    const charges = []

    for (const enrollment of enrollments) {
      let chargeableSessions = 0
      const sessionBreakdown = []

      for (const sess of sessions) {
        const attendance = sess.attendances.find(a => a.studentId === enrollment.studentId)

        let countAs = 0
        let status = 'NO_RECORD'

        if (attendance) {
          status = attendance.status
          switch (attendance.status) {
            case 'PRESENT':
              countAs = rules.presentCountsAs ?? 1
              break
            case 'LATE':
              countAs = rules.lateCountsAs ?? 1
              break
            case 'ABSENT_EXCUSED':
              countAs = rules.absentExcusedCountsAs ?? 0
              break
            case 'ABSENT_UNEXCUSED':
              countAs = rules.absentUnexcusedCountsAs ?? 1
              break
            case 'MAKEUP':
              countAs = rules.makeupCountsAs ?? 0
              break
            case 'ONLINE':
              countAs = rules.onlineCountsAs ?? 1
              break
          }
        } else {
          // No attendance record = absent unexcused
          countAs = rules.absentUnexcusedCountsAs ?? 1
        }

        chargeableSessions += countAs
        sessionBreakdown.push({
          sessionId: sess.id,
          date: sess.date,
          status,
          countAs
        })
      }

      const amount = chargeableSessions * billingPlan.pricePerSession

      // Create or update charge
      const charge = await prisma.charge.upsert({
        where: {
          id: `${enrollment.studentId}-${classId}-${periodStart}`
        },
        update: {
          amount,
          calcJson: {
            sessions: sessionBreakdown,
            chargeableSessions,
            pricePerSession: billingPlan.pricePerSession,
            rules
          }
        },
        create: {
          id: `${enrollment.studentId}-${classId}-${periodStart}`,
          studentId: enrollment.studentId,
          classId,
          periodStart: new Date(periodStart),
          periodEnd: new Date(periodEnd),
          amount,
          calcJson: {
            sessions: sessionBreakdown,
            chargeableSessions,
            pricePerSession: billingPlan.pricePerSession,
            rules
          },
          status: 'PENDING'
        }
      })

      await createAuditLog({
        actorId: session.user.id,
        entity: 'Charge',
        entityId: charge.id,
        action: 'CREATE',
        after: charge
      })

      charges.push({
        ...charge,
        student: enrollment.student
      })
    }

    return NextResponse.json({
      success: true,
      chargesGenerated: charges.length,
      charges
    })
  } catch (error) {
    console.error('Error generating billing:', error)
    return NextResponse.json({ error: 'Failed to generate billing' }, { status: 500 })
  }
}
