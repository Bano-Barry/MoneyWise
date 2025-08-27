// src/pages/Budgets.tsx

import React, { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { Plus, X, AlertTriangle, TrendingUp, TrendingDown, Loader2, Trash2, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import AppLayout from '../layouts/AppLayout';

// Composant Card intégré pour éviter les erreurs d'importation
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            {children}
        </div>
    );
};

// Instance Axios pour l'API
const api = axios.create({
    baseURL: "https://moneywise-backend-187q.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Définitions de type pour les données de l'API de dashboard
interface CategoryStats {
    nom_categorie: string;
    couleur_categorie: string;
    montant_total: number;
}

// Définitions de type pour nos budgets (fusion des données)
interface Budget {
    id: string;
    category: string;
    limit: number;
    spent: number;
}

const Budgets: React.FC = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [newBudget, setNewBudget] = useState({ category: '', limit: '' }); // 'spent' a été supprimé
    const [totalBudgetAmount, setTotalBudgetAmount] = useState<string>('');
    const [spendingInput, setSpendingInput] = useState<{ [key: string]: string }>({}); // Nouvel état pour les champs de saisie de dépense
    const [showAlert, setShowAlert] = useState<{ [key: string]: boolean }>({}); // Nouvel état pour les alertes
    // La devise est fixée à 'XAF' (Franc CFA)
    const selectedCurrency = "XAF";

    // Récupère les données de dépenses depuis l'API
    useEffect(() => {
        const fetchBudgetStats = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get('/dashboard/category-breakdown', { params: { type: 'depense' } });
                const categoryStats: CategoryStats[] = response.data;

                setBudgets(prevBudgets => {
                    return prevBudgets.map(budget => {
                        const fetchedStat = categoryStats.find(stat => stat.nom_categorie === budget.category);
                        return { ...budget, spent: fetchedStat ? fetchedStat.montant_total : 0 };
                    });
                });
            } catch (err: unknown) {
                if (isAxiosError(err)) {
                    setError(err.response?.data?.message || "Erreur API lors du chargement des budgets.");
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Une erreur inconnue est survenue.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchBudgetStats();
    }, []);

    // Gère la soumission du formulaire d'ajout de budget
    const handleAddBudget = (e: React.FormEvent) => {
        e.preventDefault();
        const limit = parseFloat(newBudget.limit) || 0;

        if (newBudget.category && limit > 0) {
            const newId = uuidv4();
            setBudgets(prevBudgets => [...prevBudgets, { id: newId, category: newBudget.category, limit, spent: 0 }]);
            setNewBudget({ category: '', limit: '' });
            setShowAddModal(false);
        }
    };

    // Gère la suppression d'un budget
    const handleDeleteBudget = (id: string) => {
        setBudgets(budgets.filter(budget => budget.id !== id));
    };

    // Nouvelle fonction pour gérer l'ajout de dépense
    const handleAddSpending = (budgetId: string) => {
        const spending = parseFloat(spendingInput[budgetId] || '0');
        if (spending > 0) {
            setBudgets(prevBudgets => {
                const updatedBudgets = prevBudgets.map(budget => {
                    if (budget.id === budgetId) {
                        const newSpent = budget.spent + spending;
                        // Afficher l'alerte si le nouveau total dépasse la limite
                        if (newSpent > budget.limit) {
                            setShowAlert(prevAlerts => ({ ...prevAlerts, [budgetId]: true }));
                        }
                        return { ...budget, spent: newSpent };
                    }
                    return budget;
                });
                return updatedBudgets;
            });
            // Réinitialiser le champ de saisie
            setSpendingInput(prevInputs => ({ ...prevInputs, [budgetId]: '' }));
        }
    };

    // Fonction de calcul des statuts de budget
    const getBudgetStatus = (spent: number, limit: number) => {
        const percentage = (spent / limit) * 100;
        if (spent === limit) return { status: 'completed', color: 'text-green-600', bg: 'bg-green-100' };
        if (percentage >= 100) return { status: 'exceeded', color: 'text-red-600', bg: 'bg-red-100' };
        if (percentage >= 80) return { status: 'warning', color: 'text-orange-600', bg: 'bg-orange-100' };
        return { status: 'good', color: 'text-green-600', bg: 'bg-green-100' };
    };

    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    const totalBudget = parseFloat(totalBudgetAmount) || 0;
    const remainingBudget = totalBudget - totalSpent;

    // Rendu conditionnel basé sur les états de chargement et d'erreur
    if (isLoading) {
        return (
            <AppLayout title="Budgets">
                <div className="flex justify-center items-center h-screen bg-gray-50">
                    <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout title="Budgets">
                <div className="p-6 text-center text-red-600 bg-red-100 rounded-lg shadow-md">
                    <p className="font-bold">Erreur de chargement :</p>
                    <p>{error}</p>
                </div>
            </AppLayout>
        );
    }

    // Rendu du contenu principal
    return (
        <AppLayout title="Budgets">
            <div className="space-y-6 p-6">
                {/* ... (le reste du code du composant, jusqu'à la liste des budgets) ... */}
                {/* Configuration du budget total */}
                <Card>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Définir le budget total</h3>
                        <div className="flex items-center space-x-4">
                            <input
                                type="number"
                                value={totalBudgetAmount}
                                onChange={(e) => setTotalBudgetAmount(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Entrez votre budget total"
                            />
                            <span className="text-gray-600 font-medium">FCFA</span>
                        </div>
                    </div>
                </Card>
                {/* Aperçu du budget */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Budget total</p>
                                <p className="text-2xl font-bold text-gray-900">{totalBudget.toLocaleString('fr-FR', { style: 'currency', currency: selectedCurrency })}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100">
                                <TrendingUp className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Dépensé</p>
                                <p className="text-2xl font-bold text-gray-900">{totalSpent.toLocaleString('fr-FR', { style: 'currency', currency: selectedCurrency })}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-red-100">
                                <TrendingDown className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Restant</p>
                                <p className="text-2xl font-bold text-green-600">{remainingBudget.toLocaleString('fr-FR', { style: 'currency', currency: selectedCurrency })}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-green-100">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </Card>
                </div>
                {/* Bouton d'ajout de budget */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Budgets par catégorie</h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Nouveau budget</span>
                    </button>
                </div>

                {/* Liste des budgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budgets.length > 0 ? (
                        budgets.map((budget) => {
                            const percentage = (budget.spent / budget.limit) * 100;
                            const status = getBudgetStatus(budget.spent, budget.limit);

                            return (
                                <Card key={budget.id}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                                        <div className="flex items-center space-x-2">
                                            {status.status !== 'good' && (
                                                <div className={`p-1 rounded-full ${status.bg}`}>
                                                    <AlertTriangle className={`h-4 w-4 ${status.color}`} />
                                                </div>
                                            )}
                                            <button onClick={() => handleDeleteBudget(budget.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Dépensé</span>
                                            <span className={status.color}>{budget.spent.toLocaleString('fr-FR', { style: 'currency', currency: selectedCurrency })}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Budget</span>
                                            <span className="text-gray-900">{budget.limit.toLocaleString('fr-FR', { style: 'currency', currency: selectedCurrency })}</span>
                                        </div>

                                        {/* Barre de progression */}
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full transition-all ${
                                                    percentage >= 100 ? 'bg-red-500' :
                                                        percentage >= 80 ? 'bg-orange-500' : 'bg-green-500'
                                                }`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            />
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className={`font-medium ${status.color}`}>
                                                {percentage.toFixed(1)}% utilisé
                                            </span>
                                            <span className="text-gray-600">
                                                Reste: {(budget.limit - budget.spent).toLocaleString('fr-FR', { style: 'currency', currency: selectedCurrency })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Champ de saisie pour ajouter une dépense */}
                                    <div className="mt-4 flex items-center space-x-2">
                                        <input
                                            type="number"
                                            value={spendingInput[budget.id] || ''}
                                            onChange={(e) => setSpendingInput({ ...spendingInput, [budget.id]: e.target.value })}
                                            className="flex-grow p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ajouter une dépense"
                                        />
                                        <button
                                            onClick={() => handleAddSpending(budget.id)}
                                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                            disabled={!spendingInput[budget.id] || parseFloat(spendingInput[budget.id]) <= 0}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Messages de statut */}
                                    {status.status === 'exceeded' && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                                            <AlertTriangle className="h-5 w-5 text-red-500" />
                                            <p className="text-sm text-red-800 font-medium">
                                                Alerte ! Vous avez dépassé votre budget de {(budget.spent - budget.limit).toLocaleString('fr-FR', { style: 'currency', currency: selectedCurrency })}
                                            </p>
                                        </div>
                                    )}
                                    {status.status === 'warning' && (
                                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center space-x-2">
                                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                                            <p className="text-sm text-orange-800 font-medium">
                                                Attention ! Vous approchez de votre limite budgétaire.
                                            </p>
                                        </div>
                                    )}
                                    {status.status === 'completed' && (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <p className="text-sm text-green-800 font-medium">
                                                Félicitations ! Vous avez atteint votre objectif budgétaire. 🥳
                                            </p>
                                        </div>
                                    )}
                                </Card>
                            );
                        })
                    ) : (
                        <p className="col-span-2 text-center text-gray-500">Aucun budget défini. Créez-en un pour commencer!</p>
                    )}
                </div>

                {/* Section des suggestions */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggestions intelligentes</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">
                                    Basé sur vos dépenses des 3 derniers mois, nous suggérons d'augmenter votre budget Alimentation à {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: selectedCurrency }).format(450)}
                                </span>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Appliquer
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">
                                    Félicitations! Vous économisez 15% sur votre budget Transport ce mois-ci
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Modale d'ajout de budget */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-900">Ajouter un nouveau budget</h3>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleAddBudget} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                                    <input
                                        type="text"
                                        value={newBudget.category}
                                        onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Budget prévu (FCFA)</label>
                                    <input
                                        type="number"
                                        value={newBudget.limit}
                                        onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Ajouter
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Budgets;