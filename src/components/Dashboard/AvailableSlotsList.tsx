import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

interface Slot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  service_id: string;
  is_booked: boolean;
}

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

const AvailableSlotsList: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotStartTime, setNewSlotStartTime] = useState('');
  const [newSlotEndTime, setNewSlotEndTime] = useState('');
  const [newSlotServiceId, setNewSlotServiceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      const { data, error } = await supabase
        .from('available_slots')
        .select('*');

      if (error) {
        console.error('Error fetching slots:', error);
      } else {
        setSlots(data);
      }
    };

    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*');
      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data);
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data);
      }
    };

    fetchSlots();
    fetchServices();
    fetchCategories();
  }, []);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!newSlotDate || !newSlotStartTime || !newSlotEndTime || !newSlotServiceId) {
      setError('Vänligen fyll i alla fält.');
      return;
    }

    const { error } = await supabase
      .from('available_slots')
      .insert([{ 
        date: newSlotDate, 
        start_time: newSlotStartTime, 
        end_time: newSlotEndTime, 
        service_id: newSlotServiceId,
        is_booked: false 
      }]);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setNewSlotDate('');
      setNewSlotStartTime('');
      setNewSlotEndTime('');
      setNewSlotServiceId(null);
      fetchSlots();
    }
  };

  const groupedSlots = slots.reduce((acc: Record<string, Slot[]>, slot) => {
    const service = services.find((s) => s.id === slot.service_id);
    const category = categories.find((c) => c.id === service?.category_id);
    const categoryName = category ? category.name : 'Okänd kategori';
    
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push({ ...slot, service });
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mb-66">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Lediga Tider</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Tiden har lagts till!</p>}
      {Object.keys(groupedSlots).length === 0 ? (
        <p className="text-gray-600">Inga lediga tider just nu.</p>
      ) : (
        Object.keys(groupedSlots).map((categoryName) => (
          <div key={categoryName} className="mb-6">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">{categoryName}</h3>
            {groupedSlots[categoryName].map((slot) => (
              <div key={slot.id} className="border rounded-lg p-4 mb-2 bg-gray-50 flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                  <p className="font-semibold text-gray-800">
                    {slot.service?.name} - {slot.date} kl. {slot.start_time} - {slot.end_time}
                  </p>
                  <p className={`text-sm ${slot.is_booked ? 'text-red-500' : 'text-green-500'}`}>
                    {slot.is_booked ? 'Bokad' : 'Ledig'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      <h3 className="text-xl font-semibold text-gray-800 mt-6">Lägg till Ledig Tid</h3>
      <form onSubmit={handleAddSlot} className="mb-4">
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Datum:</label>
          <input
            type="date"
            value={newSlotDate}
            onChange={(e) => setNewSlotDate(e.target.value)}
            className="border border-gray-300 rounded w-full p-2 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Starttid:</label>
          <input
            type="time"
            value={newSlotStartTime}
            onChange={(e) => setNewSlotStartTime(e.target.value)}
            className="border border-gray-300 rounded w-full p-2 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Sluttid:</label>
          <input
            type="time"
            value={newSlotEndTime}
            onChange={(e) => setNewSlotEndTime(e.target.value)}
            className="border border-gray-300 rounded w-full p-2 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Tjänst:</label>
          <select
            value={newSlotServiceId || ''}
            onChange={(e) => setNewSlotServiceId(e.target.value)}
            className="border border-gray-300 rounded w-full p-2 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          >
            <option value="" disabled>Välj tjänst</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Lägg till Ledig Tid
        </button>
      </form>
    </div>
  );
};

export default AvailableSlotsList;


