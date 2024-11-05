// src/components/ServiceManager.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faInfoCircle, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';


interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
}

const ServiceManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error: supabaseError } = await supabase.from('services').select('*');
      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setServices(data);
      }
    };

    const fetchCategories = async () => {
      const { data, error: supabaseError } = await supabase.from('categories').select('*');
      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setCategories(data);
      }
    };

    fetchServices();
    fetchCategories();
  }, []);

  const handleAddOrUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name || !description || price === '' || !selectedCategoryId) {
      setError('Vänligen fyll i alla fält.');
      return;
    }

    const serviceData = { name, description, price, category_id: selectedCategoryId };

    if (selectedServiceId) {
      const { error: supabaseError } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', selectedServiceId);

      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setSuccess(true);
        resetForm();
        fetchServices();
      }
    } else {
      const { error: supabaseError } = await supabase
        .from('services')
        .insert([serviceData]);

      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setSuccess(true);
        resetForm();
        fetchServices();
      }
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setSelectedCategoryId(null);
    setSelectedServiceId(null);
  };

  const handleEdit = (service: Service) => {
    setName(service.name);
    setDescription(service.description);
    setPrice(service.price);
    setSelectedCategoryId(service.category_id);
    setSelectedServiceId(service.id);
  };

  const handleDelete = async (serviceId: string) => {
    const { error: supabaseError } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      fetchServices();
    }
  };

  const handleToggleExpand = (serviceId: string) => {
    setExpandedServiceId(expandedServiceId === serviceId ? null : serviceId);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
        Hantera Tjänster
      </h2>
      <form onSubmit={handleAddOrUpdateService} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Namn:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded w-full p-3 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Beskrivning:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded w-full p-3 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Pris:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border border-gray-300 rounded w-full p-3 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Kategori:</label>
          <select
            value={selectedCategoryId || ''}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="border border-gray-300 rounded w-full p-3 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          >
            <option value="" disabled>Välj kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Tjänsten har lagts till/uppdaterats!</p>}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          {selectedServiceId ? 'Uppdatera Tjänst' : 'Lägg till Tjänst'}
        </button>
      </form>

      <h3 className="text-xl font-semibold text-gray-800 mt-6">Befintliga Tjänster</h3>
      {services.length === 0 ? (
        <p>Inga tjänster tillgängliga.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {services.map((service) => (
            <li key={service.id} className="flex flex-col mb-2 bg-gray-100 p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => handleToggleExpand(service.id)}>
                <div className="font-semibold text-gray-800">{service.name}</div>
                <FontAwesomeIcon icon={expandedServiceId === service.id ? faChevronUp : faChevronDown} />
              </div>
              {expandedServiceId === service.id && (
                <div className="mt-2">
                  <p className="text-gray-600">{service.description}</p>
                  <p className="text-gray-600">Pris: {service.price} SEK</p>
                  <p className="text-gray-600">Kategori: {categories.find(cat => cat.id === service.category_id)?.name || 'Ingen kategori'}</p>
                </div>
              )}
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServiceManager;









