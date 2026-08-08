import React from 'react'
import { useOwnerOrders } from '../../api/queries'
import { useSocket } from '../../hooks/useSocket'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'
import { finalStepButtonLabel } from '../../utils/orderLabels'
import { Home, Store } from 'lucide-react'
import api from '../../api/axios'
import { useQueryClient } from '@tanstack/react-query'

export default function ShopDashboard() {
  const { data: orders } = useOwnerOrders()
  const queryClient = useQueryClient()
  useSocket()

  const handleStatusChange = async (orderId, newStatus, order) => {
    if (newStatus === 'cancelled' && order?.paymentMethod === 'razorpay' && order?.paymentStatus === 'paid') {
      const confirmed = window.confirm(
        `This will automatically refund ₹${order.subtotal} (the food price) to the student. The service and processing fees are not refunded. Continue?`
      )
      if (!confirmed) return
    }
    try {
      await api.patch(`/owner/orders/${orderId}/status`, { status: newStatus })
      queryClient.invalidateQueries({ queryKey: ['owner', 'orders'] })
    } catch (e) {
      console.error(e)
      alert(e.response?.data?.message || 'Could not update this order.')
    }
  }

  // delivery_initiated is the final step in this simplified flow — nothing left for the shop to do after that.
  const activeOrders = orders?.filter(o => !['delivery_initiated', 'cancelled'].includes(o.status.toLowerCase())) || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary">Live Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {activeOrders.map(order => {
          const isTakeaway = order.orderType === 'takeaway'
          return (
            <div key={order._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-3">
                <div>
                  <p className="font-bold text-secondary text-lg">#{order._id.slice(-4).toUpperCase()}</p>
                  <p className="text-gray-500 text-sm">{order.user?.name}</p>
                </div>
                <OrderStatusBadge status={order.status} orderType={order.orderType} />
              </div>

              {/* Order type is the single most important thing for the kitchen to see at a glance. */}
              <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium ${isTakeaway ? 'bg-amber-50 text-amber-800' : 'bg-blue-50 text-blue-800'}`}>
                {isTakeaway ? <Store className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                {isTakeaway ? (
                  <span>Takeaway — collect at counter</span>
                ) : (
                  <span>Deliver to {order.user?.hostel || 'hostel'}{order.user?.roomNumber ? `, Room ${order.user.roomNumber}` : ''}</span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}{item.variantName ? ` (${item.variantName})` : ''}{item.isAddon ? (item.forProductName ? ` · for ${item.forProductName}` : ' · Add-on') : ''}</span>
                  </div>
                ))}
              </div>

              {/* Simple 3-step flow: Accept -> (optional) Preparing -> final step. */}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-50">
                {order.status === 'pending' && (
                  <button onClick={() => handleStatusChange(order._id, 'accepted')} className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-deep transition text-sm">
                    Accept Order
                  </button>
                )}
                {order.status === 'accepted' && (
                  <>
                    <button onClick={() => handleStatusChange(order._id, 'preparing')} className="w-full bg-orange-100 text-orange-700 py-2 rounded-lg font-medium hover:bg-orange-200 transition text-sm">
                      Start Preparing
                    </button>
                    <button onClick={() => handleStatusChange(order._id, 'delivery_initiated')} className="w-full bg-green-100 text-green-700 py-2 rounded-lg font-medium hover:bg-green-200 transition text-sm">
                      Skip · {finalStepButtonLabel(order.orderType)}
                    </button>
                  </>
                )}
                {order.status === 'preparing' && (
                  <button onClick={() => handleStatusChange(order._id, 'delivery_initiated')} className="w-full bg-green-100 text-green-700 py-2 rounded-lg font-medium hover:bg-green-200 transition text-sm">
                    {finalStepButtonLabel(order.orderType)}
                  </button>
                )}
                {order.status !== 'delivery_initiated' && (
                  <button onClick={() => handleStatusChange(order._id, 'cancelled', order)} className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition text-sm">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {activeOrders.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
            No active orders right now.
          </div>
        )}
      </div>
    </div>
  )
}
