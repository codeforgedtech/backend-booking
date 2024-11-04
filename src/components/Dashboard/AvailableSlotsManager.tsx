// src/components/AddAvailableSlot.tsx

import React, { useState } from 'react';
import { supabase } from '../../supabaseClient'; // Se till att detta importerar din supabase klient

const AddAvailableSlot: React.FC = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [serviceId, setServiceId] = useState('');

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('available_slots')
      .insert([{ date, time, service_id: serviceId, is_booked: false }]);

    if (error) {
      console.error('Error adding slot:', error);
    } else {
      alert('Ledig tid tillagd!');
      setDate('');
      setTime('');
      setServiceId('');
    }
  };

  return (
    <form onSubmit={handleAddSlot} className="flex flex-col space-y-4">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border p-2"
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        className="border p-2"
      />
      <input
        type="text"
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
        placeholder="Tjänst ID"
        required
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">Lägg till ledig tid</button>
    </form>
  );
};

export default AddAvailableSlot;
