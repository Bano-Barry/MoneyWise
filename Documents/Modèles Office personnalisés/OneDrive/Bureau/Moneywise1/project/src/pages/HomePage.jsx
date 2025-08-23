import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Target, Bell, Mail, ArrowRight, Play, Shield, PieChart, Users, TrendingUp, CreditCard, List, Tag } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Images d'illustration
const heroImage = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1611&q=80";
const feature1Image = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";
const feature2Image = "https://images.unsplash.com/photo-1563013541-3d4e9756b6d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80";
const feature3Image = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80";
const feature4Image = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1611&q=80";
const team1Image = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80";
const team2Image = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80";
const team3Image = "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80";
const team4Image = "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80";
const team5Image = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80";
const statsImage = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80";

// Composant Navbar
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-green-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">€</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">MoneyWise</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Fonctionnalités</a>
            <a href="#stats" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Avantages</a>
            <a href="#team" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Équipe</a>
            <a href="#faq" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">FAQ</a>
            <a href="#contact" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform">
              Commencer
            </Link>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 focus:outline-none transition-colors"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="text-gray-600 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">Fonctionnalités</a>
            <a href="#stats" className="text-gray-600 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">Avantages</a>
            <a href="#team" className="text-gray-600 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">Équipe</a>
            <a href="#faq" className="text-gray-600 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">FAQ</a>
            <a href="#contact" className="text-gray-600 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">Contact</a>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link to="/dashboard" className="block px-6 py-3 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors text-center">
                Commencer maintenant
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Composant HeroSection
const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-gray-50 overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left" data-aos="fade-right">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Maîtrisez votre avenir</span>
                <span className="block text-green-600">financier</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 sm:max-w-xl sm:mx-auto md:mt-8 md:text-xl lg:mx-0">
                L'application ultime pour gérer vos budgets, suivre vos dépenses et atteindre vos objectifs financiers avec confiance.
              </p>
              <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start" data-aos="fade-up" data-aos-delay="200">
                <div className="rounded-md shadow-lg">
                  <Link
                    to="/dashboard"
                    className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors transform hover:-translate-y-0.5 hover:shadow-xl md:text-lg md:px-12"
                  >
                    Démarrer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src={heroImage}
          alt="Personne gérant ses finances"
          data-aos="fade-left"
        />
      </div>
    </section>
  );
};

