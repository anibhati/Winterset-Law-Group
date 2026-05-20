'use client'

import { useState } from 'react'

interface DebtResult {
  accountNumber: string
  debtorName: string
  debtType: string
  currentBalance: number
  originalAmount: number
  agency: string
  status: string
}

export default function LookupPage() {
  const [accountNumber, setAccountNumber] = useState('')
  const [lastName, setLastName] = useState('')
  const [last4Ssn, setLast4Ssn] = useState('')
  const [result, setResult] = useState<DebtResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, lastName, last4Ssn }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Look up your debt</h1>
        <p className="text-gray-600 mb-8">
          Please enter all three fields to verify your identity and view your debt details.
        </p>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Account number
            </label>
            <input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="WLG-2026-XXX"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="last4Ssn" className="block text-sm font-medium text-gray-700 mb-1">
              Last 4 digits of SSN
            </label>
            <input
              id="last4Ssn"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={last4Ssn}
              onChange={(e) => setLast4Ssn(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              We use this to verify it's you. We never display or share your full SSN.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Looking up...' : 'Look up debt'}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account found</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Account number</dt>
                <dd className="text-gray-900 font-medium">{result.accountNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Name on account</dt>
                <dd className="text-gray-900 font-medium">{result.debtorName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Debt type</dt>
                <dd className="text-gray-900 font-medium">{result.debtType.replace(/_/g, ' ')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Owed to</dt>
                <dd className="text-gray-900 font-medium">{result.agency}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Original amount</dt>
                <dd className="text-gray-900 font-medium">${result.originalAmount.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <dt className="text-gray-700 font-semibold">Current balance</dt>
                <dd className="text-gray-900 font-bold text-lg">${result.currentBalance.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd className="text-gray-900 font-medium">{result.status.replace(/_/g, ' ')}</dd>
              </div>
            </dl>

            <p className="mt-6 text-xs text-gray-500 leading-relaxed">
              This is an attempt to collect a debt, and any information obtained will be used for that purpose.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
