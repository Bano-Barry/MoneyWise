import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    login: (userData: User, userToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Pour une application réelle, vous voudriez vérifier la validité du token ici
      // et potentiellement récupérer les informations de l'utilisateur.
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, [token]);

  const login = (userData: User, userToken: string) => {
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, token }}>
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