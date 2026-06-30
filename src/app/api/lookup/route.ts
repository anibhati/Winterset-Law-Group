import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

// 10 attempts per 10 minutes per IP. This endpoint takes a 4-digit SSN
// suffix as one of its inputs (10,000 possible values) — without a tight
// limit here it's brute-forceable against a known account number/last name.
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

    // Normalize last4Ssn — strip anything that isn't a digit, then check length
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

    // Use a single generic error for every "no match" case so attackers can't
    // distinguish wrong account # from wrong name from wrong SSN.
    const genericNotFound = NextResponse.json(
      { error: 'We could not find an account matching those details.' },
      { status: 404 }
    )

    if (!account) return genericNotFound

    const accountLastName = account.debtorName.split(' ').slice(-1)[0].toLowerCase()
    if (accountLastName !== lastName.trim().toLowerCase()) return genericNotFound

    if (account.last4Ssn !== cleanSsn) return genericNotFound

    // --- Claim logic: only runs if the user is logged in ---
    const session = await getServerSession(authOptions)
    let claimed = false

    if (session?.user?.id) {
      if (account.userId && account.userId !== session.user.id) {
        // Account is already claimed by someone else — generic error, don't reveal anything
        return genericNotFound
      }

      if (!account.userId) {
        // Unclaimed — link it to this user
        await prisma.debtAccount.update({
          where: { id: account.id },
          data: { userId: session.user.id },
        })
        claimed = true
      }
      // If already claimed by this same user, no-op (idempotent)
    }

    return NextResponse.json({
      accountNumber: account.accountNumber,
      debtorName: account.debtorName,
      debtType: account.debtType,
      currentBalance: account.currentBalance,
      originalAmount: account.originalAmount,
      agency: account.agency,
      status: account.status,
      claimed, // true if we just linked the account to the session user
    })
  } catch (error) {
    console.error('Lookup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}