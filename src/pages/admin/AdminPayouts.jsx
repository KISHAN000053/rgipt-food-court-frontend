import React from 'react'
import { Link } from 'react-router-dom'
import { useAdminPayouts } from '../../api/queries'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import { Store, Zap, AlertTriangle, XCircle } from 'lucide-react'
import { money } from '../../utils/money'

export default function AdminPayouts() {
  const { data, isLoading, error } = useAdminPayouts()

  if (isLoading) return <LoadingSkeleton type="text" count={5} />
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Failed to load payouts.</div>
  if (!data) return null

  const { payouts, summary, anomalies, failedRefunds } = data
  const needsAttention = (anomalies?.length || 0) + (failedRefunds?.length || 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-secondary mb-1">Payments Overview</h1>
        <p className="text-sm text-gray-500">
          Shops linked to Razorpay Route are paid automatically the moment a student pays — this page tracks
          your own revenue and flags anything that needs your attention, rather than duplicating what Razorpay's
          own dashboard already shows you.
        </p>
      </div>

      {needsAttention > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h2 className="flex items-center gap-2 font-bold text-red-700 mb-3">
            <AlertTriangle className="w-5 h-5" /> Needs Your Attention ({needsAttention})
          </h2>

          {anomalies?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-red-700 mb-2">
                {anomalies.length} order{anomalies.length === 1 ? '' : 's'} at linked shops that should have auto-paid but didn't:
              </p>
              <div className="space-y-1">
                {anomalies.map(a => (
                  <Link key={a.orderId} to={`/admin/orders`} className="block text-sm bg-white rounded-lg px-3 py-2 hover:bg-red-50 transition">
                    <span className="font-medium">{a.shopName}</span> — ₹{money(a.total)} — {new Date(a.createdAt).toLocaleDateString()}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {failedRefunds?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> {failedRefunds.length} refund{failedRefunds.length === 1 ? '' : 's'} that failed to process automatically:
              </p>
              <div className="space-y-1">
                {failedRefunds.map(f => (
                  <div key={f.orderId} className="text-sm bg-white rounded-lg px-3 py-2">
                    <span className="font-medium">{f.shopName}</span> — ₹{money(f.refundAmount)} owed to {f.customerEmail}
                    <p className="text-xs text-gray-500 mt-0.5">{f.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Your Platform Revenue" value={summary.totalPlatformRevenue} tone="primary" big />
        <SummaryCard label="— from processing fee" value={summary.totalMarkupRevenue} tone="neutral" />
        <SummaryCard label="— from service fee" value={summary.totalServiceFees} tone="neutral" />
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
                  {p.isLinked ? (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600">
                      <Zap className="w-3 h-3" /> Auto-pay
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600">
                      Manual
                    </span>
                  )}
                </div>

                {p.isLinked ? (
                  <p className="text-2xl font-bold text-emerald-600">₹{money(p.autoPaidAmount)}</p>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-primary">₹{money(p.manualOwedAmount)}</p>
                    <p className="text-xs text-gray-400">owed — send manually</p>
                  </>
                )}
                <p className="text-xs text-gray-400 mt-2">{p.orderCount} order{p.orderCount === 1 ? '' : 's'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Cancelled orders and unpaid/abandoned checkouts are excluded. For a shop's own detailed transaction
        history, check Razorpay Dashboard → Route → Transfers.
      </p>
    </div>
  )
}

function SummaryCard({ label, value, tone, big }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`${big ? 'text-3xl' : 'text-xl'} font-bold ${tone === 'primary' ? 'text-primary' : 'text-secondary'}`}>
        ₹{money(value)}
      </p>
    </div>
  )
}
