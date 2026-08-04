import React from 'react'
import { Flame, Clock, Truck, ShieldCheck } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-2xl w-full">
        <Flame className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-secondary mb-4 tracking-tight">RGIPT Food Court</h1>
        <p className="text-xl text-gray-500 mb-10">Fresh. Fast. Campus-delivered.</p>
        
        <button 
          onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}
          className="bg-primary text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 mb-16"
        >
          Login with Google
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-primary mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-secondary mb-2">Fast Prep</h3>
            <p className="text-sm text-gray-500">Know exactly when your food will be ready with live tracking.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-primary mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-secondary mb-2">Hostel Delivery</h3>
            <p className="text-sm text-gray-500">Delivered directly to your hostel room for maximum convenience.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-primary mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-secondary mb-2">Secure Payments</h3>
            <p className="text-sm text-gray-500">Pay securely via UPI or choose cash on delivery.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
