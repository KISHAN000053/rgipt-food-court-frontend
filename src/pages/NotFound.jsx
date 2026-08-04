import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <AlertCircle className="w-20 h-20 text-gray-300 mb-4" />
      <h1 className="text-4xl font-bold text-secondary mb-2">404</h1>
      <p className="text-xl text-gray-500 mb-8">Oops! Page not found.</p>
      <Link to="/home" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition">
        Go Home
      </Link>
    </div>
  )
}
