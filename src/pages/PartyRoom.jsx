import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePartyRoom, useRemovePartyItem, usePartyCheckout, useCreateRazorpayOrder, useVerifyRazorpayPayment } from '../api/queries'
import { useParty } from '../context/PartyContext'
import { useAuth } from '../hooks/useAuth'
import { Copy, Check, Trash2, Home, Store, Users, Plus, ArrowLeft } from 'lucide-react'
import { money } from '../utils/money'
import { openRazorpayCheckout } from '../utils/razorpay'

export default function PartyRoom() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeCode, startShoppingFor, stopShoppingForParty } = useParty()

  const { data: room, isLoading, error } = usePartyRoom(code)
  const removeItem = useRemovePartyItem()
  const checkout = usePartyCheckout()
  const createRazorpayOrder = useCreateRazorpayOrder()
  const verifyRazorpayPayment = useVerifyRazorpayPayment()

  const [orderType, setOrderType] = useState('hostel')
  const [copied, setCopied] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [paying, setPaying] = useState(false)

  const shareLink = `${window.location.origin}/party/${code}`

  // Leaving the room page shouldn't silently keep "party shopping mode" on for another room.
  useEffect(() => {
    if (activeCode && activeCode !== code) stopShoppingForParty()
  }, [activeCode, code, stopShoppingForParty])

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(`Join my food court party order: ${shareLink} (code: ${code})`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      alert(shareLink)
    }
  }

  const handleAddItems = () => {
    startShoppingFor(code)
    navigate('/home')
  }

  const handleRemove = async (itemId) => {
    try {
      await removeItem.mutateAsync({ code, itemId })
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove that item.')
    }
  }

  const handleCheckout = async () => {
    setCheckoutError('')
    setPaying(true)
    try {
      // Places the order (locks the room) and pays online — same flow as normal checkout.
      const result = await checkout.mutateAsync({ code, orderType, paymentMethod: 'razorpay' })
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
            stopShoppingForParty()
            navigate('/orders')
          } catch (err) {
            setCheckoutError('Payment succeeded but confirmation failed — check Orders in a minute, or contact Support if it doesn\'t update.')
          } finally {
            setPaying(false)
          }
        },
        onDismiss: () => {
          setPaying(false)
          setCheckoutError('Payment cancelled. The party order is saved as pending — you can try paying again from Orders.')
        },
      })
    } catch (err) {
      setCheckoutError(err.response?.data?.message || 'Could not place the order. Please try again.')
      setPaying(false)
    }
  }

  if (isLoading) return <div className="text-gray-400 text-center py-12">Loading party room...</div>
  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <p className="text-secondary font-medium mb-2">Party room not found</p>
        <p className="text-gray-500 text-sm mb-6">Check the code and try again.</p>
        <Link to="/party" className="text-primary hover:underline font-medium">Back to Party Orders</Link>
      </div>
    )
  }

  const serviceFee = room.serviceFee ?? 2
  const surchargePercent = room.surchargePercent ?? 2
  const processingFee = Math.round(room.subtotal * (surchargePercent / 100) * 100) / 100
  const grandTotal = Math.round((room.subtotal + serviceFee + processingFee) * 100) / 100

  const isOrdered = room.status === 'ordered'

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24">
      <Link to="/party" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> All parties
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-secondary">{room.name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <Users className="w-3.5 h-3.5" />
              Hosted by {room.isHost ? 'you' : room.hostName}
            </p>
          </div>
          {isOrdered && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 uppercase tracking-wider whitespace-nowrap">
              Ordered
            </span>
          )}
        </div>

        {!isOrdered && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Share this with your friends</p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-bold tracking-[0.2em] text-primary">{room.code}</span>
              <button
                onClick={copyShare}
                className="ml-auto flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy link</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {!isOrdered && (
        <button
          onClick={handleAddItems}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-deep transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add your items
        </button>
      )}

      {room.participants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          Nobody has added anything yet. Share the code above to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {room.participants.map(person => (
            <div key={person.userId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-secondary text-sm">
                  {person.userId === String(user?._id) ? 'You' : person.name}
                </span>
                <span className="text-sm font-medium text-gray-500">₹{money(person.subtotal)}</span>
              </div>
              {person.items.map(item => (
                <div key={item._id} className="flex justify-between items-center px-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="flex-1">
                    <p className="text-secondary text-sm">
                      <span className="font-medium">{item.quantity}x</span> {item.name}{item.variantName ? ` (${item.variantName})` : ''}{item.isAddon ? ' · Add-on' : ''}
                    </p>
                    <p className="text-xs text-gray-400">{item.shopName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-secondary">₹{money(item.price * item.quantity)}</span>
                    {!isOrdered && (item.isMine || room.isHost) && (
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-gray-400 hover:text-red-500 transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {room.itemCount > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-2">
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Subtotal ({room.itemCount} items)</span>
            <span>₹{money(room.subtotal)}</span>
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
            <span>Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
          {!room.isHost && !isOrdered && (
            <p className="text-xs text-gray-400 pt-1">
              {room.hostName} pays for the whole party order.
            </p>
          )}
        </div>
      )}

      {room.isHost && !isOrdered && room.itemCount > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div>
            <h3 className="font-medium text-secondary mb-3">How do you want it?</h3>
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
            <div className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              {orderType === 'hostel'
                ? (user?.hostel
                    ? <>Delivering to <span className="font-medium text-secondary">{user.hostel}, Room {user.roomNumber}</span></>
                    : <span className="text-red-500">Set your hostel &amp; room in your profile first.</span>)
                : 'Collect from the shop counter when it\'s ready.'}
            </div>
          </div>

          {checkoutError && <p className="text-red-500 text-sm">{checkoutError}</p>}

          <button
            onClick={handleCheckout}
            disabled={checkout.isPending || paying || (orderType === 'hostel' && !user?.hostel)}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-deep transition disabled:opacity-50"
          >
            {checkout.isPending || paying ? 'Opening payment...' : `Pay for Party Order (₹${grandTotal.toFixed(2)})`}
          </button>
          <p className="text-xs text-gray-400 text-center">
            Once placed, nobody can add more items to this party.
          </p>
        </div>
      )}

      {isOrdered && (
        <div className="text-center">
          <Link to="/orders" className="text-primary hover:underline font-medium">View the order →</Link>
        </div>
      )}
    </div>
  )
}
