// src/types/index.ts

export interface User {
  id: number;        // identifiant numérique
  email: string;
  firstName: string; // ajouté pour AuthContext
  lastName: string;  // ajouté pour AuthContext
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string; // ISO string
  type: 'income' | 'expense';
  category: string;
}

export interface Category {
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  balance: number;
}
