// src/components/AddService.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

interface Category {
  id: string;
  name: string;
}

const AddService: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name || !description || price === undefined || !categoryId) {
      setError('Vänligen fyll i alla fält.');
      return;
    }

    const { data, error: supabaseError } = await supabase
      .from('services')
      .insert([{ name, description, price, category_id: categoryId }]);

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setSuccess(true);
      setName('');
      setDescription('');
      setPrice(undefined);
      setCategoryId('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl mb-4">Lägg till Tjänst</h2>
      <form onSubmit={handleAddService}>
        <div className="mb-4">
          <label className="block mb-1">Namn:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Beskrivning:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Pris:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Kategori:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border rounded w-full p-2"
            required
          >
            <option value="">Välj kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Tjänsten har lagts till!</p>}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Lägg till Tjänst
        </button>
      </form>
    </div>
  );
};

export default AddService;

