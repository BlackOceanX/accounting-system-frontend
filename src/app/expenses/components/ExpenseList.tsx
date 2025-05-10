import React from 'react';
import { Expense } from '@/services/expenseService';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const [actionMenuOpen, setActionMenuOpen] = React.useState<number | null>(null);
  const actionMenuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActionMenuOpen(null);
      }
    }
    if (actionMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
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
            <th className="px-4 py-2 text-left font-semibold">
              <input type="checkbox" className="accent-blue-600" />
            </th>
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
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b hover:bg-gray-50 relative">
              <td className="px-4 py-3">
                <input type="checkbox" className="accent-blue-600" />
              </td>
              <td className="px-4 py-3">{new Date(expense.date).toLocaleDateString()}</td>
              <td className="px-4 py-3">{expense.documentNumber}</td>
              <td className="px-4 py-3">{expense.vendorName}</td>
              <td className="px-4 py-3">
                {expense.expenseItems?.[0]?.category || 'N/A'}
              </td>
              <td className="px-4 py-3">
                {expense.currency} {expense.totalAmount.toFixed(2)}
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
                  onClick={() => setActionMenuOpen(actionMenuOpen === expense.id ? null : expense.id)}
                  className="p-1 rounded hover:bg-gray-200"
                  aria-label="Open action menu"
                >
                  ⋮
                </button>
                {actionMenuOpen === expense.id && (
                  <div ref={actionMenuRef} className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        onEdit(expense);
                        setActionMenuOpen(null);
                      }}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      onClick={() => {
                        setActionMenuOpen(null);
                        onDelete(expense);
                      }}
                    >
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