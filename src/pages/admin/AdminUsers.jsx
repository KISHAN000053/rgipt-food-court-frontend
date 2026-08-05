import React from 'react'
import { useAdminUsers, useDeleteUser } from '../../api/queries'

export default function AdminUsers() {
  const { data: users } = useAdminUsers()
  const deleteUser = useDeleteUser()

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name} (${user.email})? This permanently removes their profile and details.`)) return
    try {
      await deleteUser.mutateAsync(user._id)
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete this user.')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 className="text-xl font-bold text-secondary mb-6">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 px-4">Email</th>
              <th className="pb-3 px-4">Hostel / Room</th>
              <th className="pb-3 px-4">Role</th>
              <th className="pb-3 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user._id} className="border-b border-gray-50 last:border-0">
                <td className="py-4 pr-4 font-medium text-secondary">{user.name}</td>
                <td className="py-4 px-4 text-gray-600">{user.email}</td>
                <td className="py-4 px-4 text-gray-600">
                  {user.hostel ? `${user.hostel} · ${user.roomNumber || '—'}` : <span className="text-gray-400">Not set</span>}
                </td>
                <td className="py-4 px-4 capitalize">{user.role}</td>
                <td className="py-4 pl-4 text-right">
                  {user.role === 'admin' ? (
                    <span className="text-gray-300 text-sm">Protected</span>
                  ) : (
                    <button onClick={() => handleDelete(user)} className="text-red-500 hover:underline font-medium text-sm">Delete</button>
                  )}
                </td>
              </tr>
            ))}
            {users?.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-gray-400">No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
