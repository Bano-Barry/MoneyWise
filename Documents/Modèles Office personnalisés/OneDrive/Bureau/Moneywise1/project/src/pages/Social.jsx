import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { TrendingUp, TrendingDown, Eye, Share2, Shield, PieChart, MapPin } from 'lucide-react';

const Social = () => {
  const [selectedProfile, setSelectedProfile] = useState('dakar-professionnel');
  const [budgets, setBudgets] = useState([]);
  const [currency, setCurrency] = useState('FCFA');
  const [totalIncome, setTotalIncome] = useState(0);

  // Charger les données depuis le localStorage au montage
  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgets');
    const savedCurrency = localStorage.getItem('currency');
    const savedTotalBudget = localStorage.getItem('totalBudget');

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }

    if (savedCurrency) {
      setCurrency(savedCurrency);
    }

    if (savedTotalBudget) {
      setTotalIncome(parseFloat(savedTotalBudget) || 0);
    }
  }, []);

  // Obtenir le montant dépensé pour une catégorie spécifique
  const getCategorySpent = (categoryName) => {
    const category = budgets.find(b => b.category === categoryName);
    return category ? category.spent : 0;
  };

  // Calculer le percentile
  const calculatePercentile = (average, userValue) => {
    if (average === 0 || userValue === 0) return 50;
    const ratio = userValue / average;
    let percentile;
    
    if (ratio <= 0.5) percentile = 20 + (ratio / 0.5) * 30;
    else if (ratio <= 1) percentile = 50 + ((ratio - 0.5) / 0.5) * 30;
    else percentile = 80 + (Math.min(ratio - 1, 1) / 1) * 15;
    
    return Math.min(95, Math.max(5, Math.round(percentile)));
  };

  // Calculer les données basées sur les informations utilisateur
  const totalExpenses = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
  const totalSavings = totalIncome - totalExpenses;

  // Données de comparaison adaptées au contexte sénégalais
  const regionalData = {
    'dakar-professionnel': {
      label: 'Professionnel Dakarois',
      location: 'Dakar',
      avgIncome: 450000,
      avgExpenses: 350000, 
      avgSavings: 100000,
      description: 'Cadres et professionnels travaillant à Dakar',
      categories: [
        { name: 'Logement', avg: 150000 },
        { name: 'Alimentation', avg: 80000 },
        { name: 'Transport', avg: 40000 },
        { name: 'Communication', avg: 25000 },
        { name: 'Éducation', avg: 30000 },
        { name: 'Santé', avg: 20000 }
      ]
    },
    'etudiant-dakar': {
      label: 'Étudiant à Dakar',
      location: 'Dakar',
      avgIncome: 150000,
      avgExpenses: 140000,
      avgSavings: 10000,
      description: 'Étudiants universitaires à Dakar',
      categories: [
        { name: 'Logement', avg: 60000 },
        { name: 'Alimentation', avg: 40000 },
        { name: 'Transport', avg: 20000 },
        { name: 'Communication', avg: 15000 },
        { name: 'Éducation', avg: 40000 },
        { name: 'Loisirs', avg: 10000 }
      ]
    },
    'famille-dakar': {
      label: 'Famille à Dakar',
      location: 'Dakar',
      avgIncome: 600000,
      avgExpenses: 520000,
      avgSavings: 80000,
      description: 'Famille moyenne avec enfants à Dakar',
      categories: [
        { name: 'Logement', avg: 180000 },
        { name: 'Alimentation', avg: 150000 },
        { name: 'Transport', avg: 60000 },
        { name: 'Éducation', avg: 80000 },
        { name: 'Santé', avg: 30000 },
        { name: 'Divers', avg: 40000 }
      ]
    }
  };

  // Préparer les données de catégories avec les valeurs utilisateur et percentiles
  const getCurrentData = () => {
    const baseData = regionalData[selectedProfile] || regionalData['dakar-professionnel'];
    
    const categoriesWithUserData = baseData.categories.map(category => {
      const userSpent = getCategorySpent(category.name);
      const percentile = calculatePercentile(category.avg, userSpent);
      
      return {
        ...category,
        user: userSpent,
        percentile: percentile
      };
    });

    return {
      ...baseData,
      categories: categoriesWithUserData
    };
  };

  const currentData = getCurrentData();

  const getPercentileColor = (percentile) => {
    if (percentile >= 80) return 'text-green-600 bg-green-100';
    if (percentile >= 60) return 'text-blue-600 bg-blue-100';
    if (percentile >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPercentileText = (percentile) => {
    if (percentile >= 80) return 'Excellent';
    if (percentile >= 60) return 'Bon';
    if (percentile >= 40) return 'Moyen';
    return 'À améliorer';
  };

  // Calculer les pourcentages de différence
  const incomeDifference = totalIncome > 0 && currentData.avgIncome > 0 ? 
    ((totalIncome - currentData.avgIncome) / currentData.avgIncome) * 100 : 0;
  
  const expensesDifference = currentData.avgExpenses > 0 ? 
    ((totalExpenses - currentData.avgExpenses) / currentData.avgExpenses) * 100 : 0;
  
  const savingsDifference = currentData.avgSavings > 0 ? 
    ((totalSavings - currentData.avgSavings) / currentData.avgSavings) * 100 : 0;

  // Générer des insights personnalisés
  const generateInsights = () => {
    const positiveInsights = [];
    const improvementInsights = [];

    // Insights sur les revenus
    if (incomeDifference > 15) {
      positiveInsights.push(`Vos revenus sont ${Math.abs(incomeDifference).toFixed(1)}% supérieurs à la moyenne des ${currentData.label.toLowerCase()}`);
    } else if (incomeDifference < -15) {
      improvementInsights.push(`Vos revenus sont ${Math.abs(incomeDifference).toFixed(1)}% inférieurs à la moyenne des ${currentData.label.toLowerCase()}`);
    }

    // Insights sur l'épargne
    if (savingsDifference > 30) {
      positiveInsights.push(`Votre épargne est ${Math.abs(savingsDifference).toFixed(1)}% supérieure à la moyenne - excellent travail!`);
    } else if (savingsDifference < -30) {
      improvementInsights.push(`Votre épargne est ${Math.abs(savingsDifference).toFixed(1)}% inférieure à la moyenne - essayez d'épargner davantage`);
    }

    // Insights sur les catégories
    if (currentData.categories && currentData.categories.forEach) {
      currentData.categories.forEach(category => {
        if (category.percentile >= 80 && category.user > 0) {
          positiveInsights.push(`Vous gérez bien vos dépenses ${category.name.toLowerCase()} (mieux que ${category.percentile}% des ${currentData.label.toLowerCase()})`);
        } else if (category.percentile <= 30 && category.user > 0) {
          improvementInsights.push(`Vos dépenses ${category.name.toLowerCase()} sont élevées (seulement ${category.percentile}% des ${currentData.label.toLowerCase()} dépensent plus)`);
        }
      });
    }

    // Insights par défaut si pas assez d'analyses
    if (positiveInsights.length === 0) {
      positiveInsights.push("Votre situation financière est stable et équilibrée");
    }

    if (improvementInsights.length === 0) {
      improvementInsights.push("Quelques ajustements pourraient optimiser davantage vos finances");
    }

    return { positiveInsights, improvementInsights };
  };

  const { positiveInsights, improvementInsights } = generateInsights();

  // Fonction pour partager le rapport (simulée)
  const handleShareReport = () => {
    alert(`Génération d'un rapport comparatif anonyme...`);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-900">Confidentialité et anonymat</h3>
            <p className="text-sm text-blue-800 mt-1">
              Toutes les comparaisons sont entièrement anonymes. Vos données personnelles ne sont jamais partagées. 
              Les moyennes sont calculées sur des données agrégées et anonymisées.
            </p>
          </div>
        </div>
      </Card>

      {/* Profile Selection */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Profil de comparaison</h3>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Mode anonyme actif</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choisissez un profil de comparaison:
          </label>
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="dakar-professionnel">Professionnel Dakarois</option>
            <option value="etudiant-dakar">Étudiant à Dakar</option>
            <option value="famille-dakar">Famille à Dakar</option>
          </select>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{currentData.location} • {currentData.description}</span>
        </div>
      </Card>

      {/* Overall Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Revenus mensuels</p>
            <div className="space-y-1">
              <p className="text-xl font-bold text-green-600">{totalIncome.toLocaleString()} {currency}</p>
              <p className="text-sm text-gray-500">Vous</p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-lg font-semibold text-gray-700">{currentData.avgIncome.toLocaleString()} {currency}</p>
              <p className="text-sm text-gray-500">Moyenne du profil</p>
            </div>
            <div className="mt-2 flex items-center justify-center space-x-1">
              {incomeDifference >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${incomeDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {incomeDifference >= 0 ? '+' : ''}{incomeDifference.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Dépenses mensuelles</p>
            <div className="space-y-1">
              <p className="text-xl font-bold text-red-600">{totalExpenses.toLocaleString()} {currency}</p>
              <p className="text-sm text-gray-500">Vous</p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-lg font-semibold text-gray-700">{currentData.avgExpenses.toLocaleString()} {currency}</p>
              <p className="text-sm text-gray-500">Moyenne du profil</p>
            </div>
            <div className="mt-2 flex items-center justify-center space-x-1">
              {expensesDifference <= 0 ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${expensesDifference <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {expensesDifference <= 0 ? '' : '+'}{expensesDifference.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Épargne mensuelle</p>
            <div className="space-y-1">
              <p className="text-xl font-bold text-blue-600">{totalSavings.toLocaleString()} {currency}</p>
              <p className="text-sm text-gray-500">Vous</p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-lg font-semibold text-gray-700">{currentData.avgSavings.toLocaleString()} {currency}</p>
              <p className="text-sm text-gray-500">Moyenne du profil</p>
            </div>
            <div className="mt-2 flex items-center justify-center space-x-1">
              {savingsDifference >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${savingsDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {savingsDifference >= 0 ? '+' : ''}{savingsDifference.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Comparaison par catégorie</h3>
        {currentData.categories && currentData.categories.length > 0 ? (
          <div className="space-y-4">
            {currentData.categories.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPercentileColor(category.percentile)}`}>
                    {getPercentileText(category.percentile)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Vos dépenses</p>
                    <p className="font-semibold text-gray-900">{category.user.toLocaleString()} {currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Moyenne du profil</p>
                    <p className="font-semibold text-gray-700">{category.avg.toLocaleString()} {currency}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Vous dépensez {category.percentile < 50 ? 'moins' : 'plus'} que {category.percentile}% du profil</span>
                    <span>{category.percentile}e percentile</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${category.percentile >= 80 ? 'bg-green-500' : 
                        category.percentile >= 60 ? 'bg-blue-500' : 
                        category.percentile >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${category.percentile}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune donnée de catégorie à comparer</p>
            <p className="text-sm text-gray-400 mt-1">Créez des budgets pour voir les comparaisons</p>
          </div>
        )}
      </Card>

      {/* Insights and Tips */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyses comparatives</h3>
        <div className="space-y-4">
          {positiveInsights.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">✅ Points positifs</h4>
              <ul className="text-sm text-green-800 space-y-1">
                {positiveInsights.map((insight, index) => (
                  <li key={index}>• {insight}</li>
                ))}
              </ul>
            </div>
          )}
          
          {improvementInsights.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Conseils d'amélioration</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {improvementInsights.map((insight, index) => (
                  <li key={index}>• {insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Sharing Options */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Partage sécurisé</h3>
            <p className="text-sm text-gray-600 mt-1">
              Générez un rapport anonymisé à partager avec votre conseiller financier
            </p>
          </div>
          <button 
            onClick={handleShareReport}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Générer rapport</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Social;