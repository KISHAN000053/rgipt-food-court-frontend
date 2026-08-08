import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { money } from '../utils/money'

export default function AddonPicker({ shop, addons, onClose }) {
  const { items, addItem } = useCart()
  const [selected, setSelected] = useState({}) // addonId -> quantity

  const cartFromThisShop = items.filter(i => i.shopId === shop._id && !i.isAddon)

  const setQty = (addonId, qty) => {
    setSelected(prev => {
      const next = { ...prev }
      if (qty <= 0) delete next[addonId]
      else next[addonId] = qty
      return next
    })
  }

  const selectedCount = Object.values(selected).reduce((sum, q) => sum + q, 0)
  const selectedTotal = Object.entries(selected).reduce((sum, [id, q]) => {
    const addon = addons.find(a => a._id === id)
    return sum + (addon ? addon.price * q : 0)
  }, 0)

  const handleAddAll = () => {
    for (const [addonId, qty] of Object.entries(selected)) {
      const addon = addons.find(a => a._id === addonId)
      if (addon && qty > 0) {
        addItem({ _id: addon._id, shopId: shop._id, shopName: shop.name, name: addon.name, price: addon.price }, qty)
      }
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-secondary">Add-ons</h2>
            <p className="text-sm text-gray-500">for {shop.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">In your cart</p>
            {cartFromThisShop.length === 0 ? (
              <p className="text-sm text-gray-400">Nothing from {shop.name} yet — you can still add extras, they'll ride along at checkout.</p>
            ) : (
              <div className="space-y-1">
                {cartFromThisShop.map(item => (
                  <p key={`${item.menuItemId}-${item.variantId || ''}`} className="text-sm text-secondary">
                    {item.quantity}x {item.name}{item.variantName ? ` (${item.variantName})` : ''}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Pick your add-ons</p>
            <div className="space-y-2">
              {addons.map(addon => {
                const qty = selected[addon._id] || 0
                return (
                  <div key={addon._id} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-secondary">
                      {addon.name} <span className="text-gray-400">· ₹{money(addon.price)}</span>
                    </span>
                    {qty > 0 ? (
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                        <button onClick={() => setQty(addon._id, qty - 1)} className="px-3 py-1 text-primary hover:bg-gray-100 font-medium rounded-l-lg">-</button>
                        <span className="px-2 font-medium">{qty}</span>
                        <button onClick={() => setQty(addon._id, qty + 1)} className="px-3 py-1 text-primary hover:bg-gray-100 font-medium rounded-r-lg">+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setQty(addon._id, 1)}
                        className="px-4 py-1.5 border border-primary text-primary hover:bg-primary hover:text-white transition font-medium rounded-lg text-sm"
                      >
                        <Plus className="w-3.5 h-3.5 inline -mt-0.5" /> Select
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100">
          <button
            onClick={handleAddAll}
            disabled={selectedCount === 0}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-deep transition disabled:opacity-50"
          >
            {selectedCount === 0 ? 'Select add-ons above' : `Add ${selectedCount} to Cart · ₹${money(selectedTotal)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
