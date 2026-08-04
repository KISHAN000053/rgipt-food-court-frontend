import React from 'react'
import { useCart } from '../hooks/useCart'

export default function MenuItemCard({ item }) {
  const { items, addItem, updateQty } = useCart()
  const cartItem = items.find(i => i.menuItemId === item._id)

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-3 h-3 rounded-sm border ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
          <h4 className="font-semibold text-secondary">{item.name}</h4>
        </div>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{item.description}</p>
        <span className="font-bold text-primary">₹{item.price}</span>
      </div>
      
      <div className="flex flex-col items-end justify-center w-24">
        {cartItem ? (
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
            <button 
              onClick={() => updateQty(item._id, cartItem.quantity - 1)}
              className="px-3 py-1 text-primary hover:bg-gray-100 font-medium rounded-l-lg"
            >-</button>
            <span className="px-2 font-medium">{cartItem.quantity}</span>
            <button 
              onClick={() => updateQty(item._id, cartItem.quantity + 1)}
              className="px-3 py-1 text-primary hover:bg-gray-100 font-medium rounded-r-lg"
            >+</button>
          </div>
        ) : (
          <button 
            onClick={() => addItem(item)}
            className="px-6 py-1.5 border border-primary text-primary hover:bg-primary hover:text-white transition font-medium rounded-lg text-sm"
          >
            ADD
          </button>
        )}
      </div>
    </div>
  )
}
