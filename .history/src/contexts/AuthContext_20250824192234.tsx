import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

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

  const login = async (email: string, password: string): Promise<boolean> => {
    if ((email === 'usertest' && password === '77884455') || (email && password)) {
      const user: User = {
        id: 1,  // ✅ id doit être un number
        email,
        firstName: email === 'usertest' ? 'Demo' : 'John',
        lastName: email === 'usertest' ? 'User' : 'Doe',
      };
      const token = 'mock-jwt-token';
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    if (email && password && firstName && lastName) {
      const user: User = {
        id: 1, // ✅ id doit être un number
        email,
        firstName,
        lastName,
      };
      const token = 'mock-jwt-token';
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('transactions');
    localStorage.removeItem('categories');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
