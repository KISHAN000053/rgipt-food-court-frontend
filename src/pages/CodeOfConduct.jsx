import React from 'react'
import { Link } from 'react-router-dom'

export default function CodeOfConduct() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 prose prose-sm">
      <Link to="/" className="text-primary text-sm">&larr; Back</Link>
      <h1 className="text-3xl font-bold text-secondary mt-4 mb-2">Code of Conduct</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: August 2026</p>

      <p>
        RGIPT Food Court exists to make campus life easier for everyone — students, shop staff, and the people
        running the platform. To keep it that way, everyone using the Service agrees to the following:
      </p>

      <h2>For students</h2>
      <ul>
        <li>Place orders you genuinely intend to pay for and receive — don't order and cancel repeatedly to waste a shop's time or ingredients.</li>
        <li>Provide accurate hostel and room details so your order can actually reach you.</li>
        <li>Be respectful to shop staff, whether in person or through any messaging features.</li>
        <li>Don't attempt to access another student's account, a shop's dashboard, or admin functions you haven't been given.</li>
      </ul>

      <h2>For shop owners</h2>
      <ul>
        <li>Keep your menu, prices, and item availability accurate and up to date.</li>
        <li>Accept or reject orders promptly rather than leaving students waiting indefinitely.</li>
        <li>Prepare food safely and in line with applicable food-hygiene standards.</li>
        <li>Treat all students fairly regardless of who they are.</li>
      </ul>

      <h2>For everyone</h2>
      <ul>
        <li>No harassment, hate speech, or abusive behavior toward other users, shop staff, or admins.</li>
        <li>No attempts to hack, disrupt, or exploit the platform.</li>
        <li>No fraudulent activity — fake orders, fake shops, or misuse of admin/shop access.</li>
      </ul>

      <h2>Consequences</h2>
      <p>
        Violating this Code of Conduct may result in a warning, temporary suspension, or permanent removal from
        the platform, at the admin team's discretion. Shop owners found repeatedly violating shop responsibilities
        may have their shop access revoked.
      </p>

      <h2>Reporting a problem</h2>
      <p>
        If you experience or witness a violation, please report it through the Support section after logging in.
        See also our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </div>
  )
}
