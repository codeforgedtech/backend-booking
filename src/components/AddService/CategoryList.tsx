import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faChevronDown, faChevronUp, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

const CategoryWithServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch services and categories when the component is mounted
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*');
      if (error) {
        setError(error.message);
      } else {
        setServices(data || []);
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        setError(error.message);
      } else {
        setCategories(data || []);
      }
    };

    fetchServices();
    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId);
  };

  const handleToggleExpand = (serviceId: string) => {
    setExpandedServiceId(serviceId === expandedServiceId ? null : serviceId);
  };

  const handleDeleteService = async (serviceId: string) => {
    const { error } = await supabase.from('services').delete().eq('id', serviceId);
    if (error) {
      setError(error.message);
    } else {
      setServices(services.filter(service => service.id !== serviceId));
    }
  };

  const openServiceModal = (categoryId: string, service?: Service) => {
    if (service) {
      setSelectedServiceId(service.id);
      setName(service.name);
      setDescription(service.description);
      setPrice(service.price);
      setSelectedCategoryId(service.category_id);
    } else {
      setSelectedServiceId(null);
      setName('');
      setDescription('');
      setPrice(0);
      setSelectedCategoryId(categoryId);
    }
    setIsModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsModalOpen(false);
    setName('');
    setDescription('');
    setPrice(0);
    setSelectedCategoryId(null);
    setError(null);
  };

  const handleAddOrUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      name,
      description,
      price,
      category_id: selectedCategoryId,
    };

    if (selectedServiceId) {
      const { error } = await supabase.from('services').update(serviceData).eq('id', selectedServiceId);
      if (error) {
        setError(error.message);
      } else {
        setServices(services.map(s => (s.id === selectedServiceId ? { ...s, ...serviceData } : s)));
        closeServiceModal();
      }
    } else {
      const { data, error } = await supabase.from('services').insert(serviceData).select().single();
      if (error) {
        setError(error.message);
      } else {
        setServices([...services, data]);
        closeServiceModal();
      }
    }
  };

  return (
    <div className="category-list-container">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
        Hantera Tjänster
      </h2>

      {/* Categories with collapsible services */}
      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.id} className="category-section mb-6">
            <div
              onClick={() => toggleCategory(category.id)}
              className="flex justify-between items-center cursor-pointer text-xl font-bold text-gray-800"
            >
              <h3>{category.name}</h3>
              <FontAwesomeIcon
                icon={expandedCategoryId === category.id ? faChevronUp : faChevronDown}
                className="text-gray-600"
              />
            </div>
            {expandedCategoryId === category.id && (
              <div>
                <ul className="mt-4 space-y-4">
                  {services
                    .filter(service => service.category_id === category.id)
                    .map((service) => (
                      <li
                        key={service.id}
                        className="flex flex-col bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-md"
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-semibold text-gray-800">{service.name}</div>
                        </div>
                        <div className="mt-2">
                          {expandedServiceId === service.id && (
                            <div>
                              <p className="text-black"><strong>Beskrivning:</strong> {service.description}</p>
                              <p className="text-black"><strong>Pris:</strong> {service.price} SEK</p>
                            </div>
                          )}
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              onClick={() => openServiceModal(category.id, service)}
                              className="bg-yellow-600 text-white py-1 px-3 rounded-lg hover:bg-yellow-700 text-sm"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="bg-yellow-600 text-white py-1 px-3 rounded-lg hover:bg-yellow-700 text-sm"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <button
                              onClick={() => handleToggleExpand(service.id)}
                              className="bg-yellow-600 text-white py-1 px-3 rounded-lg hover:bg-yellow-700 text-sm"
                            >
                              {expandedServiceId === service.id ? 'Dölj' : 'Visa'} detaljer
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
                <button
                  onClick={() => openServiceModal(category.id)}
                  className="mt-4 bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 text-sm flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Lägg till tjänst</span>
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-700">Inga kategorier tillgängliga.</p>
      )}

      {/* Modal for adding/updating a service */}
      {isModalOpen && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-black">Lägg till/uppdatera tjänst</h3>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
    </div>
  );
};

export default CategoryWithServices;








