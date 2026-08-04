import React, { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('rgipt-cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('rgipt-cart', JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find(i => i.menuItemId === item._id)
      if (existing) {
        return prev.map(i => i.menuItemId === item._id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { 
        menuItemId: item._id, 
        shopId: item.shopId, 
        shopName: item.shopName, 
        name: item.name, 
        price: item.price, 
        quantity: 1 
      }]
    })
  }

  const removeItem = (menuItemId) => {
    setItems(prev => prev.filter(i => i.menuItemId !== menuItemId))
  }

  const updateQty = (menuItemId, qty) => {
    if (qty < 1) {
      removeItem(menuItemId)
      return
    }
    setItems(prev => prev.map(i => i.menuItemId === menuItemId ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => setItems([])

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  )
}
