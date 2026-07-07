import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthedUser } from '@/lib/mobile-auth'
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

const LOOKUP_LIMIT = 10;
const LOOKUP_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`lookup:${ip}`, LOOKUP_LIMIT, LOOKUP_WINDOW_MS);
    if (!rl.success) return rateLimitResponse(rl);

    const body = await request.json()
    const { accountNumber, lastName, last4Ssn } = body
    if (!accountNumber || !lastName || !last4Ssn) {
      return NextResponse.json(
        { error: 'Account number, last name, and last 4 of SSN are required.' },
        { status: 400 }
      )
    }

    const cleanSsn = String(last4Ssn).replace(/\D/g, '')
    if (cleanSsn.length !== 4) {
      return NextResponse.json(
        { error: 'We could not find an account matching those details.' },
        { status: 404 }
      )
    }

    const account = await prisma.debtAccount.findUnique({
      where: { accountNumber: accountNumber.trim() },
    })

    const genericNotFound = NextResponse.json(
      { error: 'We could not find an account matching those details.' },
      { status: 404 }
    )
    if (!account) return genericNotFound
    const accountLastName = account.debtorName.split(' ').slice(-1)[0].toLowerCase()
    if (accountLastName !== lastName.trim().toLowerCase()) return genericNotFound
    if (account.last4Ssn !== cleanSsn) return genericNotFound

    // Works for both web session cookies and mobile Bearer tokens now
    const authedUser = await getAuthedUser(request)
    let claimed = false
    if (authedUser) {
      if (account.userId && account.userId !== authedUser.id) {
        return genericNotFound
      }
      if (!account.userId) {
        await prisma.debtAccount.update({
          where: { id: account.id },
          data: { userId: authedUser.id },
        })
        claimed = true
      }
    }

    return NextResponse.json({
      accountNumber: account.accountNumber,
      debtorName: account.debtorName,
      debtType: account.debtType,
      currentBalance: account.currentBalance,
      originalAmount: account.originalAmount,
      agency: account.agency,
      status: account.status,
      claimed,
    })
  } catch (error) {
    console.error('Lookup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
