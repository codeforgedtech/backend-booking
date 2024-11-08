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

const BusySlotsList: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchSlots = async () => {
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .eq('is_booked', true);

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

  // Helper function to format time to HH:mm
  const formatTime = (time: string) => {
    return time.slice(0, 5); // Returns only the first 5 characters (HH:mm)
  };

  const filteredSlots = slots.filter((slot) => {
    const slotDate = new Date(slot.date);
    return (
      slotDate.getMonth() === currentMonth.getMonth() &&
      slotDate.getFullYear() === currentMonth.getFullYear()
    );
  });

  const groupedSlotsByDate = filteredSlots.reduce((acc: Record<string, Slot[]>, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(date).toLocaleDateString('sv-SE', options);
  };

  const currentMonthLabel = currentMonth.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tillgängliga Tider</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Tiden har lagts till!</p>}

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="text-gray-600 hover:text-gray-800">
          Föregående månad
        </button>
        <h3 className="text-lg font-semibold text-gray-800">{currentMonthLabel}</h3>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="text-gray-600 hover:text-gray-800">
          Nästa månad
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-700">{day}</div>
        ))}

        {Object.keys(groupedSlotsByDate).length === 0 ? (
          <p className="col-span-7 text-gray-600">Inga tillgängliga tider den här månaden.</p>
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
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </p>
                      <p className="text-sm text-red-500">Bokad</p>
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

export default BusySlotsList;







