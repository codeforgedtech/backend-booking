import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDeleteService = async (serviceId: string) => {
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

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setSelectedCategoryId(null);
    setSelectedServiceId(null);
  };

  const handleToggleExpand = (serviceId: string) => {
    setExpandedServiceId(expandedServiceId === serviceId ? null : serviceId);
  };

  const openServiceModal = () => {
    setIsModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
        Hantera Tjänster
      </h2>

      {/* Form to Add or Update Service */}
      <div className="mb-7 w-full">
        <button
          onClick={openServiceModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Lägg till Tjänst</span>
        </button>
      </div>

      {/* Modal to Add or Update Service */}
      {isModalOpen && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-black">Lägg till/uppdatera tjänst</h3>
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
                  <option value="">Välj en kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Spara tjänst
                </button>
                <button
                  type="button"
                  onClick={closeServiceModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-3 hover:bg-gray-400"
                >
                  Stäng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of Services */}
      <div className="mt-4">
  <h3 className="text-lg font-semibold text-gray-800">Tillgängliga Tjänster</h3>
  <ul className="mt-4 space-y-4">
          {services.map((service) => (
            <li key={service.id} className="flex flex-col bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-md flex justify-between items-center">
              <div className="flex justify-between items-center cursor-pointer">
                <div className="font-semibold text-gray-800">{service.name}</div>
              </div>
              <div className="mt-2">
                {expandedServiceId === service.id && (
                  <div>
                    <p className='text-black'><strong>Beskrivning:</strong> {service.description}</p>
                    <p className='text-black'><strong>Pris:</strong> {service.price} SEK</p>
                    <p className='text-black'><strong>Kategori:</strong> {categories.find(cat => cat.id === service.category_id)?.name}</p>
                  </div>
                )}
            <div className="mt-2 flex justify-end space-x-2">
  <button
    onClick={() => setSelectedServiceId(service.id) || openServiceModal()}
    className="mt-2 bg-yellow-600 text-white py-1 px-3 rounded-lg hover:bg-yellow-700 text-sm"
  >
    <FontAwesomeIcon icon={faEdit} />
  </button>
  <button
    onClick={() => handleDeleteService(service.id)}
    className="mt-2 bg-yellow-600 text-white py-1 px-3 rounded-lg hover:bg-yellow-700 text-sm"
  >
    <FontAwesomeIcon icon={faTrash} />
  </button>
  <button
    onClick={() => handleToggleExpand(service.id)}
    className="mt-2 bg-yellow-600 text-white py-1 px-3 rounded-lg hover:bg-yellow-700 text-sm"
  >
    {expandedServiceId === service.id ? 'Dölj' : 'Visa'} detaljer
  </button>
</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceManager;










