import React from 'react'
import { useCart } from '../hooks/useCart'
import { money } from '../utils/money'

function QtyControl({ quantity, onAdd, onIncrement, onDecrement, disabled }) {
  if (quantity > 0) {
    return (
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
        <button onClick={onDecrement} className="px-3 py-1 text-primary hover:bg-gray-100 font-medium rounded-l-lg">-</button>
        <span className="px-2 font-medium">{quantity}</span>
        <button onClick={onIncrement} className="px-3 py-1 text-primary hover:bg-gray-100 font-medium rounded-r-lg">+</button>
      </div>
    )
  }
  return (
    <button
      onClick={onAdd}
      disabled={disabled}
      className="px-4 py-1.5 border border-primary text-primary hover:bg-primary hover:text-white transition font-medium rounded-lg text-sm disabled:opacity-50"
    >
      ADD
    </button>
  )
}

export default function MenuItemCard({ item, shopOpen = true }) {
  const { items, addItem, updateQty } = useCart()

  const veg = (
    <div className={`w-3 h-3 rounded-sm border ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center flex-shrink-0`}>
      <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
    </div>
  )

  if (item.hasVariants) {
    const minPrice = Math.min(...item.variants.map(v => v.price))

    return (
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          {veg}
          <h4 className="font-semibold text-secondary">{item.name}</h4>
        </div>
        <span className="text-sm text-gray-400 mb-3 block">From ₹{money(minPrice)}</span>

        <div className="space-y-2 border-t border-gray-50 pt-3">
          {item.variants.map((variant, idx) => {
            const cartItem = items.find(i => i.menuItemId === item._id && i.variantId === variant._id)
            return (
              <div key={variant._id} className="flex items-center justify-between gap-3">
                <span className="text-sm text-secondary">
                  {variant.name || `Option ${idx + 1}`} <span className="text-gray-400">· ₹{money(variant.price)}</span>
                </span>
                {!shopOpen ? (
                  <span className="px-3 py-1 text-xs font-medium text-gray-400 border border-gray-200 rounded-lg">Closed</span>
                ) : (
                  <QtyControl
                    quantity={cartItem?.quantity || 0}
                    onAdd={() => addItem({ ...item, variantId: variant._id, variantName: variant.name, price: variant.price })}
                    onIncrement={() => updateQty(item._id, (cartItem?.quantity || 0) + 1, variant._id)}
                    onDecrement={() => updateQty(item._id, (cartItem?.quantity || 0) - 1, variant._id)}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const cartItem = items.find(i => i.menuItemId === item._id && !i.variantId)

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {veg}
          <h4 className="font-semibold text-secondary">{item.name}</h4>
        </div>
        <span className="font-bold text-primary">₹{money(item.price)}</span>
      </div>

      <div className="flex flex-col items-end justify-center w-24">
        {!shopOpen ? (
          <span className="px-3 py-1.5 text-xs font-medium text-gray-400 border border-gray-200 rounded-lg">Closed</span>
        ) : (
          <QtyControl
            quantity={cartItem?.quantity || 0}
            onAdd={() => addItem(item)}
            onIncrement={() => updateQty(item._id, (cartItem?.quantity || 0) + 1)}
            onDecrement={() => updateQty(item._id, (cartItem?.quantity || 0) - 1)}
          />
        )}
      </div>
    </div>
  )
}
