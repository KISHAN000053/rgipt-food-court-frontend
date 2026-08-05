import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useHostels } from '../api/queries'
import api from '../api/axios'

export default function Onboarding() {
  const { refetchUser } = useAuth()
  const navigate = useNavigate()
  const { data: hostels } = useHostels()

  const [hostelId, setHostelId] = useState('')
  const [roomDigits, setRoomDigits] = useState('')
  const [phone, setPhone] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Default to first hostel once loaded.
  useEffect(() => {
    if (hostels?.length && !hostelId) setHostelId(hostels[0]._id)
  }, [hostels, hostelId])

  const selectedHostel = hostels?.find(h => h._id === hostelId)
  // Room number can be 3 or 4 digits (any hostel)
  const prefix = selectedHostel?.roomPrefix || ''

  // Reset room digits when hostel changes (rules differ).
  useEffect(() => { setRoomDigits('') }, [hostelId])

  const handleRoomChange = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
    setRoomDigits(onlyNums)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedHostel) return setError('Please select your hostel.')
    if (roomDigits.length < 3 || roomDigits.length > 4) {
      return setError('Room number must be 3 or 4 digits.')
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      return setError('Enter a valid 10-digit mobile number.')
    }
    if (!agreeToTerms) {
      return setError('Please agree to the Terms, Privacy Policy, and Code of Conduct to continue.')
    }

    const roomNumber = prefix ? `${prefix}-${roomDigits}` : roomDigits

    setLoading(true)
    try {
      await api.patch('/users/profile', {
        hostel: selectedHostel.name,
        roomNumber,
        phone,
        agreeToTerms,
        isOnboarded: true,
      })
      await refetchUser()
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto pt-10">
      <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-secondary mb-2">Complete your profile</h1>
        <p className="text-gray-500 mb-6">We need a few details to deliver to your room.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Hostel</label>
            <select
              value={hostelId}
              onChange={e => setHostelId(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            >
              {hostels?.length ? (
                hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)
              ) : (
                <option value="">Loading hostels...</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Room Number</label>
            <div className="flex items-center border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-primary overflow-hidden">
              {prefix && (
                <span className="px-3 py-3 bg-gray-50 text-gray-500 font-mono border-r border-gray-200 select-none">
                  {prefix}-
                </span>
              )}
              <input
                type="text"
                inputMode="numeric"
                value={roomDigits}
                onChange={handleRoomChange}
                placeholder="e.g. 902 or 1204"
                className="flex-1 p-3 outline-none font-mono"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Enter 3 or 4 digits.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Phone Number</label>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            />
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={e => setAgreeToTerms(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-500">
              I agree to the{' '}
              <Link to="/terms" target="_blank" className="text-primary underline">Terms of Service</Link>,{' '}
              <Link to="/privacy" target="_blank" className="text-primary underline">Privacy Policy</Link>, and{' '}
              <Link to="/code-of-conduct" target="_blank" className="text-primary underline">Code of Conduct</Link>.
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-deep transition disabled:opacity-50 mt-4"
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
