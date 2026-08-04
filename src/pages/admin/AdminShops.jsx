import React, { useState } from 'react'
import { useAdminShops, useCreateShop, useUpdateShop } from '../../api/queries'

const emptyForm = { name: '', description: '', ownerEmail: '', estimatedPrepTime: '', minOrder: '', categories: '' }

export default function AdminShops() {
  const { data: shops } = useAdminShops()
  const createShop = useCreateShop()
  const updateShop = useUpdateShop()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (shop) => {
    setEditingId(shop._id)
    setForm({
      name: shop.name || '',
      description: shop.description || '',
      ownerEmail: shop.ownerEmail || '',
      estimatedPrepTime: shop.estimatedPrepTime ?? '',
      minOrder: shop.minOrder ?? '',
      categories: (shop.categories || []).join(', '),
    })
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Shop name is required.')
      return
    }
    if (form.ownerEmail && !/^\S+@\S+\.\S+$/.test(form.ownerEmail.trim())) {
      setError('Owner email looks invalid.')
      return
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      ownerEmail: form.ownerEmail.trim(),
      estimatedPrepTime: form.estimatedPrepTime === '' ? undefined : Number(form.estimatedPrepTime),
      minOrder: form.minOrder === '' ? undefined : Number(form.minOrder),
      categories: form.categories
        ? form.categories.split(',').map(c => c.trim()).filter(Boolean)
        : [],
    }

    try {
      if (editingId) {
        await updateShop.mutateAsync({ id: editingId, data: payload })
      } else {
        await createShop.mutateAsync(payload)
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  const saving = createShop.isPending || updateShop.isPending

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-secondary">Manage Shops</h1>
        <button
          onClick={openAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Add Shop
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
              <th className="pb-3 pr-4">Shop Name</th>
              <th className="pb-3 px-4">Owner</th>
              <th className="pb-3 px-4">Status</th>
              <th className="pb-3 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shops?.map(shop => (
              <tr key={shop._id} className="border-b border-gray-50 last:border-0">
                <td className="py-4 pr-4 font-medium text-secondary">{shop.name}</td>
                <td className="py-4 px-4 text-gray-600">
                  {shop.ownerId?.name || shop.ownerEmail || <span className="text-gray-400">Unassigned</span>}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${shop.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </span>
                </td>
                <td className="py-4 pl-4 text-right">
                  <button onClick={() => openEdit(shop)} className="text-primary hover:underline font-medium text-sm">Edit</button>
                </td>
              </tr>
            ))}
            {shops?.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">No shops yet. Click "Add Shop" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-secondary mb-4">{editingId ? 'Edit Shop' : 'Add Shop'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Shop Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Owner's Gmail</label>
                <input
                  type="email"
                  value={form.ownerEmail}
                  onChange={e => setForm({ ...form, ownerEmail: e.target.value })}
                  placeholder="shopowner@gmail.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-400 mt-1">Only this email can access the shop owner dashboard for this shop. Leave blank to unassign.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.estimatedPrepTime}
                    onChange={e => setForm({ ...form, estimatedPrepTime: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.minOrder}
                    onChange={e => setForm({ ...form, minOrder: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Categories (comma-separated)</label>
                <input
                  type="text"
                  value={form.categories}
                  onChange={e => setForm({ ...form, categories: e.target.value })}
                  placeholder="Snacks, Beverages"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Shop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
