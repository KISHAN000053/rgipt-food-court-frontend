import React, { Suspense } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/layout/Navbar'
import NotificationPrompt from './components/NotificationPrompt'
import ProtectedRoute from './components/layout/ProtectedRoute'
import ThemeToggle from './components/ThemeToggle'
import { useSocket } from './hooks/useSocket'

const Landing = React.lazy(() => import('./pages/Landing'))
const Home = React.lazy(() => import('./pages/Home'))
const Menu = React.lazy(() => import('./pages/Menu'))
const Cart = React.lazy(() => import('./pages/Cart'))
const Orders = React.lazy(() => import('./pages/Orders'))
const OrderDetail = React.lazy(() => import('./pages/OrderDetail'))
const Profile = React.lazy(() => import('./pages/Profile'))
const Support = React.lazy(() => import('./pages/Support'))
const Onboarding = React.lazy(() => import('./pages/Onboarding'))
const Terms = React.lazy(() => import('./pages/Terms'))
const About = React.lazy(() => import('./pages/About'))
const Privacy = React.lazy(() => import('./pages/Privacy'))
const CodeOfConduct = React.lazy(() => import('./pages/CodeOfConduct'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'))
const AdminShops = React.lazy(() => import('./pages/admin/AdminShops'))
const AdminMenu = React.lazy(() => import('./pages/admin/AdminMenu'))
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'))
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'))
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'))
const AdminPayouts = React.lazy(() => import('./pages/admin/AdminPayouts'))
const AdminHostels = React.lazy(() => import('./pages/admin/AdminHostels'))

const ShopLayout = React.lazy(() => import('./pages/shop/ShopLayout'))
const ShopOwnerAcceptTerms = React.lazy(() => import('./pages/shop/ShopOwnerAcceptTerms'))
const ShopDashboard = React.lazy(() => import('./pages/shop/ShopDashboard'))
const ShopMenu = React.lazy(() => import('./pages/shop/ShopMenu'))
const ShopReports = React.lazy(() => import('./pages/shop/ShopReports'))

function RequireOnboarded({ children }) {
  const { user } = useAuth()
  // Admins and shop owners skip student onboarding entirely.
  if (user && user.role === 'admin') return <Navigate to="/admin" replace />
  if (user && user.isShopOwner) return <Navigate to="/shop-owner" replace />
  if (user && !user.isOnboarded) return <Navigate to="/onboarding" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user } = useAuth()
  if (user && user.role !== 'admin') {
    return <Navigate to={user.isShopOwner ? '/shop-owner' : '/home'} replace />
  }
  return children
}

function RequireShopOwner({ children }) {
  const { user } = useAuth()
  if (user && user.role !== 'admin' && !user.isShopOwner) return <Navigate to="/home" replace />
  // Shop owners never go through student onboarding, so this is the only place
  // that ever asks them to accept Terms — without this, they could reach the
  // dashboard having agreed to nothing.
  if (user && user.isShopOwner && user.role !== 'admin' && !user.acceptedTerms) {
    return <Navigate to="/shop-owner/accept-terms" replace />
  }
  return children
}

function LayoutWrapper({ children }) {
  return (
    <div className="min-h-screen app-page flex flex-col pt-16">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <NotificationPrompt />
    </div>
  )
}

function FullPageLoading() {
  return <div className="min-h-screen flex items-center justify-center text-primary">Loading...</div>
}

export default function App() {
  const { user } = useAuth()
  useSocket() // one global connection: keeps shop status, orders and menus live everywhere

  return (
    <>
      <Suspense fallback={<FullPageLoading />}>
        <Routes>
          <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : user.isShopOwner ? '/shop-owner' : '/home'} replace /> : <Landing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
        <Route path="/code-of-conduct" element={<CodeOfConduct />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<LayoutWrapper><Onboarding /></LayoutWrapper>} />
          <Route path="/shop-owner/accept-terms" element={<ShopOwnerAcceptTerms />} />
          {/* Profile and Support are for everyone — students, shop owners, and admins —
              so they live outside the student-only RequireOnboarded gate below. Without
              this, clicking Profile/Support as a shop owner or admin just bounced you
              straight back to your own dashboard. */}
          <Route path="/profile" element={<LayoutWrapper><Profile /></LayoutWrapper>} />
          <Route path="/support" element={<LayoutWrapper><Support /></LayoutWrapper>} />

          <Route element={<RequireOnboarded><Outlet /></RequireOnboarded>}>
            <Route path="/home" element={<LayoutWrapper><Home /></LayoutWrapper>} />
            <Route path="/shops/:id/menu" element={<LayoutWrapper><Menu /></LayoutWrapper>} />
            <Route path="/cart" element={<LayoutWrapper><Cart /></LayoutWrapper>} />
            <Route path="/orders" element={<LayoutWrapper><Orders /></LayoutWrapper>} />
            <Route path="/orders/:id" element={<LayoutWrapper><OrderDetail /></LayoutWrapper>} />
          </Route>
          
          <Route element={<RequireAdmin><Outlet /></RequireAdmin>}>
            <Route path="/admin" element={<LayoutWrapper><AdminLayout /></LayoutWrapper>}>
              <Route index element={<AdminDashboard />} />
              <Route path="shops" element={<AdminShops />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="payouts" element={<AdminPayouts />} />
              <Route path="hostels" element={<AdminHostels />} />
            </Route>
          </Route>

          <Route element={<RequireShopOwner><Outlet /></RequireShopOwner>}>
            <Route path="/shop-owner" element={<LayoutWrapper><ShopLayout /></LayoutWrapper>}>
              <Route index element={<ShopDashboard />} />
              <Route path="menu" element={<ShopMenu />} />
              <Route path="reports" element={<ShopReports />} />
            </Route>
          </Route>
        </Route>
        
        <Route path="*" element={<LayoutWrapper><NotFound /></LayoutWrapper>} />
      </Routes>
      </Suspense>
      <ThemeToggle />
    </>
  )
}
