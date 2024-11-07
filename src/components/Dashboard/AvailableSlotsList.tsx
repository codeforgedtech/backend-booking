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
      // Fetch available slots (not booked)
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .eq('is_booked', false); // Change here to fetch only available slots

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

  // Group slots by date for calendar layout
  const groupedSlotsByDate = slots.reduce((acc: Record<string, Slot[]>, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {});

  // Helper function to format date into a readable format
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(date).toLocaleDateString('sv-SE', options);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tillgängliga Tider</h2> {/* Updated title */}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Tiden har lagts till!</p>}
      
      {/* Display Calendar-like Grid */}
      <div className="grid grid-cols-7 gap-4">
        {/* Generate Calendar Header */}
        {['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-700">{day}</div>
        ))}

        {/* Render the slots grouped by date */}
        {Object.keys(groupedSlotsByDate).length === 0 ? (
          <p className="col-span-7 text-gray-600">Inga tillgängliga tider just nu.</p>
        ) : (
          Object.keys(groupedSlotsByDate).map((date) => {
            const daySlots = groupedSlotsByDate[date];
            const dayFormatted = formatDate(date);
            return (
              <div key={date} className="flex flex-col items-center border p-2 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">{dayFormatted}</p>
                <div className="space-y-2 mt-2">
                  {daySlots.map((slot) => (
                    <div key={slot.id} className="bg-white rounded-lg p-2 shadow-sm hover:shadow-md">
                      <p className="font-semibold text-gray-800">
                        {slot.start_time} - {slot.end_time}
                      </p>
                      <p className="text-sm text-green-500">Tillgänglig</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AvailableSlotsList;





