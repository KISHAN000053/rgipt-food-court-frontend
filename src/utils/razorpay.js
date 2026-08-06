// Lazily loads Razorpay's Checkout script and exposes a helper to open it.
// No keys live here — the order is created server-side, and only the public
// Key ID (safe to expose) comes back from that call.

let scriptLoadPromise = null

function loadRazorpayScript() {
  if (scriptLoadPromise) return scriptLoadPromise
  scriptLoadPromise = new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve()
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Could not load Razorpay checkout. Check your connection.'))
    document.body.appendChild(script)
  })
  return scriptLoadPromise
}

/**
 * Opens Razorpay's checkout modal.
 * @param {Object} opts
 * @param {String} opts.keyId - public Razorpay Key ID (from the create-order response)
 * @param {String} opts.orderId - Razorpay order id
 * @param {Number} opts.amount - amount in paise (as returned by the create-order response)
 * @param {Object} opts.prefill - { name, email, contact }
 * @param {Function} opts.onSuccess - called with { razorpayOrderId, razorpayPaymentId, razorpaySignature }
 * @param {Function} opts.onDismiss - called if the student closes the modal without paying
 */
export async function openRazorpayCheckout({ keyId, orderId, amount, prefill, onSuccess, onDismiss }) {
  await loadRazorpayScript()

  const rzp = new window.Razorpay({
    key: keyId,
    order_id: orderId,
    amount,
    currency: 'INR',
    name: 'RGIPT Food Court',
    description: 'Order payment',
    prefill,
    theme: { color: '#F0532B' },
    handler: (response) => {
      onSuccess({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      })
    },
    modal: {
      ondismiss: () => onDismiss && onDismiss(),
    },
  })

  rzp.open()
}
