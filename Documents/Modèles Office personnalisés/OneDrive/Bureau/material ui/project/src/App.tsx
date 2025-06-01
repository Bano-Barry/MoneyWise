import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import WorkoutsPage from './pages/WorkoutsPage';
import DietPage from './pages/DietPage';
import AboutPage from './pages/AboutPage';
import GeneratePage from './pages/GeneratePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/diet" element={<DietPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/generate" element={<GeneratePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;