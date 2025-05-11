import React from 'react';
import { Expense } from '@/services/expenseService';

interface DeleteExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expense: Expense | null;
}

export function DeleteExpenseModal({ open, onClose, onConfirm, expense }: DeleteExpenseModalProps) {
  if (!open || !expense) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          ยืนยันการลบรายการ
        </h3>
        
        <p className="text-sm text-gray-500 text-center mb-6">
          คุณต้องการลบรายการค่าใช้จ่าย เลขที่เอกสาร {expense.documentNumber} ใช่หรือไม่?
          การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            ลบรายการ
          </button>
        </div>
      </div>
    </div>
  );
} 