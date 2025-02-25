import React from 'react';
import UserList from './UserList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Application de Liste d'Utilisateurs</h1>
      </header>
      <main>
        <UserList /> {/* Utilisation du composant UserList */}
      </main>
    </div>
  );
}

export default App;