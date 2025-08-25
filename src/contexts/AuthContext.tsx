import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { getProfile } from '../services/authService';

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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier le statut d'authentification au chargement
  const checkAuthStatus = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const userData = await getProfile();
        setUser(userData);
        setToken(storedToken);
      } catch (error) {
        // Token invalide, nettoyer le localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, [token, user]);

  const login = (userData: User, userToken: string) => {
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const isAuthenticated = !!token && !!user;

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