// src/components/AddCategory.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

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
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {editCategoryId ? 'Redigera Kategori' : 'Lägg till Kategori'}
      </h2>
      
      {/* Category Form */}
      <form onSubmit={handleAddOrUpdateCategory} className="mb-4">
        {/* Category Name */}
        <div>
          <label htmlFor="name" className="block mb-1 text-gray-700">Namn:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category Description */}
        <div>
          <label htmlFor="description" className="block mb-1 text-gray-700">Beskrivning:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="border border-gray-300 rounded w-full p-2 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Error and Success Messages */}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">Kategorin har lagts till/uppdaterats!</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200"
        >
          {editCategoryId ? 'Uppdatera Kategori' : 'Lägg till Kategori'}
        </button>
      </form>

      {/* Category List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">Tillgängliga Kategorier</h3>
        <ul className="mt-4 space-y-4">
          {categories.map((category) => (
            <li key={category.id} className="flex justify-between items-center bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              <div className="flex-grow">
                <div className="font-semibold text-gray-800">{category.name}</div>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Redigera
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Ta bort
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddCategory;





