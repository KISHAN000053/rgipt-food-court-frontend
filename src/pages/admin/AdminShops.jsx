import React from 'react'
import { useAdminShops } from '../../api/queries'

export default function AdminShops() {
  const { data: shops } = useAdminShops()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-secondary">Manage Shops</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition">
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
                <td className="py-4 px-4 text-gray-600">{shop.owner?.name || 'N/A'}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${shop.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </span>
                </td>
                <td className="py-4 pl-4 text-right">
                  <button className="text-primary hover:underline font-medium text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
