import React from 'react';

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 mt-8">
      <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-4">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-7 8h6a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <div className="text-lg">ไม่พบข้อมูลรายการค่าใช้จ่าย</div>
    </div>
  );
} 