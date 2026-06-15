import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, onSnapshot, db } from '../firebase';
import { Loader2, Flame, Beef, Droplets, Wheat, Utensils } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  imageUrl?: string;
  difficulty: string;
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'recipes'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];
      setRecipes(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Sog'lom Retseptlar</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Mazali va foydali taomlar to'plami.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand" size={48} />
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <motion.div 
              key={recipe.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100"
            >
              <img 
                src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/600/400`} 
                alt={recipe.title}
                className="w-full h-40 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-5">
                <span className="text-[10px] uppercase font-bold text-brand bg-brand-light px-2 py-1 rounded-md mb-2 inline-block">
                  {recipe.difficulty}
                </span>
                <h3 className="text-lg font-bold mb-4 text-slate-900">{recipe.title}</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Flame size={12} className="text-orange-500" /> {recipe.calories} kkal
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Beef size={12} className="text-brand" /> {recipe.protein}g
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Droplets size={12} className="text-blue-500" /> {recipe.fat}g
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Wheat size={12} className="text-amber-600" /> {recipe.carbs}g
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Utensils size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Hozircha retseptlar yo'q</h3>
          <p className="text-slate-500">Tez orada yangi retseptlar qo'shiladi.</p>
        </div>
      )}
    </div>
  );
}
