import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../api/axios'

export default function Onboarding() {
  const { user, refetchUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    hostel: 'APJ Abdul Kalam Hostel',
    roomNumber: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)

  const hostels = [
    'APJ Abdul Kalam Hostel',
    'Aryabhatta Hostel',
    'Ramanujan Hostel',
    'Girls Hostel'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.patch('/users/profile', {
        ...formData,
        isOnboarded: true
      })
      await refetchUser()
      navigate('/home')
    } catch (error) {
      console.error(error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto pt-10">
      <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-secondary mb-2">Complete your profile</h1>
        <p className="text-gray-500 mb-6">We need a few details to ensure smooth delivery.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Hostel</label>
            <select 
              value={formData.hostel}
              onChange={e => setFormData({...formData, hostel: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            >
              {hostels.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Room Number</label>
            <input 
              type="text"
              value={formData.roomNumber}
              onChange={e => setFormData({...formData, roomNumber: e.target.value})}
              placeholder="e.g. 101"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Phone Number</label>
            <input 
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 mt-4"
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
