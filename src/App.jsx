import React, { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'

const Landing = React.lazy(() => import('./pages/Landing'))
const Home = React.lazy(() => import('./pages/Home'))
const Menu = React.lazy(() => import('./pages/Menu'))
const Cart = React.lazy(() => import('./pages/Cart'))
const Orders = React.lazy(() => import('./pages/Orders'))
const OrderDetail = React.lazy(() => import('./pages/OrderDetail'))
const Profile = React.lazy(() => import('./pages/Profile'))
const Onboarding = React.lazy(() => import('./pages/Onboarding'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'))
const AdminShops = React.lazy(() => import('./pages/admin/AdminShops'))
const AdminMenu = React.lazy(() => import('./pages/admin/AdminMenu'))
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'))
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'))

const ShopLayout = React.lazy(() => import('./pages/shop/ShopLayout'))
const ShopDashboard = React.lazy(() => import('./pages/shop/ShopDashboard'))
const ShopMenu = React.lazy(() => import('./pages/shop/ShopMenu'))

function RequireOnboarded({ children }) {
  const { user } = useAuth()
  if (user && !user.isOnboarded) return <Navigate to="/onboarding" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user } = useAuth()
  if (user && user.role !== 'admin') return <Navigate to="/home" replace />
  return children
}

function RequireShopOwner({ children }) {
  const { user } = useAuth()
  if (user && user.role !== 'owner') return <Navigate to="/home" replace />
  return children
}

function LayoutWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}

function FullPageLoading() {
  return <div className="min-h-screen flex items-center justify-center text-primary">Loading...</div>
}

export default function App() {
  const { user } = useAuth()
  
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return (
    <Suspense fallback={<FullPageLoading />}>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Landing />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<LayoutWrapper><Onboarding /></LayoutWrapper>} />
          
          <Route element={<RequireOnboarded><Outlet /></RequireOnboarded>}>
            <Route path="/home" element={<LayoutWrapper><Home /></LayoutWrapper>} />
            <Route path="/shops/:id/menu" element={<LayoutWrapper><Menu /></LayoutWrapper>} />
            <Route path="/cart" element={<LayoutWrapper><Cart /></LayoutWrapper>} />
            <Route path="/orders" element={<LayoutWrapper><Orders /></LayoutWrapper>} />
            <Route path="/orders/:id" element={<LayoutWrapper><OrderDetail /></LayoutWrapper>} />
            <Route path="/profile" element={<LayoutWrapper><Profile /></LayoutWrapper>} />
          </Route>
          
          <Route element={<RequireAdmin><Outlet /></RequireAdmin>}>
            <Route path="/admin" element={<LayoutWrapper><AdminLayout /></LayoutWrapper>}>
              <Route index element={<AdminDashboard />} />
              <Route path="shops" element={<AdminShops />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
          </Route>

          <Route element={<RequireShopOwner><Outlet /></RequireShopOwner>}>
            <Route path="/shop-owner" element={<LayoutWrapper><ShopLayout /></LayoutWrapper>}>
              <Route index element={<ShopDashboard />} />
              <Route path="menu" element={<ShopMenu />} />
            </Route>
          </Route>
        </Route>
        
        <Route path="*" element={<LayoutWrapper><NotFound /></LayoutWrapper>} />
      </Routes>
    </Suspense>
  )
}
