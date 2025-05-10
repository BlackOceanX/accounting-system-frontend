import React from 'react';

interface ExpensePaginationProps {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function ExpensePagination({
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange
}: ExpensePaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
      <div>
        Items per page
        <select 
          className="ml-2 border rounded px-2 py-1"
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1); // Reset to first page when changing page size
          }}
          aria-label="Select items per page"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
        <div>
          Showing {((pageNumber - 1) * pageSize) + 1} to {Math.min(pageNumber * pageSize, totalCount)} of {totalCount} items
        </div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
            disabled={pageNumber === 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => onPageChange(Math.min(totalPages, pageNumber + 1))}
            disabled={pageNumber === totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 