// Composant StatsSection
const StatsSection = () => {
  const stats = [
    { number: '95%', label: 'de satisfaction client', color: 'green' },
    { number: '50K+', label: 'utilisateurs actifs', color: 'red' },
    { number: '15M€', label: 'économisés', color: 'blue' },
    { number: '24/7', label: 'support disponible', color: 'gray' }
  ];

  return (
    <section id="stats" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Pourquoi nous choisir</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Des résultats qui parlent d'eux-mêmes
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8" data-aos="fade-up" data-aos-delay="200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 transition-transform">
              <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Composant FeaturesSection
const FeaturesSection = () => {
  const features = [
    {
      title: "Vue d'Ensemble Financière",
      description: "Résumé complet de votre situation financière avec solde, revenus, dépenses et différence en temps réel.",
      icon: PieChart,
      image: feature1Image,
      color: "green"
    },
    {
      title: "Gestion des Transactions",
      description: "Lister, filtrer et gérer toutes vos transactions avec des outils de recherche avancés.",
      icon: List,
      image: feature2Image,
      color: "red"
    },
    {
      title: "Gestion des Catégories",
      description: "Personnalisez vos catégories, modifiez ou supprimez les existantes et ajoutez de nouvelles.",
      icon: Tag,
      image: feature3Image,
      color: "blue"
    },
    {
      title: "Budgets Intelligents",
      description: "Créez des budgets personnalisés avec alertes en temps réel et analyses prédictives.",
      icon: BarChart3,
      image: feature4Image,
      color: "gray"
    },
    {
      title: "Objectifs d'Épargne",
      description: "Planifiez et suivez vos objectifs avec projections précises et conseils personnalisés.",
      icon: Target,
      image: feature2Image,
      color: "purple"
    },
    {
      title: "Surveillance 360°",
      description: "Contrôlez abonnements et dépenses récurrentes avec alertes intelligentes.",
      icon: Bell,
      image: feature3Image,
      color: "orange"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Fonctionnalités complètes</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Tout pour maîtriser vos finances
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Découvrez des outils conçus pour transformer votre gestion financière
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105 overflow-hidden group cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-40 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" src={feature.image} alt={feature.title} />
                <div className="absolute top-4 left-4">
                  <div className={`h-12 w-12 rounded-lg bg-${feature.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${feature.color}-100 text-${feature.color}-800 group-hover:bg-${feature.color}-200 transition-colors`}>
                    Découvrir
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Composant TeamSection
const TeamSection = () => {
  const team = [
    {
      name: "Marie Dupont",
      role: "CEO & Fondatrice",
      image: team1Image,
      bio: "15 ans d'expérience en finance et technologie"
    },
    {
      name: "Thomas Martin",
      role: "Développeur Principal",
      image: team2Image,
      bio: "Expert en architecture FinTech et sécurité"
    },
    {
      name: "Sophie Leroy",
      role: "Designer UX/UI",
      image: team3Image,
      bio: "Spécialiste en expériences utilisateur immersives"
    },
    {
      name: "Julie Moreau",
      role: "Responsable Marketing",
      image: team4Image,
      bio: "Stratège en croissance et acquisition utilisateurs"
    },
    {
      name: "David Petit",
      role: "Expert Financier",
      image: team5Image,
      bio: "Conseiller en investissement et planification"
    },
    {
      name: "Léa Bernard",
      role: "Support Client",
      image: team4Image,
      bio: "Dédiée à votre satisfaction et réussite financière"
    }
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Notre équipe</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Les experts derrière MoneyWise
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Une équipe passionnée dédiée à votre réussite financière
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" data-aos="fade-up" data-aos-delay="200">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="text-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 hover:scale-105 group cursor-pointer"
            >
              <div className="relative mx-auto w-24 h-24 mb-6">
                <img 
                  className="w-full h-full rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow" 
                  src={member.image} 
                  alt={member.name} 
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">{member.name}</h3>
              <p className="text-green-600 font-medium">{member.role}</p>
              <p className="mt-3 text-sm text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Composant FAQSection
const FAQSection = () => {
  const faqs = [
    {
      question: "MoneyWise est-il vraiment gratuit ?",
      answer: "Oui, notre plan de base offre toutes les fonctionnalités essentielles gratuitement. Nous proposons un plan premium avec des analyses avancées et un support prioritaire."
    },
    {
      question: "Comment protégez-vous mes données ?",
      answer: "Nous utilisons un chiffrement de niveau bancaire (AES-256) et suivons les normes de sécurité les plus strictes. Vos données ne sont jamais vendues ou partagées."
    },
    {
      question: "Puis-je utiliser l'application sur tous mes appareils ?",
      answer: "Absolument ! MoneyWise est disponible sur web, iOS et Android avec une synchronisation en temps réel sur tous vos appareils."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-green-50 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">FAQ</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Questions fréquentes
          </p>
          <p className="mt-4 text-xl text-gray-600">
            Tout ce que vous devez savoir sur MoneyWise
          </p>
        </div>

        <div className="space-y-6" data-aos="fade-up" data-aos-delay="200">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Composant ContactSection
const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Contact</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Prêt à transformer vos finances ?
          </p>
          <p className="mt-4 text-xl text-gray-600">
            Rejoignez des milliers d'utilisateurs satisfaits
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-12 text-center text-white" data-aos="fade-up" data-aos-delay="200">
          <Mail className="mx-auto h-16 w-16 mb-6" />
          <h3 className="text-2xl font-bold mb-4">Commencez votre voyage financier</h3>
          <p className="text-green-100 mb-8 text-lg">
            Notre équipe est là pour vous accompagner à chaque étape
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 transition-colors transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Essayer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="mailto:support@moneywise.com"
              className="inline-flex items-center px-8 py-4 border border-white text-base font-medium rounded-md text-white hover:bg-green-500 transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Composant Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-green-600 rounded-md flex items-center justify-center">
                <span className="font-bold text-lg">€</span>
              </div>
              <span className="ml-2 text-xl font-bold">MoneyWise</span>
            </div>
            <p className="text-gray-400">Votre partenaire pour une liberté financière totale.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Produit</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-green-400 transition-colors">Fonctionnalités</a></li>
              <li><a href="#stats" className="hover:text-green-400 transition-colors">Avantages</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#faq" className="hover:text-green-400 transition-colors">FAQ</a></li>
              <li><a href="#contact" className="hover:text-green-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-400 transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Conditions</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2024 MoneyWise. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Page d'accueil principale
const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <TeamSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;