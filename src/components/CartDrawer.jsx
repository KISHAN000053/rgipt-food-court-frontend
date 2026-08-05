import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ShoppingCart, Trash2, Store, Home } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { usePublicSettings, usePlaceOrder } from '../api/queries'
import EmptyState from './ui/EmptyState'

export default function CartDrawer({ onClose }) {
  const { items, updateQty, clearCart, total } = useCart()
  const { user } = useAuth()
  const { data: settings } = usePublicSettings()
  const placeOrder = usePlaceOrder()
  const navigate = useNavigate()

  const serviceFee = settings?.serviceFee ?? 2
  const grandTotal = total + (items.length > 0 ? serviceFee : 0)

  const [checkoutMode, setCheckoutMode] = useState(false)
  const [orderType, setOrderType] = useState('hostel')
  const [error, setError] = useState('')

  // Group cart items by shop for display — students order across shops in one checkout,
  // but each shop only ever sees its own items on the backend.
  const groupedByShop = useMemo(() => {
    const groups = new Map()
    for (const item of items) {
      if (!groups.has(item.shopId)) {
        groups.set(item.shopId, { shopId: item.shopId, shopName: item.shopName, items: [] })
      }
      groups.get(item.shopId).items.push(item)
    }
    return Array.from(groups.values())
  }, [items])

  const handlePlaceOrder = async () => {
    setError('')
    try {
      await placeOrder.mutateAsync({
        items: items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        orderType,
        paymentMethod: 'cash', // COD only for now — swap in Razorpay flow here later
      })
      clearCart()
      onClose()
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place your order. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-secondary/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cart
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-secondary rounded-full hover:bg-gray-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              description="Looks like you haven't added anything to your cart yet."
            />
          ) : (
            <div className="space-y-4">
              {groupedByShop.map(group => (
                <div key={group.shopId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {group.shopName}
                  </div>
                  {group.items.map(item => (
                    <div key={item.menuItemId} className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-secondary text-sm">{item.name}</h4>
                        <span className="text-primary font-medium text-sm">₹{item.price}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                          <button onClick={() => updateQty(item.menuItemId, item.quantity - 1)} className="px-2 py-0.5 text-primary font-medium hover:bg-gray-100 rounded-l-lg">-</button>
                          <span className="px-2 font-medium text-sm">{item.quantity}</span>
                          <button onClick={() => updateQty(item.menuItemId, item.quantity + 1)} className="px-2 py-0.5 text-primary font-medium hover:bg-gray-100 rounded-r-lg">+</button>
                        </div>
                        <button onClick={() => updateQty(item.menuItemId, 0)} className="text-gray-400 hover:text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {checkoutMode && (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <h4 className="font-medium mb-3">How do you want it?</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOrderType('hostel')}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${orderType === 'hostel' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <Home className={`w-6 h-6 ${orderType === 'hostel' ? 'text-primary' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${orderType === 'hostel' ? 'text-primary' : 'text-gray-600'}`}>Deliver to Hostel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('takeaway')}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${orderType === 'takeaway' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <Store className={`w-6 h-6 ${orderType === 'takeaway' ? 'text-primary' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${orderType === 'takeaway' ? 'text-primary' : 'text-gray-600'}`}>Takeaway</span>
                      </button>
                    </div>

                    {orderType === 'hostel' ? (
                      <div className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                        {user?.hostel ? (
                          <>Delivering to <span className="font-medium text-secondary">{user.hostel}, Room {user.roomNumber}</span></>
                        ) : (
                          <span className="text-red-500">Set your hostel &amp; room in your profile first.</span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                        Collect from the shop counter when it's ready.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <h4 className="font-medium mb-2">Payment Method</h4>
                    <div className="p-3 border border-gray-100 rounded-lg bg-gray-50 text-sm text-gray-600">
                      Cash on Delivery — online payment coming soon.
                    </div>
                  </div>
                </>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-2">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal ({groupedByShop.length} shop{groupedByShop.length > 1 ? 's' : ''})</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Service Fee</span>
                  <span>₹{serviceFee}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-secondary">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm px-1">{error}</p>}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100">
            {!checkoutMode ? (
              <button
                onClick={() => setCheckoutMode(true)}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-deep transition shadow-sm"
              >
                Checkout (₹{grandTotal})
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={placeOrder.isPending || (orderType === 'hostel' && !user?.hostel)}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-deep transition shadow-sm disabled:opacity-50"
              >
                {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
