import React from 'react';

interface ExpenseSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function ExpenseSearch({ search, onSearchChange }: ExpenseSearchProps) {
  return (
    <div className="flex justify-end">
      <div className="relative">
        <input
          type="text"
          className="border rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="ค้นหา..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape') onSearchChange(''); }}
        />
        {search && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
            onClick={() => onSearchChange('')}
            title="ล้างการค้นหา"
            type="button"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
} 