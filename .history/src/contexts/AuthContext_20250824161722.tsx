// AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
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

interface AuthProviderProps {
  children: ReactNode;
}
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch]: [AuthState, Dispatch<AuthAction>] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    token: null,
  });

  useEffect(() => {
    const savedSession = localStorage.getItem('moneywise_demo_session');
    if (savedSession) {
      try {
        const sessionData: {
          user: User;
          token: string;
          timestamp: string;
        } = JSON.parse(savedSession);
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
          localStorage.removeItem('moneywise_demo_session');
        }
      } catch (error) {
        console.error('Erreur lors de la lecture de la session:', error);
        localStorage.removeItem('moneywise_demo_session');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
      const token = `demo-token-${Date.now()}`;
      const sessionData = {
        user: DEMO_ACCOUNT.user,
        token: token,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('moneywise_demo_session', JSON.stringify(sessionData));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: DEMO_ACCOUNT.user, token }
      });
      
      return true;
    }
    
    try {
      const res = await api.post('/auth/login', { email, password });
      const token: string = res.data.token;
      const user: User = res.data.user;
      const sessionData = {
        user,
        token,
        timestamp: new Date().toISOString()
      };
      
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

  const logout = (): void => {
    localStorage.removeItem('moneywise_demo_session');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}