import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; // Adjust import according to your project structure

interface Customer {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

interface AvailableSlot {
  id: string;
  service_id: string; // Added to match the structure
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean; // Added for clarity
}

const BookingForm: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  useEffect(() => {
    fetchCustomers();
    fetchServices();
  }, []);

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from('customers').select('*'); // Adjust table name
    if (error) console.error('Error fetching customers:', error);
    else setCustomers(data);
  };

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('*');
    if (error) console.error('Error fetching services:', error);
    else setServices(data);
  };

  const fetchAvailableSlots = async () => {
    if (selectedService && selectedDate) {
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .eq('service_id', selectedService)
        .eq('date', selectedDate)
        .eq('is_booked', false); // Fetch only unbooked slots
      if (error) console.error('Error fetching available slots:', error);
      else setAvailableSlots(data);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedSlot) return; // Ensure a slot is selected

    const { error } = await supabase
      .from('available_slots')
      .update({ is_booked: true })
      .eq('id', selectedSlot.id);

    if (error) {
      console.error('Error booking service:', error);
    } else {
      alert('Booking successful!');
      // Optionally reset form or handle further logic
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Booking Form</h2>

      <label className="block mb-2">
        Customer
        <select
          className="mt-1 block w-full p-2 border rounded"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-2">
        Service
        <select
          className="mt-1 block w-full p-2 border rounded"
          value={selectedService}
          onChange={(e) => {
            setSelectedService(e.target.value);
            fetchAvailableSlots();
          }}
        >
          <option value="">Select Service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-2">
        Date
        <input
          type="date"
          className="mt-1 block w-full p-2 border rounded"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            fetchAvailableSlots();
          }}
        />
      </label>

      <label className="block mb-2">
        Time Slot
        <select
          className="mt-1 block w-full p-2 border rounded"
          value={selectedSlot?.id || ''}
          onChange={(e) => {
            const slot = availableSlots.find((s) => s.id === e.target.value);
            setSelectedSlot(slot || null);
          }}
        >
          <option value="">Select Time Slot</option>
          {availableSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {`${slot.start_time} - ${slot.end_time}`}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;



