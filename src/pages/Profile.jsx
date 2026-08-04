import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useMyOrders } from '../api/queries'
import { User, Mail, MapPin, Phone, LogOut } from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuth()
  const { data: orders } = useMyOrders()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-secondary mb-6">My Profile</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 flex items-center gap-4 border-b border-gray-100 bg-gray-50">
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
        
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-500 text-sm mb-1">Delivery Address</p>
              <p className="text-secondary font-medium">{user?.hostel}</p>
              <p className="text-secondary">Room {user?.roomNumber}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-500 text-sm mb-1">Phone Number</p>
              <p className="text-secondary font-medium">{user?.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
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
