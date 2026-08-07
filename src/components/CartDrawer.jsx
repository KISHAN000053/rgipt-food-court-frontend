import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ShoppingCart, Trash2, Store, Home } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { usePublicSettings, usePlaceOrder, useShops, useCreateRazorpayOrder, useVerifyRazorpayPayment } from '../api/queries'
import EmptyState from './ui/EmptyState'
import { money } from '../utils/money'
import { openRazorpayCheckout } from '../utils/razorpay'

export default function CartDrawer({ onClose }) {
  const { items, updateQty, clearCart, total } = useCart()
  const { user } = useAuth()
  const { data: settings } = usePublicSettings()
  const { data: shops } = useShops()
  const placeOrder = usePlaceOrder()
  const createRazorpayOrder = useCreateRazorpayOrder()
  const verifyRazorpayPayment = useVerifyRazorpayPayment()
  const navigate = useNavigate()

  const serviceFee = settings?.serviceFee ?? 2
  const surchargePercent = settings?.razorpaySurchargePercent ?? 2
  const processingFee = items.length > 0 ? Math.round(total * (surchargePercent / 100) * 100) / 100 : 0
  const grandTotal = Math.round((total + (items.length > 0 ? serviceFee : 0) + processingFee) * 100) / 100

  const [checkoutMode, setCheckoutMode] = useState(false)
  const [orderType, setOrderType] = useState('hostel')
  const [paymentMethod, setPaymentMethod] = useState('cash') // 'cash' | 'razorpay'
  const [paying, setPaying] = useState(false)
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

  // A shop can close while items are sitting in the cart — surface that immediately
  // and block checkout rather than letting the order fail at the server.
  const closedShops = useMemo(() => {
    if (!shops) return []
    const openMap = new Map(shops.map(s => [String(s._id), s.isOpen && !s.isPermanentlyClosed]))
    return groupedByShop.filter(g => openMap.get(String(g.shopId)) === false)
  }, [shops, groupedByShop])

  const hasClosedShop = closedShops.length > 0

  const handlePlaceOrder = async () => {
    setError('')
    setPaying(true)
    try {
      // Step 1: always create the order first (status stays 'pending' for razorpay
      // until payment is actually confirmed — never marked paid on trust alone).
      const result = await placeOrder.mutateAsync({
        items: items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity, variantId: i.variantId })),
        orderType,
        paymentMethod,
      })

      if (paymentMethod === 'cash') {
        clearCart()
        onClose()
        navigate('/orders')
        return
      }

      // Step 2: razorpay — create a Razorpay order for the group total, open checkout.
      const groupId = result.groupId
      const rp = await createRazorpayOrder.mutateAsync({ groupId })

      openRazorpayCheckout({
        keyId: rp.keyId,
        orderId: rp.razorpayOrderId,
        amount: rp.amount,
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        onSuccess: async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
          try {
            await verifyRazorpayPayment.mutateAsync({ razorpayOrderId, razorpayPaymentId, razorpaySignature })
            clearCart()
            onClose()
            navigate('/orders')
          } catch (err) {
            setError('Payment succeeded but confirmation failed — check Orders in a minute, or contact Support if it doesn\'t update.')
          } finally {
            setPaying(false)
          }
        },
        onDismiss: () => {
          // Order exists as 'pending' — student can retry payment from Orders later.
          setPaying(false)
          setError('Payment cancelled. Your order is saved as pending — you can try paying again from Orders.')
        },
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place your order. Please try again.')
      setPaying(false)
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
              {hasClosedShop && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  <span className="font-medium">
                    {closedShops.map(g => g.shopName).join(', ')} {closedShops.length === 1 ? 'has' : 'have'} just closed.
                  </span>{' '}
                  Remove {closedShops.length === 1 ? 'those items' : 'them'} to continue.
                </div>
              )}
              {groupedByShop.map(group => (
                <div key={group.shopId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wide flex justify-between items-center">
                    <span className="text-gray-500">{group.shopName}</span>
                    {closedShops.some(c => c.shopId === group.shopId) && (
                      <span className="text-red-600 normal-case font-medium">Closed</span>
                    )}
                  </div>
                  {group.items.map(item => (
                    <div key={item.menuItemId} className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-secondary text-sm">{item.name}{item.variantName ? ` (${item.variantName})` : ''}</h4>
                        <span className="text-primary font-medium text-sm">₹{money(item.price)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                          <button onClick={() => updateQty(item.menuItemId, item.quantity - 1, item.variantId)} className="px-2 py-0.5 text-primary font-medium hover:bg-gray-100 rounded-l-lg">-</button>
                          <span className="px-2 font-medium text-sm">{item.quantity}</span>
                          <button onClick={() => updateQty(item.menuItemId, item.quantity + 1, item.variantId)} className="px-2 py-0.5 text-primary font-medium hover:bg-gray-100 rounded-r-lg">+</button>
                        </div>
                        <button onClick={() => updateQty(item.menuItemId, 0, item.variantId)} className="text-gray-400 hover:text-red-500 transition">
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
                    <h4 className="font-medium mb-3">Payment Method</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition ${paymentMethod === 'cash' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        Cash on Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('razorpay')}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition ${paymentMethod === 'razorpay' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        Pay Online
                      </button>
                    </div>
                    {paymentMethod === 'razorpay' && (
                      <p className="text-xs text-gray-400 mt-2">Card, UPI, or netbanking via Razorpay.</p>
                    )}
                  </div>
                </>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-2">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal ({groupedByShop.length} shop{groupedByShop.length > 1 ? 's' : ''})</span>
                  <span>₹{money(total)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Service Fee</span>
                  <span>₹{money(serviceFee)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Processing ({surchargePercent}%)</span>
                  <span>₹{processingFee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-secondary">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
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
                disabled={hasClosedShop}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-deep transition shadow-sm disabled:opacity-50"
              >
                Checkout (₹{grandTotal.toFixed(2)})
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={placeOrder.isPending || paying || hasClosedShop || (orderType === 'hostel' && !user?.hostel)}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-deep transition shadow-sm disabled:opacity-50"
              >
                {placeOrder.isPending || paying
                  ? (paymentMethod === 'razorpay' ? 'Opening payment...' : 'Placing Order...')
                  : paymentMethod === 'razorpay' ? `Pay ₹${money(grandTotal)}` : 'Place Order'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
