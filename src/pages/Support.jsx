import React from 'react'
import { MessageCircle, Mail, HelpCircle, Users } from 'lucide-react'

const faqs = [
  {
    q: 'My order status hasn\'t updated in a while — what do I do?',
    a: 'Shop status updates can occasionally lag. If it\'s been more than 20-30 minutes past the estimated prep time, contact the shop directly or reach out below with your order number.'
  },
  {
    q: 'What am I actually being charged, beyond the food price?',
    a: 'Menu prices are the shop\'s real prices — nothing is added to them. At checkout, two separate charges are added on top: a small flat service fee, and a payment-processing percentage. Both are shown as their own line before you confirm the order, so you always see exactly what you\'re paying and why.'
  },
  {
    q: 'I paid online but my order still shows as pending.',
    a: 'Online payments are confirmed automatically once your bank/UPI confirms the transaction — this is usually instant but can occasionally take a minute. If it\'s been longer than that and money left your account, contact us with your order number and we\'ll look into it.'
  },
  {
    q: 'Can I get my food delivered to my hostel room?',
    a: 'Yes — hostel delivery is available at checkout alongside takeaway. Make sure your hostel and room number are set in your Profile first, or you won\'t be able to select delivery.'
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
          <Users className="w-5 h-5 text-primary" /> About this platform
        </h2>
        <p className="text-gray-500 text-sm">
          RGIPT Food Court is a student-built ordering system connecting campus shops with hostellers,
          especially for the hours after the hostel gates close. Shops set and keep their own prices;
          the platform's only revenue is the small service and processing fees shown at checkout.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
        <h2 className="font-semibold text-secondary flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" /> Still need help?
        </h2>
        <p className="text-gray-500 text-sm">
          Email us at{' '}
          <a href="mailto:support@collegeconnect4u.in" className="text-primary underline">
            support@collegeconnect4u.in
          </a>{' '}
          with your order number (if relevant) and a description of the issue. We'll get back to you as soon as we can.
        </p>
      </div>
    </div>
  )
}
