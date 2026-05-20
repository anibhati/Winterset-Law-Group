import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountNumber, reason, description, name, email, phone } = body

    if (!accountNumber || !reason || !description || !name || !email || !phone) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const account = await prisma.debtAccount.findUnique({
      where: { accountNumber: accountNumber.trim() },
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
    }

    await prisma.disputeRequest.create({
      data: {
        accountNumber: accountNumber.trim(),
        reason: reason.trim(),
        description: description.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Dispute submission error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}
