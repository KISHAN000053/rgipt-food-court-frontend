import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Utensils, FileText, LifeBuoy } from 'lucide-react'
import { useMyShop, useToggleMyShopStatus } from '../../api/queries'
import PushNotificationToggle from '../../components/PushNotificationToggle'

export default function ShopLayout() {
  const location = useLocation()
  const { data: shop } = useMyShop()
  const toggleStatus = useToggleMyShopStatus()
  
  const navItems = [
    { path: '/shop-owner', icon: LayoutDashboard, label: 'Live Orders' },
    { path: '/shop-owner/menu', icon: Utensils, label: 'My Menu' },
    { path: '/shop-owner/reports', icon: FileText, label: 'Reports' },
    { path: '/support', icon: LifeBuoy, label: 'Support' },
  ]

  const handleToggle = () => {
    if (!shop) return
    toggleStatus.mutate(!shop.isOpen)
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Shop Panel</h2>

        {shop && (
          <div className="px-2 mb-4 pb-4 border-b border-gray-100">
            <p className="font-bold text-secondary text-sm truncate mb-2">{shop.name}</p>
            {shop.isPermanentlyClosed ? (
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                Deactivated by admin
              </span>
            ) : (
              <button
                onClick={handleToggle}
                disabled={toggleStatus.isPending}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
                  shop.isOpen
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${shop.isOpen ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  {shop.isOpen ? 'Online' : 'Offline'}
                </span>
                <span className="text-xs underline">
                  {toggleStatus.isPending ? '...' : shop.isOpen ? 'Go offline' : 'Go online'}
                </span>
              </button>
            )}
            {shop.menuEditingEnabled === false && (
              <p className="text-xs text-amber-600 mt-2 px-1">Menu editing restricted by admin</p>
            )}
          </div>
        )}

        <div className="px-2 mb-4 pb-4 border-b border-gray-100">
          <PushNotificationToggle />
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition ${
                  isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
