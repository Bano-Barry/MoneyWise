import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marque */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Dumbbell className="h-8 w-8 text-primary-400" />
              <span className="font-heading font-bold text-2xl text-white">FitGen</span>
            </Link>
            <p className="text-neutral-300 mb-4">
              Votre générateur de programme d'entraînement personnalisé pour atteindre vos objectifs fitness.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          {/* Liens rapides */}
          <div className="col-span-1">
            <h3 className="font-heading font-semibold text-xl mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              {[
                { path: '', label: 'Accueil' },
                { path: 'workouts', label: 'Exercices' },
                { path: 'diet', label: 'Nutrition' },
                { path: 'about', label: 'À propos' }
              ].map((item) => (
                <li key={item.path}>
                  <Link 
                    to={`/${item.path}`}
                    className="text-neutral-300 hover:text-primary-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Types d'entraînement */}
          <div className="col-span-1">
            <h3 className="font-heading font-semibold text-xl mb-4">Types d'Entraînement</h3>
            <ul className="space-y-2">
              {[
                'Perte de poids',
                'Prise de masse',
                'Tonification',
                'Débutants',
                'Sans équipement'
              ].map((item) => (
                <li key={item}>
                  <Link 
                    to="/workouts" 
                    className="text-neutral-300 hover:text-primary-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="font-heading font-semibold text-xl mb-4">Restez Informé</h3>
            <p className="text-neutral-300 mb-4">
              Abonnez-vous à notre newsletter pour recevoir des conseils d'entraînement et des recettes santé.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-2 rounded-l-lg bg-neutral-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
              />
              <button 
                type="submit"
                className="bg-primary-500 px-4 py-2 rounded-r-lg font-medium hover:bg-primary-600 transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-neutral-400">
          <p>&copy; {new Date().getFullYear()} FitGen. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;