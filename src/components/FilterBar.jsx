import React from 'react'

export default function FilterBar({ filters, activeFilter, onFilterChange }) {
  return (
    <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 hide-scrollbar">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
            ${activeFilter === filter.id 
              ? 'bg-primary text-white border-primary shadow-sm' 
              : 'bg-white text-secondary border-gray-200 hover:bg-gray-50'
            }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
