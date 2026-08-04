import React from 'react'
import { useAdminPayouts } from '../../api/queries'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'

export default function AdminPayouts() {
  const { data, isLoading, error } = useAdminPayouts()

  if (isLoading) return <LoadingSkeleton type="text" count={5} />
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Failed to load payouts.</div>

  const { payouts, summary } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-secondary mb-1">Shop Payouts</h1>
        <p className="text-sm text-gray-500">
          Amount owed to each shop, based on <em>their own</em> menu prices — not what students were charged.
          The difference (2% surcharge + service fee) is platform revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Owed to Shops" value={summary.totalOwedToShops} tone="primary" />
        <SummaryCard label="Platform Revenue (markup)" value={summary.totalMarkupRevenue} tone="neutral" />
        <SummaryCard label="Platform Revenue (service fees)" value={summary.totalServiceFees} tone="neutral" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
                <th className="pb-3 pr-4">Shop</th>
                <th className="pb-3 px-4">Orders</th>
                <th className="pb-3 px-4">Collected from Students</th>
                <th className="pb-3 pl-4 text-right">You Owe This Shop</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map(p => (
                <tr key={p.shopId} className="border-b border-gray-50 last:border-0">
                  <td className="py-4 pr-4 font-medium text-secondary">{p.shopName}</td>
                  <td className="py-4 px-4 text-gray-600">{p.orderCount}</td>
                  <td className="py-4 px-4 text-gray-600">₹{p.amountCollectedFromStudents}</td>
                  <td className="py-4 pl-4 text-right font-bold text-primary">₹{p.amountOwed}</td>
                </tr>
              ))}
              {payouts.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-gray-400">No completed orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Cancelled orders are excluded. This reflects orders placed under Cash on Delivery — once online
        payments are enabled, this same table becomes the actual transfer amount owed to each shop.
      </p>
    </div>
  )
}

function SummaryCard({ label, value, tone }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${tone === 'primary' ? 'text-primary' : 'text-secondary'}`}>₹{value}</p>
    </div>
  )
}
