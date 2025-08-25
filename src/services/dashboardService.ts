import api from "./api";

// Types pour le dashboard
export interface DashboardSummary {
  solde: number;
  total_revenus: number;
  total_depenses: number;
  statistiques_mensuelles: {
    total_revenus: number;
    total_depenses: number;
    solde: number;
    nombre_transactions: number;
  };
  depenses_par_categorie: Array<{
    nom_categorie: string;
    couleur_categorie: string;
    montant_total: string;
    nombre_transactions: number;
  }>;
  evolution_six_mois: Array<{
    mois: string;
    revenus: number;
    depenses: number;
    solde: number;
  }>;
}

export interface MonthlyStats {
  mois: string;
  revenus: number;
  depenses: number;
  solde: number;
}

export interface CategoryBreakdown {
  nom_categorie: string;
  couleur_categorie: string;
  montant_total: string;
  nombre_transactions: number;
  pourcentage: string;
}

export interface DashboardAlert {
  type: 'warning' | 'danger' | 'info';
  message: string;
  severite: 'low' | 'medium' | 'high';
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

// Obtenir le résumé du dashboard
export const getDashboardSummary = async (year?: number, month?: number): Promise<DashboardSummary> => {
  const params = new URLSearchParams();
  if (year) params.append('year', year.toString());
  if (month) params.append('month', month.toString());
  
  const response = await api.get(`/dashboard/summary?${params.toString()}`);
  const data = response.data;

  // Valider et nettoyer les données
  return {
    solde: validateNumber(data.solde),
    total_revenus: validateNumber(data.total_revenus),
    total_depenses: validateNumber(data.total_depenses),
    statistiques_mensuelles: {
      total_revenus: validateNumber(data.statistiques_mensuelles?.total_revenus),
      total_depenses: validateNumber(data.statistiques_mensuelles?.total_depenses),
      solde: validateNumber(data.statistiques_mensuelles?.solde),
      nombre_transactions: validateNumber(data.statistiques_mensuelles?.nombre_transactions)
    },
    depenses_par_categorie: Array.isArray(data.depenses_par_categorie) 
      ? data.depenses_par_categorie.map((item: any) => ({
          nom_categorie: validateString(item.nom_categorie, 'Catégorie inconnue'),
          couleur_categorie: validateString(item.couleur_categorie, '#6B7280'),
          montant_total: validateString(item.montant_total, '0'),
          nombre_transactions: validateNumber(item.nombre_transactions)
        }))
      : [],
    evolution_six_mois: Array.isArray(data.evolution_six_mois)
      ? data.evolution_six_mois.map((item: any) => ({
          mois: validateString(item.mois, 'Mois inconnu'),
          revenus: validateNumber(item.revenus),
          depenses: validateNumber(item.depenses),
          solde: validateNumber(item.solde)
        }))
      : []
  };
};

// Obtenir les statistiques mensuelles
export const getMonthlyStats = async (month: string): Promise<MonthlyStats> => {
  const response = await api.get(`/dashboard/monthly-stats?month=${month}`);
  const data = response.data;

  return {
    mois: validateString(data.mois),
    revenus: validateNumber(data.revenus),
    depenses: validateNumber(data.depenses),
    solde: validateNumber(data.solde)
  };
};

// Obtenir la répartition par catégorie
export const getCategoryBreakdown = async (
  type: 'depense' | 'revenu' = 'depense',
  dateDebut?: string,
  dateFin?: string
): Promise<CategoryBreakdown[]> => {
  const params = new URLSearchParams();
  params.append('type', type);
  if (dateDebut) params.append('dateDebut', dateDebut);
  if (dateFin) params.append('dateFin', dateFin);
  
  const response = await api.get(`/dashboard/category-breakdown?${params.toString()}`);
  const data = response.data;

  return Array.isArray(data) 
    ? data.map((item: any) => ({
        nom_categorie: validateString(item.nom_categorie, 'Catégorie inconnue'),
        couleur_categorie: validateString(item.couleur_categorie, '#6B7280'),
        montant_total: validateString(item.montant_total, '0'),
        nombre_transactions: validateNumber(item.nombre_transactions),
        pourcentage: validateString(item.pourcentage, '0')
      }))
    : [];
};

// Obtenir les alertes
export const getDashboardAlerts = async (): Promise<{ alertes: DashboardAlert[] }> => {
  const response = await api.get('/dashboard/alerts');
  const data = response.data;

  return {
    alertes: Array.isArray(data.alertes)
      ? data.alertes.map((alert: any) => ({
          type: ['warning', 'danger', 'info'].includes(alert.type) ? alert.type : 'info',
          message: validateString(alert.message, 'Alerte sans message'),
          severite: ['low', 'medium', 'high'].includes(alert.severite) ? alert.severite : 'low'
        }))
      : []
  };
};

// Obtenir les données pour les graphiques
export const getChartData = async (
  startDate: string,
  endDate: string,
  chartType?: 'pie' | 'line' | 'bar'
): Promise<any> => {
  const params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  if (chartType) params.append('chartType', chartType);
  
  const response = await api.get(`/dashboard/charts?${params.toString()}`);
  return response.data;
};

// Obtenir les statistiques détaillées
export const getDetailedStats = async (
  startDate: string,
  endDate: string,
  type?: 'category' | 'trend' | 'balance'
): Promise<any> => {
  const params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  if (type) params.append('type', type);
  
  const response = await api.get(`/dashboard/stats?${params.toString()}`);
  return response.data;
};
