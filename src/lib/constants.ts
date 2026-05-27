export const FIRM = {
  name: "Winterset Law Group",
  shortName: "WLG",
  tagline: "People First: Fair, Manageable Solutions",
  phone: "614-453-1200",
  email: "ohiospecialcounsel@wintersetlawgroup.com",
  smsNumber: "54627",
  smsKeyword: "JOIN",
  hours: "Monday to Friday, 8:30 AM to 4:30 PM",
  address: "3980 N Hampton Dr., Powell, OH 43065",
  partner: {
    name: "Christopher J. Stevens",
    email: "c.stevens@wintersetlawgroup.com",
    title: "Managing Partner",
  },
  role: "Special Counsel to the Ohio Attorney General's Office (Tax Division)",
  authority: "ORC 109.08",
  servingSince: 1994,
} as const;

export const DISCLOSURES = {
  debtCollection:
    "This is an attempt to collect a debt, and any information obtained will be used for that purpose.",
  smsOptIn:
    "By signing up via text, you agree to receive recurring messages regarding your account, such as payment reminders, at the cell number used when signing up. Reply HELP for help and STOP to cancel. Message frequency may vary. Message and data rates may apply.",
} as const;

// Available consultation time slots (Monday to Friday)
export const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
] as const;

export const DEBT_TYPE_LABELS: Record<string, string> = {
  INCOME_TAX: "Personal Income Tax",
  BUSINESS_TAX: "Business Tax",
  SALES_TAX: "Sales Tax",
  WITHHOLDING_TAX: "Withholding Tax",
  BWC: "Bureau of Workers' Compensation",
  UNEMPLOYMENT: "Unemployment Compensation",
  MEDICAID: "Medicaid",
  OTHER: "Other State Collections",
};

export const DISPUTE_REASON_LABELS: Record<string, string> = {
  WRONG_AMOUNT: "The amount is wrong",
  ALREADY_PAID: "I already paid this",
  NOT_MY_DEBT: "This is not my debt",
  IDENTITY_THEFT: "I may be a victim of identity theft",
  OTHER: "Other reason",
};