import React from 'react'
import { useAdminUsers } from '../../api/queries'

export default function AdminUsers() {
  const { data: users } = useAdminUsers()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 className="text-xl font-bold text-secondary mb-6">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 px-4">Email</th>
              <th className="pb-3 px-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user._id} className="border-b border-gray-50 last:border-0">
                <td className="py-4 pr-4 font-medium text-secondary">{user.name}</td>
                <td className="py-4 px-4 text-gray-600">{user.email}</td>
                <td className="py-4 px-4 capitalize">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
