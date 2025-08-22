import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/transactions" element={
              <Layout>
                <Transactions />
              </Layout>
            } />
            <Route path="/add" element={
              <Layout>
                <AddTransaction />
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <Profile />
              </Layout>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;