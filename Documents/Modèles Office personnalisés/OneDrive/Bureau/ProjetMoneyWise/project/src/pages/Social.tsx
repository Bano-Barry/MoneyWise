import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Users, TrendingUp, TrendingDown, Eye, Share2, Shield } from 'lucide-react';

const Social: React.FC = () => {
  const [showComparison, setShowComparison] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState('young-professional');

  const regionalData = {
    'young-professional': {
      label: 'Jeunes professionnels (25-35 ans)',
      location: 'Région Parisienne',
      avgIncome: 3200,
      avgExpenses: 2800,
      avgSavings: 400,
      categories: [
        { name: 'Logement', avg: 1100, user: 1200, percentile: 45 },
        { name: 'Alimentation', avg: 350, user: 285, percentile: 75 },
        { name: 'Transport', avg: 180, user: 165, percentile: 65 },
        { name: 'Divertissement', avg: 120, user: 96, percentile: 80 },
        { name: 'Santé', avg: 60, user: 45, percentile: 85 },
      ]
    }
  };

  const currentData = regionalData[selectedProfile as keyof typeof regionalData];

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return 'text-green-600 bg-green-100';
    if (percentile >= 60) return 'text-blue-600 bg-blue-100';
    if (percentile >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPercentileText = (percentile: number) => {
    if (percentile >= 80) return 'Excellent';
    if (percentile >= 60) return 'Bon';
    if (percentile >= 40) return 'Moyen';
    return 'À améliorer';
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
        <select
          value={selectedProfile}
          onChange={(e) => setSelectedProfile(e.target.value)}
          className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="young-professional">Jeunes professionnels (25-35 ans) - Paris</option>
          <option value="family">Familles (35-45 ans) - Région Parisienne</option>
          <option value="senior">Seniors (45+ ans) - Province</option>
        </select>
      </Card>

      {/* Overall Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Revenus mensuels</p>
            <div className="space-y-1">
              <p className="text-xl font-bold text-green-600">€4,300</p>
              <p className="text-sm text-gray-500">Vous</p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-lg font-semibold text-gray-700">€{currentData.avgIncome.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Moyenne du profil</p>
            </div>
            <div className="mt-2 flex items-center justify-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                +{(((4300 - currentData.avgIncome) / currentData.avgIncome) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Dépenses mensuelles</p>
            <div className="space-y-1">
              <p className="text-xl font-bold text-red-600">€2,750</p>
              <p className="text-sm text-gray-500">Vous</p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-lg font-semibold text-gray-700">€{currentData.avgExpenses.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Moyenne du profil</p>
            </div>
            <div className="mt-2 flex items-center justify-center space-x-1">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                {(((2750 - currentData.avgExpenses) / currentData.avgExpenses) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Épargne mensuelle</p>
            <div className="space-y-1">
              <p className="text-xl font-bold text-blue-600">€1,550</p>
              <p className="text-sm text-gray-500">Vous</p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-lg font-semibold text-gray-700">€{currentData.avgSavings}</p>
              <p className="text-sm text-gray-500">Moyenne du profil</p>
            </div>
            <div className="mt-2 flex items-center justify-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                +{(((1550 - currentData.avgSavings) / currentData.avgSavings) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Comparaison par catégorie</h3>
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
                  <p className="font-semibold text-gray-900">€{category.user}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Moyenne du profil</p>
                  <p className="font-semibold text-gray-700">€{category.avg}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Vous économisez plus que {category.percentile}% du profil</span>
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
      </Card>

      {/* Insights and Tips */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyses comparatives</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">🎉 Vous excellez dans ces domaines</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Vos dépenses d'alimentation sont 18% inférieures à la moyenne</li>
              <li>• Votre épargne est 288% supérieure à la moyenne du profil</li>
              <li>• Vous dépensez moins en santé que 85% des personnes de votre profil</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Opportunités d'optimisation</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Vos frais de logement représentent 28% de vos revenus (moyenne: 34%)</li>
              <li>• Vous pourriez réinvestir une partie de vos économies en divertissement</li>
            </ul>
          </div>
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
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Share2 className="h-4 w-4" />
            <span>Générer rapport</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Social;