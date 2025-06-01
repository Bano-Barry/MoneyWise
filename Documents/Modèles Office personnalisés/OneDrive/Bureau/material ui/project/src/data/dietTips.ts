import { DietTip } from '../types';

export const dietTips: DietTip[] = [
  {
    id: 'tip-001',
    title: 'Petit-déjeuner Riche en Protéines',
    description: 'Commencez votre journée avec un petit-déjeuner riche en protéines pour développer les muscles et réduire les fringales. Options : œufs, yaourt grec, smoothies protéinés ou porridge avec de la poudre de protéines.',
    category: 'breakfast',
    weightGoal: ['muscleGain', 'toning', 'maintenance'],
    imageUrl: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'tip-002',
    title: 'Contrôle des Portions',
    description: 'Utilisez des assiettes plus petites pour aider à contrôler la taille des portions. Cette astuce visuelle simple peut vous aider à consommer moins de calories sans vous sentir privé.',
    category: 'general',
    weightGoal: ['weightLoss', 'maintenance'],
    imageUrl: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'tip-003',
    title: 'Nutrition Post-Entraînement',
    description: 'Consommez une combinaison de protéines et de glucides dans les 30-60 minutes après votre entraînement pour optimiser la récupération et la croissance musculaire. Bonnes options : une banane avec un shake protéiné ou une wrap dinde et avocat.',
    category: 'general',
    weightGoal: ['muscleGain', 'toning'],
    imageUrl: 'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'tip-004',
    title: 'Importance de l\'Hydratation',
    description: 'Buvez au moins 8 verres d\'eau par jour. Parfois, la soif peut être confondue avec la faim, conduisant à une consommation inutile de calories. Restez hydraté pour maintenir votre niveau d\'énergie et soutenir les fonctions métaboliques.',
    category: 'general',
    weightGoal: ['weightLoss', 'muscleGain', 'toning', 'maintenance'],
    imageUrl: 'https://images.pexels.com/photos/1346155/pexels-photo-1346155.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'tip-005',
    title: 'Options de Collations Saines',
    description: 'Gardez des collations saines à portée de main pour éviter de vous tourner vers des aliments transformés quand la faim frappe. Bonnes options : noix, yaourt grec, fruits avec du beurre de noix ou bâtonnets de légumes avec houmous.',
    category: 'snack',
    weightGoal: ['weightLoss', 'maintenance', 'toning'],
    imageUrl: 'https://images.pexels.com/photos/5938/food-salad-healthy-lunch.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'tip-006',
    title: 'Déjeuners Riches en Protéines',
    description: 'Concentrez-vous sur les protéines maigres pour le déjeuner comme le poulet, le poisson, le tofu ou les légumineuses. Accompagnez de beaucoup de légumes et d\'une portion modérée de glucides complexes comme le riz brun ou les patates douces.',
    category: 'lunch',
    weightGoal: ['muscleGain', 'toning', 'maintenance'],
    imageUrl: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'tip-007',
    title: 'Assiette Équilibrée',
    description: 'Suivez la méthode de l\'assiette : remplissez la moitié de légumes non féculents, un quart de protéines maigres et un quart de céréales complètes ou légumes féculents.',
    category: 'dinner',
    weightGoal: ['weightLoss', 'maintenance', 'toning'],
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'tip-008',
    title: 'Aliments Caloriques pour la Prise de Masse',
    description: 'Incluez des aliments denses en calories et riches en nutriments comme les avocats, les noix, l\'huile d\'olive et les fruits secs pour augmenter sainement votre apport calorique lors de la prise de masse.',
    category: 'general',
    weightGoal: ['muscleGain'],
    imageUrl: 'https://images.pexels.com/photos/616404/pexels-photo-616404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

export const getDietTipsByGoal = (goal: string) => {
  return dietTips.filter(tip => tip.weightGoal.includes(goal as any));
};

export const getDietTipsByCategory = (category: string) => {
  if (!category || category === 'all') return dietTips;
  return dietTips.filter(tip => tip.category === category);
};