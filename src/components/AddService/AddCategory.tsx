// src/components/AddCategory.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'; // Importing icons
import './AddCategory.scss'; // Importing the Sass file

interface Category {
  id: string;
  name: string;
  description: string;
}

const AddCategory: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);

  const fetchCategories = async () => {
    const { data, error: supabaseError } = await supabase.from('categories').select('*');
    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddOrUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name) {
      setError('Vänligen fyll i kategori-namn.');
      return;
    }

    if (editCategoryId) {
      // Update existing category
      const { error: supabaseError } = await supabase
        .from('categories')
        .update({ name, description })
        .eq('id', editCategoryId);

      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setSuccess(true);
        resetForm();
        fetchCategories();
      }
    } else {
      // Add new category
      const { error: supabaseError } = await supabase
        .from('categories')
        .insert([{ name, description }]);

      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setSuccess(true);
        resetForm();
        fetchCategories();
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditCategoryId(category.id);
    setName(category.name);
    setDescription(category.description || '');
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const { error: supabaseError } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      fetchCategories();
    }
  };

  const resetForm = () => {
    setEditCategoryId(null);
    setName('');
    setDescription('');
  };

  return (
    <div className="add-category-container">
      <h2>{editCategoryId ? 'Redigera Kategori' : 'Lägg till Kategori'}</h2>
      <form onSubmit={handleAddOrUpdateCategory}>
        <div className="mb-4">
          <label>Namn:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label>Beskrivning:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Kategorin har lagts till/uppdaterats!</p>}
        <button type="submit">{editCategoryId ? 'Uppdatera Kategori' : 'Lägg till Kategori'}</button>
      </form>

      <h2 className="mt-6">Existerande Kategorier</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="flex justify-between items-center mb-2">
            <div>
             
              {category.name && <p className="text-black">{category.name}</p>}
            </div>
            <div className="flex items-center">
            <button className="icon-button text-blue-500" onClick={() => handleEditCategory(category)}>
  <PencilIcon />
</button>
<button className="icon-button text-red-500" onClick={() => handleDeleteCategory(category.id)}>
  <TrashIcon />
</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddCategory;




