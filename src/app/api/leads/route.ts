import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const stage = searchParams.get('stage')
  const assigneeId = searchParams.get('assigneeId')
  const approvalStatus = searchParams.get('approvalStatus')

  const where: any = {}
  if (stage) where.stage = stage
  if (assigneeId) where.assigneeId = assigneeId
  if (approvalStatus) where.approvalStatus = approvalStatus

  const leads = await prisma.lead.findMany({
    where,
    include: {
      form: true,
      assignee: {
        select: { id: true, name: true }
      },
      stageHistory: {
        orderBy: { changedAt: 'desc' },
        take: 5,
        include: {
          changer: {
            select: { id: true, name: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(leads)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { formId, parentName, phone, studentName, studentAge, email, note, source, utmJson } = body

    const lead = await prisma.lead.create({
      data: {
        formId,
        parentName,
        phone,
        studentName,
        studentAge,
        email,
        note,
        source,
        utmJson,
        stage: 'NEW',
        approvalStatus: 'PENDING'
      }
    })

    // Create initial stage history
    await prisma.leadStageHistory.create({
      data: {
        leadId: lead.id,
        toStage: 'NEW',
        changedBy: session.user?.id || null,
        note: 'Lead created'
      }
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
