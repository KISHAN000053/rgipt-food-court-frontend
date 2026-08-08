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
      <p>We also store your order history (items ordered, amounts, timestamps, and status) to operate the Service.</p>

      <h2>2. What we don't collect</h2>
      <p>
        We do not store payment card numbers, UPI PINs, or bank credentials. Payments are processed through
        Razorpay — your card, UPI, or bank details are handled directly by Razorpay's secure systems and never
        pass through or get stored on our servers.
      </p>

      <h2>3. How we use your data</h2>
      <ul>
        <li>To create and manage your account</li>
        <li>To process and deliver your orders</li>
        <li>To let shop owners see the orders placed with them</li>
        <li>To let admins operate and troubleshoot the platform</li>
      </ul>
      <p>We do not sell your data or share it with advertisers.</p>

      <h2>4. Who can see your data</h2>
      <p>
        Shop owners can see the name, hostel, room number, and phone number attached to orders placed with
        their shop only. Admins can see account and order data across the platform for support and moderation
        purposes.
      </p>

      <h2>5. Where your data is stored</h2>
      <p>
        Data is stored with MongoDB Atlas (database) and served via Render (backend) and Vercel (frontend).
        Authentication is handled by Google OAuth — we never see or store your Google password.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use a single secure, HTTP-only cookie to keep you signed in. We don't use tracking or advertising
        cookies.
      </p>

      <h2>7. Your rights</h2>
      <p>
        You can request a copy of your data, or ask us to delete your account and associated data (subject to
        keeping order records shops may need for their own accounting), by reaching out through the Support
        section after logging in.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>We may update this policy as the Service evolves. Material changes will be reflected here with an updated date.</p>
    </div>
  )
}
