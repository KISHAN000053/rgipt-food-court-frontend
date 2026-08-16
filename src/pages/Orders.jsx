import React, { useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useMyOrders } from '../api/queries'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import OrderStatusBadge from '../components/ui/OrderStatusBadge'
import EmptyState from '../components/ui/EmptyState'
import { ClipboardList, ChevronRight, Store } from 'lucide-react'
import { money } from '../utils/money'

export default function Orders() {
  const { data: orders, isLoading, error } = useMyOrders()
  const [searchParams] = useSearchParams()
  const highlightGroup = searchParams.get('group')
  const highlightRef = useRef(null)

  const groups = useMemo(() => {
    if (!orders) return []
    const map = new Map()
    for (const order of orders) {
      const key = order.groupId || order._id
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(order)
    }
    return Array.from(map.values()).sort((a, b) => new Date(b[0].createdAt) - new Date(a[0].createdAt))
  }, [orders])

  useEffect(() => {
    if (highlightGroup && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [highlightGroup, groups])

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

  const isActive = (group) => group.some(o => !['completed', 'cancelled'].includes(o.status.toLowerCase()))
  const activeGroups = groups.filter(isActive)
  const pastGroups = groups.filter(g => !isActive(g))

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">Your Orders</h1>

      {activeGroups.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-secondary mb-4">Active Orders</h2>
          <div className="space-y-4">
            {activeGroups.map(group => (
              <OrderGroupCard
                key={group[0].groupId || group[0]._id}
                group={group}
                highlightRef={(group[0].groupId || group[0]._id) === highlightGroup ? highlightRef : null}
                highlighted={(group[0].groupId || group[0]._id) === highlightGroup}
              />
            ))}
          </div>
        </section>
      )}

      {pastGroups.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-secondary mb-4">Past Orders</h2>
          <div className="space-y-4">
            {pastGroups.map(group => (
              <OrderGroupCard
                key={group[0].groupId || group[0]._id}
                group={group}
                highlightRef={(group[0].groupId || group[0]._id) === highlightGroup ? highlightRef : null}
                highlighted={(group[0].groupId || group[0]._id) === highlightGroup}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function OrderGroupCard({ group, highlightRef, highlighted }) {
  const combinedTotal = group.reduce((sum, o) => sum + o.total, 0)
  const placedAt = new Date(group[0].createdAt).toLocaleString()
  const ringClass = highlighted ? 'ring-2 ring-primary' : ''

  if (group.length === 1) {
    const order = group[0]
    return (
      <Link 
        ref={highlightRef}
        to={`/orders/${order._id}`} 
        className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary transition group ${ringClass}`}
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-secondary">{order.shop?.name || 'Shop'}</h3>
            <OrderStatusBadge status={order.status} orderType={order.orderType} />
            {order.paymentMethod === 'razorpay' && order.paymentStatus !== 'paid' && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Payment pending</span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-2">Order #{order._id.slice(-6).toUpperCase()}</p>
          <p className="font-medium text-secondary">₹{money(order.total)} • {order.items.length} items</p>
          <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
            {order.orderType === 'takeaway' ? 'Takeaway' : 'Deliver to Hostel'}
          </span>
        </div>
        <div className="text-gray-300 group-hover:text-primary transition">
          <ChevronRight className="w-6 h-6" />
        </div>
      </Link>
    )
  }

  return (
    <div ref={highlightRef} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${ringClass}`}>
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Store className="w-4 h-4" />
          {group.length} shops • {placedAt}
        </div>
        <span className="font-bold text-secondary">₹{money(combinedTotal)}</span>
      </div>
      {group.map(order => (
        <Link
          key={order._id}
          to={`/orders/${order._id}`}
          className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-medium text-secondary">{order.shop?.name || 'Shop'}</h3>
              <OrderStatusBadge status={order.status} orderType={order.orderType} />
            {order.paymentMethod === 'razorpay' && order.paymentStatus !== 'paid' && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Payment pending</span>
            )}
            </div>
            <p className="text-gray-500 text-sm">{order.items.length} items • ₹{money(order.total)}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </Link>
      ))}
    </div>
  )
}
