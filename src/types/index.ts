export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  balance: number;
}