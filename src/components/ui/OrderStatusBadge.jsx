import React from 'react'

export default function OrderStatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    delivery_initiated: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const labels = {
    delivery_initiated: 'Delivery Initiated',
  }

  const defaultStyle = 'bg-gray-100 text-gray-800'
  const key = status?.toLowerCase()
  const style = styles[key] || defaultStyle
  const label = labels[key] || status || 'Unknown'

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${style}`}>
      {label}
    </span>
  )
}
