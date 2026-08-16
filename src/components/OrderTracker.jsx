import React from 'react'
import { Check, KeyRound } from 'lucide-react'
import { statusLabel } from '../utils/orderLabels'

export default function OrderTracker({ status, orderType, pickupPin }) {
  const steps = [
    { id: 'pending', label: 'Placed' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'delivery_initiated', label: statusLabel('delivery_initiated', orderType) },
    { id: 'completed', label: statusLabel('completed', orderType) },
  ]

  const statusMap = {
    pending: 0,
    accepted: 1,
    preparing: 2,
    delivery_initiated: 3,
    completed: 4,
    cancelled: -1
  }

  const currentIndex = statusMap[status?.toLowerCase()] ?? -1
  const isTakeaway = orderType === 'takeaway'
  const showPin = isTakeaway && pickupPin && !['completed', 'cancelled'].includes(status?.toLowerCase())

  if (status?.toLowerCase() === 'cancelled') {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-100">
        This order was cancelled.
      </div>
    )
  }

  return (
    <div className="py-4">
      {showPin && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-amber-700 mb-1">
            <KeyRound className="w-3.5 h-3.5" /> Show this PIN when you collect your order
          </p>
          <p className="text-3xl font-bold tracking-[0.3em] text-amber-800 font-mono">{pickupPin}</p>
        </div>
      )}

      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isLast = index === steps.length - 1

        return (
          <div key={step.id} className="flex gap-4 relative">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white
                ${isCompleted ? 'border-primary bg-primary text-white' : 
                  isCurrent ? 'border-primary text-primary' : 'border-gray-200 text-gray-300'}`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-primary' : 'bg-transparent'}`} />}
              </div>
              {!isLast && (
                <div className={`w-0.5 h-12 -my-1 ${isCompleted ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            <div className={`pt-1 pb-8 ${isCurrent ? 'font-bold text-secondary' : isCompleted ? 'font-medium text-secondary' : 'text-gray-400'}`}>
              {step.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
