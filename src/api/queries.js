import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './axios'

export const useShops = () => useQuery({ queryKey: ['shops'], queryFn: () => api.get('/shops').then(r => r.data) })
export const useMenu = (shopId) => useQuery({ queryKey: ['menu', shopId], queryFn: () => api.get(`/menu/shops/${shopId}/menu`).then(r => r.data), enabled: !!shopId })
export const useMyOrders = () => useQuery({ queryKey: ['orders', 'my'], queryFn: () => api.get('/orders/my').then(r => r.data) })
export const useOrder = (id) => useQuery({ queryKey: ['order', id], queryFn: () => api.get(`/orders/${id}`).then(r => r.data), enabled: !!id })

export const usePlaceOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/orders', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders', 'my'] })
  })
}
export const useSearchMenu = (q) => useQuery({ queryKey: ['search', q], queryFn: () => api.get(`/menu/search?q=${q}`).then(r => r.data), enabled: q?.length > 1 })

export const useOwnerOrders = () => useQuery({ queryKey: ['owner', 'orders'], queryFn: () => api.get('/owner/orders').then(r => r.data), refetchInterval: 30000 })
export const useOwnerMenu = () => useQuery({ queryKey: ['owner', 'menu'], queryFn: () => api.get('/owner/menu').then(r => r.data) })
export const useOwnerStats = () => useQuery({ queryKey: ['owner', 'stats'], queryFn: () => api.get('/owner/stats').then(r => r.data) })

const invalidateOwnerMenu = (queryClient) => queryClient.invalidateQueries({ queryKey: ['owner', 'menu'] })

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/owner/menu', data).then(r => r.data),
    onSuccess: () => invalidateOwnerMenu(queryClient)
  })
}

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/owner/menu/${id}`, data).then(r => r.data),
    onSuccess: () => invalidateOwnerMenu(queryClient)
  })
}

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/owner/menu/${id}`).then(r => r.data),
    onSuccess: () => invalidateOwnerMenu(queryClient)
  })
}

export const useAdminShops = () => useQuery({ queryKey: ['admin', 'shops'], queryFn: () => api.get('/admin/shops').then(r => r.data) })
export const useAdminUsers = () => useQuery({ queryKey: ['admin', 'users'], queryFn: () => api.get('/admin/users').then(r => r.data) })
export const useAdminOrders = () => useQuery({ queryKey: ['admin', 'orders'], queryFn: () => api.get('/admin/orders').then(r => r.data) })
export const useAdminAnalytics = () => useQuery({ queryKey: ['admin', 'analytics'], queryFn: () => api.get('/admin/analytics').then(r => r.data) })
export const useAdminPayouts = () => useQuery({ queryKey: ['admin', 'payouts'], queryFn: () => api.get('/admin/payouts').then(r => r.data) })
export const usePublicSettings = () => useQuery({ queryKey: ['settings', 'public'], queryFn: () => api.get('/settings/public').then(r => r.data) })
export const useAdminSettings = () => useQuery({ queryKey: ['admin', 'settings'], queryFn: () => api.get('/admin/settings').then(r => r.data) })

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.patch('/admin/settings', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] })
      queryClient.invalidateQueries({ queryKey: ['settings', 'public'] })
    }
  })
}

export const useCreateShop = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/admin/shops', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'shops'] })
  })
}

export const useUpdateShop = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/admin/shops/${id}`, data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'shops'] })
  })
}
