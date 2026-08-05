import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useOrder } from '../api/queries'
import { useSocket } from '../hooks/useSocket'
import OrderTracker from '../components/OrderTracker'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import OrderStatusBadge from '../components/ui/OrderStatusBadge'
import { ArrowLeft, Clock, MapPin, Phone, Store } from 'lucide-react'

export default function OrderDetail() {
  const { id } = useParams()
  const { data: order, isLoading } = useOrder(id)
  
  useSocket()

  if (isLoading) return <LoadingSkeleton type="text" count={6} />
  if (!order) return <div>Order not found</div>

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <Link to="/orders" className="flex items-center gap-2 text-gray-500 hover:text-primary transition font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      {order.siblings?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
          <Store className="w-4 h-4 flex-shrink-0" />
          This checkout also included {order.siblings.length} other shop{order.siblings.length > 1 ? 's' : ''}:{' '}
          {order.siblings.map((s, idx) => (
            <React.Fragment key={s._id}>
              {idx > 0 && ', '}
              <Link to={`/orders/${s._id}`} className="underline font-medium">{s.shop?.name}</Link>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary mb-1">Order #{order._id.slice(-6).toUpperCase()}</h1>
              <p className="text-gray-500">{order.shop?.name}</p>
            </div>
            <OrderStatusBadge status={order.status} orderType={order.orderType} />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-secondary mb-4">Live Tracking</h3>
          <OrderTracker status={order.status} orderType={order.orderType} />
        </div>

        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-secondary mb-4">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <span className="font-medium">{item.quantity}x</span> {item.name}
                </div>
                <div className="text-secondary font-medium">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Service Fee</span>
              <span>₹{order.serviceFee}</span>
            </div>
            <div className="flex justify-between font-bold text-secondary text-lg pt-2">
              <span>Total</span>
              <span className="text-primary">₹{order.total}</span>
            </div>
            {order.serviceFee === 0 && (
              <p className="text-xs text-gray-400 pt-1">
                Service fee was already charged on another shop in this same order.
              </p>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-secondary mb-4">
            {order.orderType === 'takeaway' ? 'Pickup Details' : 'Delivery Details'}
          </h3>
          {order.orderType === 'takeaway' ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-secondary">Collect from {order.shop?.name}</p>
                  <p className="text-gray-500 text-sm">You'll be notified when it's ready for pickup.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <p className="text-secondary">{order.user?.phone || '—'}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-secondary">{order.user?.hostel || '—'}</p>
                  <p className="text-gray-500 text-sm">Room {order.user?.roomNumber || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <p className="text-secondary">{order.user?.phone || '—'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
