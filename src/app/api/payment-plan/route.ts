import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountNumber, frequency, installmentAmount, startDate } = body

    if (!accountNumber || !frequency || !installmentAmount || !startDate) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const account = await prisma.debtAccount.findUnique({
      where: { accountNumber: accountNumber.trim() },
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
    }

    await prisma.paymentPlanRequest.create({
      data: {
        debtAccountId: account.id,
        frequency,
        installmentAmount: parseFloat(installmentAmount),
        startDate: new Date(startDate),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment plan submission error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}
