import React from 'react';
import { Expense } from '@/services/expenseService';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  pageNumber: number;
  pageSize: number;
}

export function ExpenseList({ expenses, onEdit, onDelete, pageNumber, pageSize }: ExpenseListProps) {
  const [actionMenuOpen, setActionMenuOpen] = React.useState<number | null>(null);
  const [actionMenuPosition, setActionMenuPosition] = React.useState<{ x: number; y: number } | null>(null);
  const actionMenuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActionMenuOpen(null);
        setActionMenuPosition(null);
      }
    }
    if (actionMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      setActionMenuPosition(null);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionMenuOpen]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-blue-100 text-blue-700">
            <th className="px-4 py-2 text-left font-semibold">ลำดับ</th>
            <th className="px-4 py-2 text-left font-semibold">วันที่</th>
            <th className="px-4 py-2 text-left font-semibold">เลขที่เอกสาร</th>
            <th className="px-4 py-2 text-left font-semibold">ผู้จัดจำหน่าย</th>
            <th className="px-4 py-2 text-left font-semibold">หมวดหมู่</th>
            <th className="px-4 py-2 text-left font-semibold">จำนวนเงิน</th>
            <th className="px-4 py-2 text-left font-semibold">สถานะ</th>
            <th className="px-4 py-2 text-left font-semibold">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={expense.id} className="border-b hover:bg-gray-50 relative">
              <td className="px-4 py-3">{(pageNumber - 1) * pageSize + index + 1}</td>
              <td className="px-4 py-3">{new Date(expense.date).toLocaleDateString()}</td>
              <td className="px-4 py-3">{expense.documentNumber}</td>
              <td className="px-4 py-3">{expense.vendorName}</td>
              <td className="px-4 py-3">
                {expense.expenseItems?.[0]?.category || 'N/A'}
              </td>
              <td className="px-4 py-3">
                {expense.currency} {Number((expense.totalAmount || 0) * (1 - (expense.discount || 0) / 100)).toLocaleString('th-TH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  new Date(expense.dueDate) > new Date()
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {new Date(expense.dueDate) > new Date() ? 'Active' : 'Overdue'}
                </span>
              </td>
              <td className="px-4 py-3 relative">
                <button
                  onClick={(e) => {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    if (actionMenuOpen === expense.id) {
                      setActionMenuOpen(null);
                      setActionMenuPosition(null);
                    } else {
                      setActionMenuOpen(expense.id);
                      setActionMenuPosition({ x: rect.right, y: rect.bottom });
                    }
                  }}
                  className="p-1 rounded hover:bg-gray-200"
                  aria-label="Open action menu"
                >
                  ⋮
                </button>
                {actionMenuOpen === expense.id && actionMenuPosition && (
                  <div
                    ref={actionMenuRef}
                    style={{
                      position: 'fixed',
                      top: actionMenuPosition.y,
                      left: actionMenuPosition.x,
                      zIndex: 9999,
                    }}
                    className="w-40 bg-white border border-blue-300 rounded-lg shadow-2xl ring-2 ring-blue-200/40 backdrop-blur-sm"
                  >
                    <button
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors duration-150 font-medium text-blue-700"
                      onClick={() => {
                        onEdit(expense);
                        setActionMenuOpen(null);
                        setActionMenuPosition(null);
                      }}
                    >
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6v2H7v-2z" />
                      </svg>
                      แก้ไข
                    </button>
                    <button
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-50 transition-colors duration-150 font-medium text-red-600"
                      onClick={() => {
                        setActionMenuOpen(null);
                        setActionMenuPosition(null);
                        onDelete(expense);
                      }}
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      ลบ
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 