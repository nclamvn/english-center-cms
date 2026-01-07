import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/utils'

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
    const { expiresInDays = 30 } = body

    // Revoke existing active tokens
    await prisma.parentPreviewToken.updateMany({
      where: {
        studentId: id,
        status: 'ACTIVE'
      },
      data: { status: 'REVOKED' }
    })

    // Create new token
    const token = generateToken(48)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const previewToken = await prisma.parentPreviewToken.create({
      data: {
        studentId: id,
        token,
        expiresAt,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({
      token: previewToken.token,
      expiresAt: previewToken.expiresAt,
      previewUrl: `/p/${previewToken.token}`
    })
  } catch (error) {
    console.error('Error creating preview token:', error)
    return NextResponse.json({ error: 'Failed to create preview token' }, { status: 500 })
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
    await prisma.parentPreviewToken.updateMany({
      where: {
        studentId: id,
        status: 'ACTIVE'
      },
      data: { status: 'REVOKED' }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error revoking preview tokens:', error)
    return NextResponse.json({ error: 'Failed to revoke tokens' }, { status: 500 })
  }
}
