import React, { useState } from 'react'
import { useOwnerReport } from '../../api/queries'
import { Download } from 'lucide-react'
import { money } from '../../utils/money'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}
function daysAgoStr(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export default function ShopReports() {
  const [from, setFrom] = useState(daysAgoStr(7))
  const [to, setTo] = useState(todayStr())

  const { data, isLoading } = useOwnerReport(from, to)

  const downloadCsv = () => {
    if (!data?.rows?.length) return
    const header = ['Order ID', 'Date', 'Customer', 'Type', 'Items', 'Earnings (Rs)']
    const escape = (v) => `"${String(v).replace(/"/g, '""')}"`
    const lines = [
      header.map(escape).join(','),
      ...data.rows.map(r => [
        r.orderId,
        new Date(r.date).toLocaleString(),
        r.customer,
        r.type,
        r.items,
        r.earnings,
      ].map(escape).join(',')),
      '',
      escape('') + ',' + escape('') + ',' + escape('') + ',' + escape('') + ',' + escape('TOTAL EARNINGS') + ',' + escape(data.totalEarnings),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_${from}_to_${to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-secondary mb-1">Order Reports</h1>
          <p className="text-sm text-gray-500">Your orders and net earnings (your own prices, before platform fees).</p>
        </div>
        <button
          onClick={downloadCsv}
          disabled={!data?.rows?.length}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-deep transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Download CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input type="date" value={from} max={to} onChange={e => setFrom(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input type="date" value={to} min={from} max={todayStr()} onChange={e => setTo(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-400 py-8 text-center">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Orders</p>
              <p className="text-2xl font-bold text-secondary">{data?.orderCount || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Net Earnings</p>
              <p className="text-2xl font-bold text-primary">₹{money(data?.totalEarnings || 0)}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Type</th>
                  <th className="pb-3 px-4">Items</th>
                  <th className="pb-3 pl-4 text-right">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {data?.rows?.map(r => (
                  <tr key={r.orderId} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 pr-4 font-mono text-sm">{r.orderId}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{r.type}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm max-w-xs truncate">{r.items}</td>
                    <td className="py-3 pl-4 text-right font-medium">₹{money(r.earnings)}</td>
                  </tr>
                ))}
                {(!data?.rows || data.rows.length === 0) && (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">No orders in this range.</td></tr>
                )}
              </tbody>
              {data?.rows?.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-gray-100 font-bold text-secondary">
                    <td colSpan={4} className="py-3 pr-4 text-right">Total Earnings</td>
                    <td className="py-3 pl-4 text-right text-primary">₹{money(data.totalEarnings)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </>
      )}
    </div>
  )
}
