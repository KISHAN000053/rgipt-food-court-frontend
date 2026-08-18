import React from 'react'
import { Bell, BellOff } from 'lucide-react'
import { usePushNotifications } from '../hooks/usePushNotifications'

export default function PushNotificationToggle() {
  const { supported, subscribed, loading, error, subscribe, unsubscribe } = usePushNotifications()

  if (!supported) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-400 text-sm">
        <BellOff className="w-4 h-4" />
        Notifications not supported in this browser
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={subscribed ? unsubscribe : subscribe}
        disabled={loading}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium text-sm transition ${
          subscribed
            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        } disabled:opacity-50`}
      >
        {subscribed ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        {loading
          ? 'Please wait...'
          : subscribed
          ? 'Order alerts ON'
          : 'Enable order alerts'}
      </button>
      {error && <p className="text-red-500 text-xs mt-1 px-1">{error}</p>}
      {!subscribed && !loading && (
        <p className="text-xs text-gray-400 mt-1 px-1">
          Get notified the moment a new order comes in, even with another app open.
        </p>
      )}
    </div>
  )
}
