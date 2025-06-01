import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Dumbbell, Salad, Target, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Section Héro */}
      <section className="min-h-screen pt-24 pb-12 flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                Votre Générateur d'Entraînement à Domicile
              </h1>
              <p className="text-lg text-neutral-700 mb-8">
                Créez des programmes d'entraînement personnalisés adaptés à vos objectifs, votre équipement et votre niveau.
                Restez en forme chez vous avec des plans d'exercices sur mesure et des conseils nutritionnels.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/generate">
                  <Button size="lg" rightIcon={<Dumbbell size={20} />}>
                    Créer mon Programme
                  </Button>
                </Link>
                <Link to="/diet">
                  <Button size="lg" variant="outline" rightIcon={<Salad size={20} />}>
                    Conseils Nutrition
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="pop1.jpg" 
                  alt="Personne s'entraînant à la maison" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 max-w-xs">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Zap className="text-primary-500 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Résultats Rapides</h3>
                    <p className="text-sm text-neutral-600">Programmes efficaces pour vos objectifs</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Section Caractéristiques */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Pourquoi Choisir FitGen ?
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Notre approche personnalisée du fitness vous aide à atteindre vos objectifs avec des programmes d'entraînement adaptés et des conseils nutritionnels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Dumbbell className="h-8 w-8 text-primary-500" />,
                title: 'Entraînements Personnalisés',
                description: 'Programmes adaptés à votre niveau, vos objectifs et votre équipement. Parfait pour s\'entraîner à la maison avec des ressources limitées.'
              },
              {
                icon: <Target className="h-8 w-8 text-primary-500" />,
                title: 'Objectifs Ciblés',
                description: 'Que vous souhaitiez perdre du poids, gagner du muscle ou rester en forme, notre générateur crée le programme adapté à vos besoins.'
              },
              {
                icon: <Salad className="h-8 w-8 text-primary-500" />,
                title: 'Conseils Nutritionnels',
                description: 'Complétez vos entraînements avec des conseils alimentaires sains et des suggestions de repas qui soutiennent votre parcours fitness.'
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="bg-primary-100 rounded-full p-3 inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Comment ça marche */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Comment ça Marche
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Créez votre programme personnalisé en quelques étapes simples
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                number: '01',
                title: 'Choisissez votre Objectif',
                description: 'Sélectionnez si vous voulez perdre du poids, gagner du muscle ou maintenir votre forme.'
              },
              {
                number: '02',
                title: 'Définissez vos Paramètres',
                description: 'Indiquez votre niveau de fitness, l\'équipement disponible et vos contraintes de temps.'
              },
              {
                number: '03',
                title: 'Générez votre Programme',
                description: 'Notre système crée un programme personnalisé basé sur vos critères.'
              },
              {
                number: '04',
                title: 'Commencez l\'Entraînement',
                description: 'Suivez le programme, suivez vos progrès et ajustez si nécessaire.'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl shadow-md p-6 h-full relative z-10">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-2xl rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-3">{step.title}</h3>
                  <p className="text-neutral-600">{step.description}</p>
                </div>
                
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transform translate-x-1/2 z-0">
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Section CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-accent-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
            Prêt à Commencer votre Parcours Fitness ?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
            Générez votre programme d'entraînement personnalisé maintenant et commencez à travailler vers vos objectifs fitness dès aujourd'hui.
          </p>
          <Link to="/generate">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-white/90 focus:ring-white"
              rightIcon={<Dumbbell size={20} />}
            >
              Créer Mon Programme d'Entraînement
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;