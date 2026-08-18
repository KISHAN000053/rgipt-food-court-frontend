import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useMyOrders, useHostels } from '../api/queries'
import api from '../api/axios'
import { User, Mail, MapPin, Phone, LogOut, Pencil } from 'lucide-react'
import PushNotificationToggle from '../components/PushNotificationToggle'

export default function Profile() {
  const { user, logout, refetchUser } = useAuth()
  const { data: orders } = useMyOrders()
  const { data: hostels } = useHostels()

  const [editing, setEditing] = useState(false)
  const [isJunior, setIsJunior] = useState(false)
  const [hostel, setHostel] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const startEdit = () => {
    setIsJunior(!!user?.isJunior)
    setHostel(user?.hostel || '')
    setRoomNumber(user?.roomNumber || '')
    setPhone(user?.phone || '')
    setError('')
    setEditing(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    if (isJunior && (!hostel || !/^[0-9]{3,4}$/.test(roomNumber))) {
      return setError('As a Junior, please select a hostel and enter a 3-4 digit room number.')
    }
    if (!/^[0-9]{10}$/.test(phone)) return setError('Enter a valid 10-digit mobile number.')

    setSaving(true)
    try {
      await api.patch('/users/profile', {
        isJunior,
        hostel: isJunior ? hostel : undefined,
        roomNumber: isJunior ? roomNumber : undefined,
        phone,
        agreeToTerms: true,
      })
      await refetchUser()
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto force-light">
      <h1 className="text-2xl font-bold text-secondary mb-6">My Profile</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 flex items-center justify-between gap-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0) || <User />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary">{user?.name}</h2>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                <Mail className="w-4 h-4" />
                {user?.email}
              </div>
            </div>
          </div>
          {!editing && (
            <button onClick={startEdit} className="flex items-center gap-1.5 text-primary hover:underline text-sm font-medium flex-shrink-0">
              <Pencil className="w-4 h-4" /> Edit
            </button>
          )}
        </div>
        
        {editing ? (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Junior or Senior?</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setIsJunior(true)}
                  className={`p-2.5 rounded-lg border-2 text-sm font-medium transition ${isJunior ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600'}`}>
                  Junior
                </button>
                <button type="button" onClick={() => setIsJunior(false)}
                  className={`p-2.5 rounded-lg border-2 text-sm font-medium transition ${!isJunior ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600'}`}>
                  Senior
                </button>
              </div>
              {!isJunior && (
                <p className="text-xs text-gray-400 mt-2">As a Senior, hostel delivery isn't available — takeaway only.</p>
              )}
            </div>

            {isJunior && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Hostel</label>
                  <select
                    value={hostel}
                    onChange={e => setHostel(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="">Select hostel</option>
                    {hostels?.map(h => <option key={h._id} value={h.name}>{h.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Room Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={roomNumber}
                    onChange={e => setRoomNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                    placeholder="Room number"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-1">3 or 4 digits.</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-deep transition disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            {user?.isJunior !== false && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-500 text-sm mb-1">Delivery Address</p>
                  <p className="text-secondary font-medium">{user?.hostel || 'Not set'}</p>
                  <p className="text-secondary">{user?.roomNumber ? `Room ${user.roomNumber}` : ''}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-500 text-sm mb-1">Phone Number</p>
                <p className="text-secondary font-medium">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-primary">{orders?.length || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
          <p className="text-gray-500 text-sm font-medium mb-1">Account Role</p>
          <p className="text-lg font-bold text-secondary capitalize">{user?.role || 'Student'}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 mb-4">
        <p className="text-sm font-medium text-secondary mb-2">Order Updates</p>
        <PushNotificationToggle description="Know the moment your order is accepted, ready, or cancelled — even with the app closed." />
      </div>

      <button 
        onClick={logout}
        className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold py-3 rounded-xl transition"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>
    </div>
  )
}
