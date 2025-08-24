
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transaction, Category, FinanceState } from '../types';
import api from '../services/api';

interface FinanceContextType extends FinanceState {






  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getTransactionsByMonth: (month: number, year: number) => Transaction[];
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[];
  fetchTransactions: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

type FinanceAction = 
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; transaction: Partial<Transaction> } }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; category: Partial<Category> } }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }


  | { type: 'RESET_STATE' };
const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      const newTransactions = [...state.transactions, action.payload];
      return {
        ...state,
        transactions: newTransactions,
        balance: calculateBalance(newTransactions),
      };
    case 'UPDATE_TRANSACTION':
      const updatedTransactions = state.transactions.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload.transaction } : t
      );
      return {
        ...state,
        transactions: updatedTransactions,
        balance: calculateBalance(updatedTransactions),
      };
    case 'DELETE_TRANSACTION':
      const filteredTransactions = state.transactions.filter(t => t.id !== action.payload);
      return {
        ...state,
        transactions: filteredTransactions,
        balance: calculateBalance(filteredTransactions),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.category } : c
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        balance: calculateBalance(action.payload),
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
























    case 'RESET_STATE':
      return {
    transactions: [],
    categories: defaultCategories,
    balance: 0,









  };





    default:
      return state;
  }
  };

































const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return total + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
  }, 0);
    };


const defaultCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income', color: '#10B981' },
  { id: '2', name: 'Freelance', type: 'income', color: '#059669' },
  { id: '3', name: 'Food & Dining', type: 'expense', color: '#EF4444' },
  { id: '4', name: 'Transportation', type: 'expense', color: '#F59E0B' },
  { id: '5', name: 'Shopping', type: 'expense', color: '#8B5CF6' },
  { id: '6', name: 'Entertainment', type: 'expense', color: '#EC4899' },
  { id: '7', name: 'Bills & Utilities', type: 'expense', color: '#6B7280' },
  { id: '8', name: 'Healthcare', type: 'expense', color: '#DC2626' },
];

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, {
    transactions: [],
    categories: defaultCategories,
    balance: 0,
  });

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      dispatch({ type: 'SET_TRANSACTIONS', payload: res.data });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      const savedTransactions = localStorage.getItem('transactions');
      if (savedTransactions) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: JSON.parse(savedTransactions) });
      }
    }
  };



  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      dispatch({ type: 'SET_CATEGORIES', payload: res.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      const savedCategories = localStorage.getItem('categories');
      if (savedCategories) {
        dispatch({ type: 'SET_CATEGORIES', payload: JSON.parse(savedCategories) });
      }
    }
  };








  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(state.categories));
  }, [state.categories]);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
    try {
      const response = await api.post('/transactions', transactionData);
      dispatch({ type: 'ADD_TRANSACTION', payload: response.data });
    } catch (error) {
      console.error('Failed to add transaction:', error);
      const transaction: Transaction = {
        ...transactionData,
      id: Date.now().toString(),
        userId: '1',
    };

      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    }
  };



  const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, transaction: response.data } });
    } catch (error) {
      console.error('Failed to update transaction:', error);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, transaction: transactionData } });
    }
  };



  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };






  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const response = await api.post('/categories', categoryData);
      dispatch({ type: 'ADD_CATEGORY', payload: response.data });
    } catch (error) {
      console.error('Failed to add category:', error);
      const category: Category = {
        ...categoryData,
        id: Date.now().toString(),
  };








      dispatch({ type: 'ADD_CATEGORY', payload: category });
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id, category: response.data } });
    } catch (error) {
      console.error('Failed to update category:', error);
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id, category: categoryData } });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      console.error('Failed to delete category:', error);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    }
  };

  const getTransactionsByMonth = (month: number, year: number) => {
    return state.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
    });
  };

  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return state.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  };

  return (
    <FinanceContext.Provider value={{
      ...state,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      getTransactionsByMonth,
      getTransactionsByDateRange,




      fetchTransactions,
      fetchCategories,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}