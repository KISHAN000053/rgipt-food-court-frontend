import React from 'react'
import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 prose prose-sm">
      <Link to="/" className="text-primary text-sm">&larr; Back</Link>
      <h1 className="text-3xl font-bold text-secondary mt-4 mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: August 2026</p>

      <h2>1. What we collect</h2>
      <p>When you sign in with Google, we receive your name, email address, and profile photo. During onboarding, we additionally collect:</p>
      <ul>
        <li>Hostel name and room number (used to deliver your order)</li>
        <li>Phone number (used by shop staff to reach you about your order)</li>
      </ul>
      <p>
        We also store your order history (items ordered, prices, timestamps, order type, and status), and — for
        shop owners — the menu and pricing data they enter, to operate the Service. This data is processed to
        the extent necessary to provide the Service, on the basis of your consent given when you use the
        Service and, for order records, our legitimate interest in operating and accounting for the Platform.
      </p>

      <h2>2. What we don't collect</h2>
      <p>
        We do not store payment card numbers, UPI PINs, or bank credentials. Payments are processed through
        Razorpay — your card, UPI, or bank details are handled directly by Razorpay's secure systems and never
        pass through or get stored on our servers. Razorpay's own privacy policy governs its handling of your
        payment data.
      </p>

      <h2>3. How we use your data</h2>
      <ul>
        <li>To create and manage your account, and determine your role (student, shop owner, or admin)</li>
        <li>To process, deliver, and provide support for your orders</li>
        <li>To let shop owners see the orders placed with them</li>
        <li>To process payments and refunds through Razorpay</li>
        <li>To let admins operate, moderate, and troubleshoot the platform</li>
        <li>To detect and prevent fraud or abuse of the Service</li>
      </ul>
      <p>We do not sell your personal data, and we do not share it with advertisers or use it for third-party marketing.</p>

      <h2>4. Who can see your data</h2>
      <p>
        Shop owners can see the name, hostel, room number, and phone number attached to orders placed with
        their shop only — not your data more broadly. Admins can see account and order data across the
        platform for support, moderation, and accounting purposes. We may disclose your data where required
        by law, to comply with a valid legal process, or to protect the
        rights, safety, or property of the Platform, its users, or the public.
      </p>

      <h2>5. Where your data is stored</h2>
      <p>
        Data is stored with MongoDB Atlas (database) and served via Render (backend) and Vercel (frontend).
        Depending on these providers' infrastructure, data may be processed on servers located outside India.
        Authentication is handled by Google OAuth — we never see or store your Google password. No method of
        transmission or storage is completely secure; while we take reasonable measures to protect your data, we
        cannot guarantee absolute security.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We retain your account and order data for as long as your account is active, and for a reasonable period
        afterward as needed for accounting, dispute resolution, or legal compliance. If you request account
        deletion, we delete or anonymize your personal data, except where we are required or permitted to retain
        order records (e.g. for shop accounting or legal obligations).
      </p>

      <h2>7. Cookies</h2>
      <p>
        We use a single secure, HTTP-only cookie (or, where that isn't available, a comparable token) to keep
        you signed in. We don't use tracking or advertising cookies.
      </p>

      <h2>8. Your rights</h2>
      <p>
        Subject to applicable law, you may request a copy of your data, ask us to correct inaccurate data, or
        ask us to delete your account and associated personal data (subject to retaining order records shops or
        we may need for accounting or legal purposes), by reaching out through the Support section after logging
        in. We will respond to verified requests within a reasonable time.
      </p>

      <h2>9. Children's privacy</h2>
      <p>
        The Service is intended for users capable of entering a binding contract (see Terms of Service) and is
        not directed at children. We do not knowingly collect data from anyone below the applicable age of
        consent.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>We may update this policy as the Service evolves. Material changes will be reflected here with an updated date.</p>

      <h2>11. Grievance Officer</h2>
      <p>
        For any privacy-related grievance, complaint, or request regarding your personal data, contact us through
        the Support section after logging in, which serves as our designated point of contact for such requests.
      </p>
    </div>
  )
}
