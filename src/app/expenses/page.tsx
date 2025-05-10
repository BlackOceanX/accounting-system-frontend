"use client";

import React, { useEffect, useState } from "react";
import { expenseService, Expense } from "@/services/expenseService";

function CreateExpenseModal({ open, onClose, onCreated }: { open: boolean, onClose: () => void, onCreated: () => void }) {
  const [form, setForm] = useState({
    documentNumber: '',
    vendorName: '',
    vendorDetail: '',
    project: '',
    referenceNumber: '',
    date: new Date().toISOString().slice(0, 10),
    creditTerm: 0,
    dueDate: new Date().toISOString().slice(0, 10),
    currency: 'THB',
    discount: 0,
    vatIncluded: false,
    remark: '',
    internalNote: '',
    totalAmount: 0,
    expenseItems: [
      { description: '', category: '', quantity: 1, unit: '', unitPrice: 0, amount: 0 }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue
    }));
  };

  const handleItemChange = (idx: number, field: string, value: any) => {
    setForm((prev) => {
      const items = [...prev.expenseItems];
      items[idx] = { ...items[idx], [field]: value };
      // recalculate amount
      items[idx].amount = (Number(items[idx].quantity) || 0) * (Number(items[idx].unitPrice) || 0);
      return { ...prev, expenseItems: items };
    });
  };

  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      expenseItems: [...prev.expenseItems, { description: '', category: '', quantity: 1, unit: '', unitPrice: 0, amount: 0 }]
    }));
  };

  const handleRemoveItem = (idx: number) => {
    setForm((prev) => {
      const items = prev.expenseItems.filter((_, i) => i !== idx);
      return { ...prev, expenseItems: items };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { ...form, totalAmount: form.expenseItems.reduce((sum, i) => sum + (Number(i.amount) || 0), 0) };
      await expenseService.createExpense(payload as any);
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4 text-blue-700">Create Expense</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Document No.</label>
              <input name="documentNumber" value={form.documentNumber} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Vendor Name</label>
              <input name="vendorName" value={form.vendorName} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Credit Term (days)</label>
              <input type="number" name="creditTerm" value={form.creditTerm} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className="w-full border rounded px-2 py-1">
                <option value="THB">THB</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium">Remark</label>
              <input name="remark" value={form.remark} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Expense Items</label>
            <div className="space-y-2">
              {form.expenseItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-6 gap-2 items-center">
                  <input placeholder="Description" value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} className="col-span-2 border rounded px-2 py-1" />
                  <input placeholder="Category" value={item.category} onChange={e => handleItemChange(idx, 'category', e.target.value)} className="col-span-1 border rounded px-2 py-1" />
                  <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} className="col-span-1 border rounded px-2 py-1" />
                  <input placeholder="Unit" value={item.unit} onChange={e => handleItemChange(idx, 'unit', e.target.value)} className="col-span-1 border rounded px-2 py-1" />
                  <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)} className="col-span-1 border rounded px-2 py-1" />
                  <span className="col-span-1">{item.amount.toFixed(2)}</span>
                  <button type="button" className="text-red-500 ml-2" onClick={() => handleRemoveItem(idx)} disabled={form.expenseItems.length === 1}>-</button>
                </div>
              ))}
              <button type="button" className="text-blue-600 mt-2" onClick={handleAddItem}>+ Add Item</button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchExpenses();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Expenses</h1>
          <div className="text-sm text-gray-500 mt-1">Expenses &gt; All Expenses</div>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">Scan Bill & Receipt</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition" onClick={() => setShowCreateModal(true)}>Create New</button>
        </div>
      </div>
      <CreateExpenseModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onCreated={fetchExpenses} />
      {/* Table */}
      <div className="bg-white rounded shadow p-4 flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-red-600">
            <p className="mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-blue-100 text-blue-700">
                  <th className="px-4 py-2 text-left font-semibold">
                    <input type="checkbox" className="accent-blue-600" />
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Document No.</th>
                  <th className="px-4 py-2 text-left font-semibold">Vendor Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Category</th>
                  <th className="px-4 py-2 text-left font-semibold">Amount</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && expenses.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 mt-8">
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-7 8h6a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-lg">Click here to create your first expense document</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <div>Items per page
          <select className="ml-2 border rounded px-2 py-1">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
        <div className="text-blue-600 cursor-pointer">Show All Totals</div>
      </div>
    </div>
  );
} 