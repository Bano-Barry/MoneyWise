import React, { useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import StatCard from '../components/dashboard/StatCard';
import { Wallet, TrendingUp, TrendingDown, Lock } from 'lucide-react';
import ExpensePieChart from '../components/dashboard/ExpensePieChart';
import IncomeExpenseTrendChart from '../components/dashboard/IncomeExpenseTrendChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';

const DashboardPage = () => {
    const [showVariation, setShowVariation] = useState(false);
    const [showExpensePercentage, setShowExpensePercentage] = useState(false);

    const revenue = 1200000;
    const expenses = 387500;
    const expensePercentage = Math.round((expenses / revenue) * 100);

    return (
        <AppLayout title="Tableau de bord">
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary">Bonjour Mamadou, bienvenue !</h2>
                    <p className="mt-2 text-text-secondary">Voici un aperçu de vos finances pour le mois de Juillet.</p>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={() => setShowVariation(!showVariation)}
                        className="px-4 py-2 bg-gray-200 rounded shadow-sm"
                    >
                        {showVariation ? 'Masquer Variations' : 'Afficher Variations'}
                    </button>
                </div>
                {showVariation && (
                    <div className="p-4 border rounded bg-gray-50">
                        <p className="font-semibold text-gray-700">Suivi des revenus et dépenses :</p>
                        <ul className="ml-4 list-disc text-sm text-gray-600">
                            <li>Jour : +0.5%</li>
                            <li>Semaine : +2%</li>
                            <li>Mois : +5%</li>
                        </ul>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Solde Actuel"
                        value="812 500 FCFA"
                        icon={<Wallet className="w-6 h-6 text-white" />}
                        color="bg-primary"
                    />
                    <StatCard
                        title="Revenus du Mois"
                        value={`${revenue.toLocaleString()} FCFA`}
                        icon={<TrendingUp className="w-6 h-6 text-white" />}
                        color="bg-positive"
                    />
                    <StatCard
                        title="Dépenses du Mois"
                        value={
                            <>
                                {expenses.toLocaleString()} FCFA
                                <button 
                                    onClick={() => setShowExpensePercentage(!showExpensePercentage)} 
                                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded shadow-sm"
                                >
                                    {showExpensePercentage ? '-' : '+'}
                                </button>
                                {showExpensePercentage && (
                                    <span className="ml-2 text-sm text-gray-800">
                                        ({expensePercentage}% du revenu)
                                    </span>
                                )}
                            </>
                        }
                        icon={<TrendingDown className="w-6 h-6 text-white" />}
                        color="bg-negative"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <ExpensePieChart />
                    </div>
                    <div>
                        <IncomeExpenseTrendChart />
                    </div>
                </div>
                <div>
                    <RecentTransactions />
                </div>
            </div>
        </AppLayout>
    );
};

export default DashboardPage;