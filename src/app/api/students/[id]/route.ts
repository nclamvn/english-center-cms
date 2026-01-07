import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          class: {
            include: {
              course: true,
              branch: true
            }
          }
        }
      },
      studentParents: {
        include: {
          parent: true
        }
      },
      attendances: {
        include: {
          session: {
            include: {
              class: true
            }
          }
        },
        orderBy: { session: { date: 'desc' } },
        take: 20
      },
      submissions: {
        include: {
          assignment: {
            include: {
              template: true
            }
          },
          grading: true
        },
        orderBy: { submittedAt: 'desc' },
        take: 10
      },
      previewTokens: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  })

  if (!student) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 })
  }

  return NextResponse.json(student)
}

export async function PATCH(
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
    const { fullName, dob, gender, phone, email, notes, status } = body

    const before = await prisma.student.findUnique({ where: { id } })

    const student = await prisma.student.update({
      where: { id },
      data: {
        ...(fullName && { fullName }),
        ...(dob !== undefined && { dob: dob ? new Date(dob) : null }),
        ...(gender !== undefined && { gender }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(notes !== undefined && { notes }),
        ...(status && { status })
      }
    })

    await createAuditLog({
      actorId: session.user.id,
      entity: 'Student',
      entityId: student.id,
      action: 'UPDATE',
      before,
      after: student
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const before = await prisma.student.findUnique({ where: { id } })

    await prisma.student.delete({ where: { id } })

    await createAuditLog({
      actorId: session.user.id,
      entity: 'Student',
      entityId: id,
      action: 'DELETE',
      before
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}
