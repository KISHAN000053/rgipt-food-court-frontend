import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'

export const useSocket = () => {
  const socketRef = useRef(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    // Must point at the backend (Render), not the frontend origin — otherwise the
    // socket silently never connects and nothing is real-time.
    const url = import.meta.env.VITE_API_URL || '/'
    socketRef.current = io(url, { transports: ['websocket', 'polling'] })

    socketRef.current.on('orderStatusChanged', (data) => {
      queryClient.invalidateQueries({ queryKey: ['order', data.orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'my'] })
      if (Notification.permission === 'granted') {
        new Notification('RGIPT Food Court', { body: `Your order is now ${data.status}` })
      }
    })

    socketRef.current.on('newOrder', () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'orders'] })
    })

    // A shop opened or closed — refresh shop lists and menus everywhere immediately
    // so students can't keep adding items from a shop that just went offline.
    socketRef.current.on('shopStatusChanged', () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
      queryClient.invalidateQueries({ queryKey: ['shop'] })
      queryClient.invalidateQueries({ queryKey: ['menu'] })
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [queryClient])

  return socketRef.current
}
