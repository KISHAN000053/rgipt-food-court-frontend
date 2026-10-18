import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { getToken } from '../api/axios'

export const useSocket = () => {
  const socketRef = useRef(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    // Must point at the backend (Render), not the frontend origin — otherwise the
    // socket silently never connects and nothing is real-time.
    const url = import.meta.env.VITE_API_URL || '/'
    const socket = io(url, {
      transports: ['websocket', 'polling'],
      // Socket rooms contain private order/user data. Send the signed-in token so
      // the backend can authenticate the connection and authorize room subscriptions.
      auth: (callback) => callback({ token: getToken() }),
    })
    socketRef.current = socket

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
  }, [queryClient])

  return socketRef.current
}
