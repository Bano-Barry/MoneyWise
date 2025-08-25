import { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import StatCard from '../components/dashboard/StatCard';
import { Wallet, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import ExpensePieChart from '../components/dashboard/ExpensePieChart';
import MonthlyAnalyticsChart from '../components/dashboard/MonthlyAnalyticsChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { getDashboardSummary, getDashboardAlerts, type DashboardSummary, type DashboardAlert } from '../services/dashboardService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
    const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [summaryData, alertsData] = await Promise.all([
                    getDashboardSummary(),
                    getDashboardAlerts()
                ]);
                
                setDashboardData(summaryData);
                setAlerts(alertsData.alertes);
            } catch (error) {
                console.error('Erreur lors du chargement du dashboard:', error);
                toast.error('Erreur lors du chargement des données du dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (amount: number | null | undefined): string => {
        // Contrôle pour éviter NaN
        const safeAmount = amount && !isNaN(amount) ? amount : 0;
        
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(safeAmount);
    };

    const getCurrentMonthName = () => {
        return new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    };

    // Fonction pour sécuriser les données du dashboard
    const getSafeDashboardData = () => {
        if (!dashboardData) return null;
        
        return {
            ...dashboardData,
            solde: dashboardData.solde && !isNaN(dashboardData.solde) ? dashboardData.solde : 0,
            total_revenus: dashboardData.total_revenus && !isNaN(dashboardData.total_revenus) ? dashboardData.total_revenus : 0,
            total_depenses: dashboardData.total_depenses && !isNaN(dashboardData.total_depenses) ? dashboardData.total_depenses : 0,
            statistiques_mensuelles: {
                ...dashboardData.statistiques_mensuelles,
                total_revenus: dashboardData.statistiques_mensuelles?.total_revenus && !isNaN(dashboardData.statistiques_mensuelles.total_revenus) ? dashboardData.statistiques_mensuelles.total_revenus : 0,
                total_depenses: dashboardData.statistiques_mensuelles?.total_depenses && !isNaN(dashboardData.statistiques_mensuelles.total_depenses) ? dashboardData.statistiques_mensuelles.total_depenses : 0,
                solde: dashboardData.statistiques_mensuelles?.solde && !isNaN(dashboardData.statistiques_mensuelles.solde) ? dashboardData.statistiques_mensuelles.solde : 0,
                nombre_transactions: dashboardData.statistiques_mensuelles?.nombre_transactions && !isNaN(dashboardData.statistiques_mensuelles.nombre_transactions) ? dashboardData.statistiques_mensuelles.nombre_transactions : 0
            },
            depenses_par_categorie: dashboardData.depenses_par_categorie?.map(item => ({
                ...item,
                montant_total: item.montant_total && !isNaN(parseFloat(item.montant_total)) ? item.montant_total : "0",
                nombre_transactions: item.nombre_transactions && !isNaN(item.nombre_transactions) ? item.nombre_transactions : 0
            })) || [],
            evolution_six_mois: dashboardData.evolution_six_mois?.map(item => ({
                ...item,
                revenus: item.revenus && !isNaN(item.revenus) ? item.revenus : 0,
                depenses: item.depenses && !isNaN(item.depenses) ? item.depenses : 0,
                solde: item.solde && !isNaN(item.solde) ? item.solde : 0
            })) || []
        };
    };

    if (loading) {
        return (
            <AppLayout title="Tableau de bord">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AppLayout>
        );
    }

    const safeData = getSafeDashboardData();

    return (
        <AppLayout title="Tableau de bord">
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary">
                        Bonjour {user?.prenom || 'Utilisateur'}, bienvenue !
                    </h2>
                    <p className="mt-2 text-text-secondary">
                        Voici un aperçu de vos finances pour {getCurrentMonthName()}.
                    </p>
                </div>

                {/* Alertes */}
                {alerts.length > 0 && (
                    <div className="space-y-3">
                        {alerts.map((alert, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border-l-4 ${
                                    alert.type === 'danger' 
                                        ? 'bg-red-50 border-red-400 text-red-700'
                                        : alert.type === 'warning'
                                        ? 'bg-yellow-50 border-yellow-400 text-yellow-700'
                                        : 'bg-blue-50 border-blue-400 text-blue-700'
                                }`}
                            >
                                <div className="flex items-center">
                                    <AlertTriangle className="w-5 h-5 mr-2" />
                                    <span className="font-medium">{alert.message}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard 
                        title="Solde Actuel"
                        value={safeData ? formatCurrency(safeData.solde) : "0 FCFA"}
                        icon={<Wallet className="w-6 h-6 text-white" />}
                        color="bg-primary"
                    />
                    <StatCard 
                        title="Revenus du Mois"
                        value={safeData ? formatCurrency(safeData.total_revenus) : "0 FCFA"}
                        icon={<TrendingUp className="w-6 h-6 text-white" />}
                        color="bg-positive"
                    />
                    <StatCard 
                        title="Dépenses du Mois"
                        value={safeData ? formatCurrency(safeData.total_depenses) : "0 FCFA"}
                        icon={<TrendingDown className="w-6 h-6 text-white" />}
                        color="bg-negative"
                    />
                </div>

                {/* Graphiques */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2">
                        <ExpensePieChart 
                            data={safeData?.depenses_par_categorie || []}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <MonthlyAnalyticsChart 
                            data={safeData?.evolution_six_mois || []}
                        />
                    </div>
                </div>

                {/* Transactions récentes */}
                <div>
                    <RecentTransactions />
                </div>
            </div>
        </AppLayout>
    );
};

export default DashboardPage;