import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be signed in to submit a payment plan.' }, { status: 401 })
    }

    const body = await request.json()
    const { frequency, installmentAmount, startDate } = body

    if (!frequency || !installmentAmount || !startDate) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Validate frequency against the enum
    const validFrequencies = ['WEEKLY', 'BIWEEKLY', 'MONTHLY']
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json({ error: 'Invalid payment frequency.' }, { status: 400 })
    }

    const amount = parseFloat(installmentAmount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Installment amount must be a positive number.' }, { status: 400 })
    }

    const start = new Date(startDate)
    if (isNaN(start.getTime())) {
      return NextResponse.json({ error: 'Invalid start date.' }, { status: 400 })
    }

    // Find the user's linked debt account (don't trust account # from the request body)
    const account = await prisma.debtAccount.findUnique({
      where: { userId: session.user.id },
    })
    if (!account) {
      return NextResponse.json({ error: 'No linked debt account. Please complete the lookup first.' }, { status: 404 })
    }

    // Reject if there's already a PENDING plan — user must cancel it before submitting a new one
    const existingPending = await prisma.paymentPlanRequest.findFirst({
      where: { userId: session.user.id, status: 'PENDING' },
    })
    if (existingPending) {
      return NextResponse.json({ error: 'You already have a pending plan under review.' }, { status: 409 })
    }

    await prisma.paymentPlanRequest.create({
      data: {
        userId: session.user.id,
        debtAccountId: account.id,
        frequency,
        installmentAmount: amount,
        startDate: start,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment plan submission error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}