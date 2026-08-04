import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'

export const useSocket = () => {
  const socketRef = useRef(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    socketRef.current = io('/', { path: '/socket.io' })
    
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

    return () => {
      socketRef.current.disconnect()
    }
  }, [queryClient])

  return socketRef.current
}
