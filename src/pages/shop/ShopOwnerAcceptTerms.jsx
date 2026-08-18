import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../api/axios'

export default function ShopOwnerAcceptTerms() {
  const { refetchUser } = useAuth()
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleContinue = async (e) => {
    e.preventDefault()
    if (!agreed) {
      setError('Please confirm you have read and agree before continuing.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.patch('/users/accept-terms')
      await refetchUser()
      navigate('/shop-owner')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen app-page flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-card p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-secondary mb-2">Before you get started</h1>
        <p className="text-gray-500 mb-6">
          As a shop owner on RGIPT Food Court, please review and agree to a few things specific to running your
          shop on the platform.
        </p>

        <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3 text-sm text-gray-600">
          <p className="font-medium text-secondary">In short, as a shop owner you agree to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Keep your menu, prices, and availability accurate — you're solely responsible for this information</li>
            <li>Hold any required food-safety licensing (e.g. FSSAI) for your business</li>
            <li>Accept or reject orders promptly, and prepare/handle food safely</li>
            <li>Verify a student's pickup PIN before marking a takeaway order complete</li>
            <li>Understand that going offline with orders still in progress will automatically cancel and refund them to the student</li>
            <li>Not cancel paid orders except when genuinely necessary</li>
          </ul>
          <p className="text-xs text-gray-400 pt-1">
            This is a summary, not the complete terms — please read the full documents below.
          </p>
        </div>

        <div className="flex gap-4 text-sm mb-6">
          <Link to="/terms" target="_blank" className="text-primary underline">Terms of Service</Link>
          <Link to="/privacy" target="_blank" className="text-primary underline">Privacy Policy</Link>
          <Link to="/code-of-conduct" target="_blank" className="text-primary underline">Code of Conduct</Link>
        </div>

        <form onSubmit={handleContinue}>
          <label className="flex items-start gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              I have read and agree to the Terms of Service, Privacy Policy, and Code of Conduct, including the
              shop-owner responsibilities summarized above.
            </span>
          </label>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-deep transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'I Agree & Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
