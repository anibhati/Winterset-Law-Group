import { PrismaClient, DebtType, AccountStatus, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  await prisma.auditLog.deleteMany()
  await prisma.consultationBooking.deleteMany()
  await prisma.disputeRequest.deleteMany()
  await prisma.paymentPlanRequest.deleteMany()
  await prisma.debtAccount.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.create({
    data: {
      email: 'staff@wintersetlawgroup.com',
      name: 'Test Staff',
      password: 'placeholder-hash',
      role: Role.STAFF,
    },
  })

  const debtors = [
    { accountNumber: 'WLG-2026-001', debtorName: 'John Smith', last4Ssn: '1234', debtType: DebtType.INCOME_TAX, originalAmount: 4500.0, currentBalance: 4500.0, agency: 'Ohio Department of Taxation' },
    { accountNumber: 'WLG-2026-002', debtorName: 'Maria Garcia', last4Ssn: '5678', debtType: DebtType.UNEMPLOYMENT, originalAmount: 2300.5, currentBalance: 1800.5, agency: 'Ohio Department of Job and Family Services', status: AccountStatus.IN_PLAN },
    { accountNumber: 'WLG-2026-003', debtorName: 'David Johnson', last4Ssn: '9012', debtType: DebtType.BWC, originalAmount: 12000.0, currentBalance: 12000.0, agency: 'Ohio Bureau of Workers Compensation' },
    { accountNumber: 'WLG-2026-004', debtorName: 'Sarah Patel', last4Ssn: '3456', debtType: DebtType.BUSINESS_TAX, originalAmount: 8750.0, currentBalance: 8750.0, agency: 'Ohio Department of Taxation' },
    { accountNumber: 'WLG-2026-005', debtorName: 'Robert Williams', last4Ssn: '7890', debtType: DebtType.MEDICAID, originalAmount: 3200.0, currentBalance: 0, agency: 'Ohio Department of Medicaid', status: AccountStatus.RESOLVED },
    { accountNumber: 'WLG-2026-006', debtorName: 'Emily Chen', last4Ssn: '2468', debtType: DebtType.INCOME_TAX, originalAmount: 1500.0, currentBalance: 1500.0, agency: 'Ohio Department of Taxation' },
  ]

  for (const d of debtors) {
    await prisma.debtAccount.create({ data: d })
  }

  console.log('Created ' + debtors.length + ' debt accounts and 1 staff user.')
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1) })
