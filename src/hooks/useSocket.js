import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import api, { getToken } from '../api/axios'
import { useAuth } from './useAuth'

export const useSocket = () => {
  const socketRef = useRef(null)
  const queryClient = useQueryClient()
  const { user } = useAuth()

  useEffect(() => {
    // Only create a connection after authentication is loaded. This avoids an
    // unauthenticated initial socket and keeps private rooms tied to the current user.
    if (!user?._id) {
      socketRef.current?.disconnect()
      socketRef.current = null
      return undefined
    }

    // Must point at the backend (Render), not the frontend origin — otherwise the
    // socket silently never connects and nothing is real-time.
    const url = import.meta.env.VITE_API_URL || '/'
    const socket = io(url, {
      transports: ['websocket', 'polling'],
      auth: (callback) => callback({ token: getToken() }),
    })
    socketRef.current = socket

    socket.on('connect', async () => {
      socket.emit('join_user', String(user._id))

      // Shop owners need their authorized shop room to receive new-order events.
      if (user.isShopOwner) {
        try {
          const { data } = await api.get('/owner/shop')
          if (data?._id && socket.connected) socket.emit('join_shop', String(data._id))
        } catch {
          // The REST dashboard surfaces its own errors; a failed room subscription
          // should not break the rest of the app.
        }
      }
    })

    socket.on('orderStatusChanged', (data) => {
      queryClient.invalidateQueries({ queryKey: ['order', data._id] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'my'] })
    })

    socket.on('newOrder', () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'orders'] })
    })

    // A shop opened or closed — refresh shop lists and menus everywhere immediately
    // so students can't keep adding items from a shop that just went offline.
    socket.on('shopStatusChanged', () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
      queryClient.invalidateQueries({ queryKey: ['shop'] })
      queryClient.invalidateQueries({ queryKey: ['menu'] })
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [queryClient, user?._id, user?.isShopOwner])

  return socketRef.current
}
