import React, { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { useParty } from '../context/PartyContext'
import { useAddPartyItem } from '../api/queries'

export default function MenuItemCard({ item }) {
  const { items, addItem, updateQty } = useCart()
  const { activeCode } = useParty()
  const addPartyItem = useAddPartyItem()
  const [justAdded, setJustAdded] = useState(false)

  const cartItem = items.find(i => i.menuItemId === item._id)

  // When shopping for a party room, ADD sends the item to the room instead of the personal cart.
  const handlePartyAdd = async () => {
    try {
      await addPartyItem.mutateAsync({ code: activeCode, menuItemId: item._id, quantity: 1 })
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 1500)
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add this item to the party.')
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-3 h-3 rounded-sm border ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
          <h4 className="font-semibold text-secondary">{item.name}</h4>
        </div>
        <span className="font-bold text-primary">₹{item.price}</span>
      </div>

      <div className="flex flex-col items-end justify-center w-24">
        {activeCode ? (
          <button
            onClick={handlePartyAdd}
            disabled={addPartyItem.isPending}
            className={`px-4 py-1.5 border transition font-medium rounded-lg text-sm disabled:opacity-50 ${
              justAdded
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            {justAdded ? 'ADDED' : 'ADD'}
          </button>
        ) : cartItem ? (
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
