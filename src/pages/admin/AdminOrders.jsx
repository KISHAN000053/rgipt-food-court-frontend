import React, { useState, useMemo } from 'react'
import { useAdminOrders } from '../../api/queries'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'
import { Search } from 'lucide-react'

export default function AdminOrders() {
  const { data: orders } = useAdminOrders()
  const [search, setSearch] = useState('')

  const filteredOrders = useMemo(() => {
    if (!orders) return []
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(order =>
      order._id.toLowerCase().includes(q) ||
      order.orderNumber?.toLowerCase().includes(q)
    )
  }, [orders, search])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-secondary">All Orders</h1>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
              <th className="pb-3 pr-4">Order ID</th>
              <th className="pb-3 px-4">Customer</th>
              <th className="pb-3 px-4">Shop</th>
              <th className="pb-3 px-4">Type</th>
              <th className="pb-3 px-4">Amount</th>
              <th className="pb-3 pl-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id} className="border-b border-gray-50 last:border-0">
                <td className="py-4 pr-4 text-sm font-mono">{order._id.slice(-6).toUpperCase()}</td>
                <td className="py-4 px-4 font-medium text-secondary">{order.user?.name}</td>
                <td className="py-4 px-4 text-gray-600">{order.shop?.name}</td>
                <td className="py-4 px-4 text-gray-600">{order.orderType === 'takeaway' ? 'Takeaway' : 'Hostel'}</td>
                <td className="py-4 px-4 font-medium">₹{order.total}</td>
                <td className="py-4 pl-4"><OrderStatusBadge status={order.status} orderType={order.orderType} /></td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-gray-400">{search ? 'No orders match your search.' : 'No orders yet.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
