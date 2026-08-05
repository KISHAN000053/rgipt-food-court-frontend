import React, { useState, useEffect } from 'react'
import { useAdminSettings, useUpdateSettings } from '../../api/queries'

export default function AdminSettings() {
  const { data: settings, isLoading } = useAdminSettings()
  const updateSettings = useUpdateSettings()

  const [form, setForm] = useState({ razorpaySurchargePercent: '', serviceFee: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (settings) {
      setForm({
        razorpaySurchargePercent: settings.razorpaySurchargePercent,
        serviceFee: settings.serviceFee,
      })
    }
  }, [settings])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      await updateSettings.mutateAsync({
        razorpaySurchargePercent: Number(form.razorpaySurchargePercent),
        serviceFee: Number(form.serviceFee),
      })
      setMessage('Saved — new prices apply immediately across the site.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings.')
    }
  }

  if (isLoading) return <div className="text-gray-400 p-6">Loading...</div>

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg">
      <h1 className="text-xl font-bold text-secondary mb-2">Pricing Settings</h1>
      <p className="text-sm text-gray-500 mb-6">
        These apply to every shop's menu automatically. Shop owners still set their own base prices —
        this is the platform markup added on top, shown to students at checkout.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Payment processing surcharge (%)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.razorpaySurchargePercent}
            onChange={e => setForm({ ...form, razorpaySurchargePercent: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-gray-400 mt-1">Added on top of every menu item's price.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Service fee (₹ per order)
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={form.serviceFee}
            onChange={e => setForm({ ...form, serviceFee: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-gray-400 mt-1">Flat charge added once per order, regardless of items.</p>
        </div>

        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={updateSettings.isPending}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-deep transition disabled:opacity-50"
        >
          {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
