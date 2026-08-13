import React, { useState, useMemo } from 'react'
import { useAdminOrders } from '../../api/queries'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'
import { Search, Store } from 'lucide-react'
import { money } from '../../utils/money'

export default function AdminOrders() {
  const { data: orders } = useAdminOrders()
  const [search, setSearch] = useState('')

  const filteredOrders = useMemo(() => {
    if (!orders) return []
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(order =>
      order._id.toLowerCase().includes(q) ||
      order.orderNumber?.toLowerCase().includes(q) ||
      order.user?.email?.toLowerCase().includes(q)
    )
  }, [orders, search])

  const clusters = useMemo(() => {
    const map = new Map()
    for (const order of filteredOrders) {
      const key = order.shop?._id || order.shop?.name || 'unknown'
      if (!map.has(key)) map.set(key, { shopName: order.shop?.name || 'Unknown shop', orders: [] })
      map.get(key).orders.push(order)
    }
    return Array.from(map.values()).sort((a, b) => b.orders.length - a.orders.length)
  }, [filteredOrders])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-secondary">All Orders</h1>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or email..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {clusters.length === 0 ? (
        <p className="py-8 text-center text-gray-400">{search ? 'No orders match your search.' : 'No orders yet.'}</p>
      ) : (
        <div className="space-y-6">
          {clusters.map(cluster => (
            <div key={cluster.shopName} className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-secondary">
                  <Store className="w-4 h-4 text-gray-400" />
                  {cluster.shopName}
                </div>
                <span className="text-sm text-gray-500">{cluster.orders.length} order{cluster.orders.length === 1 ? '' : 's'}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-50">
                      <th className="py-2 pl-4 pr-3">Order ID</th>
                      <th className="py-2 px-3">Customer</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Amount</th>
                      <th className="py-2 pl-3 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cluster.orders.map(order => (
                      <tr key={order._id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pl-4 pr-3 text-sm font-mono">{order._id.slice(-6).toUpperCase()}</td>
                        <td className="py-3 px-3 font-medium text-secondary">{order.user?.name}</td>
                        <td className="py-3 px-3 text-gray-500 text-sm">{order.user?.email || '—'}</td>
                        <td className="py-3 px-3 text-gray-600">{order.orderType === 'takeaway' ? 'Takeaway' : 'Hostel'}</td>
                        <td className="py-3 px-3 font-medium">₹{money(order.total)}</td>
                        <td className="py-3 pl-3 pr-4"><OrderStatusBadge status={order.status} orderType={order.orderType} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
