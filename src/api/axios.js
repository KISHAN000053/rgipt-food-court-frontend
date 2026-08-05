import axios from 'axios'

// Token-based fallback for browsers that block cross-site cookies (Brave, Safari, etc).
// After OAuth, the backend redirects with #token=... which we capture and store here.
const TOKEN_KEY = 'auth_token'

export function captureTokenFromUrl() {
  if (window.location.hash.startsWith('#token=')) {
    const token = window.location.hash.slice('#token='.length)
    if (token) {
      try { localStorage.setItem(TOKEN_KEY, token) } catch (e) { /* ignore */ }
    }
    // Clean the token out of the URL so it isn't left visible / bookmarked.
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) } catch (e) { return null }
}

export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY) } catch (e) { /* ignore */ }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  withCredentials: true,
})

// Attach the stored token as a Bearer header (used when the cookie is blocked).
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)

export default api
