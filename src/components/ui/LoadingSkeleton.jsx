import React from 'react'

export default function LoadingSkeleton({ type = 'shop', count = 3 }) {
  const skeletons = Array.from({ length: count }, (_, i) => i)
  
  if (type === 'shop') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map(i => (
          <div key={i} className="bg-white rounded-xl shadow-card p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="flex gap-4 mb-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }
  
  if (type === 'menu') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map(i => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse flex justify-between">
            <div className="flex-1 pr-4">
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {skeletons.map(i => (
        <div key={i} className="h-20 bg-gray-200 rounded animate-pulse w-full"></div>
      ))}
    </div>
  )
}
