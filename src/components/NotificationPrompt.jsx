import React, { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { usePushNotifications } from '../hooks/usePushNotifications'
import { useAuth } from '../hooks/useAuth'

const SESSION_FLAG = 'notifPromptShownThisSession'

export default function NotificationPrompt() {
  const { user } = useAuth()
  const { supported, subscribed, subscribe } = usePushNotifications()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || !supported || subscribed) return
    // Browser has permanently denied — our own prompt can't override that, and
    // showing it anyway would just be a dead end that annoys people for no reason.
    if (Notification.permission === 'denied') return
    // Once per fresh visit, not once per page navigation within the same visit.
    if (sessionStorage.getItem(SESSION_FLAG)) return

    const timer = setTimeout(() => {
      setVisible(true)
      sessionStorage.setItem(SESSION_FLAG, '1')
    }, 1200) // small delay so it doesn't compete with the page's own first paint
    return () => clearTimeout(timer)
  }, [user, supported, subscribed])

  if (!visible) return null

  const isShopOwner = user?.isShopOwner

  const handleEnable = async () => {
    setLoading(true)
    await subscribe()
    setLoading(false)
    setVisible(false)
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 text-gray-300 hover:text-gray-500"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-secondary text-sm mb-1">Turn on order alerts?</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              {isShopOwner
                ? "Know the instant a new order comes in, even with another app open."
                : "Know the instant your order is ready — no need to keep checking the app."}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setVisible(false)}
            className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
          >
            Not now
          </button>
          <button
            onClick={handleEnable}
            disabled={loading}
            className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-deep transition disabled:opacity-50"
          >
            {loading ? 'Enabling...' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  )
}
