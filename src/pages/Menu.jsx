import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMenu, useShops } from '../api/queries'
import { useCart } from '../hooks/useCart'
import MenuItemCard from '../components/MenuItemCard'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import FilterBar from '../components/FilterBar'
import EmptyState from '../components/ui/EmptyState'
import { ArrowLeft, Utensils } from 'lucide-react'

export default function Menu() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: items, isLoading: itemsLoading } = useMenu(id)
  const { data: shops, isLoading: shopsLoading } = useShops()
  const { itemCount, total } = useCart()
  
  const [activeFilter, setActiveFilter] = useState('all')

  const shop = shops?.find(s => s._id === id)

  const filters = [
    { id: 'all', label: 'All Items' },
    { id: 'veg', label: 'Veg Only' },
    { id: 'non-veg', label: 'Non-Veg Only' }
  ]

  const categories = useMemo(() => {
    if (!items) return []
    const cats = new Set(items.map(item => item.category))
    return Array.from(cats)
  }, [items])

  const filteredItems = useMemo(() => {
    if (!items) return []
    return items.filter(item => {
      if (activeFilter === 'veg' && !item.isVeg) return false
      if (activeFilter === 'non-veg' && item.isVeg) return false
      return true
    })
  }, [items, activeFilter])

  if (shopsLoading) return <LoadingSkeleton type="shop" count={1} />
  
  if (!shop) return (
    <div className="pt-8">
      <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-primary font-medium mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>
      <EmptyState icon={Utensils} title="Shop not found" description="The shop you are looking for does not exist." />
    </div>
  )

  return (
    <div className="pb-24">
      <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-gray-500 hover:text-primary transition font-medium mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary mb-1">{shop.name}</h1>
            <p className="text-gray-500">{shop.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${shop.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {shop.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      <div className="mb-6 sticky top-16 bg-gray-50 z-10 py-2">
        <FilterBar filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {itemsLoading ? (
        <LoadingSkeleton type="menu" count={6} />
      ) : filteredItems.length === 0 ? (
        <EmptyState icon={Utensils} title="No items found" description="Try changing your filters." />
      ) : (
        <div className="space-y-8">
          {categories.map(category => {
            const categoryItems = filteredItems.filter(item => item.category === category)
            if (categoryItems.length === 0) return null
            
            return (
              <div key={category}>
                <h3 className="text-xl font-bold text-secondary mb-4 capitalize">{category}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {categoryItems.map(item => (
                    <MenuItemCard key={item._id} item={{...item, shopId: shop._id, shopName: shop.name}} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden z-40">
          <button 
            onClick={() => navigate('/cart')}
            className="w-full bg-primary text-white px-4 py-3 rounded-xl font-bold flex justify-between items-center shadow-md"
          >
            <div className="flex flex-col text-left leading-tight">
              <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
              <span className="text-xs text-orange-200">View Cart</span>
            </div>
            <span className="text-lg">₹{total}</span>
          </button>
        </div>
      )}
    </div>
  )
}
