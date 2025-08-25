import api from "./api";
import type { 
  RegisterData, 
  LoginData, 
  AuthResponse, 
  RegisterResponse,
  EmailVerificationData,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  UpdateProfileData,
  UpdateThemeData,
  User,
  LoginErrorResponse
} from "../types";

// Inscription
export const register = async (userData: RegisterData): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Connexion
export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    const loginErrorResponse = error as LoginErrorResponse;
    if (loginErrorResponse.emailNonVerifie) {
      throw new Error("Email non vérifié");
    } else { 
      throw new Error(loginErrorResponse.message);
    }
  }
};

// Vérification d'email
export const verifyEmail = async (data: EmailVerificationData): Promise<AuthResponse> => {
  const response = await api.post("/auth/verify-email", data);
  return response.data;
};

// Renvoyer l'email de vérification
export const resendVerification = async (data: ResendVerificationData): Promise<{ message: string }> => {
  const response = await api.post("/auth/resend-verification", data);
  return response.data;
};

// Obtenir le profil utilisateur
export const getProfile = async (): Promise<User> => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// Mettre à jour le profil
export const updateProfile = async (data: UpdateProfileData): Promise<{ message: string; utilisateur: User }> => {
  const response = await api.put("/auth/profile", data);
  return response.data;
};

// Changer le thème
export const updateTheme = async (data: UpdateThemeData): Promise<{ message: string; utilisateur: User }> => {
  const response = await api.put("/auth/profile/theme", data);
  return response.data;
};

// Changer le mot de passe
export const changePassword = async (data: ChangePasswordData): Promise<{ message: string }> => {
  const response = await api.put("/auth/change-password", data);
  return response.data;
};

// Demander la récupération de mot de passe
export const forgotPassword = async (data: ForgotPasswordData): Promise<{ message: string }> => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

// Réinitialiser le mot de passe
export const resetPassword = async (data: ResetPasswordData): Promise<{ message: string }> => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};