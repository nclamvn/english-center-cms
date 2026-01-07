import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET checklist for a session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Get session
  const sessionData = await prisma.session.findUnique({
    where: { id },
    include: {
      checklistItems: {
        include: {
          user: {
            select: { id: true, name: true }
          }
        },
        orderBy: { order: 'asc' }
      },
      class: {
        select: { id: true, name: true }
      }
    }
  })

  if (!sessionData) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // If no checklist items, create from template
  if (sessionData.checklistItems.length === 0) {
    const template = await prisma.checklistTemplate.findFirst({
      where: {
        sessionMode: sessionData.mode,
        status: 'ACTIVE'
      }
    })

    if (template) {
      const items = template.itemsJson as any[]
      for (const item of items) {
        await prisma.sessionChecklistItem.create({
          data: {
            sessionId: id,
            templateId: template.id,
            title: item.title,
            order: item.order,
            status: 'TODO'
          }
        })
      }

      // Refetch with created items
      const updatedSession = await prisma.session.findUnique({
        where: { id },
        include: {
          checklistItems: {
            include: {
              user: {
                select: { id: true, name: true }
              }
            },
            orderBy: { order: 'asc' }
          },
          class: {
            select: { id: true, name: true }
          }
        }
      })

      return NextResponse.json(updatedSession)
    }
  }

  return NextResponse.json(sessionData)
}

// Update checklist items
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
    const { items } = body // Array of { id, status, note? }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items data' }, { status: 400 })
    }

    for (const item of items) {
      await prisma.sessionChecklistItem.update({
        where: { id: item.id },
        data: {
          status: item.status,
          note: item.note || null,
          doneBy: item.status === 'DONE' ? session.user.id : null,
          doneAt: item.status === 'DONE' ? new Date() : null
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating checklist:', error)
    return NextResponse.json({ error: 'Failed to update checklist' }, { status: 500 })
  }
}
