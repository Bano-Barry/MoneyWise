export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  frequency: 'monthly' | 'yearly' | 'weekly';
  category: string;
  active: boolean;
}

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-01-15', description: 'Salaire', amount: 3500, category: 'Salaire', type: 'income' },
  { id: '2', date: '2024-01-14', description: 'Carrefour', amount: -85.50, category: 'Alimentation', type: 'expense' },
  { id: '3', date: '2024-01-13', description: 'Essence Total', amount: -65.00, category: 'Transport', type: 'expense' },
  { id: '4', date: '2024-01-12', description: 'Netflix', amount: -15.99, category: 'Divertissement', type: 'expense' },
  { id: '5', date: '2024-01-11', description: 'Freelance', amount: 800, category: 'Autres revenus', type: 'income' },
  { id: '6', date: '2024-01-10', description: 'Loyer', amount: -1200, category: 'Logement', type: 'expense' },
];

export const mockBudgets: Budget[] = [
  { id: '1', category: 'Alimentation', limit: 400, spent: 285.50, color: 'bg-blue-500' },
  { id: '2', category: 'Transport', limit: 200, spent: 165.00, color: 'bg-green-500' },
  { id: '3', category: 'Divertissement', limit: 150, spent: 95.99, color: 'bg-purple-500' },
  { id: '4', category: 'Logement', limit: 1300, spent: 1200, color: 'bg-orange-500' },
  { id: '5', category: 'Santé', limit: 100, spent: 45, color: 'bg-pink-500' },
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Vacances d\'été',
    targetAmount: 2500,
    currentAmount: 1200,
    targetDate: '2024-07-01',
    category: 'Voyage'
  },
  {
    id: '2',
    title: 'Fonds d\'urgence',
    targetAmount: 5000,
    currentAmount: 3200,
    targetDate: '2024-12-31',
    category: 'Sécurité'
  },
  {
    id: '3',
    title: 'Nouvelle voiture',
    targetAmount: 15000,
    currentAmount: 4500,
    targetDate: '2025-06-01',
    category: 'Transport'
  }
];

export const mockSubscriptions: Subscription[] = [
  { id: '1', name: 'Netflix', amount: 15.99, nextPayment: '2024-02-05', frequency: 'monthly', category: 'Divertissement', active: true },
  { id: '2', name: 'Spotify', amount: 9.99, nextPayment: '2024-02-10', frequency: 'monthly', category: 'Divertissement', active: true },
  { id: '3', name: 'Office 365', amount: 69.99, nextPayment: '2024-08-15', frequency: 'yearly', category: 'Productivité', active: true },
  { id: '4', name: 'Gym', amount: 39.99, nextPayment: '2024-02-01', frequency: 'monthly', category: 'Santé', active: true },
  { id: '5', name: 'Adobe Creative', amount: 239.88, nextPayment: '2024-11-20', frequency: 'yearly', category: 'Productivité', active: false },
];

export const monthlyData = [
  { month: 'Sep', income: 3500, expenses: 2800 },
  { month: 'Oct', income: 3500, expenses: 2950 },
  { month: 'Nov', income: 4200, expenses: 3100 },
  { month: 'Dec', income: 3800, expenses: 3400 },
  { month: 'Jan', income: 4300, expenses: 2750 },
];

export const expensesByCategory = [
  { name: 'Logement', value: 1200, color: '#EF4444' },
  { name: 'Alimentation', value: 285, color: '#F97316' },
  { name: 'Transport', value: 165, color: '#EAB308' },
  { name: 'Divertissement', value: 96, color: '#8B5CF6' },
  { name: 'Santé', value: 45, color: '#06B6D4' },
  { name: 'Autres', value: 120, color: '#6B7280' },
];