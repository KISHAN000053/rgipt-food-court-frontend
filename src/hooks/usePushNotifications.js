import { useState, useEffect } from 'react'
import api from '../api/axios'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function usePushNotifications() {
  const [permission, setPermission] = useState(Notification.permission)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    // Check if already subscribed on this device
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        setSubscribed(!!sub)
      })
    })
  }, [])

  const subscribe = async () => {
    setLoading(true)
    setError('')
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('This browser does not support push notifications.')
      }

      const perm = await Notification.requestPermission()
      setPermission(perm)
      if (perm !== 'granted') {
        throw new Error('Permission denied. Enable notifications in your browser settings.')
      }

      const reg = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      const { data } = await api.get('/push/vapid-public-key')
      const applicationServerKey = urlBase64ToUint8Array(data.publicKey)

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true, // required by browsers — every push must show a notification
        applicationServerKey,
      })

      await api.post('/push/subscribe', { subscription: sub.toJSON() })
      setSubscribed(true)
    } catch (err) {
      setError(err.message || 'Could not enable notifications.')
    } finally {
      setLoading(false)
    }
  }

  const unsubscribe = async () => {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await api.post('/push/unsubscribe', { endpoint: sub.endpoint })
        await sub.unsubscribe()
      }
      setSubscribed(false)
    } catch (err) {
      setError(err.message || 'Could not disable notifications.')
    } finally {
      setLoading(false)
    }
  }

  const supported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window

  return { supported, permission, subscribed, loading, error, subscribe, unsubscribe }
}
