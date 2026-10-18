# Contributing

Thanks for helping improve Campus Food Court.

## Before changing code

- Read [the deployment guide](docs/DEPLOYMENT.md).
- Keep campus branding in `src/config/branding.js` or the documented `VITE_*` variables rather than scattering institution names throughout components.
- Never put secrets in frontend code or `VITE_*` variables; these values are public in the built bundle.
- Keep role-based access enforced by the backend. Hiding a button or route is not a security boundary.

## Local checks

```bash
npm ci
npm run build
```

GitHub Actions builds the production bundle on pushes and pull requests. For authentication, payment, or live-order changes, document any manual end-to-end checks that still need to be performed.

## Pull requests

Describe the user-visible change, the related backend/configuration changes, test evidence, and known limitations. Keep campus-specific policy and legal wording accurate for the intended deployment.
