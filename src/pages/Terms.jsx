import React from 'react'
import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 prose prose-sm">
      <Link to="/" className="text-primary text-sm">&larr; Back</Link>
      <h1 className="text-3xl font-bold text-secondary mt-4 mb-2">Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: August 2026</p>

      <h2>1. What this service is</h2>
      <p>
        RGIPT Food Court ("the Service", "we", "us") is a student-run ordering platform that lets members of the
        RGIPT community place food orders with participating campus shops. We are not the food seller — each
        shop is independently responsible for the food it prepares and sells. We provide the platform that
        connects students and shops.
      </p>

      <h2>2. Who can use it</h2>
      <p>
        The Service is intended for RGIPT students, staff, and campus shop owners. You must sign in with a valid
        Google account. Shop-owner and admin access is granted individually and cannot be self-assigned.
      </p>

      <h2>3. Orders and payment</h2>
      <p>
        Menu prices are the shop's own prices — nothing is added to them. At checkout, a flat service fee and a
        payment-processing charge are added as separate, clearly shown line items on top of the food price. Both
        amounts may change over time; the current amounts are always shown before you complete an order. Orders
        can be paid via card, UPI, or netbanking through Razorpay.
      </p>
      <p>
        Once placed, an order is a commitment to pay the shop for the items ordered. Cancellations after a shop
        has accepted the order may not be possible — check the order status before assuming you can cancel.
      </p>
      <h2>3a. Refunds</h2>
      <p>
        If an online payment is captured but the order is later cancelled (by the shop, or because it could not
        be fulfilled), the amount is refunded to the original payment method through Razorpay. Refunds typically
        take 5-7 business days to reflect, depending on your bank. If a payment is deducted but no order appears
        in your account, contact Support with the payment reference so it can be investigated.
      </p>

      <h2>4. Shop responsibilities</h2>
      <p>
        Shop owners are responsible for the accuracy of their menu (pricing, availability, description),
        preparing orders they accept, and complying with applicable food-safety standards. We do not inspect or
        certify food quality or hygiene.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        Don't place fraudulent orders, abuse the cancellation process, impersonate another person, or attempt to
        access accounts, shops, or admin functions you have not been authorized for. See our{' '}
        <Link to="/code-of-conduct">Code of Conduct</Link> for full behavioral expectations.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        The Service is provided "as is." We are not liable for food quality, delivery delays, incorrect orders
        prepared by a shop, or losses arising from use of the Service, to the maximum extent permitted by law.
      </p>

      <h2>7. Changes to these Terms</h2>
      <p>
        We may update these Terms as the Service evolves. Continued use after an update means you accept the
        revised Terms.
      </p>

      <h2>8. Contact</h2>
      <p>Questions about these Terms can be raised through the Support section after logging in.</p>
    </div>
  )
}
