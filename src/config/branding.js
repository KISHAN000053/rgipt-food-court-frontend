// Public, build-time branding for this single-campus deployment.
// Values are intentionally public; never put secrets in VITE_* variables.
export const CAMPUS_NAME = import.meta.env.VITE_CAMPUS_NAME || 'RGIPT Food Court'
export const INSTITUTION_NAME = import.meta.env.VITE_INSTITUTION_NAME || 'Rajiv Gandhi Institute of Petroleum Technology (RGIPT)'
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@collegeconnect4u.in'
