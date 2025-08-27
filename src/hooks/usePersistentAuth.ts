import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { setCookie, getCookie, deleteCookie } from '../utils/cookieUtils';

// Hook pour gérer la persistance des données d'authentification
export const usePersistentAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      // Essayer d'abord les cookies, puis localStorage
      const cookieUser = getCookie('user');
      const cookieToken = getCookie('token');
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      

      
      // Priorité aux cookies, puis localStorage
      let userData = null;
      let tokenData = null;
      
      if (cookieUser && cookieToken) {
        userData = JSON.parse(cookieUser);
        tokenData = cookieToken;
      } else if (storedUser && storedToken) {
        userData = JSON.parse(storedUser);
        tokenData = storedToken;
      }
      
      if (!userData || !tokenData) {
        return null;
      }
      
      return userData;
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    // Essayer d'abord les cookies, puis localStorage
    const cookieToken = getCookie('token');
    const storedToken = localStorage.getItem('token');
    
    const tokenData = cookieToken || storedToken;
    return tokenData;
  });

  // Sauvegarder les données utilisateur
  const saveUser = useCallback((userData: User) => {
    try {
      // Éviter les sauvegardes inutiles
      if (JSON.stringify(userData) === JSON.stringify(user)) {
        return;
      }
      
      // Sauvegarder dans localStorage ET cookies
      const userJson = JSON.stringify(userData);
      localStorage.setItem('user', userJson);
      setCookie('user', userJson, 30); // 30 jours
      
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    }
  }, [user]);

  // Sauvegarder le token
  const saveToken = useCallback((userToken: string) => {
    try {
      // Éviter les sauvegardes inutiles
      if (userToken === token) {
        return;
      }
      
      // Sauvegarder dans localStorage ET cookies
      localStorage.setItem('token', userToken);
      setCookie('token', userToken, 30); // 30 jours
      
      setToken(userToken);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
    }
  }, [token]);

  // Nettoyer toutes les données
  const clearAuth = useCallback(() => {
    try {
      // Nettoyer localStorage ET cookies
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      deleteCookie('token');
      deleteCookie('user');
      
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors du nettoyage des données:', error);
    }
  }, []);

  // Connexion complète
  const login = useCallback((userData: User, userToken: string) => {
    saveToken(userToken);
    saveUser(userData);
  }, [saveToken, saveUser]);

  // Déconnexion
  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  // Mise à jour de l'utilisateur
  const updateUser = useCallback((userData: User) => {
    saveUser(userData);
  }, [saveUser]);

  // Écouter les changements dans le localStorage (pour la synchronisation entre onglets)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Éviter les changements inutiles
      if (e.key === 'user' && e.newValue) {
        try {
          const newUser = JSON.parse(e.newValue);
          // Vérifier si l'utilisateur a vraiment changé
          if (JSON.stringify(newUser) !== JSON.stringify(user)) {
            setUser(newUser);
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation utilisateur:', error);
        }
      } else if (e.key === 'token' && e.newValue !== token) {
        setToken(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user, token]); // Dépendances pour éviter les closures

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    updateUser,
    saveUser,
    saveToken,
    clearAuth
  };
};
