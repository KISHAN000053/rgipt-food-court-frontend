import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useShops } from '../api/queries'
import ShopCard from '../components/ShopCard'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import EmptyState from '../components/ui/EmptyState'
import { Store, PartyPopper, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useParty } from '../context/PartyContext'

export default function Home() {
  const { user } = useAuth()
  const { data: shops, isLoading, error } = useShops()
  const { activeCode, stopShoppingForParty } = useParty()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const isUnverifiedDomain = user?.role === 'student' && user?.email && !user.email.toLowerCase().endsWith('@rgipt.ac.in')

  return (
    <div className="space-y-8 pb-20">
      {activeCode && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 flex items-center gap-3">
          <PartyPopper className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm text-secondary flex-1">
            Adding to party <span className="font-mono font-bold">{activeCode}</span> — items go to the group order.{' '}
            <Link to={`/party/${activeCode}`} className="text-primary underline font-medium">View room</Link>
          </p>
          <button onClick={stopShoppingForParty} className="text-gray-400 hover:text-secondary" aria-label="Stop adding to party">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {isUnverifiedDomain && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3">
          We couldn't verify this account as an official RGIPT email. You can still browse and order — if you run
          into any access issues, reach out via Support.
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-secondary mb-1">
          {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500">What are you craving today?</p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
          <Store className="w-5 h-5 text-primary" />
          Campus Shops
        </h2>
        
        {isLoading ? (
          <LoadingSkeleton type="shop" count={4} />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">Failed to load shops. Please try again.</div>
        ) : shops?.length === 0 ? (
          <EmptyState 
            icon={Store}
            title="No shops found"
            description="There are currently no shops available."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops?.map(shop => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
