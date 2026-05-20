import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountNumber, lastName } = body

    if (!accountNumber || !lastName) {
      return NextResponse.json(
        { error: 'Account number and last name are required.' },
        { status: 400 }
      )
    }

    const account = await prisma.debtAccount.findUnique({
      where: { accountNumber: accountNumber.trim() },
    })

    if (!account) {
      return NextResponse.json(
        { error: 'We could not find an account matching those details.' },
        { status: 404 }
      )
    }

    // Verify last name matches (case-insensitive)
    const accountLastName = account.debtorName.split(' ').slice(-1)[0].toLowerCase()
    if (accountLastName !== lastName.trim().toLowerCase()) {
      // Return the same generic error to avoid leaking which accounts exist
      return NextResponse.json(
        { error: 'We could not find an account matching those details.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      accountNumber: account.accountNumber,
      debtorName: account.debtorName,
      debtType: account.debtType,
      currentBalance: account.currentBalance,
      originalAmount: account.originalAmount,
      agency: account.agency,
      status: account.status,
    })
  } catch (error) {
    console.error('Lookup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
