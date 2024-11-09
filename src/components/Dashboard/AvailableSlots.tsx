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
  provider: string;
}

interface Customer {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
}

const AvailableSlots: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  useEffect(() => {
    const fetchSlots = async () => {
      const { data, error } = await supabase.from('available_slots').select('*').eq('is_booked', false);
      if (error) console.error('Error fetching slots:', error);
      else setSlots(data);
    };

    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*');
      if (error) console.error('Error fetching services:', error);
      else setServices(data);
    };

    const fetchCustomers = async () => {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) console.error('Error fetching customers:', error);
      else setCustomers(data);
    };

    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('users').select('*').eq('role', 'employee');
      if (error) console.error('Error fetching employees:', error);
      else {
        console.log("Fetched employees: ", data);  // Log to verify data
        setEmployees(data);
      }
    };

    fetchSlots();
    fetchServices();
    fetchCustomers();
    fetchEmployees();
  }, []);

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

  const formatTime = (time: string) => time.slice(0, 5);

  const openBookingModal = (slot: Slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSlot(null);
    setSelectedCustomer('');
    setSelectedEmployee('');
    setIsModalOpen(false);
  };

  const handleBookingSubmit = async () => {
    if (!selectedSlot || !selectedCustomer || !selectedEmployee) {
      alert('Please select a customer and an employee.');
      return;
    }

    const { error: updateError } = await supabase
      .from('available_slots')
      .update({ is_booked: true })
      .eq('id', selectedSlot.id);

    if (updateError) {
      console.error('Error updating slot:', updateError);
      alert('Booking failed. Try again.');
      return;
    }

    const { error: insertError } = await supabase.from('bookings').insert({
      customer_id: selectedCustomer,
      employee_id: selectedEmployee,
     
      service_id: selectedSlot.service_id,
      booking_date: selectedSlot.date,
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
      status: 'Confirmed',
    });

    if (insertError) {
      console.error('Error creating booking:', insertError);
      alert('Booking failed. Try again.');
    } else {
      alert('Booking confirmed!');
      closeModal();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tillgängliga Tider</h2>
      <div className="mb-7 w-full">
  <Calendar
    onChange={handleDateChange}
    value={selectedDate}
    tileClassName={({ date }) => {
      const formattedDate = date.toISOString().split('T')[0];
      return slots.some((slot) => slot.date === formattedDate) ? 'bg-green-100' : '';
    }}
    tileContent={({ date }) => {
      const formattedDate = date.toISOString().split('T')[0];
      return slots.some((slot) => slot.date === formattedDate) ? <div className="dot bg-green-400" /> : null;
    }}
    className="w-full"  // Ensure the calendar expands to the full width
  />
</div>


      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {selectedDate ? `Lediga tider för ${selectedDate.toLocaleDateString('sv-SE')}` : 'Välj en dag för att visa tillgängliga tider'}
        </h3>

        {filteredSlots.length > 0 ? (
          <div className="mt-4 space-y-4">
            {filteredSlots.map((slot) => {
              const service = services.find((s) => s.id === slot.service_id);
              return (
                <div key={slot.id} className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-md flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Tid: {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </p>
                    <p className="text-gray-600 text-sm">Tjänst: {service?.name || 'Okänd tjänst'}</p>
                    <p className="text-gray-600 text-sm">Utförare: {service?.provider || 'Okänd utförare'}</p>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => openBookingModal(slot)}>
                    Boka
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          selectedDate && <p className="text-gray-500 mt-4">Inga tillgängliga tider för den här dagen.</p>
        )}
      </div>

      {isModalOpen && selectedSlot && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-black">Bokningsformulär</h3>
            <p className="mb-2 text-black">Tid: {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}</p>
            <p className="mb-4 text-black">Tjänst: {services.find((s) => s.id === selectedSlot.service_id)?.name || 'Okänd tjänst'}</p>

            {/* Customer Selection */}
            <label className="block mb-2">
              <span className="text-gray-700">Kund</span>
              <select className="mt-1 block w-full" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                <option value="">Välj kund</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </label>

            {/* Employee Selection */}
            <label className="block mb-4">
              <span className="text-gray-700">Medarbetare</span>
              <select className="mt-1 block w-full" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                <option value="">Välj medarbetare</option>
                {employees.map((users) => (
                  <option key={users.id} value={users.id}>{users.display_name}</option>
                ))}
              </select>
            </label>

            <button onClick={handleBookingSubmit} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">
              Bekräfta Bokning
            </button>
            <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded-md">
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableSlots;












