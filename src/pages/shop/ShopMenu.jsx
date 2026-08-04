import React from 'react'
import { useOwnerMenu } from '../../api/queries'

export default function ShopMenu() {
  const { data: menuItems } = useOwnerMenu()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-secondary">My Menu</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition">
          Add Item
        </button>
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
                <td className="py-4 px-4 font-medium">₹{item.price}</td>
                <td className="py-4 px-4 text-gray-600 capitalize">{item.category}</td>
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
