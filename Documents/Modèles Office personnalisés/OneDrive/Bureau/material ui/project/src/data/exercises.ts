import { Exercise, MuscleGroup, Difficulty, Equipment, WeightGoal } from '../types';

const youtubeVideos = {
  chest: 'https://www.youtube.com/watch?v=c7JisdFieeI',
  core: 'https://www.youtube.com/watch?v=wfxm7Sufd4Y',
  abs: 'https://www.youtube.com/watch?v=wX8eSe1SZks',
  back: 'https://www.youtube.com/watch?v=dH0Ef2hZ_p4',
  shoulders: 'https://www.youtube.com/watch?v=1noV0QbxgIU',
  biceps: 'https://www.youtube.com/watch?v=PHTe-6kQAW0',
  triceps: 'https://www.youtube.com/watch?v=D2hidaJTg2U',
  calves: 'https://www.youtube.com/watch?v=pO9cnCE-s_g',
  legs: 'https://www.youtube.com/watch?v=dxIG3unEY6Q',
  belly: 'https://www.youtube.com/watch?v=my7J_4XBPHw',
  cardio: 'https://www.youtube.com/watch?v=WtR-BepQpbU',
  weightLoss: 'https://www.youtube.com/watch?v=7-xqHFGpiIE',
  fullBody: 'https://www.youtube.com/watch?v=rARlcT2xneg'
};

export const exercises: Exercise[] = [
  // Pectoraux
  {
    id: 'ex-001',
    name: 'Pompes',
    description: 'Exercice classique pour développer les pectoraux',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    equipment: ['none'],
    youtubeLink: youtubeVideos.chest,
    instructions: [
      'Positionnez vos mains à plat sur le sol, écartées d\'une largeur légèrement supérieure à celle des épaules',
      'Gardez votre corps droit de la tête aux pieds',
      'Descendez jusqu\'à ce que votre poitrine touche presque le sol',
      'Remontez en poussant sur vos bras',
      'Effectuez 3 séries de 12 répétitions'
    ],
    imageUrl: '/pompe.jpg',
    duration: 30,
    caloriesBurned: 8,
    weightGoal: ['muscleGain', 'toning', 'maintenance'],
    tips: 'Gardez vos abdominaux contractés pour protéger votre dos',
    variations: ['Pompes inclinées', 'Pompes diamant', 'Pompes avec clap']
  },

  // Abdominaux
  {
    id: 'ex-002',
    name: 'Crunches',
    description: 'Exercice de base pour les abdominaux',
    muscleGroup: 'abs',
    difficulty: 'beginner',
    equipment: ['none'],
    youtubeLink: youtubeVideos.abs,
    instructions: [
      'Allongez-vous sur le dos, genoux pliés et pieds à plat au sol',
      'Placez vos mains derrière la tête sans tirer sur le cou',
      'Soulevez doucement le haut du dos en contractant les abdominaux',
      'Redescendez en contrôlant le mouvement',
      'Effectuez 3 séries de 15 répétitions'
    ],
    imageUrl: '/crunch.avif',
    duration: 20,
    caloriesBurned: 5,
    weightGoal: ['weightLoss', 'toning', 'maintenance']
  },

  // Dos
  {
    id: 'ex-003',
    name: 'Tractions',
    description: 'Exercice complet pour le dos',
    muscleGroup: 'back',
    difficulty: 'intermediate',
    equipment: ['pullUpBar'],
    youtubeLink: youtubeVideos.back,
    instructions: [
      'Saisissez la barre avec les paumes tournées vers l\'avant',
      'Levez-vous jusqu\'à ce que votre menton dépasse la barre',
      'Redescendez lentement',
      'Effectuez 3 séries de 8 répétitions'
    ],
    imageUrl: '/trac.jpg',
    duration: 25,
    caloriesBurned: 7,
    weightGoal: ['muscleGain', 'toning']
  },

  // Jambes
  {
    id: 'ex-004',
    name: 'Squats',
    description: 'Exercice fondamental pour les jambes',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    equipment: ['none'],
    youtubeLink: youtubeVideos.legs,
    instructions: [
      'Pieds écartés à la largeur des épaules',
      'Descendez comme pour vous asseoir en gardant le dos droit',
      'Remontez en poussant sur vos talons',
      'Effectuez 3 séries de 15 répétitions'
    ],
    imageUrl: '/squads.avif',
    duration: 30,
    caloriesBurned: 10,
    weightGoal: ['weightLoss', 'muscleGain', 'toning']
  },

  // Cardio
  {
    id: 'ex-005',
    name: 'Cardio',
    description: 'Exercice cardio complet',
    muscleGroup: 'cardio',
    difficulty: 'intermediate',
    equipment: ['none'],
    youtubeLink: youtubeVideos.cardio,
    instructions: [
      'Debout, accroupissez-vous et posez les mains au sol',
      'Lancez vos pieds en arrière en position planche',
      'Faites une pompe',
      'Ramenez vos pieds vers vos mains',
      'Sautez en l\'air',
      'Effectuez 3 séries de 10 répétitions'
    ],
    imageUrl: '/cardio.avif',
    duration: 20,
    caloriesBurned: 12,
    weightGoal: ['weightLoss', 'toning']
  },

  // Corps complet
  {
    id: 'ex-006',
    name: 'Circuit complet',
    description: 'Entraînement pour tout le corps',
    muscleGroup: 'fullBody',
    difficulty: 'advanced',
    equipment: ['none'],
    youtubeLink: youtubeVideos.fullBody,
    instructions: [
      '10 pompes',
      '15 squats',
      '20 crunchs',
      '30 secondes de planche',
      'Répétez 3 fois'
    ],
    imageUrl: '/global.avif',
    duration: 45,
    caloriesBurned: 15,
    weightGoal: ['weightLoss', 'muscleGain', 'toning']
  }
];

// Fonctions de filtrage
export const getExercisesByGoal = (goal: WeightGoal): Exercise[] => {
  return exercises.filter(exercise => exercise.weightGoal.includes(goal));
};

export const getExercisesByEquipment = (equipment: Equipment[]): Exercise[] => {
  if (equipment.length === 0 || (equipment.length === 1 && equipment[0] === 'none')) {
    return exercises.filter(ex => ex.equipment.includes('none'));
  }
  return exercises.filter(ex => 
    equipment.some(eq => ex.equipment.includes(eq))
  );
};

export const getExercisesByMuscleGroup = (muscleGroups: MuscleGroup[]): Exercise[] => {
  if (muscleGroups.length === 0) return exercises;
  return exercises.filter(ex => 
    muscleGroups.includes(ex.muscleGroup)
  );
};

export const getExercisesByDifficulty = (difficulty: Difficulty): Exercise[] => {
  return exercises.filter(ex => ex.difficulty === difficulty);
};

export const getYoutubeVideoByMuscleGroup = (muscleGroup: MuscleGroup): string | null => {
  return youtubeVideos[muscleGroup as keyof typeof youtubeVideos] || null;
};