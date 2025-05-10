import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:5014/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Unable to connect to the server. Please check if the backend is running.');
    }
    throw error;
  }
);

export interface ExpenseItem {
  id: number;
  expenseId: number;
  description: string | null;
  category: string | null;
  quantity: number;
  unit: string | null;
  unitPrice: number;
  amount: number;
}

export interface Expense {
  id: number;
  documentNumber: string | null;
  vendorName: string | null;
  vendorDetail: string | null;
  project: string | null;
  referenceNumber: string | null;
  date: string;
  creditTerm: number;
  dueDate: string;
  currency: string | null;
  discount: number;
  vatIncluded: boolean;
  remark: string | null;
  internalNote: string | null;
  totalAmount: number;
  expenseItems: ExpenseItem[] | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const expenseService = {
  async getAllExpenses(pageNumber: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Expense>> {
    try {
      const response = await api.get('/Expenses', {
        params: {
          pageNumber,
          pageSize
        }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch expenses');
      }
      throw error;
    }
  },

  async getExpenseById(id: number): Promise<Expense> {
    try {
      const response = await api.get(`/Expenses/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch expense');
      }
      throw error;
    }
  },

  async createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    try {
      const response = await api.post('/Expenses', expense);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to create expense');
      }
      throw error;
    }
  },

  async updateExpense(id: number, expense: Expense): Promise<Expense> {
    try {
      const response = await api.put(`/Expenses/${id}`, expense);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update expense');
      }
      throw error;
    }
  },

  async deleteExpense(id: number): Promise<void> {
    try {
      await api.delete(`/Expenses/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to delete expense');
      }
      throw error;
    }
  },

  async getLatestDocumentNumber(date: string): Promise<string | null> {
    try {
      const response = await api.get('/Expenses/LatestDocumentNumber', {
        params: { date }
      });
      return response.data?.documentNumber || null;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch latest document number');
      }
      throw error;
    }
  }
}; 