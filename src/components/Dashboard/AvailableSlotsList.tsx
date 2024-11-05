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
 

  useEffect(() => {
    const fetchSlots = async () => {
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .eq('is_booked', true); // Filter to get only booked slots

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
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Bokningar</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Tiden har lagts till!</p>}
      {Object.keys(groupedSlots).length === 0 ? (
        <p className="text-gray-600">Inga bokade tider just nu.</p>
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
                  <p className="text-sm text-red-500">Bokad</p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default AvailableSlotsList;



