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
        running the platform. This Code of Conduct is part of our{' '}
        <Link to="/terms">Terms of Service</Link>. Everyone using the Service agrees to the following, and
        violations may be enforced at the sole discretion of the admin team.
      </p>

      <h2>For students</h2>
      <ul>
        <li>Place orders you genuinely intend to pay for and receive — don't order and cancel repeatedly to waste a shop's time or ingredients.</li>
        <li>Provide accurate hostel and room details so your order can actually reach you.</li>
        <li>Be respectful to shop staff, whether in person or through any messaging or ordering features.</li>
        <li>In Party Orders, don't add items you don't intend to have the host pay for, and don't misuse the feature to obtain food without payment.</li>
        <li>Don't attempt to access another student's account, a shop's dashboard, or admin functions you haven't been given.</li>
      </ul>

      <h2>For shop owners</h2>
      <ul>
        <li>Keep your menu, prices, availability, and any allergen/ingredient information accurate and up to date — you are solely responsible for this information.</li>
        <li>Accept or reject orders promptly rather than leaving students waiting indefinitely.</li>
        <li>Prepare and handle food safely, in line with applicable food-safety and hygiene laws, including any required licensing (e.g. FSSAI registration where applicable).</li>
        <li>Treat all students fairly regardless of who they are.</li>
        <li>Only cancel a paid order when genuinely necessary — cancelling a paid order triggers an automatic refund of the food price to the student, and repeated unnecessary cancellations may be treated as a violation.</li>
      </ul>

      <h2>For everyone</h2>
      <ul>
        <li>No harassment, hate speech, discrimination, or abusive behavior toward other users, shop staff, or admins.</li>
        <li>No attempts to hack, disrupt, reverse-engineer, or exploit the platform, its data, or its payment systems.</li>
        <li>No fraudulent activity — fake orders, fake shops, chargeback abuse, or misuse of admin/shop access.</li>
        <li>No posting or transmitting unlawful, defamatory, or infringing content through any part of the Service.</li>
      </ul>

      <h2>Consequences</h2>
      <p>
        Violating this Code of Conduct may result in a warning, order cancellation, temporary suspension, or
        permanent removal from the platform, at the admin team's sole and final discretion. Shop owners found
        repeatedly violating shop responsibilities may have their shop access revoked without prior notice. We
        are not liable for any loss you may incur as a result of a suspension or removal made in good faith
        under this Code.
      </p>

      <h2>Conduct of other users</h2>
      <p>
        We are not responsible for the conduct — online or in person — of any student, shop owner, or shop staff
        member, whether or not that conduct violates this Code. If you experience a safety concern, please also
        contact the appropriate campus or law-enforcement authority in addition to reporting it to us.
      </p>

      <h2>Reporting a problem</h2>
      <p>
        If you experience or witness a violation, please report it through the Support section after logging in.
        See also our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </div>
  )
}
