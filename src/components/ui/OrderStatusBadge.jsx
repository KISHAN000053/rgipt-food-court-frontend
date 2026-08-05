import React from 'react'
import { statusLabel } from '../../utils/orderLabels'

export default function OrderStatusBadge({ status, orderType }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    delivery_initiated: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const defaultStyle = 'bg-gray-100 text-gray-800'
  const key = status?.toLowerCase()
  const style = styles[key] || defaultStyle
  const label = statusLabel(status, orderType)

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${style}`}>
      {label}
    </span>
  )
}
