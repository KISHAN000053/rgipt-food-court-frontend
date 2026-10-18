# Changelog

## 2026-10-18

- Added full-history Gitleaks secret scanning to GitHub Actions and expanded ignore rules for environment files, package-manager credentials, private keys, local databases, and backups.
- Centralized public campus, institution, and support-email branding in `src/config/branding.js`.
- Updated About, Terms, Code of Conduct, Support, navbar, and service-worker fallback copy to use configurable branding where appropriate.
- Normalized the configured backend URL so a trailing slash does not produce a double-slash API base URL.
- Authenticated Socket.IO connections with the user's JWT and joined authorized user/shop rooms so order updates reach the right signed-in user and shop owner.
- Added GitHub Actions production-build checks, Dependabot configuration, deployment docs, contribution guidance, and a security policy.
- Added an MIT license for commercial reuse, subject to its terms and any third-party asset/service terms.

## Known boundaries

This is still a single-campus deployment starter, not a multi-tenant SaaS. Review legal pages and campus-specific assumptions before each new deployment. Build success does not replace live OAuth/payment/socket testing.
