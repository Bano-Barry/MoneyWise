import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transaction, Category, FinanceState } from '../types';
import api from '../src/services/api';

import { getCategories, createCategory } from '../../services/categoryService';

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
    default:
      return state;
  }
};

const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return total + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
  }, 0);
};

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, {
    transactions: [],
    categories: [],
    balance: 0,
  });

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: JSON.parse(savedTransactions) });
    }
    // Charger depuis l'API
    getCategories()
      .then((response) => {
        dispatch({ type: 'SET_CATEGORIES', payload: response.data });
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des catégories API:", err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
    const transaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      userId: '1',
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const updateTransaction = (id: string, transactionData: Partial<Transaction>) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, transaction: transactionData } });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const response = await import('../../services/categoryService').then(mod => mod.createCategory(categoryData));
      dispatch({ type: 'ADD_CATEGORY', payload: response.data });
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie :', error);
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
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