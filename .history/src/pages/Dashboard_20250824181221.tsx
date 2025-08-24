import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transaction, Category, FinanceState } from '../types';
import api from '../../services/api';

interface FinanceContextType extends FinanceState {
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
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
      return { ...state, transactions: [...state.transactions, action.payload], balance: calculateBalance([...state.transactions, action.payload]) };
    case 'UPDATE_TRANSACTION':
      const updatedTransactions = state.transactions.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload.transaction } : t
      );
      return { ...state, transactions: updatedTransactions, balance: calculateBalance(updatedTransactions) };
    case 'DELETE_TRANSACTION':
      const filteredTransactions = state.transactions.filter(t => t.id !== action.payload);
      return { ...state, transactions: filteredTransactions, balance: calculateBalance(filteredTransactions) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? { ...c, ...action.payload.category } : c) };
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, balance: calculateBalance(action.payload) };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    default:
      return state;
  }
};

const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) =>
    total + (transaction.type === 'income' ? transaction.amount : -transaction.amount), 0
  );
};

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, {
    transactions: [],
    categories: [],
    balance: 0,
  });

  // Charger données depuis le backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, transactionsRes] = await Promise.all([
          api.get('/catégories'),
          api.get('/transactions'),
        ]);
        dispatch({ type: 'SET_CATEGORIES', payload: categoriesRes.data });
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactionsRes.data });
      } catch (error) {
        console.error('Erreur chargement données backend:', error);
      }
    };
    fetchData();
  }, []);

  // --- Transactions ---
  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
    try {
      const res = await api.post('/transactions', transactionData);
      dispatch({ type: 'ADD_TRANSACTION', payload: res.data });
    } catch (error) {
      console.error('Erreur ajout transaction:', error);
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
    try {
      const res = await api.put(`/transactions/${id}`, transactionData);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, transaction: res.data } });
    } catch (error) {
      console.error('Erreur modification transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (error) {
      console.error('Erreur suppression transaction:', error);
    }
  };

  // --- Catégories ---
  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const res = await api.post('/catégories', categoryData);
      dispatch({ type: 'ADD_CATEGORY', payload: res.data });
    } catch (error) {
      console.error('Erreur ajout catégorie:', error);
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const res = await api.put(`/catégories/${id}`, categoryData);
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id, category: res.data } });
    } catch (error) {
      console.error('Erreur modification catégorie:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/catégories/${id}`);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      console.error('Erreur suppression catégorie:', error);
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
