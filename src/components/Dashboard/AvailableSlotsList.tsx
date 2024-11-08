import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
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
  provider: string; // Information om vem som utför tjänsten
}

const AvailableSlotsList: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);

  useEffect(() => {
    const fetchSlots = async () => {
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .eq('is_booked', false);
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

    fetchSlots();
    fetchServices();
  }, []);

  // Filtrera slots för vald dag
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const daySlots = slots.filter((slot) => slot.date === formattedDate);
      setFilteredSlots(daySlots);
    }
  }, [selectedDate, slots]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Formatera tid till HH:mm
  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tillgängliga Tider</h2>

      {/* Kalenderkomponent */}
      <div className="mb-6">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={({ date, view }) => {
            // Markera dagar med tillgängliga tider
            const formattedDate = date.toISOString().split('T')[0];
            return slots.some(slot => slot.date === formattedDate) ? 'bg-green-100' : '';
          }}
          tileContent={({ date, view }) => {
            // Visa punkt om det finns tillgängliga tider på dagen
            const formattedDate = date.toISOString().split('T')[0];
            return slots.some(slot => slot.date === formattedDate) ? <div className="dot bg-green-400" /> : null;
          }}
        />
      </div>

      {/* Visa lediga tider för vald dag */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {selectedDate ? `Lediga tider för ${selectedDate.toLocaleDateString('sv-SE')}` : 'Välj en dag för att visa tillgängliga tider'}
        </h3>

        {filteredSlots.length > 0 ? (
          <div className="mt-4 space-y-4">
            {filteredSlots.map((slot) => {
              const service = services.find((s) => s.id === slot.service_id);
              return (
                <div
                  key={slot.id}
                  className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      Tid: {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Tjänst: {service?.name || 'Okänd tjänst'}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Utförare: {service?.provider || 'Okänd utförare'}
                    </p>
                  </div>
                 
                </div>
              );
            })}
          </div>
        ) : (
          selectedDate && <p className="text-gray-500 mt-4">Inga tillgängliga tider för den här dagen.</p>
        )}
      </div>
    </div>
  );
};

export default AvailableSlotsList;









