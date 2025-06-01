import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-primary-500" />
            <span className="font-heading font-bold text-2xl bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              FitGen
            </span>
          </Link>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-8">
            {[
              { path: '', label: 'Accueil' },
              { path: 'workouts', label: 'Exercices' },
              { path: 'diet', label: 'Nutrition' },
              { path: 'about', label: 'À propos' }
            ].map((item) => (
              <Link
                key={item.path}
                to={`/${item.path}`}
                className={`font-medium text-lg transition-colors hover:text-primary-500 ${
                  location.pathname === `/${item.path}` 
                    ? 'text-primary-500' 
                    : 'text-neutral-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/generate"
              className="bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium py-2 px-6 rounded-full hover:opacity-90 transition-opacity"
            >
              Créer un Programme
            </Link>
          </nav>
          
          {/* Bouton menu mobile */}
          <button
            className="md:hidden text-neutral-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Navigation mobile */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden pt-4 pb-2"
          >
            <div className="flex flex-col space-y-4">
              {[
                { path: '', label: 'Accueil' },
                { path: 'workouts', label: 'Exercices' },
                { path: 'diet', label: 'Nutrition' },
                { path: 'about', label: 'À propos' }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={`/${item.path}`}
                  className={`font-medium text-lg transition-colors hover:text-primary-500 ${
                    location.pathname === `/${item.path}` 
                      ? 'text-primary-500' 
                      : 'text-neutral-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/generate"
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium py-2 px-6 rounded-full hover:opacity-90 transition-opacity text-center"
              >
                Créer un Programme
              </Link>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;