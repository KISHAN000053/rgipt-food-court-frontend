import React from 'react'
import { useAdminAnalytics } from '../../api/queries'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import { TrendingUp, Users, Store, ClipboardList } from 'lucide-react'

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useAdminAnalytics()

  if (isLoading) return <LoadingSkeleton type="shop" count={4} />

  const stats = [
    { label: 'Total Revenue', value: `₹${analytics?.totalRevenue || 0}`, icon: TrendingUp },
    { label: 'Total Orders', value: analytics?.totalOrders || 0, icon: ClipboardList },
    { label: 'Active Users', value: analytics?.totalUsers || 0, icon: Users },
    { label: 'Active Shops', value: analytics?.totalShops || 0, icon: Store },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-primary">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-secondary">{stat.value}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
