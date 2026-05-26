import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be signed in to file a dispute.' }, { status: 401 })
    }

    const body = await request.json()
    const { reason, description } = body

    if (!reason || !description) {
      return NextResponse.json({ error: 'Reason and description are required.' }, { status: 400 })
    }

    if (description.trim().length < 20) {
      return NextResponse.json({ error: 'Please provide at least 20 characters of detail.' }, { status: 400 })
    }

    const validReasons = ['WRONG_AMOUNT', 'ALREADY_PAID', 'NOT_MY_DEBT', 'IDENTITY_THEFT', 'OTHER']
    if (!validReasons.includes(reason)) {
      return NextResponse.json({ error: 'Invalid dispute reason.' }, { status: 400 })
    }

    const account = await prisma.debtAccount.findUnique({
      where: { userId: session.user.id },
    })
    if (!account) {
      return NextResponse.json({ error: 'No linked debt account found.' }, { status: 404 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, phone: true },
    })

    const existing = await prisma.disputeRequest.findFirst({
      where: { userId: session.user.id, status: 'PENDING' },
    })
    if (existing) {
      return NextResponse.json({ error: 'You already have a dispute under review.' }, { status: 409 })
    }

    await prisma.disputeRequest.create({
      data: {
        userId: session.user.id,
        accountNumber: account.accountNumber,
        reason,
        description: description.trim(),
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Dispute submission error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}