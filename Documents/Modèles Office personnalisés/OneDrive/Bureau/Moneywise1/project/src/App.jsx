import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Reports from './pages/Reports';
import Social from './pages/Social';
import Subscriptions from './pages/Subscriptions';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil (sans le layout de l'app) */}
        <Route path="/" element={<HomePage />} />
        
        {/* Pages de l'application (avec layout commun) */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/budgets" element={<Layout><Budgets /></Layout>} />
        <Route path="/goals" element={<Layout><Goals /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/social" element={<Layout><Social /></Layout>} />
        <Route path="/subscriptions" element={<Layout><Subscriptions /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;