import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <Outlet />
}
