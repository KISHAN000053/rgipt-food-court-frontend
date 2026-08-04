import React from 'react'
import { useAdminOrders } from '../../api/queries'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'

export default function AdminOrders() {
  const { data: orders } = useAdminOrders()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 className="text-xl font-bold text-secondary mb-6">All Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
              <th className="pb-3 pr-4">Order ID</th>
              <th className="pb-3 px-4">Customer</th>
              <th className="pb-3 px-4">Shop</th>
              <th className="pb-3 px-4">Amount</th>
              <th className="pb-3 pl-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(order => (
              <tr key={order._id} className="border-b border-gray-50 last:border-0">
                <td className="py-4 pr-4 text-sm font-mono">{order._id.slice(-6).toUpperCase()}</td>
                <td className="py-4 px-4 font-medium text-secondary">{order.user?.name}</td>
                <td className="py-4 px-4 text-gray-600">{order.shop?.name}</td>
                <td className="py-4 px-4 font-medium">₹{order.total}</td>
                <td className="py-4 pl-4"><OrderStatusBadge status={order.status} /></td>
              </tr>
            ))}
            {orders?.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-gray-400">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
