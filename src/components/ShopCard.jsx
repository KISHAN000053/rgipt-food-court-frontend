import React from 'react'
import { Link } from 'react-router-dom'

export default function ShopCard({ shop }) {
  return (
    <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-secondary">{shop.name}</h3>
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${shop.isOpen ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className="text-sm font-medium text-gray-500">{shop.isOpen ? 'Open' : 'Closed'}</span>
          </div>
        </div>

        {shop.description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{shop.description}</p>
        )}

        <div className="mt-auto">
          <Link
            to={`/shops/${shop._id}/menu`}
            className="block w-full bg-primary text-white text-center py-2.5 rounded-lg font-medium hover:bg-orange-600 transition"
            onClick={(e) => {
              if (!shop.isOpen) e.preventDefault()
            }}
          >
            View Menu
          </Link>
        </div>
      </div>
    </div>
  )
}
