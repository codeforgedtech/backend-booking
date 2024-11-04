// src/components/CategoryList.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import './CategoryList.scss'; // Importing the Sass file

interface Category {
  id: string;
  name: string;
  description: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error: supabaseError } = await supabase.from('categories').select('*');
      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="category-list-container">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kategorier</h2>
      {error && <p className="error-message">{error}</p>}
      {categories.length === 0 ? (
        <p>Inga kategorier tillgängliga.</p>
      ) : (
        <ul className="list-disc pl-5">
          {categories.map((category) => (
            <li key={category.id} className="mb-2">
              <div className="font-semibold text-gray-800">{category.name}</div>
              {category.description && <p className="text-gray-600">{category.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;

