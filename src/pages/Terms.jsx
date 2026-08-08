import React from 'react'
import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 prose prose-sm">
      <Link to="/" className="text-primary text-sm">&larr; Back</Link>
      <h1 className="text-3xl font-bold text-secondary mt-4 mb-2">Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: August 2026</p>

      <h2>1. What this Service is — and isn't</h2>
      <p>
        RGIPT Food Court ("the Service", "Platform", "we", "us") is a technology platform that lets members of
        the RGIPT community place food orders with independent campus shops and pay for them online. We are an
        <strong> intermediary only</strong>. We do not prepare, cook, handle, package, store, or deliver food, and we
        are not a restaurant, caterer, or food business. Each participating shop is an independent business,
        solely responsible for the food it sells. When you place an order, the contract of sale for that food is
        formed directly between you and the shop — we are not a party to that contract. Our role is limited to
        providing the ordering interface, processing payment through our payment partner, and passing order
        details to the shop.
      </p>

      <h2>2. Who can use it</h2>
      <p>
        The Service is intended for RGIPT students, staff, and campus shop owners, who must be at least 18 years
        old or otherwise capable of entering a binding contract under applicable law. You must sign in with a
        valid Google account. Shop-owner and admin access is granted individually by us and cannot be
        self-assigned; using such access without authorization is a violation of these Terms and may be treated
        as unauthorized access under applicable law.
      </p>

      <h2>3. Orders and payment</h2>
      <p>
        Menu prices, descriptions, images, availability, and ingredient/allergen information are set and
        maintained entirely by each shop. We do not verify, edit, or guarantee the accuracy of this information.
        At checkout, a flat service fee and a payment-processing charge are added as separate, clearly shown
        line items on top of the food price — these are the Platform's own charges for operating the Service,
        not amounts collected on the shop's behalf. Both amounts may change over time; the current amounts are
        always shown before you complete an order. Orders are paid via card, UPI, or netbanking through Razorpay,
        a third-party payment processor. Your use of Razorpay's payment service is also subject to Razorpay's own
        terms; we are not responsible for the operation of Razorpay's systems, payment gateway downtime, or
        delays caused by your bank or payment provider.
      </p>
      <p>
        Once placed, an order is a commitment to pay for the items ordered. A shop may accept, reject, or be
        unable to fulfil an order for reasons outside our control (stock, timing, closure). Cancellations after a
        shop has accepted the order may not be possible — check the order status before assuming you can cancel.
        We reserve the right to cancel or refuse any order at our discretion, including where we suspect fraud,
        abuse, or a violation of these Terms.
      </p>

      <h2>3a. Refunds</h2>
      <p>
        If an online payment is captured but the order is later cancelled, the food-price portion (subtotal) is
        refunded automatically to the original payment method through Razorpay. The service fee and
        payment-processing charge are Platform charges for facilitating the order and are non-refundable once
        the order has been placed, except where required by applicable law. Refunds typically take 5-7 business
        days to reflect, depending on your bank, and their timing is controlled by Razorpay and your bank, not
        by us. If a payment is deducted but no order appears in your account, or a refund does not arrive within
        a reasonable time, contact Support with the payment reference so it can be investigated. We do not
        guarantee any specific refund timeline beyond what Razorpay and the banking system provide.
      </p>

      <h2>4. Shop responsibilities</h2>
      <p>
        Each shop is solely and independently responsible for: the accuracy of its menu (pricing, availability,
        descriptions, allergen information); accepting and fulfilling orders it agrees to; the quality,
        safety, hygiene, and legality of the food it prepares and sells; and compliance with all applicable food
        safety and licensing laws, including registration with the Food Safety and Standards Authority of India
        (FSSAI) or the equivalent regulator where required. We do not inspect, certify, test, or guarantee food
        quality, hygiene, or safety at any shop, and we do not hold any food-business license on behalf of any
        shop.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        Don't place fraudulent or bad-faith orders, abuse the cancellation or refund process, impersonate another
        person, misuse the Party Order feature to obtain items without paying, or attempt to access accounts,
        shops, or admin functions you have not been authorized for. See our{' '}
        <Link to="/code-of-conduct">Code of Conduct</Link> for full behavioral expectations, which are part of
        these Terms.
      </p>

      <h2>6. No warranty</h2>
      <p>
        The Service is provided "as is" and "as available," without warranties of any kind, express or implied,
        including warranties of merchantability, fitness for a particular purpose, accuracy, or non-infringement.
        We do not warrant that the Service will be uninterrupted, error-free, or secure, or that any shop will
        accept, prepare, or deliver any order.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by applicable law: we are not liable for any loss, illness, injury, or
        damage arising from food quality, food safety, allergens, contamination, incorrect preparation, delivery
        delay, non-delivery, or any act or omission of a shop — these are entirely the shop's responsibility, not
        ours. We are not liable for indirect, incidental, consequential, or punitive damages arising from use of
        the Service. Where liability cannot be excluded, our total liability to you for any claim arising from
        or relating to the Service or a specific order is limited to the service fee and processing charge we
        actually retained on that order. Nothing in these Terms limits liability that cannot lawfully be limited
        or excluded, including liability for fraud or for death or personal injury caused by our own proven
        negligence.
      </p>

      <h2>8. Indemnity</h2>
      <p>
        You agree to indemnify and hold harmless the Platform, its operators, and administrators from any claim,
        loss, or expense (including reasonable legal costs) arising from your violation of these Terms, the Code
        of Conduct, or applicable law, or from your misuse of the Service. Shop owners additionally agree to
        indemnify the Platform against any claim relating to the food they prepare or sell, including food
        safety, quality, allergen, or licensing claims.
      </p>

      <h2>9. Disputes between students and shops</h2>
      <p>
        Any dispute about an order — quality, accuracy, missing items, or similar — is between you and the shop.
        We may, at our discretion, assist by facilitating communication or reviewing order records, but we are
        under no obligation to mediate, adjudicate, or compensate for such disputes.
      </p>

      <h2>10. Suspension and termination</h2>
      <p>
        We may suspend or terminate your access to the Service, including shop-owner or admin access, at any
        time and at our discretion, with or without notice, for violation of these Terms or the Code of Conduct,
        suspected fraud, or any reason we consider necessary to protect the Service or its users.
      </p>

      <h2>11. Force majeure</h2>
      <p>
        We are not liable for any failure or delay in the Service caused by events beyond our reasonable
        control, including internet or hosting outages, power failures, government action, or other events of
        similar nature.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These Terms are governed by the laws of India. Any dispute arising from these Terms or the Service is
        subject to the exclusive jurisdiction of the courts having jurisdiction over the Platform's place of
        operation.
      </p>

      <h2>13. Severability and entire agreement</h2>
      <p>
        If any provision of these Terms is found unenforceable, the remaining provisions continue in full force.
        These Terms, together with the Privacy Policy and Code of Conduct, constitute the entire agreement
        between you and us regarding the Service.
      </p>

      <h2>14. Changes to these Terms</h2>
      <p>
        We may update these Terms as the Service evolves. Continued use after an update means you accept the
        revised Terms. Material changes will be reflected here with an updated date.
      </p>

      <h2>15. Contact / Grievance Officer</h2>
      <p>
        Questions, complaints, or grievances about these Terms or the Service can be raised through the Support
        section after logging in, which serves as our designated point of contact for user grievances.
      </p>
    </div>
  )
}
