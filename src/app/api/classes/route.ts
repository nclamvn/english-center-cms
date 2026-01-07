import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const branchId = searchParams.get('branchId')

  const where: any = {}
  if (status) where.status = status
  if (branchId) where.branchId = branchId

  const classes = await prisma.class.findMany({
    where,
    include: {
      course: true,
      branch: true,
      _count: {
        select: {
          enrollments: true,
          sessions: true
        }
      }
    },
    orderBy: { startDate: 'desc' }
  })

  return NextResponse.json(classes)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { courseId, branchId, name, startDate, endDate } = body

    const classData = await prisma.class.create({
      data: {
        courseId,
        branchId,
        name,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json(classData, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 })
  }
}
