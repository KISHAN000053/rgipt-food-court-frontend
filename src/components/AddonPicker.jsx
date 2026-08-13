import React, { useState, useMemo } from 'react'
import { X, Plus, ChevronLeft } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { money } from '../utils/money'

export default function AddonPicker({ shop, addons, onClose }) {
  const { items, addItem } = useCart()

  const [step, setStep] = useState('products')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selected, setSelected] = useState({})
  const [error, setError] = useState('')

  const products = useMemo(() => {
    return items
      .filter(i => i.shopId === shop._id && !i.isAddon)
      .map(i => ({
        key: `${i.menuItemId}::${i.variantId || ''}`,
        label: i.name + (i.variantName ? ` (${i.variantName})` : ''),
      }))
  }, [items, shop])

  const pickProduct = (product) => {
    setSelectedProduct(product)
    setSelected({})
    setError('')
    setStep('addons')
  }

  const backToProducts = () => {
    setStep('products')
    setSelectedProduct(null)
    setSelected({})
    setError('')
  }

  const setQty = (addonId, qty) => {
    setSelected(prev => {
      const next = { ...prev }
      if (qty <= 0) delete next[addonId]
      else next[addonId] = qty
      return next
    })
  }

  const selectedCount = Object.values(selected).reduce((sum, q) => sum + q, 0)
  const selectedTotal = Object.entries(selected).reduce((sum, [id, q]) => {
    const addon = addons.find(a => a._id === id)
    return sum + (addon ? addon.price * q : 0)
  }, 0)

  const handleSave = () => {
    setError('')
    const entries = Object.entries(selected).filter(([, qty]) => qty > 0)
    const forProductName = selectedProduct.label

    for (const [addonId, qty] of entries) {
      const addon = addons.find(a => a._id === addonId)
      if (addon) {
        addItem({ _id: addon._id, shopId: shop._id, shopName: shop.name, name: addon.name, price: addon.price, isAddon: true, forProductName }, qty)
      }
    }
    backToProducts()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {step === 'addons' && (
              <button onClick={backToProducts} className="text-gray-400 hover:text-secondary -ml-1">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-secondary">
                {step === 'products' ? 'Add extras' : `Extras for ${selectedProduct?.label}`}
              </h2>
              <p className="text-sm text-gray-500">{shop.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'products' ? (
          <div className="overflow-y-auto flex-1 p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Which item are these extras for?
            </p>
            {products.length === 0 ? (
              <p className="text-sm text-gray-400">
                Add a dish from {shop.name} to your cart first, then come back to add extras to it.
              </p>
            ) : (
              <div className="space-y-2">
                {products.map(p => (
                  <button
                    key={p.key}
                    onClick={() => pickProduct(p)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition text-left"
                  >
                    <span className="text-sm text-secondary font-medium">{p.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-1 p-5">
              <div className="space-y-2">
                {addons.map(addon => {
                  const qty = selected[addon._id] || 0
                  return (
                    <div key={addon._id} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-secondary">
                        {addon.name} <span className="text-gray-400">· ₹{money(addon.price)}</span>
                      </span>
                      {qty > 0 ? (
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                          <button onClick={() => setQty(addon._id, qty - 1)} className="px-3 py-1 text-primary hover:bg-gray-100 font-medium rounded-l-lg">-</button>
                          <span className="px-2 font-medium">{qty}</span>
                          <button onClick={() => setQty(addon._id, qty + 1)} className="px-3 py-1 text-primary hover:bg-gray-100 font-medium rounded-r-lg">+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setQty(addon._id, 1)}
                          className="px-4 py-1.5 border border-primary text-primary hover:bg-primary hover:text-white transition font-medium rounded-lg text-sm"
                        >
                          <Plus className="w-3.5 h-3.5 inline -mt-0.5" /> Select
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-5 border-t border-gray-100">
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <button
                onClick={handleSave}
                disabled={selectedCount === 0}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-deep transition disabled:opacity-50"
              >
                {selectedCount === 0
                  ? 'Select add-ons above'
                  : `Save ${selectedCount} for ${selectedProduct?.label} · ₹${money(selectedTotal)}`}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">You'll come back here to add extras to another item.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
