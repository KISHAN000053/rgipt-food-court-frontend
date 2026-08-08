import React, { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

// A cart line's identity is menuItemId + variantId — Quarter and Half of the same
// pizza are different lines, but two plain single-price items with no variant just
// key on menuItemId (variantId undefined for both).
const lineKey = (menuItemId, variantId) => `${menuItemId}::${variantId || ''}`

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('rgipt-cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('rgipt-cart', JSON.stringify(items))
  }, [items])

  // item: { _id, shopId, shopName, name, price, variantId?, variantName? }
  // qty: how many to add in this call (default 1, used by the add-ons picker to add several at once)
  const addItem = (item, qty = 1) => {
    setItems((prev) => {
      const key = lineKey(item._id, item.variantId)
      const existing = prev.find(i => lineKey(i.menuItemId, i.variantId) === key)
      if (existing) {
        return prev.map(i => lineKey(i.menuItemId, i.variantId) === key ? { ...i, quantity: i.quantity + qty } : i)
      }
      return [...prev, {
        menuItemId: item._id,
        variantId: item.variantId || undefined,
        variantName: item.variantName || undefined,
        shopId: item.shopId,
        shopName: item.shopName,
        name: item.name,
        price: item.price,
        quantity: qty
      }]
    })
  }

  const removeItem = (menuItemId, variantId) => {
    const key = lineKey(menuItemId, variantId)
    setItems(prev => prev.filter(i => lineKey(i.menuItemId, i.variantId) !== key))
  }

  const updateQty = (menuItemId, qty, variantId) => {
    if (qty < 1) {
      removeItem(menuItemId, variantId)
      return
    }
    const key = lineKey(menuItemId, variantId)
    setItems(prev => prev.map(i => lineKey(i.menuItemId, i.variantId) === key ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => setItems([])

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const total = Math.round(items.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 100) / 100

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  )
}
