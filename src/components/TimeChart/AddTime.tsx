import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const AddTime: React.FC = () => {
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotStartTime, setNewSlotStartTime] = useState('');
  const [newSlotEndTime, setNewSlotEndTime] = useState('');
  const [newSlotServiceId, setNewSlotServiceId] = useState('');
  const [services, setServices] = useState<{ id: string, name: string }[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('id, name');
      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data);
      }
    };
    fetchServices();
  }, []);

  // Form submission logic
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    // Insert the new slot into the database
    const { data, error } = await supabase.from('available_slots').insert([
      {
        date: newSlotDate,
        start_time: newSlotStartTime,
        end_time: newSlotEndTime,
        service_id: newSlotServiceId,
        is_booked: false,
      },
    ]);

    if (error) {
      console.error('Error adding slot:', error);
      setMessage({ type: 'error', text: 'Kunde inte lägga till ledig tid. Försök igen.' });
    } else {
      setMessage({ type: 'success', text: 'Ledig tid tillagd framgångsrikt!' });
      // Clear form inputs
      setNewSlotDate('');
      setNewSlotStartTime('');
      setNewSlotEndTime('');
      setNewSlotServiceId('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-xl font-semibold text-gray-800 mt-6">Lägg till Ledig Tid</h3>
      {message && (
        <p className={`mb-4 text-${message.type === 'success' ? 'green' : 'red'}-500`}>
          {message.text}
        </p>
      )}
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
            value={newSlotServiceId}
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

export default AddTime;