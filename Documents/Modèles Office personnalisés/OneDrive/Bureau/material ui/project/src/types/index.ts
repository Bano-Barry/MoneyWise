/* TYPES PRINCIPAUX */
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

/* TYPES DE PROGRAMME */
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

/* TYPES DE FORMULAIRE */
export interface FormState {
  weightGoal: WeightGoal;
  difficulty: Difficulty;
  duration: number;
  equipment: Equipment[];
  targetMuscleGroups: MuscleGroup[];
}

/* UTILITAIRES YOUTUBE */
/**
 * Extrait l'ID d'une vidéo YouTube depuis une URL
 * @param url L'URL YouTube (format quelconque)
 * @returns L'ID de la vidéo ou null si invalide
 */
export const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Gestion des formats d'URL :
  // 1. Format court (youtu.be)
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split(/[?&#]/)[0];
  }
  
  // 2. Format embed
  if (url.includes('/embed/')) {
    return url.split('/embed/')[1].split(/[?&#]/)[0];
  }
  
  // 3. Format standard
  const regExp = /^.*(youtube\.com\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Convertit une URL YouTube standard en URL embed
 * @param url L'URL originale
 * @returns L'URL embed ou null si conversion impossible
 */
export const convertToEmbedUrl = (url: string): string | null => {
  const id = getYouTubeId(url);
  if (!id) return null;
  
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=0`;
};

/* TYPES POUR LES COMPOSANTS */
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

/* TYPES POUR LES REQUETES API */
export interface WorkoutQueryParams {
  goal?: WeightGoal;
  difficulty?: Difficulty;
  equipment?: Equipment[];
  muscleGroups?: MuscleGroup[];
  duration?: number;
  exclude?: string[];
}

/* TYPES DE RÉPONSE */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}