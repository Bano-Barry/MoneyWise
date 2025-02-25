import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [listOfUser, setListOfUser] = useState([]); // État pour stocker la liste des utilisateurs
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs

  // Utilisation de useEffect pour effectuer la requête API
  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/users') // Requête GET vers l'API
      .then((response) => {
        setListOfUser(response.data); // Mettre à jour l'état avec les données reçues
        setLoading(false); // Désactiver le chargement
      })
      .catch((error) => {
        setError('Une erreur est survenue lors du chargement des utilisateurs.'); // Gérer les erreurs
        setLoading(false); // Désactiver le chargement
      });
  }, []); // Le tableau vide signifie que useEffect ne s'exécute qu'une fois

  // Afficher un message de chargement pendant que les données sont récupérées
  if (loading) return <p>Chargement en cours...</p>;

  // Afficher un message d'erreur si la requête échoue
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Afficher la liste des utilisateurs
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Liste des Utilisateurs</h2>
      <ul style={styles.list}>
        {listOfUser.map((user) => (
          <li key={user.id} style={styles.listItem}>
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Styles pour le composant
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  list: {
    listStyleType: 'none',
    padding: '0',
  },
  listItem: {
    background: '#f9f9f9',
    margin: '10px 0',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default UserList;