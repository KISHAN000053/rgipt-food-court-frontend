import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import EmptyState from './ui/EmptyState'
import UPIPayment from './UPIPayment'

export default function CartDrawer({ onClose }) {
  const { items, updateQty, clearCart, total } = useCart()
  const navigate = useNavigate()
  const serviceFee = 2
  const grandTotal = total + (items.length > 0 ? serviceFee : 0)
  
  const [checkoutMode, setCheckoutMode] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const handlePlaceOrder = () => {
    if (paymentMethod === 'upi') {
      return
    }
    clearCart()
    onClose()
    navigate('/orders')
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
              {checkoutMode && paymentMethod === 'upi' ? (
                <UPIPayment amount={grandTotal} onPaymentConfirm={handlePlaceOrder} />
              ) : (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                    {items.map(item => (
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

                  {checkoutMode && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <h4 className="font-medium mb-3">Payment Method</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="text-primary" />
                          <span>Cash on Delivery</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="text-primary" />
                          <span>UPI</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-2">
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>Subtotal</span>
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
                </>
              )}
            </div>
          )}
        </div>

        {items.length > 0 && !(checkoutMode && paymentMethod === 'upi') && (
          <div className="p-4 bg-white border-t border-gray-100">
            {!checkoutMode ? (
              <button 
                onClick={() => setCheckoutMode(true)}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-sm"
              >
                Checkout (₹{grandTotal})
              </button>
            ) : (
              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-sm"
              >
                Place Order
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
