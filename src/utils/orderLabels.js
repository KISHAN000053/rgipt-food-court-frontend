// Status labels adapt to whether it's a takeaway (pickup) or hostel delivery order.
export function statusLabel(status, orderType) {
  const key = (status || '').toLowerCase()
  if (key === 'delivery_initiated') {
    return orderType === 'takeaway' ? 'Ready for pickup' : 'Out for delivery'
  }
  const labels = {
    pending: 'Pending',
    accepted: 'Accepted',
    preparing: 'Preparing',
    cancelled: 'Cancelled',
  }
  return labels[key] || status || 'Unknown'
}

export function orderTypeLabel(orderType) {
  return orderType === 'takeaway' ? 'Takeaway' : 'Deliver to Hostel'
}

// The shop owner's action button text for advancing to the final step.
export function finalStepButtonLabel(orderType) {
  return orderType === 'takeaway' ? 'Mark Ready for Pickup' : 'Mark Out for Delivery'
}
