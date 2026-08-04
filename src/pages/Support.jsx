import React from 'react'
import { MessageCircle, Mail, HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: 'My order status hasn\'t updated in a while — what do I do?',
    a: 'Shop status updates can occasionally lag. If it\'s been more than 20-30 minutes past the estimated prep time, contact the shop directly or reach out below.'
  },
  {
    q: 'I was charged the wrong amount.',
    a: 'Menu prices include a small payment-processing surcharge and a flat per-order service fee, both shown at checkout and on the login page. If the total still looks wrong, let us know the order number below.'
  },
  {
    q: 'How do I become a shop owner on the platform?',
    a: 'Shop owner access is granted individually by an admin. If you run a campus shop and want to join, reach out below with your shop details.'
  },
  {
    q: 'I want to report a problem with a shop or another user.',
    a: 'Please use the contact option below with as much detail as possible — we take Code of Conduct violations seriously.'
  },
]

export default function Support() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-secondary mb-1">Support</h1>
        <p className="text-gray-500">Need help? Start here.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-secondary flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" /> Frequently asked questions
        </h2>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div key={i}>
              <p className="font-medium text-secondary text-sm">{item.q}</p>
              <p className="text-gray-500 text-sm mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
        <h2 className="font-semibold text-secondary flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" /> Still need help?
        </h2>
        <p className="text-gray-500 text-sm">
          Email us at{' '}
          <a href="mailto:collegeconnect@rgipt.ac.in" className="text-primary underline">
            collegeconnect@rgipt.ac.in
          </a>{' '}
          with your order number (if relevant) and a description of the issue. We'll get back to you as soon as we can.
        </p>
      </div>
    </div>
  )
}
