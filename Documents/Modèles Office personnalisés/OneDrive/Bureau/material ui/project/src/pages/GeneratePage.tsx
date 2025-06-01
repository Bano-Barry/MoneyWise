import React from 'react';
import WorkoutGenerator from '../components/workout/WorkoutGenerator';

const GeneratePage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="font-heading font-bold text-4xl mb-4">Générer Votre Programme</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Répondez à quelques questions et nous créerons un programme d'entraînement personnalisé qui correspond à vos objectifs et votre équipement.
          </p>
        </div>
        
        <WorkoutGenerator />
      </div>
    </div>
  );
};

export default GeneratePage;