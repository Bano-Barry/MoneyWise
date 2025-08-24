import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;import React, { createContext, useContext, useReducer, useEffect } from 'react';
  import { Transaction, Category, FinanceState } from '../types';
  
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: JSON.parse(user), token }
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    if ((email === 'usertest' && password === '77884455') || (email && password)) {
      const user: User = {
        id: '1',
        email,
        firstName: email === 'usertest' ? 'Demo' : 'John',
        lastName: email === 'usertest' ? 'User' : 'Doe',
      };
      const token = 'mock-jwt-token';
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    // Mock registration - in real app, this would be an API call
    if (email && password && firstName && lastName) {
      const user: User = {
        id: '1',
        email,
        firstName,
        lastName,
      };
      const token = 'mock-jwt-token';
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('transactions');
    localStorage.removeItem('categories');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}