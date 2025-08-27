import { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface Transaction {
  id: number;
  utilisateur_id: number;
  categorie_id: number;
  type: string;
  montant: number;
  description: string;
  date_transaction: string;
  date_creation: string;
  date_modification: string;
}

interface Category {
  id: number;
  utilisateur_id: number;
  nom: string;
  couleur: string;
  type: string;
  date_creation: string;
  date_modification: string;
}

interface DashboardSummary {
  solde: number;
  statistiques_mensuelles: {
    total_revenus: number;
    total_depenses: number;
    solde: number;
    nombre_transactions: number;
  };
}

interface MonthlyStats {
  mois: string;
  revenus: number;
  depenses: number;
  solde: number;
}

interface CategoryBreakdown {
  nom_categorie: string;
  couleur_categorie: string;
  montant_total: number;
  nombre_transactions: number;
  pourcentage: number;
}

interface Alert {
  type: string;
  message: string;
  severite: string;
}

interface MonthlyData {
  month: string;
  revenus: number;
  depenses: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface BalanceData {
  date: string;
  solde: number;
}

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculer le paramètre 'month' au format YYYY-MM
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const monthParam = `${year}-${month}`;
      
      const monthlyStatsParams = {
        // Le backend attend un paramètre 'month' au lieu de 'range'
        month: monthParam,
      };

      // Récupérer les transactions et les catégories (ces appels ne changent pas)
      const transactionsResponse = await api.get('/transactions');
      setTransactions(transactionsResponse.data?.transactions || []);
      const categoriesResponse = await api.get('/categories');
      setCategories(categoriesResponse.data?.categories || []);
      
      // Récupérer les statistiques du dashboard - avec la gestion d'erreur détaillée
      try {
        // Supprimer le paramètre 'month' de cet appel
        const summaryResponse = await api.get('/dashboard/summary');
        setSummary(summaryResponse.data || null);
      } catch (err) {
        console.warn('Erreur sur /dashboard/summary:', err);
        if (err.response && err.response.data) {
          console.error('Réponse d’erreur du serveur:', err.response.data);
        }
      }
      
      try {
        // Garder le paramètre 'month' pour cet appel
        const monthlyStatsResponse = await api.get('/dashboard/monthly-stats', { params: monthlyStatsParams });
        setMonthlyStats(monthlyStatsResponse.data || []);
      } catch (err) {
        console.warn('Erreur sur /dashboard/monthly-stats:', err);
        if (err.response && err.response.data) {
          console.error('Réponse d’erreur du serveur:', err.response.data);
          setError(`Erreur: ${err.response.data.message || 'La requête est invalide.'}`);
        } else {
          setError('Erreur lors du chargement des statistiques mensuelles.');
        }
        setMonthlyStats([]);
      }
      
      try {
        // Supprimer le paramètre 'month' de cet appel
        const categoryBreakdownResponse = await api.get('/dashboard/category-breakdown');
        setCategoryBreakdown(categoryBreakdownResponse.data || []);
      } catch (err) {
        console.warn('Erreur sur /dashboard/category-breakdown:', err);
        if (err.response && err.response.data) {
          console.error('Réponse d’erreur du serveur:', err.response.data);
        }
        setCategoryBreakdown([]);
      }
      
      try {
        // Supprimer le paramètre 'month' de cet appel
        const alertsResponse = await api.get('/dashboard/alerts');
        setAlerts(alertsResponse.data?.alertes || []);
      } catch (err) {
        console.warn('Erreur sur /dashboard/alerts:', err);
        if (err.response && err.response.data) {
          console.error('Réponse d’erreur du serveur:', err.response.data);
        }
        setAlerts([]);
      }
      
    } catch (err: unknown) {
      console.error('Erreur générale:', err);
      setError('Une erreur est survenue lors du chargement des données. Vérifiez la console pour plus de détails.');
    } finally {
      setLoading(false);
    }
  };

  // Préparer les données pour le graphique des revenus vs dépenses par mois
  const prepareMonthlyData = (): MonthlyData[] => {
    // Si on a des données de l'API, on les utilise
    if (monthlyStats.length > 0) {
      return monthlyStats.map(stat => ({
        month: stat.mois,
        revenus: stat.revenus || 0,
        depenses: stat.depenses || 0
      }));
    }
    
    // Sinon, on calcule à partir des transactions
    const monthlyData: {[key: string]: MonthlyData} = {};
    
    transactions.forEach(transaction => {
      try {
        const date = new Date(transaction.date_transaction);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            month: monthYear,
            revenus: 0,
            depenses: 0
          };
        }
        
        if (transaction.type === 'revenu') {
          monthlyData[monthYear].revenus += parseFloat(transaction.montant.toString());
        } else {
          monthlyData[monthYear].depenses += parseFloat(transaction.montant.toString());
        }
      } catch (e) {
        console.error('Erreur de traitement de transaction:', transaction, e);
      }
    });
    
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  // Préparer les données pour le graphique par catégories
  const prepareCategoryData = (): CategoryData[] => {
    // Si on a des données de l'API, on les utilise
    if (categoryBreakdown.length > 0) {
      return categoryBreakdown.map(cat => ({
        name: cat.nom_categorie,
        value: cat.montant_total || 0,
        color: cat.couleur_categorie || '#CCCCCC'
      }));
    }
    
    // Sinon, on calcule à partir des transactions
    const categoryData: {[key: number]: CategoryData} = {};
    
    transactions.forEach(transaction => {
      try {
        const categoryId = transaction.categorie_id;
        const category = categories.find(c => c.id === categoryId);
        const categoryName = category ? category.nom : 'Non catégorisé';
        const categoryColor = category ? category.couleur : '#CCCCCC';
        
        if (!categoryData[categoryId]) {
          categoryData[categoryId] = {
            name: categoryName,
            value: 0,
            color: categoryColor
          };
        }
        
        if (transaction.type === 'depense') {
          categoryData[categoryId].value += Math.abs(parseFloat(transaction.montant.toString()));
        }
      } catch (e) {
        console.error('Erreur de traitement de transaction pour catégorie:', transaction, e);
      }
    });
    
    return Object.values(categoryData);
  };

  // Préparer les données pour l'évolution du solde
  const prepareBalanceData = (): BalanceData[] => {
    const dailyData: {[key: string]: BalanceData} = {};
    let runningBalance = 0;
    
    // Trier les transactions par date
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date_transaction).getTime() - new Date(b.date_transaction).getTime()
    );
    
    sortedTransactions.forEach(transaction => {
      try {
        const date = transaction.date_transaction;
        
        if (!dailyData[date]) {
          dailyData[date] = {
            date: date,
            solde: runningBalance
          };
        }
        
        if (transaction.type === 'revenu') {
          runningBalance += parseFloat(transaction.montant.toString());
        } else {
          runningBalance -= parseFloat(transaction.montant.toString());
        }
        
        dailyData[date].solde = runningBalance;
      } catch (e) {
        console.error('Erreur de traitement de transaction pour solde:', transaction, e);
      }
    });
    
    return Object.values(dailyData);
  };

  const monthlyData = prepareMonthlyData();
  const categoryData = prepareCategoryData();
  const balanceData = prepareBalanceData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Fonction pour formater les montants en euros avec gestion des valeurs undefined/null
  const formatEuro = (value: number | undefined | null) => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.00 €';
    }
    return `${value.toFixed(2)} €`;
  };

  if (loading) {
    return (
      <AppLayout title="Rapports">
        <div className="flex justify-center items-center h-64">
          <div className="text-text-secondary">Chargement des données...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Rapports">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur! </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={fetchData}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Réessayer
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Rapports">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-text-primary mb-6">Rapports et Analyses</h2>
        
        {/* Alertes */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-text-primary mb-2">Alertes</h3>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md ${
                    alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    alert.type === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-medium">{alert.type === 'warning' ? '⚠️' : 'ℹ️'} {alert.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Filtres de période */}
        <div className="mb-6">
          <label htmlFor="timeRange" className="block text-sm font-medium text-text-secondary mb-2">
            Période:
          </label>
          <select
            id="timeRange"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-full md:w-48 px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
        
        {/* Cartes de résumé */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-text-secondary">Solde Actuel</h3>
              <p className={`text-2xl font-bold ${(summary.solde || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatEuro(summary.solde)}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-text-secondary">Revenus Totaux</h3>
              <p className="text-2xl font-bold text-green-600">
                {formatEuro(summary.statistiques_mensuelles?.total_revenus)}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-text-secondary">Dépenses Totales</h3>
              <p className="text-2xl font-bold text-red-600">
                {formatEuro(summary.statistiques_mensuelles?.total_depenses)}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-text-secondary">Nombre de Transactions</h3>
              <p className="text-2xl font-bold text-blue-600">
                {summary.statistiques_mensuelles?.nombre_transactions || 0}
              </p>
            </div>
          </div>
        )}
        
        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenus vs Dépenses par mois */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-text-primary mb-4">Revenus vs Dépenses par mois</h3>
            <div className="h-64">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [formatEuro(value), '']} />
                    <Legend />
                    <Bar dataKey="revenus" fill="#4CAF50" name="Revenus" />
                    <Bar dataKey="depenses" fill="#F44336" name="Dépenses" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-text-secondary">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
          
          {/* Répartition des dépenses par catégorie */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-text-primary mb-4">Répartition des dépenses par catégorie</h3>
            <div className="h-64">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: {name: string, percent: number}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatEuro(value), '']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-text-secondary">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Évolution du solde */}
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <h3 className="text-lg font-medium text-text-primary mb-4">Évolution du solde</h3>
          <div className="h-64">
            {balanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [formatEuro(value), 'Solde']} />
                  <Legend />
                  <Area type="monotone" dataKey="solde" stroke="#8884d8" fill="#8884d8" name="Solde" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-text-secondary">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>
        
        {/* Tableau des transactions récentes */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-text-primary mb-4">Transactions récentes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.slice(0, 10).map((transaction) => {
                  const category = categories.find(c => c.id === transaction.categorie_id);
                  return (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date_transaction}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{transaction.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category ? category.nom : 'Non catégorisé'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.description}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === 'revenu' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'revenu' ? '+' : '-'}{Math.abs(transaction.montant).toFixed(2)} €
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {transactions.length === 0 && (
            <p className="text-center text-text-secondary py-4">Aucune transaction à afficher</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
