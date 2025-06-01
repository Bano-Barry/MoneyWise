// src/types.ts

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  equipment: Equipment[];
  youtubeLink?: string;
  instructions: string[];
  imageUrl: string;
  duration: number;
  caloriesBurned: number;
  weightGoal: WeightGoal[];
  tips?: string;
  variations?: string[];
}

export type MuscleGroup = 
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' 
  | 'legs' | 'core' | 'cardio' | 'fullBody' | 'glutes' 
  | 'calves' | 'hips' | 'abs' | 'belly';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Equipment = 'none' | 'dumbbell' | 'resistanceBand' | 'bench' | 'chair' | 'pullUpBar' | 'yogaMat';
export type WeightGoal = 'weightLoss' | 'muscleGain' | 'toning' | 'maintenance';

export interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  restTime: number;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  duration: number;
  exercises: WorkoutExercise[];
  weightGoal: WeightGoal;
  caloriesBurned: number;
}

export interface FormState {
  weightGoal: WeightGoal;
  difficulty: Difficulty;
  duration: number;
  equipment: Equipment[];
  targetMuscleGroups: MuscleGroup[];
}

/* Fonctions utilitaires pour la conversion des URLs YouTube */
export const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Gestion des URLs courtes (youtu.be)
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split(/[?&#]/)[0];
  }
  
  // Gestion des URLs standard
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

export const convertToEmbedUrl = (url: string): string | null => {
  const id = getYouTubeId(url);
  if (!id) return null;
  
  // Retourne l'URL embed avec des paramètres optimisés
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=0`;
};

/* Types supplémentaires pour les props des composants */
export interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
  showVideoButton?: boolean;
}

export interface FilterOptions {
  muscleGroups: MuscleGroup[];
  difficulties: Difficulty[];
  equipment: Equipment[];
  goals: WeightGoal[];
}

/* Type pour les paramètres de requête API */
export interface WorkoutQueryParams {
  goal?: WeightGoal;
  difficulty?: Difficulty;
  equipment?: Equipment[];
  muscleGroups?: MuscleGroup[];
  duration?: number;
}