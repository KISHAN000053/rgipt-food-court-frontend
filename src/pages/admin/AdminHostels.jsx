import React, { useState } from 'react'
import { useAdminHostels, useCreateHostel, useUpdateHostel, useDeleteHostel } from '../../api/queries'

const emptyForm = { name: '', roomPrefix: '', roomDigits: 3, isActive: true }

export default function AdminHostels() {
  const { data: hostels } = useAdminHostels()
  const createHostel = useCreateHostel()
  const updateHostel = useUpdateHostel()
  const deleteHostel = useDeleteHostel()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setError(''); setModalOpen(true) }
  const openEdit = (h) => {
    setEditingId(h._id)
    setForm({ name: h.name || '', roomPrefix: h.roomPrefix || '', roomDigits: h.roomDigits ?? 3, isActive: h.isActive ?? true })
    setError(''); setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Hostel name is required.')
    const digits = Number(form.roomDigits)
    if (digits < 1 || digits > 6) return setError('Room digits must be between 1 and 6.')

    const payload = {
      name: form.name.trim(),
      roomPrefix: form.roomPrefix.trim(),
      roomDigits: digits,
      isActive: form.isActive,
    }
    try {
      if (editingId) await updateHostel.mutateAsync({ id: editingId, data: payload })
      else await createHostel.mutateAsync(payload)
      setModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    }
  }

  const handleDelete = async (h) => {
    if (!window.confirm(`Delete "${h.name}"? Students in this hostel will need to pick another next time they update their profile.`)) return
    try {
      await deleteHostel.mutateAsync(h._id)
    } catch (err) {
      alert('Could not delete this hostel.')
    }
  }

  const example = (h) => {
    const digits = '0'.repeat(Number(h.roomDigits || 3)).replace(/0/g, 'x')
    return h.roomPrefix ? `${h.roomPrefix}-${digits}` : digits
  }

  const saving = createHostel.isPending || updateHostel.isPending

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold text-secondary">Manage Hostels</h1>
        <button onClick={openAdd} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-deep transition">
          Add Hostel
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Set each hostel's room format. The prefix is fixed and students only type the number
        (e.g. prefix "g" + 3 digits means students enter 902, saved as g-902).
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
              <th className="pb-3 pr-4">Hostel</th>
              <th className="pb-3 px-4">Room Format</th>
              <th className="pb-3 px-4">Status</th>
              <th className="pb-3 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hostels?.map(h => (
              <tr key={h._id} className="border-b border-gray-50 last:border-0">
                <td className="py-4 pr-4 font-medium text-secondary">{h.name}</td>
                <td className="py-4 px-4 font-mono text-gray-600">{example(h)}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${h.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {h.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="py-4 pl-4 text-right space-x-3">
                  <button onClick={() => openEdit(h)} className="text-primary hover:underline font-medium text-sm">Edit</button>
                  <button onClick={() => handleDelete(h)} className="text-red-500 hover:underline font-medium text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {hostels?.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">No hostels yet. Click "Add Hostel" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-secondary mb-4">{editingId ? 'Edit Hostel' : 'Add Hostel'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Hostel Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Room Prefix</label>
                  <input type="text" value={form.roomPrefix} onChange={e => setForm({ ...form, roomPrefix: e.target.value })}
                    placeholder="e.g. g" maxLength={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                  <p className="text-xs text-gray-400 mt-1">Leave blank for no prefix.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Room Digits *</label>
                  <select value={form.roomDigits} onChange={e => setForm({ ...form, roomDigits: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value={3}>3 digits</option>
                    <option value={4}>4 digits</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600">
                Students will enter: <span className="font-mono font-medium">{example(form)}</span>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                Active (shown to students)
              </label>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" disabled={saving} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-deep transition disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Hostel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
