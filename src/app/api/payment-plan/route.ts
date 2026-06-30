import { NextRequest, NextResponse, after } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { syncPaymentPlan } from '@/lib/crm/sync'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isStaff = session.user.role === 'STAFF' || session.user.role === 'ATTORNEY'

  const plans = await prisma.paymentPlanRequest.findMany({
    where: isStaff ? { status: 'PENDING' } : { userId: session.user.id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      debtAccount: { select: { accountNumber: true, debtType: true, currentBalance: true, agency: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(plans)
}

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
    const account = await prisma.debtAccount.findUnique({
      where: { userId: session.user.id },
    })
    if (!account) {
      return NextResponse.json({ error: 'No linked debt account. Please complete the lookup first.' }, { status: 404 })
    }
    const existingPending = await prisma.paymentPlanRequest.findFirst({
      where: { userId: session.user.id, status: 'PENDING' },
    })
    if (existingPending) {
      return NextResponse.json({ error: 'You already have a pending plan under review.' }, { status: 409 })
    }
    const plan = await prisma.paymentPlanRequest.create({
      data: {
        userId: session.user.id,
        debtAccountId: account.id,
        frequency,
        installmentAmount: amount,
        startDate: start,
      },
    })
    // Wrapped in after() so Vercel keeps this function alive long enough
    // for the CRM sync to finish, instead of freezing the runtime the
    // moment the response below is sent.
    after(() =>
      syncPaymentPlan({
        id: plan.id,
        accountNumber: account.accountNumber,
        debtorName: account.debtorName,
        frequency,
        installmentAmount: amount,
        startDate: start,
      })
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment plan submission error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}