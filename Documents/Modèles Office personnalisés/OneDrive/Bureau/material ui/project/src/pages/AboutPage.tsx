import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Heart, Zap } from 'lucide-react';
import Button from '../components/ui/Button';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl mb-4">À Propos de FitGen</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Notre mission est de rendre le fitness accessible à tous, peu importe où vous êtes ou quel équipement vous avez.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-heading font-bold text-3xl mb-6">Notre Mission</h2>
            <p className="text-neutral-700 mb-4">
              FitGen a été créé avec une mission simple : rendre les programmes d'entraînement efficaces accessibles à tous, où qu'ils soient et quel que soit leur équipement disponible.
            </p>
            <p className="text-neutral-700 mb-4">
              Nous croyons que le fitness doit être inclusif, adaptable et agréable. Notre générateur d'entraînement crée des programmes personnalisés qui correspondent à vos objectifs spécifiques, votre niveau de forme et vos ressources disponibles.
            </p>
            <p className="text-neutral-700">
              Que vous cherchiez à perdre du poids, à développer vos muscles ou simplement à rester actif, FitGen vous fournit les conseils dont vous avez besoin pour réussir votre parcours fitness.
            </p>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Personne s'étirant à la maison"
              className="rounded-xl shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="font-heading font-bold text-3xl text-center mb-10">Pourquoi Choisir FitGen ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-10 w-10 text-primary-500" />,
                title: 'Programmes Personnalisés',
                description: 'Chaque entraînement est adapté à vos besoins spécifiques, vos objectifs et votre équipement disponible. Vous obtenez un programme vraiment personnalisé, pas une solution universelle.'
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-primary-500" />,
                title: 'Approche Scientifique',
                description: 'Nos recommandations d\'entraînement sont basées sur des principes scientifiques éprouvés pour garantir des séances efficaces, sûres et équilibrées.'
              },
              {
                icon: <Heart className="h-10 w-10 text-primary-500" />,
                title: 'Bien-être Global',
                description: 'Nous allons au-delà des exercices avec des conseils nutritionnels et des recommandations pour un mode de vie sain qui soutiennent votre parcours bien-être.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-heading font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-neutral-50 rounded-2xl p-8 mb-16">
          <h2 className="font-heading font-bold text-3xl text-center mb-8">Comment Tout a Commencé</h2>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-neutral-700 mb-4">
              FitGen est né pendant la pandémie mondiale, lorsque les salles de sport étaient fermées et que les gens avaient du mal à maintenir leurs routines d'entraînement à domicile. Notre fondateur, un coach sportif certifié, a remarqué que beaucoup de ses clients ne savaient pas comment créer des entraînements efficaces à la maison avec un équipement limité.
            </p>
            <p className="text-neutral-700 mb-4">
              Il a commencé à concevoir des programmes personnalisés pour chaque client en fonction de leur situation spécifique, mais s'est vite rendu compte que la technologie pouvait aider à étendre cette solution pour atteindre plus de personnes. C'est alors qu'est née l'idée d'un générateur d'entraînement intelligent.
            </p>
            <p className="text-neutral-700">
              Aujourd'hui, FitGen continue d'évoluer avec de nouveaux exercices, des recommandations nutritionnelles et des fonctionnalités pour aider les gens à atteindre leurs objectifs fitness, où qu'ils en soient dans leur parcours.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="font-heading font-bold text-3xl mb-6">Prêt à Commencer votre Parcours Fitness ?</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto mb-8">
            Créez votre programme d'entraînement personnalisé aujourd'hui et faites le premier pas vers vos objectifs fitness.
          </p>
          <Link to="/generate">
            <Button size="lg">Générer Mon Programme</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;