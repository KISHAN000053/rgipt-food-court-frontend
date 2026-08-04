import React from 'react'
import CartDrawer from '../components/CartDrawer'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const navigate = useNavigate()
  return (
    <div className="pt-4">
      <CartDrawer onClose={() => navigate(-1)} />
    </div>
  )
}
