import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './axios'

export const useShops = () => useQuery({ queryKey: ['shops'], queryFn: () => api.get('/shops').then(r => r.data), staleTime: 0, refetchInterval: 30000 })
export const useMenu = (shopId) => useQuery({ queryKey: ['menu', shopId], queryFn: () => api.get(`/menu/shops/${shopId}/menu`).then(r => r.data), enabled: !!shopId })
export const useShopAddons = (shopId) => useQuery({ queryKey: ['addons', shopId], queryFn: () => api.get(`/menu/shops/${shopId}/addons`).then(r => r.data), enabled: !!shopId })
export const useMyOrders = () => useQuery({ queryKey: ['orders', 'my'], queryFn: () => api.get('/orders/my').then(r => r.data) })
export const useOrder = (id) => useQuery({ queryKey: ['order', id], queryFn: () => api.get(`/orders/${id}`).then(r => r.data), enabled: !!id })

export const usePlaceOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/orders', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders', 'my'] })
  })
}

export const useOwnerOrders = () => useQuery({ queryKey: ['owner', 'orders'], queryFn: () => api.get('/owner/orders').then(r => r.data), refetchInterval: 30000 })
export const useOwnerMenu = () => useQuery({ queryKey: ['owner', 'menu'], queryFn: () => api.get('/owner/menu').then(r => r.data) })
export const useOwnerStats = () => useQuery({ queryKey: ['owner', 'stats'], queryFn: () => api.get('/owner/stats').then(r => r.data) })
export const useOwnerReport = (from, to) => useQuery({
  queryKey: ['owner', 'report', from, to],
  queryFn: () => api.get('/owner/report', { params: { from, to } }).then(r => r.data),
})

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

export const useDeleteShop = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/shops/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'shops'] })
  })
}

// Admin menu management (per shop)
export const useAdminShopMenu = (shopId) => useQuery({
  queryKey: ['admin', 'menu', shopId],
  queryFn: () => api.get(`/admin/menu/${shopId}`).then(r => r.data),
  enabled: !!shopId
})

const invalidateAdminMenu = (queryClient, shopId) => queryClient.invalidateQueries({ queryKey: ['admin', 'menu', shopId] })

export const useAdminCreateMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/admin/menu', data).then(r => r.data),
    onSuccess: (_, vars) => invalidateAdminMenu(queryClient, vars.shop)
  })
}

export const useAdminUpdateMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/admin/menu/${id}`, data).then(r => r.data),
    onSuccess: (item) => invalidateAdminMenu(queryClient, item.shop)
  })
}

export const useAdminDeleteMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => api.delete(`/admin/menu/${id}`).then(r => r.data),
    onSuccess: (_, vars) => invalidateAdminMenu(queryClient, vars.shopId)
  })
}

// Hostels (public list for onboarding)
export const useHostels = () => useQuery({ queryKey: ['hostels'], queryFn: () => api.get('/hostels').then(r => r.data) })

// Admin hostel management
export const useAdminHostels = () => useQuery({ queryKey: ['admin', 'hostels'], queryFn: () => api.get('/admin/hostels').then(r => r.data) })

const invalidateHostels = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ['admin', 'hostels'] })
  queryClient.invalidateQueries({ queryKey: ['hostels'] })
}

export const useCreateHostel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/admin/hostels', data).then(r => r.data),
    onSuccess: () => invalidateHostels(queryClient)
  })
}

export const useUpdateHostel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/admin/hostels/${id}`, data).then(r => r.data),
    onSuccess: () => invalidateHostels(queryClient)
  })
}

export const useDeleteHostel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/hostels/${id}`).then(r => r.data),
    onSuccess: () => invalidateHostels(queryClient)
  })
}

// Admin user deletion
export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
  })
}

// --- Party orders ---
export const usePartyRoom = (code) => useQuery({
  queryKey: ['party', code],
  queryFn: () => api.get(`/party/${code}`).then(r => r.data),
  enabled: !!code,
  refetchInterval: 8000, // keep the room live as guests add items
})

export const useMyPartyRooms = () => useQuery({
  queryKey: ['party', 'mine'],
  queryFn: () => api.get('/party/mine').then(r => r.data),
})

export const useCreatePartyRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/party', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['party', 'mine'] })
  })
}

export const useAddPartyItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ code, menuItemId, quantity, variantId }) =>
      api.post(`/party/${code}/items`, { menuItemId, quantity, variantId }).then(r => r.data),
    onSuccess: (_, vars) => queryClient.invalidateQueries({ queryKey: ['party', vars.code] })
  })
}

export const useRemovePartyItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ code, itemId }) => api.delete(`/party/${code}/items/${itemId}`).then(r => r.data),
    onSuccess: (_, vars) => queryClient.invalidateQueries({ queryKey: ['party', vars.code] })
  })
}

export const usePartyCheckout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ code, orderType, paymentMethod }) =>
      api.post(`/party/${code}/checkout`, { orderType, paymentMethod }).then(r => r.data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['party', vars.code] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'my'] })
    }
  })
}

// --- Razorpay ---
export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: ({ groupId }) => api.post('/payments/razorpay/create', { groupId }).then(r => r.data),
  })
}

export const useVerifyRazorpayPayment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/payments/razorpay/verify', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders', 'my'] })
  })
}

// --- Shop owner's own shop status ---
export const useMyShop = () => useQuery({ queryKey: ['owner', 'shop'], queryFn: () => api.get('/owner/shop').then(r => r.data) })

export const useToggleMyShopStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (isOpen) => api.patch('/owner/shop/status', { isOpen }).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['owner', 'shop'] })
  })
}
