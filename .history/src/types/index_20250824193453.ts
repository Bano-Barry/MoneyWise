export interface User {
  id: number;       // nombre pour correspondre à AuthContext
  email: string;
  firstName: string;
  lastName: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export interface Transaction {
  id: number;
  amount: number;
  categoryId: number;
  date: string;
  description?: string;
  type: 'income' | 'expense';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
}
