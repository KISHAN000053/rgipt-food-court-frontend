import React, { useState } from 'react'
import { useOwnerMenu, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '../../api/queries'
import { usePublicSettings } from '../../api/queries'

const emptyForm = { name: '', price: '', category: '', description: '', isVeg: true, isAvailable: true }

export default function ShopMenu() {
  const { data: menuItems } = useOwnerMenu()
  const { data: settings } = usePublicSettings()
  const createItem = useCreateMenuItem()
  const updateItem = useUpdateMenuItem()
  const deleteItem = useDeleteMenuItem()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const surcharge = settings?.razorpaySurchargePercent ?? 0

  const openAdd = () => {
    setEditingId(null); setForm(emptyForm); setError(''); setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item._id)
    setForm({
      name: item.name || '',
      price: item.price ?? '',
      category: item.category || '',
      description: item.description || '',
      isVeg: item.isVeg ?? true,
      isAvailable: item.isAvailable ?? true,
    })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Item name is required.')
    if (form.price === '' || Number(form.price) < 0) return setError('Enter a valid price.')
    if (!form.category.trim()) return setError('Category is required.')

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      description: form.description.trim(),
      isVeg: form.isVeg,
      isAvailable: form.isAvailable,
    }

    try {
      if (editingId) await updateItem.mutateAsync({ id: editingId, data: payload })
      else await createItem.mutateAsync(payload)
      setModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return
    try {
      await deleteItem.mutateAsync(item._id)
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete this item.')
    }
  }

  const toggleAvailable = async (item) => {
    try {
      await updateItem.mutateAsync({ id: item._id, data: { isAvailable: !item.isAvailable } })
    } catch (err) {
      alert('Could not update availability.')
    }
  }

  const saving = createItem.isPending || updateItem.isPending

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold text-secondary">My Menu</h1>
        <button onClick={openAdd} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition">
          Add Item
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Set your own price here — this is what you get paid. Students see a slightly higher price
        (+{surcharge}%) which covers payment processing; that difference does not come out of your earnings.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
              <th className="pb-3 pr-4">Item Name</th>
              <th className="pb-3 px-4">Your Price</th>
              <th className="pb-3 px-4">Category</th>
              <th className="pb-3 px-4">Available</th>
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
                <td className="py-4 px-4 font-medium">₹{item.price}</td>
                <td className="py-4 px-4 text-gray-600 capitalize">{item.category}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => toggleAvailable(item)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {item.isAvailable ? 'In stock' : 'Out of stock'}
                  </button>
                </td>
                <td className="py-4 pl-4 text-right space-x-3">
                  <button onClick={() => openEdit(item)} className="text-primary hover:underline font-medium text-sm">Edit</button>
                  <button onClick={() => handleDelete(item)} className="text-red-500 hover:underline font-medium text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {menuItems?.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-gray-400">No menu items yet. Click "Add Item" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-secondary mb-4">{editingId ? 'Edit Item' : 'Add Item'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Item Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Your Price (₹) *</label>
                  <input type="number" min="0" step="1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                  {form.price !== '' && Number(form.price) >= 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Student sees ₹{(Number(form.price) * (1 + surcharge / 100)).toFixed(2)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Category *</label>
                  <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Snacks"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.isVeg} onChange={e => setForm({ ...form, isVeg: e.target.checked })} />
                  Vegetarian
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} />
                  In stock
                </label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" disabled={saving} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50">
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
