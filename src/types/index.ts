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

export interface User {
  id: number;
  email: string;
  prenom: string;
  nom: string;
  date_creation: string;
  date_modification: string;
}