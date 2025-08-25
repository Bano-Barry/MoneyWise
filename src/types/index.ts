export interface Category {
  id: number;
  utilisateur_id: number;
  nom: string;
  couleur: string;
  type: 'revenu' | 'depense';
  date_creation: string;
  date_modification: string;
}

export interface NewCategory {
  nom: string;
  couleur: string;
  type: 'revenu' | 'depense';
}

// Types d'authentification alignés avec l'API
export interface User {
  id: number;
  email: string;
  prenom: string;
  nom: string;
  theme: 'light' | 'dark';
  date_creation: string;
  date_modification: string;
  email_verifie: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  utilisateur: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  utilisateur: User;
}

export interface EmailVerificationData {
  token: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
}

export interface UpdateThemeData {
  theme: 'light' | 'dark';
}

export interface LoginErrorResponse {
  message: string;
  emailNonVerifie?: boolean;
}

export interface ApiError {
  message: string;
}