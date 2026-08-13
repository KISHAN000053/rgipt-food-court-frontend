import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Clock, MapPin, Moon } from 'lucide-react'
import { usePublicSettings } from '../api/queries'

export default function Landing() {
  const { data: settings } = usePublicSettings()
  const [searchParams] = useSearchParams()
  const loginError = searchParams.get('loginError')
  const loginUrl = `${import.meta.env.VITE_API_URL}/api/auth/google`

  return (
    <div className="min-h-screen bg-secondary text-canvas flex flex-col relative overflow-hidden">
      {/* Warm ambient glow, like a canteen light at night */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]" />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
        <div className="max-w-2xl w-full">
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm rounded-lg px-4 py-3 mb-6 max-w-md mx-auto">
              {loginError}
            </div>
          )}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-canvas/80 text-xs font-medium mb-8 backdrop-blur-sm">
            <Moon className="w-3.5 h-3.5" />
            Open when the campus gates aren't
          </div>

          <h1 className="font-display text-6xl sm:text-7xl font-extrabold leading-[0.95] mb-5">
            Hungry at<br />
            <span className="text-primary">the hostel?</span>
          </h1>

          <button
            onClick={() => window.location.href = loginUrl}
            className="bg-primary text-white text-lg font-semibold py-4 px-10 rounded-full shadow-lg shadow-primary/30 hover:bg-primary-deep hover:-translate-y-0.5 transition-all duration-200"
          >
            Continue with Google
          </button>
          <p className="text-xs text-canvas/40 mt-4 max-w-xs mx-auto">
            For RGIPT students. Other emails can still sign in.
          </p>

          {settings && (
            <p className="text-xs text-canvas/40 max-w-md mx-auto mt-8">
              Prices include a {settings.razorpaySurchargePercent}% payment processing charge ·
              ₹{settings.serviceFee} service fee per order
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl w-full">
          {[
            { icon: MapPin, title: 'To your room', body: 'Hostel delivery for first years — everyone else can take away.' },
            { icon: Clock, title: 'Live tracking', body: 'Watch it go from accepted to on-its-way.' },
            { icon: Moon, title: 'After-hours', body: 'Built for the nights you can\'t leave campus.' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl bg-white/5 border border-white/10 p-5 text-left backdrop-blur-sm">
              <Icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-display font-bold text-canvas mb-1">{title}</h3>
              <p className="text-sm text-canvas/60">{body}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 pb-8 pt-6 flex flex-col items-center gap-3">
        <div className="flex gap-6 text-xs text-canvas/50">
          <button onClick={() => window.location.href = loginUrl} className="hover:text-primary transition">Shop Owner Login</button>
          <span className="text-canvas/20">·</span>
          <button onClick={() => window.location.href = loginUrl} className="hover:text-primary transition">Admin Login</button>
        </div>
        <div className="flex gap-4 text-xs text-canvas/30">
          <Link to="/terms" className="hover:text-canvas/60 transition">Terms</Link>
          <Link to="/privacy" className="hover:text-canvas/60 transition">Privacy</Link>
          <Link to="/code-of-conduct" className="hover:text-canvas/60 transition">Code of Conduct</Link>
          <Link to="/about" className="hover:text-canvas/60 transition">About</Link>
        </div>
      </footer>
    </div>
  )
}
