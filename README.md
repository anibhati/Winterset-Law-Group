# Winterset Law Group — Debt Resolution Portal

A secure, mobile-responsive web application for Ohio residents to understand and resolve state debt obligations through Winterset Law Group, Special Counsel to the Ohio Attorney General's Office (Tax Division).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS (navy + gold theme) |
| Auth | NextAuth.js v4 + mandatory 2FA |
| 2FA | TOTP (otplib) + SMS OTP (Twilio) |
| Database | PostgreSQL + Prisma ORM |
| Payments | Stripe (PCI-compliant, Elements) |
| SMS | Twilio (opt-in reminders) |
| Security | HTTPS, CSRF, rate limiting, audit logging |

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local and fill in all required values
```

### 3. Set up the database
```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to your PostgreSQL database
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages (no auth)
│   │   ├── page.tsx       # Landing / Home
│   │   ├── about/         # About WLG + partner bio
│   │   ├── focus/         # Debt types WLG handles
│   │   ├── contact/       # Contact form + info
│   │   ├── sms-optin/     # SMS opt-in details
│   │   └── legal/         # Terms, Privacy, SMS Terms
│   ├── (auth)/            # Auth pages (minimal layout)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── verify-2fa/    # 2FA challenge (SMS/TOTP/backup)
│   │   ├── setup-2fa/     # 2FA onboarding wizard
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/       # Protected pages (auth + 2FA required)
│   │   ├── dashboard/     # Account overview
│   │   ├── payment/       # Payment portal + plan setup
│   │   └── account/       # Account settings
│   └── api/
│       ├── auth/          # NextAuth + signup + 2FA + password reset
│       ├── account/       # Account data API
│       ├── payment/       # Stripe payment intent + webhook + plans
│       └── sms/           # SMS opt-in/out
├── components/
│   ├── layout/            # Header, Footer
│   ├── auth/              # Auth-specific components
│   └── Providers.tsx      # NextAuth SessionProvider
├── lib/
│   ├── auth.ts            # NextAuth config + JWT callbacks
│   ├── db.ts              # Prisma client singleton
│   ├── totp.ts            # TOTP generation + verification
│   ├── backup-codes.ts    # Recovery code generation + verification
│   ├── twilio.ts          # SMS delivery
│   ├── stripe.ts          # Stripe client + PaymentIntent helpers
│   ├── audit.ts           # Compliance audit logging
│   ├── constants.ts       # Firm info, disclosures, config values
│   └── utils.ts           # Formatting, rate limiting helpers
├── middleware.ts           # Route protection + 2FA gate
prisma/
└── schema.prisma          # Full database schema
```

---

## Security Features

- **Mandatory 2FA** — all authenticated users must complete 2FA setup and challenge
- **15-minute session timeout** — idle sessions are invalidated automatically
- **Rate limiting** — login, 2FA, OTP, and password reset endpoints are rate-limited
- **Audit logging** — all significant actions (login, payment, 2FA events) are logged
- **PCI compliance** — card data handled entirely by Stripe Elements, never touches our server
- **Security headers** — X-Frame-Options, HSTS, CSP, XSS protection via `next.config.ts`
- **Account lockout** — `lockedUntil` field on User table supports brute-force protection (implement logic in auth)
- **Encrypted passwords** — bcrypt with cost factor 12

---

## Legal & Compliance Checklist

> ⚠️  **Items requiring legal review before go-live:**

- [ ] **Terms & Conditions** — placeholder content, must be finalized by counsel
- [ ] **Privacy Policy** — placeholder, review for FDCPA + Ohio law compliance
- [ ] **SMS Terms** — TCPA disclosure language is standard; have counsel confirm for your carrier/program
- [ ] **FDCPA disclosure** — currently displayed in top banner and footer; verify placement meets requirements
- [ ] **Payment terms** — finalize what happens on missed plan payments
- [ ] **Data retention policy** — specify retention periods in Privacy Policy
- [ ] **Supported SMS carriers** — fill in supported carrier list in SMS Terms
- [ ] **TOTP secret encryption** — in production, encrypt `totpSecret` at rest using KMS/Vault rather than storing plaintext
- [ ] **Email delivery** — wire up Nodemailer/Resend for password reset emails
- [ ] **Session revocation** — current implementation uses JWT (stateless); if you need server-side revocation, switch to database sessions in NextAuth
- [ ] **Rate limiting** — current implementation is in-memory (resets on server restart); use Redis-backed rate limiter (e.g., `@upstash/ratelimit`) in production
- [ ] **Contact form** — implement `/api/contact` email delivery route

---

## Stripe Webhook Setup

For local development:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/payment/webhook
```

Copy the webhook signing secret shown to `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## Customization Notes

- All firm details are centralized in `src/lib/constants.ts` — update once, applies everywhere
- Color palette is in `tailwind.config.ts` — adjust `navy` and `gold` scales to match final brand
- Disclosure text is in `constants.ts` — coordinate with legal before modifying
- Replace placeholder `⚖️` icon in the About sidebar with an actual photo via `<Image>` in `about/page.tsx`
