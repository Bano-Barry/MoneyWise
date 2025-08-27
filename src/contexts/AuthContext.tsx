import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { getProfile } from '../services/authService';

import { usePersistentAuth } from '../hooks/usePersistentAuth';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (userData: User, userToken: string) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Utiliser le hook de persistance pour gérer l'état
  const {
    user,
    token,
    isAuthenticated,
    login: persistentLogin,
    logout: persistentLogout,
    updateUser: persistentUpdateUser,
    saveUser,
    clearAuth
  } = usePersistentAuth();

  // Vérifier le statut d'authentification au chargement
  const checkAuthStatus = async () => {
    
    
    // Si on a déjà les données en mémoire, on peut les utiliser immédiatement
    if (user && token) {
      try {
        // Vérifier avec l'API si le token est toujours valide
        const userData = await getProfile();
        saveUser(userData);
      } catch (error) {
        console.error('Token invalide, nettoyage...', error);
        clearAuth();
      }
      setIsLoading(false);
      return;
    }
    
    // Vérifier si le token est présent
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    if (token && user) {
      try {
        // Vérifier avec l'API si le token est toujours valide
        const userData = await getProfile();
        saveUser(userData);
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        clearAuth();
      }
    } else if (token && !user) {
      // Token présent mais pas de données utilisateur, essayer de les récupérer
      try {
        const userData = await getProfile();
        saveUser(userData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        clearAuth();
      }
    }
    setIsLoading(false);
  };

  // Effet pour vérifier l'authentification au chargement uniquement
  useEffect(() => {
    checkAuthStatus();
  }, []); // Pas de dépendances pour éviter les boucles infinies

  // Effet pour synchroniser l'état quand les données changent (avec debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user && token) {
        // Synchronisation des données utilisateur
      }
    }, 100); // Debounce de 100ms

    return () => clearTimeout(timeoutId);
  }, [user?.id, token]); // Seulement sur les changements importants

  const login = (userData: User, userToken: string) => {
    persistentLogin(userData, userToken);
  };

  const logout = () => {
    persistentLogout();
  };

  const updateUser = (userData: User) => {
    persistentUpdateUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token,
      isLoading,
      login, 
      logout, 
      updateUser,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};