import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Utensils, FileText } from 'lucide-react'

export default function ShopLayout() {
  const location = useLocation()
  
  const navItems = [
    { path: '/shop-owner', icon: LayoutDashboard, label: 'Live Orders' },
    { path: '/shop-owner/menu', icon: Utensils, label: 'My Menu' },
    { path: '/shop-owner/reports', icon: FileText, label: 'Reports' },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Shop Panel</h2>
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
