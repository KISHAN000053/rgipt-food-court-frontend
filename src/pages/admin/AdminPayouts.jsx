import React from 'react'
import { useAdminPayouts } from '../../api/queries'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import { Store } from 'lucide-react'
import { money } from '../../utils/money'

export default function AdminPayouts() {
  const { data, isLoading, error } = useAdminPayouts()

  if (isLoading) return <LoadingSkeleton type="text" count={5} />
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Failed to load payouts.</div>
  if (!data) return null

  const { payouts, summary } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-secondary mb-1">Shop Payouts</h1>
        <p className="text-sm text-gray-500">
          Amount owed to each shop = their own menu prices (the order subtotal). The processing charge
          and service fee added at checkout are platform revenue, shown separately.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Owed to Shops" value={summary.totalOwedToShops} tone="primary" />
        <SummaryCard label="Platform Revenue (processing)" value={summary.totalMarkupRevenue} tone="neutral" />
        <SummaryCard label="Platform Revenue (service fees)" value={summary.totalServiceFees} tone="neutral" />
      </div>

      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Total Owed to Shops</h2>
        {payouts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
            No completed orders yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {payouts.map(p => (
              <div key={p.shopId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Store className="w-4 h-4 text-gray-400" />
                  <h3 className="font-bold text-secondary">{p.shopName}</h3>
                </div>
                <p className="text-2xl font-bold text-primary mb-1">₹{money(p.amountOwed)}</p>
                <p className="text-xs text-gray-400">{p.orderCount} order{p.orderCount === 1 ? '' : 's'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Cancelled orders and unpaid/abandoned online payments are excluded. These are the actual amounts
        collected — since all orders are now paid online through Razorpay, this reflects real transfers owed to each shop.
      </p>
    </div>
  )
}

function SummaryCard({ label, value, tone }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${tone === 'primary' ? 'text-primary' : 'text-secondary'}`}>₹{money(value)}</p>
    </div>
  )
}
