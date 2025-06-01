import React, { useState } from 'react';
import { ChevronRight, Clock, Zap, ChevronDown } from 'lucide-react';
import { Exercise } from '../../types';
import Card from '../ui/Card';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return difficulty;
    }
  };

  const getMuscleGroupLabel = (muscleGroup: string) => {
    switch (muscleGroup) {
      case 'chest': return 'Pectoraux';
      case 'back': return 'Dos';
      case 'shoulders': return 'Épaules';
      case 'biceps': return 'Biceps';
      case 'triceps': return 'Triceps';
      case 'legs': return 'Jambes';
      case 'core': return 'Abdominaux';
      case 'cardio': return 'Cardio';
      case 'fullBody': return 'Corps Complet';
      default: return muscleGroup;
    }
  };

  const getEquipmentLabel = (equipment: string) => {
    switch (equipment) {
      case 'none': return 'Aucun';
      case 'dumbbell': return 'Haltères';
      case 'resistanceBand': return 'Bandes élastiques';
      case 'bench': return 'Banc';
      case 'chair': return 'Chaise';
      case 'pullUpBar': return 'Barre de traction';
      case 'yogaMat': return 'Tapis de yoga';
      default: return equipment;
    }
  };

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  return (
    <Card className="h-full" hoverEffect onClick={onClick}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={exercise.imageUrl} 
          alt={exercise.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[exercise.difficulty]}`}>
            {getDifficultyLabel(exercise.difficulty)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-heading font-bold text-xl mb-2">{exercise.name}</h3>
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {exercise.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {exercise.muscleGroup && (
            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
              {getMuscleGroupLabel(exercise.muscleGroup)}
            </span>
          )}
          {exercise.equipment.map((item, index) => (
            <span key={index} className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded-full">
              {getEquipmentLabel(item)}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-sm text-neutral-500">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{exercise.duration}s</span>
          </div>
          <div className="flex items-center">
            <Zap size={16} className="mr-1" />
            <span>{exercise.caloriesBurned} cal/min</span>
          </div>
          
          {onClick && (
            <div 
              className="flex items-center text-primary-500 cursor-pointer hover:text-primary-600 transition-colors"
              onClick={handleDetailsClick}
            >
              <span className="mr-1 font-medium">Détails</span>
              {showDetails ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-neutral-200 animate-fadeIn">
            {exercise.youtubeLink && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Démonstration vidéo</h4>
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${getYouTubeId(exercise.youtubeLink)}`}
                    title={`Démonstration de ${exercise.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <h4 className="font-medium mb-2">Instructions :</h4>
            <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
              {exercise.instructions?.map((step, index) => (
                <li key={index}>{step}</li>
              )) || (
                <li>Aucune instruction disponible pour cet exercice</li>
              )}
            </ul>
            
            {exercise.tips && (
              <>
                <h4 className="font-medium mt-3 mb-2">Conseils :</h4>
                <p className="text-sm text-neutral-600">{exercise.tips}</p>
              </>
            )}

            {exercise.variations && exercise.variations.length > 0 && (
              <>
                <h4 className="font-medium mt-3 mb-2">Variantes :</h4>
                <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
                  {exercise.variations.map((variation, index) => (
                    <li key={index}>{variation}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExerciseCard;