import React, { useState, useEffect } from 'react'
import { useAdminShops, useAdminShopMenu, useAdminCreateMenuItem, useAdminUpdateMenuItem, useAdminDeleteMenuItem } from '../../api/queries'
import { money } from '../../utils/money'

const emptyForm = { name: '', category: '', isVeg: true, isAvailable: true, priceMode: 'single', price: '', variantCount: 2, variants: [{ name: '', price: '' }, { name: '', price: '' }] }

export default function AdminMenu() {
  const { data: shops } = useAdminShops()
  const [selectedShop, setSelectedShop] = useState('')

  useEffect(() => {
    if (shops?.length && !selectedShop) setSelectedShop(shops[0]._id)
  }, [shops, selectedShop])

  const { data: menuItems } = useAdminShopMenu(selectedShop)
  const createItem = useAdminCreateMenuItem()
  const updateItem = useAdminUpdateMenuItem()
  const deleteItem = useAdminDeleteMenuItem()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const shopName = shops?.find(s => s._id === selectedShop)?.name || ''

  useEffect(() => {
    setForm(f => {
      const rows = [...f.variants]
      while (rows.length < f.variantCount) rows.push({ name: '', price: '' })
      while (rows.length > f.variantCount) rows.pop()
      return { ...f, variants: rows }
    })
  }, [form.variantCount])

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setError(''); setModalOpen(true) }
  const openEdit = (item) => {
    setEditingId(item._id)
    if (item.hasVariants) {
      setForm({
        name: item.name || '', category: item.category || '', isVeg: item.isVeg ?? true, isAvailable: item.isAvailable ?? true,
        priceMode: 'multiple', price: '',
        variantCount: item.variants.length,
        variants: item.variants.map(v => ({ name: v.name || '', price: String(v.price) })),
      })
    } else {
      setForm({
        name: item.name || '', category: item.category || '', isVeg: item.isVeg ?? true, isAvailable: item.isAvailable ?? true,
        priceMode: 'single', price: item.price ?? '',
        variantCount: 2, variants: [{ name: '', price: '' }, { name: '', price: '' }],
      })
    }
    setError(''); setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Item name is required.')
    if (!form.category.trim()) return setError('Category is required.')

    let payload = {
      name: form.name.trim(), category: form.category.trim(),
      isVeg: form.isVeg, isAvailable: form.isAvailable,
    }

    if (form.priceMode === 'single') {
      if (form.price === '' || Number(form.price) < 0) return setError('Enter a valid price.')
      payload.hasVariants = false
      payload.price = Number(form.price)
      payload.variants = []
    } else {
      if (form.variants.some(v => v.price === '' || Number(v.price) < 0)) {
        return setError('Every price option needs a valid price. (A name is optional.)')
      }
      payload.hasVariants = true
      payload.variants = form.variants.map(v => ({ name: v.name.trim(), price: Number(v.price) }))
    }

    try {
      if (editingId) await updateItem.mutateAsync({ id: editingId, data: payload })
      else await createItem.mutateAsync({ ...payload, shop: selectedShop })
      setModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return
    try {
      await deleteItem.mutateAsync({ id: item._id, shopId: selectedShop })
    } catch (err) {
      alert('Could not delete this item.')
    }
  }

  const priceDisplay = (item) => {
    if (!item.hasVariants) return `₹${money(item.price)}`
    const min = Math.min(...item.variants.map(v => v.price))
    return `From ₹${money(min)} (${item.variants.length} options)`
  }

  const saving = createItem.isPending || updateItem.isPending

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-secondary">Manage Menus</h1>
        <div className="flex gap-3">
          <select
            value={selectedShop}
            onChange={e => setSelectedShop(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {shops?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <button onClick={openAdd} disabled={!selectedShop} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-deep transition disabled:opacity-50">
            Add Item
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
              <th className="pb-3 pr-4">Item Name</th>
              <th className="pb-3 px-4">Price</th>
              <th className="pb-3 px-4">Category</th>
              <th className="pb-3 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems?.map(item => (
              <tr key={item._id} className="border-b border-gray-50 last:border-0">
                <td className="py-4 pr-4 font-medium text-secondary">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {item.name}
                  </div>
                </td>
                <td className="py-4 px-4 font-medium">{priceDisplay(item)}</td>
                <td className="py-4 px-4 text-gray-600 capitalize">{item.category}</td>
                <td className="py-4 pl-4 text-right space-x-3">
                  <button onClick={() => openEdit(item)} className="text-primary hover:underline font-medium text-sm">Edit</button>
                  <button onClick={() => handleDelete(item)} className="text-red-500 hover:underline font-medium text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {menuItems?.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">No items in {shopName}. Click "Add Item" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-secondary mb-1">{editingId ? 'Edit Item' : 'Add Item'}</h2>
            <p className="text-sm text-gray-500 mb-4">for {shopName}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Item Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category *</label>
                <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Snacks"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Pricing</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button type="button" onClick={() => setForm({ ...form, priceMode: 'single' })}
                    className={`p-2.5 rounded-lg border-2 text-sm font-medium transition ${form.priceMode === 'single' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600'}`}>
                    Single Price
                  </button>
                  <button type="button" onClick={() => setForm({ ...form, priceMode: 'multiple' })}
                    className={`p-2.5 rounded-lg border-2 text-sm font-medium transition ${form.priceMode === 'multiple' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600'}`}>
                    Multiple Prices
                  </button>
                </div>

                {form.priceMode === 'single' ? (
                  <input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="Price (₹)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">How many price options?</label>
                      <select value={form.variantCount} onChange={e => setForm({ ...form, variantCount: Number(e.target.value) })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                        {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} options</option>)}
                      </select>
                    </div>
                    {form.variants.map((v, idx) => (
                      <div key={idx} className="grid grid-cols-2 gap-2">
                        <input type="text" value={v.name} placeholder="Name (optional) e.g. Quarter"
                          onChange={e => {
                            const variants = [...form.variants]; variants[idx] = { ...variants[idx], name: e.target.value }
                            setForm({ ...form, variants })
                          }}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input type="number" min="0" value={v.price} placeholder="Price (₹) *"
                          onChange={e => {
                            const variants = [...form.variants]; variants[idx] = { ...variants[idx], price: e.target.value }
                            setForm({ ...form, variants })
                          }}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.isVeg} onChange={e => setForm({ ...form, isVeg: e.target.checked })} /> Vegetarian
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} /> In stock
                </label>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" disabled={saving} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-deep transition disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
