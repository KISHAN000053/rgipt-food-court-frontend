import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useHostels } from '../api/queries'
import api from '../api/axios'

export default function Onboarding() {
  const { user, refetchUser } = useAuth()
  const navigate = useNavigate()
  const { data: hostels } = useHostels()

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true })
    else if (user?.isShopOwner) navigate('/shop-owner', { replace: true })
  }, [user, navigate])

  const [isJunior, setIsJunior] = useState(null)
  const [hostelId, setHostelId] = useState('')
  const [roomDigits, setRoomDigits] = useState('')
  const [phone, setPhone] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (hostels?.length && !hostelId) setHostelId(hostels[0]._id)
  }, [hostels, hostelId])

  const selectedHostel = hostels?.find(h => h._id === hostelId)

  useEffect(() => { setRoomDigits('') }, [hostelId])

  const handleRoomChange = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
    setRoomDigits(onlyNums)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isJunior === null) return setError('Please select whether you\'re a Junior or Senior.')

    if (isJunior) {
      if (!selectedHostel) return setError('Please select your hostel.')
      if (roomDigits.length < 3 || roomDigits.length > 4) {
        return setError('Room number must be 3 or 4 digits.')
      }
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      return setError('Enter a valid 10-digit mobile number.')
    }
    if (!agreeToTerms) {
      return setError('Please agree to the Terms, Privacy Policy, and Code of Conduct to continue.')
    }

    setLoading(true)
    try {
      await api.patch('/users/profile', {
        isJunior,
        hostel: isJunior ? selectedHostel.name : undefined,
        roomNumber: isJunior ? roomDigits : undefined,
        phone,
        agreeToTerms,
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
    <div className="max-w-md mx-auto pt-10 force-light">
      <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-secondary mb-2">Complete your profile</h1>
        <p className="text-gray-500 mb-6">Just a couple of details to get you started.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Are you a Junior or Senior?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsJunior(true)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition ${isJunior === true ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600'}`}
              >
                Junior
              </button>
              <button
                type="button"
                onClick={() => setIsJunior(false)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition ${isJunior === false ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600'}`}
              >
                Senior
              </button>
            </div>
            {isJunior === false && (
              <p className="text-xs text-gray-400 mt-2">
                As a Senior, hostel delivery isn't available — you'll order for takeaway only.
              </p>
            )}
          </div>

          {isJunior === true && (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Hostel</label>
                <select
                  value={hostelId}
                  onChange={e => setHostelId(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
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
                  <input
                    type="text"
                    inputMode="numeric"
                    value={roomDigits}
                    onChange={handleRoomChange}
                    placeholder="Room number"
                    className="flex-1 p-3 outline-none font-mono"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Enter 3 or 4 digits.</p>
              </div>
            </>
          )}

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
