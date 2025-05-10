"use client";

import React, { useState, useEffect } from 'react';
import { CreateExpenseModal } from './components/CreateExpenseModal';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSearch } from './components/ExpenseSearch';
import { ExpensePagination } from './components/ExpensePagination';
import { EmptyState } from './components/EmptyState';
import { expenseService, Expense } from '@/services/expenseService';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseService.getAllExpenses();
      setExpenses(response.items);
      setFilteredExpenses(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error fetching expenses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const filtered = expenses.filter(expense => 
      (expense.documentNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (expense.vendorName || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredExpenses(filtered);
    setTotalCount(filtered.length);
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setPageNumber(1);
  }, [search, expenses, pageSize]);

  const handleRetry = () => {
    fetchExpenses();
  };

  const handleDelete = async (expense: Expense) => {
    if (window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
      try {
        await expenseService.deleteExpense(expense.id);
        await fetchExpenses();
      } catch (err) {
        console.error('Error deleting expense:', err);
        alert('เกิดข้อผิดพลาดในการลบรายการ');
      }
    }
  };

  const handleEdit = (expense: Expense) => {
    // TODO: Implement edit functionality
    console.log('Edit expense:', expense);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageNumber(1);
  };

  const paginatedExpenses = filteredExpenses.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">รายการค่าใช้จ่าย</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          เพิ่มรายการใหม่
        </button>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <ExpenseSearch
            search={search}
            onSearchChange={setSearch}
          />
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-red-600">
            <p className="mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              ลองใหม่
            </button>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ExpenseList
              expenses={paginatedExpenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <div className="p-6 border-t border-gray-200">
              <ExpensePagination
                pageNumber={pageNumber}
                pageSize={pageSize}
                totalCount={totalCount}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </>
        )}
      </div>

      <CreateExpenseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          setIsModalOpen(false);
          fetchExpenses();
        }}
      />
    </div>
  );
} 