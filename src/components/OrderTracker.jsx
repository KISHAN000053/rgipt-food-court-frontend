import React from 'react'
import { Check } from 'lucide-react'

export default function OrderTracker({ status }) {
  const steps = [
    { id: 'pending', label: 'Placed' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready' },
    { id: 'delivered', label: 'Delivered' }
  ]

  const statusMap = {
    pending: 0,
    accepted: 1,
    preparing: 2,
    ready: 3,
    delivered: 4,
    cancelled: -1
  }

  const currentIndex = statusMap[status?.toLowerCase()] ?? -1

  if (status?.toLowerCase() === 'cancelled') {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-100">
        This order was cancelled.
      </div>
    )
  }

  return (
    <div className="py-4">
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
