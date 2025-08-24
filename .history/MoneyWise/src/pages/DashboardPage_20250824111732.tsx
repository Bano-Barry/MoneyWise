import AppLayout from '../layouts/AppLayout';
import StatCard from '../components/dashboard/StatCard';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import ExpensePieChart from '../components/dashboard/ExpensePieChart';
import IncomeExpenseTrendChart from '../components/dashboard/IncomeExpenseTrendChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';

const DashboardPage = () => {
    return (
        <AppLayout title="Tableau de bord">
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary">Bonjour Mamadou, bienvenue !</h2>
                    <p className="mt-2 text-text-secondary">Voici un aperçu de vos finances pour le mois de Juillet.</p>
                </div>
                
                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Solde Actuel"
                        value="812 500 FCFA"
                        icon={<Wallet className="w-6 h-6 text-white" />}
                        color="bg-primary"
                    />
                    <StatCard
                        title="Revenus du Mois"
                        value="1 200 000 FCFA"
                        icon={<TrendingUp className="w-6 h-6 text-white" />}
                        color="bg-positive"
                    />
                    <StatCard
                        title="Dépenses du Mois"
                        value="387 500 FCFA"
                        icon={<TrendingDown className="w-6 h-6 text-white" />}
                        color="bg-negative"
                    />
                </div>

                {/* Graphiques */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <ExpensePieChart />
                    </div>
                    <div>
                        <IncomeExpenseTrendChart />
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