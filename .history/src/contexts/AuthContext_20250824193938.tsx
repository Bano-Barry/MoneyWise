import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types';

// Définition du type de l'état d'authentification
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// Définition du contexte
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Actions pour le reducer
type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer pour gérer l'état
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

// Fournisseur du contexte
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: JSON.parse(user), token }
      });
    }
  }, []);

  // Fonction login
  const login = async (email: string, _password: string): Promise<boolean> => {
    // Mock - à remplacer par ton appel API
    if (email && _password) {
      const user: User = {
        id: 1, // numéro unique
        email,
        firstName: 'Jean',
        lastName: 'Dupont',
      };
      const token = 'mock-jwt-token';

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      return true;
    }
    return false;
  };

  // Fonction register
  const register = async (
    email: string,
    _password: string,
    firstName: string,
    lastName: string
  ): Promise<boolean> => {
    // Mock - à remplacer par ton appel API
    if (email && _password && firstName && lastName) {
      const user: User = {
        id: 1,
        email,
        firstName,
        lastName,
      };
      const token = 'mock-jwt-token';

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      return true;
    }
    return false;
  };

  // Fonction logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
