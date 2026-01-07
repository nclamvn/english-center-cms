import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const body = await request.json()
    const { stage, note } = body

    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const fromStage = lead.stage

    // Update lead stage
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { stage }
    })

    // Create stage history
    await prisma.leadStageHistory.create({
      data: {
        leadId: id,
        fromStage,
        toStage: stage,
        changedBy: session.user.id,
        note
      }
    })

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error('Error updating lead stage:', error)
    return NextResponse.json({ error: 'Failed to update lead stage' }, { status: 500 })
  }
}
