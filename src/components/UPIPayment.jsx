import React from 'react'
import { QrCode } from 'lucide-react'

export default function UPIPayment({ amount, onPaymentConfirm }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
      <h3 className="text-lg font-bold text-secondary mb-2">Pay via UPI</h3>
      <p className="text-gray-500 mb-6">Amount to pay: <span className="font-bold text-secondary">₹{amount}</span></p>
      
      <div className="bg-gray-50 w-48 h-48 mx-auto rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 mb-4">
        <QrCode className="w-16 h-16 text-gray-400 mb-2" />
        <span className="text-sm font-medium text-gray-500">Scan QR Code</span>
      </div>
      
      <div className="bg-gray-100 py-2 px-4 rounded-lg inline-block mb-6 font-mono text-sm">
        rgipt.foodcourt@upi
      </div>

      <button 
        onClick={onPaymentConfirm}
        className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-sm"
      >
        I Have Paid
      </button>
    </div>
  )
}
