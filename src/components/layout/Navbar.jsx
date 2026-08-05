import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Flame, ShoppingCart, User, Menu, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import CartDrawer from '../CartDrawer'

export default function Navbar() {
  const { user } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <nav className="bg-white border-b border-gray-100 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={user ? "/home" : "/"} className="flex items-center gap-2">
                <Flame className="w-8 h-8 text-primary" />
                <span className="font-bold text-xl hidden sm:block">RGIPT Food Court</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {user && (
                <>
                  <Link to="/home" className="text-secondary hover:text-primary transition font-medium">Home</Link>
                  <Link to="/orders" className="text-secondary hover:text-primary transition font-medium">Orders</Link>
                  <Link to="/support" className="text-secondary hover:text-primary transition font-medium">Support</Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <button onClick={() => setCartOpen(true)} className="relative p-2 text-secondary hover:text-primary transition">
                    <ShoppingCart className="w-6 h-6" />
                    {itemCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-primary rounded-full">
                        {itemCount}
                      </span>
                    )}
                  </button>
                  <button onClick={() => navigate('/profile')} className="p-2 text-secondary hover:text-primary transition hidden md:block">
                    <User className="w-6 h-6" />
                  </button>
                  <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 md:hidden">
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </>
              ) : (
                <button onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-deep transition">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
        
        {mobileMenuOpen && user && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-1">
            <Link to="/home" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-secondary hover:bg-gray-50 rounded-md">Home</Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-secondary hover:bg-gray-50 rounded-md">Orders</Link>
            <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-secondary hover:bg-gray-50 rounded-md">Support</Link>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-secondary hover:bg-gray-50 rounded-md">Profile</Link>
          </div>
        )}
      </nav>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  )
}
