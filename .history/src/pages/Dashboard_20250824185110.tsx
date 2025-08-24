import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Transaction, Category, FinanceState } from '../types/index';
import { getCategories, createCategory } from '../../services/categoryService';

import {
  getTransactions,
  createTransaction,
  updateTransactionApi,
  deleteTransactionApi
} from '../../services/transactionService';

// Types
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

// Reducer
type FinanceAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; transaction: Partial<Transaction> } }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; category: Partial<Category> } }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] };

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

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, {
    transactions: [],
    categories: [],
    balance: 0,
  });

  // Chargement API initial
  useEffect(() => {
    getTransactions()
      .then((response) => {
        dispatch({ type: 'SET_TRANSACTIONS', payload: response.data });
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des transactions API:', err);
      });

    getCategories()
      .then((response) => {
        dispatch({ type: 'SET_CATEGORIES', payload: response.data });
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des catégories API:', err);
      });
  }, []);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
    try {
      const response = await createTransaction(transactionData);
      dispatch({ type: 'ADD_TRANSACTION', payload: response.data });
    } catch (error) {
      console.error('Erreur lors de la création de la transaction :', error);
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
    try {
      const response = await updateTransactionApi(id, transactionData);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, transaction: response.data } });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction :', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteTransactionApi(id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (error) {
      console.error('Erreur lors de la suppression de la transaction :', error);
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const response = await createCategory(categoryData);
      dispatch({ type: 'ADD_CATEGORY', payload: response.data });
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie :', error);
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      // Créez la route correspondante côté backend si elle n'existe pas
      const response = await api.put(`/catégories/${id}`, categoryData);
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id, category: response.data } });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie :', error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/catégories/${id}`);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie :', error);
    }
  };

  const getTransactionsByMonth = (month: number, year: number): Transaction[] => {
    return state.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
    });
  };

  const getTransactionsByDateRange = (startDate: string, endDate: string): Transaction[] => {
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