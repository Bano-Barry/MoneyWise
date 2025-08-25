import api from "./api";

export interface Transaction {
  id: number;
  utilisateur_id: number;
  type: 'revenu' | 'depense';
  montant: number;
  description: string;
  date_transaction: string;
  categorie_id: number;
  categorie_nom?: string;
  categorie_couleur?: string;
  date_creation: string;
  date_modification: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: 'revenu' | 'depense';
  categoryId?: number;
  startDate?: string;
  endDate?: string;
}

// Fonction utilitaire pour valider les données numériques
const validateNumber = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined || isNaN(value)) {
    return defaultValue;
  }
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

// Fonction utilitaire pour valider les chaînes
const validateString = (value: any, defaultValue: string = ''): string => {
  return value && typeof value === 'string' ? value : defaultValue;
};

// Fonction utilitaire pour valider les dates
const validateDate = (value: any): string => {
  if (!value) return new Date().toISOString();
  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

// Obtenir toutes les transactions
export const getTransactions = async (filters: TransactionFilters = {}): Promise<{
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.type) params.append('type', filters.type);
  if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  
  const response = await api.get(`/transactions?${params.toString()}`);
  const data = response.data;

  return {
    transactions: Array.isArray(data.transactions) 
      ? data.transactions.map((transaction: any) => ({
          id: validateNumber(transaction.id),
          utilisateur_id: validateNumber(transaction.utilisateur_id),
          type: ['revenu', 'depense'].includes(transaction.type) ? transaction.type : 'depense',
          montant: validateNumber(transaction.montant),
          description: validateString(transaction.description, 'Description manquante'),
          date_transaction: validateDate(transaction.date_transaction),
          categorie_id: validateNumber(transaction.categorie_id),
          categorie_nom: validateString(transaction.categorie_nom),
          categorie_couleur: validateString(transaction.couleur_categorie),
          date_creation: validateDate(transaction.date_creation),
          date_modification: validateDate(transaction.date_modification)
        }))
      : [],
    total: validateNumber(data.total),
    page: validateNumber(data.page, 1),
    totalPages: validateNumber(data.totalPages, 1)
  };
};

// Obtenir les transactions récentes
export const getRecentTransactions = async (limit: number = 5): Promise<Transaction[]> => {
  const response = await api.get(`/transactions?limit=${limit}&sort=date_transaction&order=desc`);
  const data = response.data;

  return Array.isArray(data.transactions) 
    ? data.transactions.map((transaction: any) => ({
        id: validateNumber(transaction.id),
        utilisateur_id: validateNumber(transaction.utilisateur_id),
        type: ['revenu', 'depense'].includes(transaction.type) ? transaction.type : 'depense',
        montant: validateNumber(transaction.montant),
        description: validateString(transaction.description, 'Description manquante'),
        date_transaction: validateDate(transaction.date_transaction),
        categorie_id: validateNumber(transaction.categorie_id),
        categorie_nom: validateString(transaction.categorie_nom),
        categorie_couleur: validateString(transaction.couleur_categorie),
        date_creation: validateDate(transaction.date_creation),
        date_modification: validateDate(transaction.date_modification)
      }))
    : [];
};

// Créer une nouvelle transaction
export const createTransaction = async (transactionData: {
  type: 'revenu' | 'depense';
  montant: number;
  description: string;
  date_transaction: string;
  categorie_id: number;
}): Promise<Transaction> => {
  // Valider les données avant envoi
  const validatedData = {
    type: ['revenu', 'depense'].includes(transactionData.type) ? transactionData.type : 'depense',
    montant: validateNumber(transactionData.montant),
    description: validateString(transactionData.description, 'Description manquante'),
    date_transaction: validateDate(transactionData.date_transaction),
    categorie_id: validateNumber(transactionData.categorie_id)
  };

  const response = await api.post('/transactions', validatedData);
  const data = response.data;

  return {
    id: validateNumber(data.id),
    utilisateur_id: validateNumber(data.utilisateur_id),
    type: ['revenu', 'depense'].includes(data.type) ? data.type : 'depense',
    montant: validateNumber(data.montant),
    description: validateString(data.description, 'Description manquante'),
    date_transaction: validateDate(data.date_transaction),
    categorie_id: validateNumber(data.categorie_id),
    categorie_nom: validateString(data.categorie_nom),
    categorie_couleur: validateString(data.couleur_categorie),
    date_creation: validateDate(data.date_creation),
    date_modification: validateDate(data.date_modification)
  };
};

// Mettre à jour une transaction
export const updateTransaction = async (
  id: number,
  transactionData: Partial<{
    type: 'revenu' | 'depense';
    montant: number;
    description: string;
    date_transaction: string;
    categorie_id: number;
  }>
): Promise<Transaction> => {
  // Valider les données avant envoi
  const validatedData: any = {};
  if (transactionData.type) {
    validatedData.type = ['revenu', 'depense'].includes(transactionData.type) ? transactionData.type : 'depense';
  }
  if (transactionData.montant !== undefined) {
    validatedData.montant = validateNumber(transactionData.montant);
  }
  if (transactionData.description) {
    validatedData.description = validateString(transactionData.description, 'Description manquante');
  }
  if (transactionData.date_transaction) {
    validatedData.date_transaction = validateDate(transactionData.date_transaction);
  }
  if (transactionData.categorie_id !== undefined) {
    validatedData.categorie_id = validateNumber(transactionData.categorie_id);
  }

  const response = await api.put(`/transactions/${id}`, validatedData);
  const data = response.data;

  return {
    id: validateNumber(data.id),
    utilisateur_id: validateNumber(data.utilisateur_id),
    type: ['revenu', 'depense'].includes(data.type) ? data.type : 'depense',
    montant: validateNumber(data.montant),
    description: validateString(data.description, 'Description manquante'),
    date_transaction: validateDate(data.date_transaction),
    categorie_id: validateNumber(data.categorie_id),
    categorie_nom: validateString(data.categorie_nom),
    categorie_couleur: validateString(data.couleur_categorie),
    date_creation: validateDate(data.date_creation),
    date_modification: validateDate(data.date_modification)
  };
};

// Supprimer une transaction
export const deleteTransaction = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/transactions/${id}`);
  return {
    message: validateString(response.data.message, 'Transaction supprimée avec succès')
  };
};

// Obtenir une transaction par ID
export const getTransactionById = async (id: number): Promise<Transaction> => {
  const response = await api.get(`/transactions/${id}`);
  const data = response.data;

  return {
    id: validateNumber(data.id),
    utilisateur_id: validateNumber(data.utilisateur_id),
    type: ['revenu', 'depense'].includes(data.type) ? data.type : 'depense',
    montant: validateNumber(data.montant),
    description: validateString(data.description, 'Description manquante'),
    date_transaction: validateDate(data.date_transaction),
    categorie_id: validateNumber(data.categorie_id),
    categorie_nom: validateString(data.categorie_nom),
    categorie_couleur: validateString(data.couleur_categorie),
    date_creation: validateDate(data.date_creation),
    date_modification: validateDate(data.date_modification)
  };
};

// Obtenir le solde
export const getBalance = async (): Promise<{
  solde: number;
  total_revenus: number;
  total_depenses: number;
}> => {
  const response = await api.get('/transactions/balance/summary');
  const data = response.data;

  return {
    solde: validateNumber(data.solde),
    total_revenus: validateNumber(data.total_revenus),
    total_depenses: validateNumber(data.total_depenses)
  };
};
