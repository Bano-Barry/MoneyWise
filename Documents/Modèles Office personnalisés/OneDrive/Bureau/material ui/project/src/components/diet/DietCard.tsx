import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Utensils, Info } from 'lucide-react';
import Card from '../ui/Card';

interface DietCardProps {
  dietTip: {
    id: string;
    title: string;
    description: string;
    category: string;
    weightGoal: string[];
    imageUrl: string;
    details: {
      calories: number;
      preparationTime: number;
      keyNutrients: string[];
      tips: string[];
    };
  };
}

const DietCard: React.FC<DietCardProps> = ({ dietTip }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getGoalConfig = (goal: string) => {
    switch(goal) {
      case 'weightLoss': 
        return { label: 'Perte de poids', color: 'bg-red-100 text-red-800' };
      case 'muscleGain': 
        return { label: 'Prise de masse', color: 'bg-blue-100 text-blue-800' };
      case 'maintenance': 
        return { label: 'Maintien', color: 'bg-green-100 text-green-800' };
      default: 
        return { label: goal, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getCategoryConfig = (category: string) => {
    switch(category) {
      case 'breakfast': 
        return { label: 'Petit-déjeuner', color: 'bg-orange-100 text-orange-800' };
      case 'lunch': 
        return { label: 'Déjeuner', color: 'bg-emerald-100 text-emerald-800' };
      case 'dinner': 
        return { label: 'Dîner', color: 'bg-indigo-100 text-indigo-800' };
      case 'snack': 
        return { label: 'Collation', color: 'bg-yellow-100 text-yellow-800' };
      default: 
        return { label: category, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={dietTip.imageUrl} 
          alt={dietTip.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-full ${
          getCategoryConfig(dietTip.category).color
        }`}>
          {getCategoryConfig(dietTip.category).label}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{dietTip.title}</h3>
        <p className="text-gray-600 mb-4">{dietTip.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {dietTip.weightGoal.map(goal => {
            const config = getGoalConfig(goal);
            return (
              <span key={goal} className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
                {config.label}
              </span>
            );
          })}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between py-2 text-blue-600 hover:text-blue-800"
        >
          <span className="font-medium flex items-center">
            <Info size={16} className="mr-1" />
            {showDetails ? 'Masquer les détails' : 'Voir les détails'}
          </span>
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                <Zap size={16} className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Valeurs nutritionnelles</h4>
                <p className="text-sm text-gray-600">
                  {dietTip.details.calories} kcal • {dietTip.details.preparationTime} min
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {dietTip.details.keyNutrients.map((nutrient, i) => (
                    <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {nutrient}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                <Utensils size={16} className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Conseils de préparation</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  {dietTip.details.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DietCard;