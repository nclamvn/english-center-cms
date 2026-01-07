import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''

  const where: any = {}
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { email: { contains: search, mode: 'insensitive' } }
    ]
  }
  if (status) {
    where.status = status
  }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: {
        enrollments: {
          include: {
            class: {
              select: { id: true, name: true }
            }
          },
          where: { status: 'ACTIVE' }
        },
        studentParents: {
          include: {
            parent: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.student.count({ where })
  ])

  return NextResponse.json({
    data: students,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { fullName, dob, gender, phone, email, notes, parentData } = body

    const student = await prisma.student.create({
      data: {
        fullName,
        dob: dob ? new Date(dob) : null,
        gender,
        phone,
        email,
        notes,
        status: 'ACTIVE'
      }
    })

    // Create parent if provided
    if (parentData?.fullName) {
      const parent = await prisma.parent.create({
        data: {
          fullName: parentData.fullName,
          phone: parentData.phone,
          email: parentData.email
        }
      })

      await prisma.studentParent.create({
        data: {
          studentId: student.id,
          parentId: parent.id,
          relationship: parentData.relationship || 'GUARDIAN',
          isPrimary: true
        }
      })
    }

    await createAuditLog({
      actorId: session.user.id,
      entity: 'Student',
      entityId: student.id,
      action: 'CREATE',
      after: student
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}
