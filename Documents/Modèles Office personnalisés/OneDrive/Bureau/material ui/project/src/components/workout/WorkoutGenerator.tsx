import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Dumbbell, RotateCcw, Save, List, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Equipment, FormState, MuscleGroup, WeightGoal, Difficulty, WorkoutProgram, convertToEmbedUrl, Exercise } from '../../types/index';
import { exercises, getExercisesByDifficulty, getExercisesByEquipment, getExercisesByGoal } from '../../data/exercises';

const MUSCLE_GROUP_DEFAULT_EXERCISES: Record<MuscleGroup, Exercise> = {
  chest: {
    id: 'default-chest',
    name: 'Développé couché',
    description: 'Exercice de base pour développer les pectoraux. Allongez-vous sur un banc, poussez la barre vers le haut en contrôlant le mouvement.',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink: 'https://www.youtube.com/watch?v=c7JisdFieeI',
    instructions: ['Position de départ allongé', 'Descendre la barre au niveau de la poitrine', 'Pousser vers le haut'],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    duration: 180,
    caloriesBurned: 100,
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  back: {
    id: 'default-back',
    name: 'Tractions',
    description: 'Exercice complet pour le dos. Suspendez-vous à une barre et tirez votre corps vers le haut.',
    muscleGroup: 'back',
    difficulty: 'intermediate',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink: 'https://www.youtube.com/watch?v=dH0Ef2hZ_p4',
    instructions: ['Saisir la barre en pronation', 'Tirer jusqu\'à ce que le menton dépasse la barre', 'Redescendre lentement'],
    imageUrl: '/trac.jpg',
    duration: 120,
    caloriesBurned: 80,
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  shoulders: {
    id: 'default-shoulders',
    name: 'Développé militaire',
    description: 'Exercice pour développer les épaules. Debout ou assis, poussez la barre au-dessus de la tête.',
    muscleGroup: 'shoulders',
    difficulty: 'intermediate',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink:  'https://www.youtube.com/watch?v=1noV0QbxgIU',
    instructions: ['Saisir les haltères', 'Pousser vers le haut jusqu\'à extension complète', 'Redescendre lentement'],
    imageUrl: '/pompe.jpg',
    duration: 150,
    caloriesBurned: 90,
    weightGoal:  ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  biceps: {
    id: 'default-biceps',
    name: 'Curl haltères',
    description: 'Exercice d\'isolation pour les biceps. Fléchissez les bras en contrôlant le mouvement.',
    muscleGroup: 'biceps',
    difficulty: 'beginner',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink:  'https://www.youtube.com/watch?v=PHTe-6kQAW0',
    instructions: ['Bras le long du corps', 'Remonter les haltères en fléchissant les coudes', 'Redescendre lentement'],
    imageUrl:  '/pompe.jpg',
    duration: 120,
    caloriesBurned: 70,
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  triceps: {
    id: 'default-triceps',
    name: 'Dips',
    description: 'Exercice efficace pour les triceps. Utilisez des barres parallèles pour descendre et remonter votre corps.',
    muscleGroup: 'triceps',
    difficulty: 'intermediate',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink:  'https://www.youtube.com/watch?v=D2hidaJTg2U',
    instructions: ['Position de départ bras tendus', 'Descendre jusqu\'à 90° de flexion', 'Remonter à la position initiale'],
    imageUrl:  '/pompe.jpg',
    duration: 150,
    caloriesBurned: 85,
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  legs: {
    id: 'default-legs',
    name: 'Squats',
    description: 'Exercice complet pour les jambes. Fléchissez les genoux en gardant le dos droit.',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink:  'https://www.youtube.com/watch?v=dxIG3unEY6Q',    
    instructions: ['Pieds écartés largeur épaules', 'Descendre comme pour s\'asseoir', 'Remonter en poussant sur les talons'],
    imageUrl: '/squads.avif',
    duration: 180,
    caloriesBurned: 120,
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  core: {
    id: 'default-core',
    name: 'Gainage',
    description: 'Exercice isométrique pour renforcer la sangle abdominale.',
    muscleGroup: 'core',
    difficulty: 'beginner',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink:'https://www.youtube.com/watch?v=wfxm7Sufd4Y',            
    instructions: ['Position de planche sur les avant-bras', 'Maintenir le corps aligné', 'Rester gainé'],
    imageUrl: '/crunch.avif',
    duration: 60,
    caloriesBurned: 50,
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  abs: {
    id: 'default-abs',
    name: 'Crunch',
    description: 'Exercice classique pour les abdominaux. Relevez le buste en contractant les abdos.',
    muscleGroup: 'abs',
    difficulty: 'beginner',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink: 'https://www.youtube.com/watch?v=wX8eSe1SZks',
    instructions: ['Allongé sur le dos', 'Relever le buste en contractant les abdos', 'Redescendre lentement'],
    imageUrl: '/crunch.avif',
    duration: 90,
    caloriesBurned: 60,
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  cardio: {
    id: 'default-cardio',
    name: 'Corde à sauter',
    description: 'Exercice cardiovasculaire efficace. Sautez à un rythme régulier.',
    muscleGroup: 'cardio',
    difficulty: 'beginner',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink: 'https://www.youtube.com/watch?v=WtR-BepQpbU', 
    instructions: ['Sauter à un rythme régulier', 'Maintenir une bonne posture', 'Varier les styles de saut'],
    imageUrl: 'cardio.avif',
    duration: 300,
    caloriesBurned: 200,
    weightGoal:  ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  fullBody: {
    id: 'default-fullBody',
    name: 'Burpees',
    description: 'Exercice complet sollicitant tout le corps. Combinaison de squat, planche et saut.',
    muscleGroup: 'fullBody',
    difficulty: 'intermediate',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink:  'https://www.youtube.com/watch?v=rARlcT2xneg' ,
    instructions: ['Position debout', 'Descendre en planche', 'Faire une pompe', 'Remonter en sautant'],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    duration: 180,
    caloriesBurned: 150,
    weightGoal:  ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  glutes: {
    id: 'default-glutes',
    name: 'Hip Thrust',
    description: 'Exercice ciblé pour les fessiers. Poussez le bassin vers le haut en contractant les fessiers.',
    muscleGroup: 'glutes',
    difficulty: 'beginner',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink: 'https://www.youtube.com/watch?v=xhQinUkq8K8',
    instructions: ['Dos appuyé sur un banc', 'Pousser le bassin vers le haut', 'Contracter les fessiers au sommet'],
    imageUrl: '/squads.avif',
    duration: 150,
    caloriesBurned: 90,
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  calves: {
    id: 'default-calves',
    name: 'Mollets sur marche',
    description: 'Exercice d\'isolation pour les mollets. Montez sur la pointe des pieds en contrôlant le mouvement.',
    muscleGroup: 'calves',
    difficulty: 'beginner',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink: 'https://www.youtube.com/watch?v=pO9cnCE-s_g',  
    instructions: ['Pieds sur une marche', 'Descendre les talons', 'Remonter sur la pointe des pieds'],
    imageUrl: '/mol.avif',
    duration: 120,
    caloriesBurned: 60,
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  hips: {
    id: 'default-hips',
    name: 'Fire Hydrant',
    description: 'Exercice pour les hanches et fessiers. À quatre pattes, levez la jambe sur le côté.',
    muscleGroup: 'hips',
    difficulty: 'beginner',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink: 'https://www.youtube.com/watch?v=mkIb3sArvMo',
    instructions: ['Position à quatre pattes', 'Lever la jambe sur le côté', 'Contrôler le mouvement'],
    imageUrl: '/mol.avif',
    duration: 90,
    caloriesBurned: 50,
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  },
  belly: {
    id: 'default-belly',
    name: 'V-Ups',
    description: 'Exercice avancé pour la ceinture abdominale. Formez un V avec votre corps.',
    muscleGroup: 'belly',
    difficulty: 'advanced',
    equipment: ['bench', 'dumbbell','pullUpBar','none','bench'],
    youtubeLink:'https://www.youtube.com/watch?v=my7J_4XBPHw', 
    instructions: ['Allongé sur le dos', 'Relever simultanément buste et jambes', 'Toucher les pieds'],
    imageUrl: '/crunch.avif',
    duration: 120,
    caloriesBurned: 80,
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance']
  }
};

const WorkoutGenerator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<FormState>({
    weightGoal: 'weightLoss',
    difficulty: 'beginner',
    duration: 30,
    equipment: ['none'],
    targetMuscleGroups: [],
  });
  
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutProgram | null>(null);
  const [savedPrograms, setSavedPrograms] = useState<WorkoutProgram[]>([]);
  const [showSavedPrograms, setShowSavedPrograms] = useState(false);
  
  const handleChangeGoal = (goal: WeightGoal) => {
    setFormState(prev => ({ ...prev, weightGoal: goal }));
  };
  
  const handleChangeDifficulty = (difficulty: Difficulty) => {
    setFormState(prev => ({ ...prev, difficulty }));
  };
  
  const handleChangeDuration = (duration: number) => {
    setFormState(prev => ({ ...prev, duration }));
  };
  
  const handleChangeEquipment = (equipment: Equipment) => {
    setFormState(prev => {
      if (equipment === 'none') {
        return { ...prev, equipment: ['none'] };
      }
      
      const newEquipment = prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment.filter(e => e !== 'none'), equipment];
      
      return { ...prev, equipment: newEquipment.length === 0 ? ['none'] : newEquipment };
    });
  };
  
  const handleChangeMuscleGroup = (muscleGroup: MuscleGroup) => {
    setFormState(prev => {
      const newGroups = prev.targetMuscleGroups.includes(muscleGroup)
        ? prev.targetMuscleGroups.filter(g => g !== muscleGroup)
        : [...prev.targetMuscleGroups, muscleGroup];
      
      return { ...prev, targetMuscleGroups: newGroups };
    });
  };
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const resetForm = () => {
    setFormState({
      weightGoal: 'weightLoss',
      difficulty: 'beginner',
      duration: 30,
      equipment: ['none'],
      targetMuscleGroups: [],
    });
    setGeneratedWorkout(null);
    setStep(1);
  };
  
  const generateWorkout = () => {
    if (formState.targetMuscleGroups.length > 0) {
      const selectedExercises = formState.targetMuscleGroups.map(muscleGroup => 
        MUSCLE_GROUP_DEFAULT_EXERCISES[muscleGroup]
      );
      
      const totalCalories = selectedExercises.reduce((total, ex) => 
        total + (ex.caloriesBurned * (formState.duration / selectedExercises.length / 60)), 0
      );
      
      const workout: WorkoutProgram = {
        id: `workout-${Date.now()}`,
        name: `Programme ${formState.targetMuscleGroups.join(', ')} ${formState.duration}min`,
        description: `Programme ciblant ${formState.targetMuscleGroups.length} groupes musculaires`,
        difficulty: formState.difficulty,
        duration: formState.duration,
        exercises: selectedExercises.map(ex => ({
          exercise: ex,
          sets: formState.weightGoal === 'muscleGain' ? 4 : 3,
          reps: formState.weightGoal === 'weightLoss' ? 15 : formState.weightGoal === 'muscleGain' ? 10 : 12,
          restTime: formState.weightGoal === 'weightLoss' ? 30 : formState.weightGoal === 'muscleGain' ? 60 : 45,
        })),
        weightGoal: formState.weightGoal,
        caloriesBurned: Math.round(totalCalories),
      };
      
      setGeneratedWorkout(workout);
      nextStep();
      return;
    }
    
    let filteredExercises = [...exercises];
    
    filteredExercises = getExercisesByGoal(formState.weightGoal);
    filteredExercises = getExercisesByDifficulty(formState.difficulty).filter(ex => 
      filteredExercises.some(e => e.id === ex.id)
    );
    
    filteredExercises = getExercisesByEquipment(formState.equipment).filter(ex => 
      filteredExercises.some(e => e.id === ex.id)
    );
    
    const shuffled = [...filteredExercises].sort(() => 0.5 - Math.random());
    const numExercises = formState.duration <= 20 ? 4 : formState.duration <= 40 ? 5 : 6;
    const selectedExercises = shuffled.slice(0, Math.min(numExercises, shuffled.length));
    
    const totalCalories = selectedExercises.reduce((total, ex) => 
      total + (ex.caloriesBurned * (formState.duration / 60)), 0
    );
    
    const workout: WorkoutProgram = {
      id: `workout-${Date.now()}`,
      name: `Programme ${formState.duration} minutes`,
      description: `Programme complet de ${formState.duration} minutes`,
      difficulty: formState.difficulty,
      duration: formState.duration,
      exercises: selectedExercises.map(ex => ({
        exercise: ex,
        sets: formState.weightGoal === 'muscleGain' ? 4 : 3,
        reps: formState.weightGoal === 'weightLoss' ? 15 : formState.weightGoal === 'muscleGain' ? 10 : 12,
        restTime: formState.weightGoal === 'weightLoss' ? 30 : formState.weightGoal === 'muscleGain' ? 60 : 45,
      })),
      weightGoal: formState.weightGoal,
      caloriesBurned: Math.round(totalCalories),
    };
    
    setGeneratedWorkout(workout);
    nextStep();
  };
  
  const saveWorkout = () => {
    if (generatedWorkout) {
      setSavedPrograms(prev => [...prev, generatedWorkout]);
      setGeneratedWorkout(null);
      setShowSavedPrograms(true);
    }
  };
  
  const deleteProgram = (id: string) => {
    setSavedPrograms(prev => prev.filter(program => program.id !== id));
  };
  
  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div 
          key={s}
          className={`w-3 h-3 rounded-full mx-1 ${
            s === step ? 'bg-primary-500' : 
            s < step ? 'bg-primary-300' : 'bg-neutral-300'
          }`}
        />
      ))}
    </div>
  );
  
  const renderStep1 = () => (
    <>
      <h3 className="font-heading font-bold text-2xl mb-6 text-center">Quel est votre objectif ?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { value: 'weightLoss', label: 'Perte de Poids', description: 'Brûler des calories et réduire la masse graisseuse' },
          { value: 'muscleGain', label: 'Prise de Masse', description: 'Développer la force et augmenter la masse musculaire' },
          { value: 'toning', label: 'Tonification', description: 'Définir les muscles sans prise de masse' },
          { value: 'maintenance', label: 'Maintien', description: 'Maintenir votre niveau de forme actuel' },
        ].map((goal) => (
          <div
            key={goal.value}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-colors ${
              formState.weightGoal === goal.value 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-neutral-200 hover:border-primary-200'
            }`}
            onClick={() => handleChangeGoal(goal.value as WeightGoal)}
          >
            <h4 className="font-heading font-semibold text-lg mb-1">{goal.label}</h4>
            <p className="text-neutral-600 text-sm">{goal.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button 
          onClick={nextStep}
          rightIcon={<ArrowRight size={16} />}
        >
          Suivant
        </Button>
      </div>
    </>
  );
  
  const renderStep2 = () => (
    <>
      <h3 className="font-heading font-bold text-2xl mb-6 text-center">Choisissez votre niveau</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { value: 'beginner', label: 'Débutant', description: 'Nouveau dans le fitness ou reprise après une pause' },
          { value: 'intermediate', label: 'Intermédiaire', description: 'Pratique régulière cherchant plus de défis' },
          { value: 'advanced', label: 'Avancé', description: 'Expérimenté avec des entraînements intensifs' },
        ].map((level) => (
          <div
            key={level.value}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-colors ${
              formState.difficulty === level.value 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-neutral-200 hover:border-primary-200'
            }`}
            onClick={() => handleChangeDifficulty(level.value as Difficulty)}
          >
            <h4 className="font-heading font-semibold text-lg mb-1">{level.label}</h4>
            <p className="text-neutral-600 text-sm">{level.description}</p>
          </div>
        ))}
      </div>
      
      <h3 className="font-heading font-bold text-2xl mb-6 text-center">Durée de l'Entraînement</h3>
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-neutral-500">15 min</span>
          <span className="text-sm font-medium">{formState.duration} min</span>
          <span className="text-sm text-neutral-500">60 min</span>
        </div>
        <input
          type="range"
          min="15"
          max="60"
          step="5"
          value={formState.duration}
          onChange={(e) => handleChangeDuration(parseInt(e.target.value))}
          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={prevStep}
        >
          Retour
        </Button>
        <Button 
          onClick={nextStep}
          rightIcon={<ArrowRight size={16} />}
        >
          Suivant
        </Button>
      </div>
    </>
  );
  
  const renderStep3 = () => (
    <>
      <h3 className="font-heading font-bold text-2xl mb-6 text-center">Équipement Disponible</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { value: 'none', label: 'Sans Équipement' },
          { value: 'dumbbell', label: 'Haltères' },
          { value: 'resistanceBand', label: 'Élastiques' },
          { value: 'bench', label: 'Banc' },
          { value: 'chair', label: 'Chaise' },
          { value: 'pullUpBar', label: 'Barre de Traction' },
          { value: 'yogaMat', label: 'Tapis de Yoga' },
        ].map((item) => (
          <div
            key={item.value}
            className={`p-3 border-2 rounded-xl cursor-pointer transition-colors text-center ${
              formState.equipment.includes(item.value as Equipment)
                ? 'border-primary-500 bg-primary-50' 
                : 'border-neutral-200 hover:border-primary-200'
            }`}
            onClick={() => handleChangeEquipment(item.value as Equipment)}
          >
            <p className="text-sm font-medium">{item.label}</p>
          </div>
        ))}
      </div>
      
      <h3 className="font-heading font-bold text-2xl mb-6 text-center">Groupes Musculaires Ciblés</h3>
      <p className="text-neutral-500 text-sm mb-4 text-center">Optionnel : Sélectionnez les groupes musculaires à cibler</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {[
          { value: 'chest', label: 'Pectoraux' },
          { value: 'back', label: 'Dos' },
          { value: 'shoulders', label: 'Épaules' },
          { value: 'biceps', label: 'Biceps' },
          { value: 'triceps', label: 'Triceps' },
          { value: 'legs', label: 'Jambes' },
          { value: 'core', label: 'Abdominaux' },
          { value: 'cardio', label: 'Cardio' },
          { value: 'fullBody', label: 'Corps Complet' },
          { value: 'glutes', label: 'Fessiers' },
          { value: 'calves', label: 'Mollets' },
          { value: 'hips', label: 'Hanches' },
        ].map((group) => (
          <div
            key={group.value}
            className={`p-3 border-2 rounded-xl cursor-pointer transition-colors text-center ${
              formState.targetMuscleGroups.includes(group.value as MuscleGroup)
                ? 'border-primary-500 bg-primary-50' 
                : 'border-neutral-200 hover:border-primary-200'
            }`}
            onClick={() => handleChangeMuscleGroup(group.value as MuscleGroup)}
          >
            <p className="text-sm font-medium">{group.label}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={prevStep}
        >
          Retour
        </Button>
        <Button 
          onClick={generateWorkout}
          rightIcon={<Dumbbell size={16} />}
        >
          Générer le Programme
        </Button>
      </div>
    </>
  );
  
  const renderStep4 = () => {
    if (!generatedWorkout) return null;
    
    return (
      <>
        <div className="text-center mb-6">
          <h2 className="font-heading font-bold text-3xl mb-2 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            Votre Programme d'Entraînement
          </h2>
          <p className="text-neutral-600">
            {generatedWorkout.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <p className="text-neutral-500 text-sm mb-1">Durée</p>
            <p className="font-semibold text-xl">{generatedWorkout.duration} minutes</p>
          </div>
          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <p className="text-neutral-500 text-sm mb-1">Niveau</p>
            <p className="font-semibold text-xl capitalize">
              {generatedWorkout.difficulty === 'beginner' ? 'Débutant' :
               generatedWorkout.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
            </p>
          </div>
          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <p className="text-neutral-500 text-sm mb-1">Calories</p>
            <p className="font-semibold text-xl">~{generatedWorkout.caloriesBurned} cal</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="font-heading font-semibold text-xl mb-4">Exercices</h3>
          <div className="space-y-4">
            {generatedWorkout.exercises.map((programExercise, index) => (
              <div key={programExercise.exercise.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={programExercise.exercise.imageUrl} 
                      alt={programExercise.exercise.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{index + 1}. {programExercise.exercise.name}</h4>
                    <p className="text-sm text-neutral-600 line-clamp-1">{programExercise.exercise.description}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-3 text-sm">
                  <div>
                    <span className="font-medium">{programExercise.sets} séries</span>
                    <span className="text-neutral-500"> × </span>
                    <span className="font-medium">{programExercise.reps} répétitions</span>
                  </div>
                  <div className="text-neutral-500">
                    {programExercise.restTime}s de repos entre les séries
                  </div>
                </div>
                
                {programExercise.exercise.youtubeLink && (
                  <div className="mt-4 aspect-w-16 aspect-h-9">
                    <iframe
                      width="100%"
                      height="200"
                      src={convertToEmbedUrl(programExercise.exercise.youtubeLink)}
                      title={`Tutoriel ${programExercise.exercise.name}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            leftIcon={<RotateCcw size={16} />}
            onClick={resetForm}
          >
            Créer un Nouveau Programme
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              leftIcon={<List size={16} />}
              onClick={() => setShowSavedPrograms(true)}
            >
              Voir mes programmes ({savedPrograms.length})
            </Button>
            <Button
              leftIcon={<Save size={16} />}
              onClick={saveWorkout}
            >
              Sauvegarder le Programme
            </Button>
          </div>
        </div>
      </>
    );
  };

  const renderSavedPrograms = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading font-bold text-2xl">Mes Programmes Sauvegardés</h2>
        <Button 
          variant="outline"
          onClick={() => setShowSavedPrograms(false)}
        >
          Retour
        </Button>
      </div>
      
      {savedPrograms.length > 0 ? (
        <div className="space-y-4">
          {savedPrograms.map((program) => (
            <div key={program.id} className="border rounded-lg p-4 relative">
              <button 
                onClick={() => deleteProgram(program.id)}
                className="absolute top-2 right-2 text-neutral-400 hover:text-red-500"
              >
                <X size={18} />
              </button>
              
              <h3 className="font-heading font-semibold text-lg mb-2">{program.name}</h3>
              <p className="text-neutral-600 mb-3">{program.description}</p>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-neutral-50 p-2 rounded text-center">
                  <p className="text-sm text-neutral-500">Durée</p>
                  <p className="font-medium">{program.duration} min</p>
                </div>
                <div className="bg-neutral-50 p-2 rounded text-center">
                  <p className="text-sm text-neutral-500">Exercices</p>
                  <p className="font-medium">{program.exercises.length}</p>
                </div>
                <div className="bg-neutral-50 p-2 rounded text-center">
                  <p className="text-sm text-neutral-500">Calories</p>
                  <p className="font-medium">~{program.caloriesBurned} cal</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setGeneratedWorkout(program);
                  setShowSavedPrograms(false);
                  setStep(4);
                }}
              >
                Voir le programme
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-neutral-500 mb-4">Vous n'avez aucun programme sauvegardé</p>
          <Button onClick={() => setShowSavedPrograms(false)}>
            Créer un programme
          </Button>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="bg-neutral-50 p-6 rounded-2xl shadow-sm max-w-3xl mx-auto">
      {renderStepIndicator()}
      
      {showSavedPrograms ? (
        renderSavedPrograms()
      ) : (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </motion.div>
      )}
    </div>
  );
};

export default WorkoutGenerator;