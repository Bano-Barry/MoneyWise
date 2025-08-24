import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transaction, Category, FinanceState } from '../types';
import api from '../../services/api';
import { getCategories } from '../../services/categoryService';

interface FinanceContextType extends FinanceState {
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getTransactionsByMonth: (month: number, year: number) => Transaction[];
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[];
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
  | { type: 'RESET_STATE' }; // Added a new action type for resetting state if needed.

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

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedTransactions) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: JSON.parse(savedTransactions) });
    }
    
    if (savedCategories) {
      dispatch({ type: 'SET_CATEGORIES', payload: JSON.parse(savedCategories) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(state.categories));
  }, [state.categories]);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
    const transaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      userId: '1', // Mock user ID
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const updateTransaction = (id: string, transactionData: Partial<Transaction>) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, transaction: transactionData } });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const category: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: { id, category: categoryData } });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
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