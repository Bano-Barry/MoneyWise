// src/types/index.ts

// Utilisateur
export interface User {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
}

// Catégorie telle que renvoyée par le backend
export interface Category {
  id: number;
  utilisateur_id: number;
  nom: string;
  couleur: string;
  type: 'depense' | 'revenu';
  date_creation: string;
  date_modification: string;
}

// Transaction telle que renvoyée par le backend
export interface Transaction {
  id: number;
  utilisateur_id: number;
  categorie_id: number;
  type: 'depense' | 'revenu';
  montant: number;
  description: string;
  date_transaction: string;
  date_creation: string;
  date_modification: string;
}

// Pagination (optionnel pour les listes)
export interface Pagination {
  page: number;
  limit: number;
}

// Réponses API
export interface CategoriesResponse {
  categories: Category[];
}

export interface CategoryResponse {
  categorie: Category;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: Pagination;
}

// État côté frontend
export interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  balance: number;
}

// État Auth
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
