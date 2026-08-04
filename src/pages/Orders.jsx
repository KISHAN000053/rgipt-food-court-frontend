import React from 'react'
import { Link } from 'react-router-dom'
import { useMyOrders } from '../api/queries'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import OrderStatusBadge from '../components/ui/OrderStatusBadge'
import EmptyState from '../components/ui/EmptyState'
import { ClipboardList, ChevronRight } from 'lucide-react'

export default function Orders() {
  const { data: orders, isLoading, error } = useMyOrders()

  if (isLoading) return <LoadingSkeleton type="text" count={5} />
  
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Failed to load orders.</div>

  if (!orders || orders.length === 0) {
    return (
      <EmptyState 
        icon={ClipboardList} 
        title="No orders yet" 
        description="You haven't placed any orders yet. Go to Home to explore shops."
      />
    )
  }

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status.toLowerCase()))
  const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status.toLowerCase()))

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">Your Orders</h1>

      {activeOrders.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-secondary mb-4">Active Orders</h2>
          <div className="space-y-4">
            {activeOrders.map(order => (
              <OrderRow key={order._id} order={order} />
            ))}
          </div>
        </section>
      )}

      {pastOrders.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-secondary mb-4">Past Orders</h2>
          <div className="space-y-4">
            {pastOrders.map(order => (
              <OrderRow key={order._id} order={order} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function OrderRow({ order }) {
  return (
    <Link 
      to={`/orders/${order._id}`} 
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary transition group"
    >
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-bold text-secondary">{order.shop?.name || 'Shop'}</h3>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-gray-500 text-sm mb-2">Order #{order._id.slice(-6).toUpperCase()}</p>
        <p className="font-medium text-secondary">₹{order.totalAmount} • {order.items.length} items</p>
      </div>
      <div className="text-gray-300 group-hover:text-primary transition">
        <ChevronRight className="w-6 h-6" />
      </div>
    </Link>
  )
}
