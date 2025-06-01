import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import {  MuscleGroup, Difficulty, Equipment, WeightGoal } from '../types';
import { exercises,  getExercisesByEquipment, getExercisesByMuscleGroup } from '../data/exercises';
import ExerciseCard from '../components/workout/ExerciseCard';
import Button from '../components/ui/Button';

const WorkoutsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    muscleGroups: [] as MuscleGroup[],
    difficulties: [] as Difficulty[],
    equipment: [] as Equipment[],
    goals: [] as WeightGoal[],
  });
  
  const handleToggleFilter = (type: keyof typeof filters, value: any) => {
    setFilters(prev => {
      const current = [...prev[type]];
      const index = current.indexOf(value);
      
      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }
      
      return { ...prev, [type]: current };
    });
  };
  
  const clearFilters = () => {
    setFilters({
      muscleGroups: [],
      difficulties: [],
      equipment: [],
      goals: [],
    });
    setSearchTerm('');
  };
  
  const filterExercises = () => {
    let filtered = [...exercises];
    
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        ex => ex.name.toLowerCase().includes(term) || 
              ex.description.toLowerCase().includes(term)
      );
    }
    
    // Muscle group filter
    if (filters.muscleGroups.length > 0) {
      filtered = getExercisesByMuscleGroup(filters.muscleGroups).filter(
        ex => filtered.some(e => e.id === ex.id)
      );
    }
    
    // Difficulty filter
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter(ex => 
        filters.difficulties.includes(ex.difficulty)
      );
    }
    
    // Equipment filter
    if (filters.equipment.length > 0) {
      filtered = getExercisesByEquipment(filters.equipment).filter(
        ex => filtered.some(e => e.id === ex.id)
      );
    }
    
    // Goal filter
    if (filters.goals.length > 0) {
      filtered = filtered.filter(ex => 
        ex.weightGoal.some(goal => filters.goals.includes(goal))
      );
    }
    
    return filtered;
  };
  
  const filteredExercises = filterExercises();
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="font-heading font-bold text-4xl mb-4">Bibliothèque de quelques exercices phares</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
          Parcourez notre collection d'exercices à domicile avec des instructions détaillées pour tous les niveaux de forme physique.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 border border-neutral-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                leftIcon={<Filter size={16} />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              
              <Link to="/generate">
                <Button>Generate Workout</Button>
              </Link>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading font-semibold text-lg">Filters</h3>
                <button 
                  className="text-primary-500 text-sm font-medium"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Muscle Groups */}
                <div>
                  <h4 className="font-medium mb-2">Muscle Groups</h4>
                  <div className="space-y-1">
                    {[
                      { value: 'chest', label: 'Chest' },
                      { value: 'back', label: 'Back' },
                      { value: 'shoulders', label: 'Shoulders' },
                      { value: 'biceps', label: 'Biceps' },
                      { value: 'triceps', label: 'Triceps' },
                      { value: 'legs', label: 'Legs' },
                      { value: 'core', label: 'Core' },
                      { value: 'cardio', label: 'Cardio' },
                      { value: 'fullBody', label: 'Full Body' },
                    ].map((item) => (
                      <label key={item.value} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-primary-500 focus:ring-primary-500 mr-2"
                          checked={filters.muscleGroups.includes(item.value as MuscleGroup)}
                          onChange={() => handleToggleFilter('muscleGroups', item.value)}
                        />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Difficulty */}
                <div>
                  <h4 className="font-medium mb-2">Difficulty</h4>
                  <div className="space-y-1">
                    {[
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' },
                    ].map((item) => (
                      <label key={item.value} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-primary-500 focus:ring-primary-500 mr-2"
                          checked={filters.difficulties.includes(item.value as Difficulty)}
                          onChange={() => handleToggleFilter('difficulties', item.value)}
                        />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Equipment */}
                <div>
                  <h4 className="font-medium mb-2">Equipment</h4>
                  <div className="space-y-1">
                    {[
                      { value: 'none', label: 'No Equipment' },
                      { value: 'dumbbell', label: 'Dumbbells' },
                      { value: 'resistanceBand', label: 'Resistance Bands' },
                      { value: 'bench', label: 'Bench' },
                      { value: 'chair', label: 'Chair' },
                      { value: 'pullUpBar', label: 'Pull-up Bar' },
                      { value: 'yogaMat', label: 'Yoga Mat' },
                    ].map((item) => (
                      <label key={item.value} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-primary-500 focus:ring-primary-500 mr-2"
                          checked={filters.equipment.includes(item.value as Equipment)}
                          onChange={() => handleToggleFilter('equipment', item.value)}
                        />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Goals */}
                <div>
                  <h4 className="font-medium mb-2">Goals</h4>
                  <div className="space-y-1">
                    {[
                      { value: 'weightLoss', label: 'Weight Loss' },
                      { value: 'muscleGain', label: 'Muscle Gain' },
                      { value: 'toning', label: 'Toning' },
                      { value: 'maintenance', label: 'Maintenance' },
                    ].map((item) => (
                      <label key={item.value} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-primary-500 focus:ring-primary-500 mr-2"
                          checked={filters.goals.includes(item.value as WeightGoal)}
                          onChange={() => handleToggleFilter('goals', item.value)}
                        />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <ExerciseCard 
                key={exercise.id} 
                exercise={exercise} 
                onClick={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="font-heading font-semibold text-xl mb-2">No exercises found</h3>
            <p className="text-neutral-600 mb-4">
              Try adjusting your filters or search term to find exercises.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutsPage;