import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 prose prose-sm">
      <Link to="/" className="text-primary text-sm">&larr; Back</Link>
      <h1 className="text-3xl font-bold text-secondary mt-4 mb-2">About College Connect</h1>
      <p className="text-gray-400 text-sm mb-8">RGIPT Food Court, operated under College Connect</p>

      <h2>What College Connect is</h2>
      <p>
        College Connect is the platform behind RGIPT Food Court — a campus food ordering system built for
        students at Rajiv Gandhi Institute of Petroleum Technology (RGIPT). It connects students with
        independent, on-campus food shops, letting them browse menus, place orders, and pay online, with the
        option of takeaway or delivery straight to their hostel room.
      </p>

      <h2>Why it was built</h2>
      <p>
        Hostel gates close at night, and first-year students in particular are often restricted from stepping
        out after hours — but that doesn't mean the craving for a late meal goes away. College Connect was built
        to solve exactly that: giving students a way to order from campus shops without needing to physically
        visit them, especially during the hours when leaving the hostel isn't an option.
      </p>

      <h2>The role it plays</h2>
      <p>
        College Connect is a facilitator, not a food business. It provides the ordering interface, connects
        students to shops, and processes payment — it does not prepare, sell, or handle food itself. Each
        participating shop is an independent business that sets its own menu and prices, and is responsible for
        preparing and fulfilling the orders it accepts. See our <Link to="/terms">Terms of Service</Link> for the
        full picture of how this works.
      </p>

      <h2>Who can use it, and why</h2>
      <p>
        The platform is built for the RGIPT community — students who want an easy way to order food from campus
        shops, and shop owners who want a simple way to reach students without needing their own ordering
        system. Students sign in with their Google account, set up their hostel and room details once, and can
        then order from any participating shop. A built-in "Party Order" feature also lets a group of students
        order together under one host, splitting the browsing but keeping the payment simple.
      </p>

      <h2>Shop owners: access and registration</h2>
      <p>
        Shop owner access on College Connect isn't self-service — it's granted individually. A shop that wants
        to join contacts the platform directly (through the Support section), and once verified, the
        shop's details and owner's email are added by an administrator. From that point on, the shop owner logs
        in the same way as any student — with their Google account — but is automatically taken to a dedicated
        shop dashboard instead of the student ordering screens.
      </p>
      <p>
        That dashboard gives a shop owner everything they need to run their side of things: managing their menu
        and prices, marking items in or out of stock, accepting or updating live orders as they come in, going
        online or offline whenever they choose, and pulling reports on their own sales and earnings. In short,
        being a "shop owner" on College Connect means having full control over one's own shop's presence on the
        platform, without needing to build or maintain any ordering system of their own.
      </p>

      <h2>Where we operate</h2>
      <p>
        College Connect operates from RGIPT, Jais, Raebareli, Uttar Pradesh — 229304.
      </p>

      <hr className="my-8 border-gray-100" />
      <p className="text-xs text-gray-400">
        Operated by Kishan Karri &middot; RGIPT, Jais, Raebareli, Uttar Pradesh, India &ndash; 229304
      </p>
    </div>
  )
}
