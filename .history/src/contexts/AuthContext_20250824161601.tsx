// AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

import api from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};

// Données du compte démo
const DEMO_ACCOUNT = {
  email: 'demo@moneywise.com',
  password: 'demo123',
  user: {
    id: 'demo-user-001',
    email: 'demo@moneywise.com',
    firstName: 'Utilisateur',
    lastName: 'Démo'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    token: null,
  });

  useEffect(() => {
    // Vérifier si une session existe déjà dans le localStorage
    const savedSession = localStorage.getItem('moneywise_demo_session');
    
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        // Vérifier si la session est toujours valide (7 jours max)
        const sessionDate = new Date(sessionData.timestamp);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - sessionDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: sessionData.user, token: sessionData.token }
          });
        } else {
          // Session expirée
          localStorage.removeItem('moneywise_demo_session');
        }
      } catch (error) {
        console.error('Erreur lors de la lecture de la session:', error);
        localStorage.removeItem('moneywise_demo_session');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Vérification des identifiants du compte démo
    if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
      const token = `demo-token-${Date.now()}`;
      const sessionData = {
        user: DEMO_ACCOUNT.user,
        token: token,
        timestamp: new Date().toISOString()
      };
      
      // Sauvegarder la session dans le localStorage
      localStorage.setItem('moneywise_demo_session', JSON.stringify(sessionData));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: DEMO_ACCOUNT.user, token }
      });
      
      return true;
    }
    
    // Authentification via l'API
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.token;
      const user = res.data.user; // Assurez-vous que l'API renvoie les données utilisateur
      
      const sessionData = {
        user,
        token,
        timestamp: new Date().toISOString()
      };
      
      // Sauvegarder la session dans le localStorage
      localStorage.setItem('moneywise_demo_session', JSON.stringify(sessionData));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}