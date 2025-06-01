import React, { useState } from 'react';
import DietCard from '../components/diet/DietCard';

type DietCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';
type WeightGoal = 'weightLoss' | 'muscleGain' | 'maintenance';

interface DietTip {
  id: string;
  title: string;
  description: string;
  category: DietCategory;
  weightGoal: WeightGoal[];
  imageUrl: string;
  details: {
    calories: number;
    preparationTime: number;
    keyNutrients: string[];
    tips: string[];
  };
}

const dietTips: DietTip[] = [
  // PERTE DE POIDS
  {
    id: 'wl-bf-1',
    title: 'Porridge protéiné',
    description: 'Flocons d\'avoine + lait végétal + whey + fruits rouges + graines de chia',
    category: 'breakfast',
    weightGoal: ['weightLoss'],
    imageUrl: '/rouge.jpg',
    details: {
      calories: 350,
      preparationTime: 10,
      keyNutrients: ['Protéines: 25g', 'Fibres: 8g', 'Glucides lents: 40g'],
      tips: [
        'Utiliser des flocons d\'avoine complets',
        'Ajouter la whey après cuisson'
      ]
    }
  },
  {
    id: 'wl-bf-2',
    title: 'Pain complet + œufs',
    description: '2 tranches de pain complet + 2 œufs durs ou pochés + avocat (¼)',
    category: 'breakfast',
    weightGoal: ['weightLoss'],
    imageUrl: '/pain.avif',
    details: {
      calories: 320,
      preparationTime: 15,
      keyNutrients: ['Protéines: 22g', 'Bons lipides: 15g', 'Fibres: 6g'],
      tips: [
        'Cuire les œufs sans matière grasse',
        'Pain complet bio de préférence'
      ]
    }
  },
  {
    id: 'wl-bf-3',
    title: 'Smoothie bowl sportif',
    description: 'Banane + épinards + lait d’amande + 1 scoop de protéine + topping amandes',
    category: 'breakfast',
    weightGoal: ['weightLoss'],
    imageUrl: '/epinard.jpg',
    details: {
      calories: 50,
      preparationTime: 25,
      keyNutrients: [''],
      tips: [
        
      ]
    }
  },
 
 
  {
    id: 'wl-bf-4',
    title: 'Skyr + fruits + amandes',
    description: '150g skyr ou fromage blanc 0% + pomme ou poire + 5-6 amandes',
    category: 'breakfast',
    weightGoal: ['weightLoss'],
    imageUrl: '/amende.avif',
    details: {
      calories: 20,
      preparationTime: 20,
      keyNutrients: [''],
      tips: [
       
      ]
    }
  },
  {
    id: 'wl-bf-5',
    title: ' Omelette aux légumes + 1 tranche de pain complet',
    description: '2 œufs, Poivrons, épinards, champignons (ou légumes de saison), 1 cuillère à café d’huile d’olive pour la cuisson ,1 tranche de pain complet grillé',
    category: 'breakfast',
    weightGoal: ['weightLoss'],
    imageUrl: '/omelettes.avif',
    details: {
      calories: 20,
      preparationTime: 20,
      keyNutrients: [''],
      tips: [
       
      ]
    }
  },
  {
    id: 'wl-bf-6',
    title: 'Bol de yaourt grec, fruits rouges et graines',
    description: '150 g de yaourt grec nature 0% (ou végétal sans sucre), 1 poignée de fruits rouges (framboises, myrtilles, fraises) ,1 cuillère à soupe de graines de chia ou de lin, 1 cuillère à café de miel (facultatif)',
    category: 'breakfast',
    weightGoal: ['weightLoss'],
    imageUrl: '/amende.avif',
    details: {
      calories: 20,
      preparationTime: 20,
      keyNutrients: [''],
      tips: [
       
      ]
    }
  },
  {
    id: 'wl-ln-1',
    title: 'Poulet grillé',
    description: 'Poulet grillé + riz complet + brocolis vapeur',
    category: 'lunch',
    weightGoal: ['weightLoss'],
    imageUrl: '/filetdinde.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-ln-2',
    title: 'Filet de saumon',
    description: ' Filet de saumon + patate douce rôtie + haricots verts',
    category: 'lunch',
    weightGoal: ['weightLoss'],
    imageUrl: '/dejpoisson.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-ln-3',
    title: 'Salade power ',
    description: ' Salade power : quinoa + pois chiches + avocat + œuf + légumes verts',
    category: 'lunch',
    weightGoal: ['weightLoss'],
    imageUrl: '/salade.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-ln-4',
    title: ' Crevettes sautées à l’ail',
    description: ' Crevettes sautées à l’ail + légumes wok + vermicelles de riz',
    category: 'lunch',
    weightGoal: ['weightLoss'],
    imageUrl: '/dejcrevette.jpg',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-ln-5',
    title: ' Steak haché 5% MG ',
    description: '  Steak haché 5% MG + purée de carottes maison + épinards',
    category: 'lunch',
    weightGoal: ['weightLoss'],
    imageUrl: '/dejsteak.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-ln-6',
    title: ' Wraps complets au poulet',
    description: ' Wraps complets au poulet + légumes + yaourt en sauce',
    category: 'lunch',
    weightGoal: ['weightLoss'],
    imageUrl: '/pouletleg.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-ln-7',
    title: ' Pâtes complètes',
    description: 'Pâtes complètes + filet de dinde + sauce tomate maison + courgettes',
    category: 'lunch',
    weightGoal: ['weightLoss'],
    imageUrl: '/pates.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-dn-1',
    title: 'Cabillaud vapeur',
    description: ' Cabillaud vapeur + riz basmati + courgettes',
    category: 'dinner',
    weightGoal: ['weightLoss'],
    imageUrl: '/courgette.jpg',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-dn-2',
    title: 'Omelette',
    description: '  Omelette + salade verte + avocat',
    category: 'dinner',
    weightGoal: ['weightLoss'],
    imageUrl: '/omelettes.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-dn-3',
    title: 'Soupe maison ',
    description: ' Soupe maison + toast complet + œuf poché',
    category: 'dinner',
    weightGoal: ['weightLoss'],
    imageUrl: '/soupe.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-dn-4',
    title: ' Galettes de pois chiches ',
    description: ' Galettes de pois chiches + légumes rôtis',
    category: 'dinner',
    weightGoal: ['weightLoss'],
    imageUrl: '/poischiches.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-dn-5',
    title: 'Tofu sauté ',
    description: 'Tofu sauté + riz complet + épinards',
    category: 'dinner',
    weightGoal: ['weightLoss'],
    imageUrl: '/épinards.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-dn-6',
    title: 'Falafels au four',
    description: 'Falafels au four + salade grecque',
    category: 'dinner',
    weightGoal: ['weightLoss'],
    imageUrl: '/salade.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'wl-dn-7',
    title: ' Filet de dinde ',
    description: ' Filet de dinde + purée de patate douce + brocolis',
    category: 'dinner',
    weightGoal: ['weightLoss'],
    imageUrl: '/filetdinde.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },

  // PRISE DE MASSE
  {
    id: 'gm-bf-1',
    title: 'Porridge musclé',
    description: 'Flocons d\'avoine + lait entier + banane + beurre de cacahuète',
    category: 'breakfast',
    weightGoal: ['muscleGain'],
    imageUrl: '/laiban.jpg',
    details: {
      calories: 600,
      preparationTime: 15,
      keyNutrients: ['Calories: 600kcal', 'Protéines: 30g', 'Glucides: 80g'],
      tips: [
        'Ajouter des fruits secs',
        'Consommer dans l\'heure qui suit le réveil'
      ]
    }
  },
  
  {
    id: 'gm-bf-2',
    title: 'Tartines complètes',
    description: 'Pain complet + œufs brouillés + avocat + huile d’olive + fromage râpé',
    category: 'breakfast',
    weightGoal: ['muscleGain'],
    imageUrl: '/tarte1.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
    
      ]
    }
  },
  {
    id: 'gm-bf-3',
    title: 'Smoothie calorique maison',
    description: 'Banane + flocons d’avoine + lait entier + cacahuètes + miel + protéine en poudre',
    category: 'breakfast',
    weightGoal: ['muscleGain'],
    imageUrl: '/av.avif',
    details: {
      calories: 20,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
        
      ]
    }
  },
  {
    id: 'gm-bf-4',
    title: 'Crêpes protéinées',
    description: 'Farine complète + œufs + lait + poudre protéinée + sirop d’érable ou miel',
    category: 'breakfast',
    weightGoal: ['muscleGain'],
    imageUrl: '/crepePP.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
     
      ]
    }
  },
  {
    id: 'gm-bf-5',
    title: '. Toast avocat, œufs et fromage + smoothie',
    description: '2 grandes tranches de pain complet ou aux céréales,1 avocat mûr,2 œufs (cuits au plat ou brouillés),1 tranche de fromage (type cheddar ou emmental),1 smoothie maison : lait, banane, fruits rouges, flocons d’avoine, miel',
    category: 'breakfast',
    weightGoal: ['muscleGain'],
    imageUrl: '/omelettes.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
     
      ]
    }
  },
  {
    id: 'gm-ln-1',
    title: 'Poulet rôti + riz + avocat',
    description: 'Cuisson à l\'huile d\'olive avec portion généreuse',
    category: 'lunch',
    weightGoal: ['muscleGain'],
    imageUrl: '/pouletroti.avif',
    details: {
      calories: 10,
      preparationTime: 30,
      keyNutrients: [''],
      tips: [
        'Mariner le poulet au moins 2h',
        'Ajouter des épices'
      ]
    }
  },
  {
    id: 'gm-ln-2',
    title: 'Pâtes complètes + viande hachée + sauce tomate maison',
    description: 'Ajoute du parmesan ou du fromage râpé pour plus de calories',
    category: 'lunch',
    weightGoal: ['muscleGain'],
    imageUrl: '/pates.avif',
    details: {
      calories: 10,
      preparationTime: 30,
      keyNutrients: [''],
      tips: [
       
      ]
    }
  },
  {
    id: 'gm-ln-3',
    title: 'Buddha Bowl prise de masse',
    description: 'Quinoa + pois chiches + patate douce + huile d’olive + œuf ou tofu + avocat',
    category: 'lunch',
    weightGoal: ['muscleGain'],
    imageUrl: '/poischiches.avif',
    details: {
      calories: 10,
      preparationTime: 30,
      keyNutrients: [''],
      tips: [
        
      ]
    }
  },
  {
    id: 'gm-ln-4',
    title: 'Steak de saumon',
    description: 'Steak de saumon + riz basmati + haricots verts + noix de cajou',
    category: 'lunch',
    weightGoal: ['muscleGain'],
    imageUrl: '/dejsteak.avif',
    details: {
      calories: 10,
      preparationTime: 30,
      keyNutrients: [''],
      tips: [
        
      ]
    }
  },
  {
    id: 'gm-dn-1',
    title: 'Omelette aux légumes',
    description: '2 œufs + légumes + fromage râpé + 1 tranche de pain complet',
    category: 'dinner',
    weightGoal: ['muscleGain'],
    imageUrl: '/omelettes.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'gm-dn-2',
    title: ' Poisson ou viande blanche + lentilles + huile de colza',
    description: ' Excellente source de protéines et d’oméga 3',
    category: 'dinner',
    weightGoal: ['muscleGain'],
    imageUrl: '/dejpoisson.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'gm-dn-3',
    title: ' Soupe maison  ',
    description: ' Soupe maison + œufs + pain + huile de noix ou beurres',
    category: 'dinner',
    weightGoal: ['muscleGain'],
    imageUrl: '/soupe.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'gm-dn-4',
    title: ' Gratin de légumes  ',
    description: ' Gratin de légumes + riz + poulet ou tofu + fromage râpé',
    category: 'dinner',
    weightGoal: ['muscleGain'],
    imageUrl: '/gratin.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  

  // MAINTIEN
  {
    id: 'm-bf-1',
    title: 'Fromage blanc + fruits',
    description: '150g de fromage blanc + 1 fruit + graines de lin',
    category: 'breakfast',
    weightGoal: ['maintenance'],
    imageUrl: '/laiban.jpg',
    details: {
      calories: 300,
      preparationTime: 5,
      keyNutrients: ['Protéines: 20g', 'Calcium', 'Fibres'],
      tips: [
        'Choisir des fruits de saison',
        'Moudre les graines de lin'
      ]
    }
  },
  {
    id: 'm-bf-2',
    title: 'Pain complet + œufs + avocat',
    description: '2 tranches + 1 œuf + ¼ avocat + tomate',
    category: 'breakfast',
    weightGoal: ['maintenance'],
    imageUrl: '/omelettes.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
        
      ]
    }
  },
  {
    id: 'm-bf-3',
    title: 'Fromage blanc ou Skyr + fruits + graines',
    description: '150g + 1 fruit (pomme, kiwi, banane) + graines de chia ou lin',
    category: 'breakfast',
    weightGoal: ['maintenance'],
    imageUrl: '/kiwi.avif',
    details: {
      calories: 10,
      preparationTime: 5,
      keyNutrients: [''],
      tips: [
       
      ]
    }
  },
  {
    id: 'm-bf-4',
    title: 'Porridge léger',
    description: '1Flocons d’avoine + lait ou eau + cannelle + fruits rouges',
    category: 'breakfast',
    weightGoal: ['maintenance'],
    imageUrl: '/rouge.jpg',
    details: {
      calories: 10,
      preparationTime: 5,
      keyNutrients: [''],
      tips: [
        
      ]
    }
  },
  {
    id: 'm-bf-5',
    title: 'Crêpes à la banane',
    description: '1 banane + 2 œufs + cannelle + un peu de farine complète (facultatif)',
    category: 'breakfast',
    weightGoal: ['maintenance'],
    imageUrl: '/creban.jpg',
    details: {
      calories: 10,
      preparationTime: 5,
      keyNutrients: [''],
      tips: [
       
      ]
    }
  },
  {
    id: 'm-ln-1',
    title: 'Buddha Bowl équilibré',
    description: 'Quinoa + avocat + légumes rôtis + œuf',
    category: 'lunch',
    weightGoal: ['maintenance'],
    imageUrl: '/pouletleg.avif',
    details: {
      calories: 500,
      preparationTime: 20,
      keyNutrients: ['Protéines: 25g', 'Bons lipides', 'Fibres'],
      tips: [
        'Varier les légumes selon la saison',
        'Utiliser des huiles végétales'
      ]
    }
  },
  {
    id: 'm-ln-2',
    title: 'Poulet grillé + quinoa + courgettes',
    description: 'Cuisson à l’huile d’olive ou au four',
    category: 'lunch',
    weightGoal: ['maintenance'],
    imageUrl: '/filetdinde.avif',
    details: {
      calories: 10,
      preparationTime: 20,
      keyNutrients: [''],
      tips: [
    
      ]
    }
  },
  {
    id: 'm-ln-3',
    title: 'Pâtes semi-complètes ',
    description: 'Pâtes semi-complètes + sauce tomate maison + filet de dinde + salade verte',
    category: 'lunch',
    weightGoal: ['maintenance'],
    imageUrl: '/pates.avif',
    details: {
      calories: 10,
      preparationTime: 20,
      keyNutrients: [''],
      tips: [
        
      ]
    }
  },
  {
    id: 'm-ln-4',
    title: 'Poisson blanc',
    description: 'Poisson blanc + patate douce + brocolis vapeur',
    category: 'lunch',
    weightGoal: ['maintenance'],
    imageUrl: '/defpoisson.avif',
    details: {
      calories: 20,
      preparationTime: 20,
      keyNutrients: [''],
      tips: [
        
      ]
    }
  },
  {
    id: 'm-ln-5',
    title: 'Salade composée',
    description: 'Lentilles + feta + tomates cerises + concombre + huile de colza',
    category: 'lunch',
    weightGoal: ['maintenance'],
    imageUrl: '/salade.avif',
    details: {
      calories: 10,
      preparationTime: 20,
      keyNutrients: [''],
      tips: [
        
      ]
    }
  },
  {
    id: 'm-dn-1',
    title: ' Soupe maison',
    description: 'Soupe maison + tartine complète + fromage ou œuf',
    category: 'dinner',
    weightGoal: ['maintenance'],
    imageUrl: '/soupe.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'm-dn-2',
    title: ' Tofu ou poisson ',
    description: ' Tofu ou poisson + légumes vapeur + riz ou boulgour',
    category: 'dinner',
    weightGoal: ['maintenance'],
    imageUrl: '/dejpoisson.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'm-dn-3',
    title: 'Omelette aux légumes ',
    description: ' Omelette aux légumes + salade verte + une tranche de pain complet',
    category: 'dinner',
    weightGoal: ['maintenance'],
    imageUrl: '/omelettes.avif',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },
  {
    id: 'm-dn-4',
    title: ' Wok de légumes  ',
    description: ' Wok de légumes + crevettes ou tempeh + sauce soja légère',
    category: 'dinner',
    weightGoal:  ['maintenance'],
    imageUrl: '/dejsalade.jpg',
    details: {
      calories: 10,
      preparationTime: 15,
      keyNutrients: [''],
      tips: [
   
      ]
    }
  },

  // COLLATIONS
  {
    id: 'sn-1',
    title: 'Fruits',
    description: 'Fruit + poignée d’amandes ou noix',
    category: 'snack',
    weightGoal: ['muscleGain'],
    imageUrl: '/amende.avif',
    details: {
      calories: 350,
      preparationTime: 5,
      keyNutrients: [''],
      tips: [
        
      ]
    }
  },
  {
    id: 'sn-2',
    title: 'Yaourt nature ',
    description: 'Yaourt nature ou skyr + flocons ou muesli',
    category: 'snack',
    weightGoal: ['maintenance'],
    imageUrl: '/ya.avif',
    details: {
      calories: 10,
      preparationTime: 2,
      keyNutrients: [''],
      tips: [
        
      ]
    }
  },
  {
    id: 'sn-3',
    title: 'Smoothie léger ',
    description: 'Smoothie léger (fruits + eau ou lait végétal)',
    category: 'snack',
    weightGoal: ['maintenance'],
    imageUrl: '/amende.avif',
    details: {
      calories: 10,
      preparationTime: 2,
      keyNutrients: [''],
      tips: [
 
      ]
    }
  },
  {
    id: 'sn-4',
    title: 'Galette de riz ',
    description: 'Galette de riz + purée d’oléagineux (cacahuète, amande)',
    category: 'snack',
    weightGoal: ['maintenance'],
    imageUrl: '/galet.jpg',
    details: {
      calories: 10,
      preparationTime: 2,
      keyNutrients: [''],
      tips: [
      
      ]
    }
  },
  {
    id: 'sn-5',
    title: 'Tranche de pain complet ',
    description: '1 tranche de pain complet + œuf dur ou fromage frais',
    category: 'snack',
    weightGoal: ['maintenance'],
    imageUrl: '/pain.avif',
    details: {
      calories: 10,
      preparationTime: 2,
      keyNutrients: [''],
      tips: [
      
      ]
    }
  }
];

const DietPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<DietCategory | 'all'>('all');
  const [activeGoal, setActiveGoal] = useState<WeightGoal | 'all'>('all');

  const filteredTips = dietTips.filter(tip => {
    const categoryMatch = activeCategory === 'all' || tip.category === activeCategory;
    const goalMatch = activeGoal === 'all' || tip.weightGoal.includes(activeGoal);
    return categoryMatch && goalMatch;
  });

  return (
    <div className="container mx-auto px-4 pt-24 ">
      <h1 className="text-3xl font-bold mb-8 text-center">Guide Nutritionnel Complet</h1>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Objectif</h2>
          <div className="flex flex-wrap gap-2">
            {['all', 'weightLoss', 'muscleGain', 'maintenance'].map(goal => (
              <button
                key={goal}
                onClick={() => setActiveGoal(goal as WeightGoal | 'all')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeGoal === goal 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {goal === 'all' ? 'Tous' : 
                 goal === 'weightLoss' ? 'Perte de poids' :
                 goal === 'muscleGain' ? 'Prise de masse' : 'Maintien'}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Catégorie</h2>
          <div className="flex flex-wrap gap-2">
            {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as DietCategory | 'all')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {cat === 'all' ? 'Toutes' : 
                 cat === 'breakfast' ? 'Petit-déjeuner' :
                 cat === 'lunch' ? 'Déjeuner' :
                 cat === 'dinner' ? 'Dîner' : 'Collations'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredTips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map(tip => (
            <DietCard key={tip.id} dietTip={tip} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Aucun résultat</h3>
          <p className="text-gray-600">
            Essayez de modifier vos filtres de recherche
          </p>
        </div>
      )}
    </div>
  );
};

export default DietPage;