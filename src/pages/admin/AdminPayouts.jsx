import React from 'react'
import { useAdminPayouts } from '../../api/queries'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import { Store, Zap } from 'lucide-react'
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
          Amount owed to each shop = their own menu prices (the order subtotal). Shops linked to Razorpay
          Route are paid automatically the moment a student pays — only unlinked shops need a manual transfer from you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <SummaryCard label="Still Owed (manual)" value={summary.totalOwedToShops} tone="primary" />
        <SummaryCard label="Already Auto-Paid (Route)" value={summary.totalAutoPaidToShops} tone="green" />
        <SummaryCard label="Platform Revenue (processing)" value={summary.totalMarkupRevenue} tone="neutral" />
        <SummaryCard label="Platform Revenue (service fees)" value={summary.totalServiceFees} tone="neutral" />
      </div>

      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">By Shop</h2>
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
                  {p.isLinked && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600">
                      <Zap className="w-3 h-3" /> Auto-pay
                    </span>
                  )}
                </div>

                {p.manualOwedAmount > 0 && (
                  <div className="mb-2">
                    <p className="text-2xl font-bold text-primary">₹{money(p.manualOwedAmount)}</p>
                    <p className="text-xs text-gray-400">still owed — send manually</p>
                  </div>
                )}
                {p.autoPaidAmount > 0 && (
                  <div className="mb-2">
                    <p className="text-lg font-bold text-emerald-600">₹{money(p.autoPaidAmount)}</p>
                    <p className="text-xs text-gray-400">already auto-paid via Route</p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">{p.orderCount} order{p.orderCount === 1 ? '' : 's'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Cancelled orders and unpaid/abandoned checkouts are excluded. "Still Owed" reflects only what genuinely
        needs a manual transfer from you — amounts already sent automatically via Route are shown separately, not
        double-counted.
      </p>
    </div>
  )
}

function SummaryCard({ label, value, tone }) {
  const colorClass = tone === 'primary' ? 'text-primary' : tone === 'green' ? 'text-emerald-600' : 'text-secondary'
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>₹{money(value)}</p>
    </div>
  )
}
