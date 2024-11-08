import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import './BookingForm.scss';

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
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface Employee {
  id: string;
  name: string;
}

const BookingForm: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]); // Ny state för medarbetare
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>(''); // State för vald medarbetare
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
    fetchServices();
    fetchEmployees(); // Hämta medarbetare vid komponentladdning
  }, []);

  useEffect(() => {
    if (selectedService && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedService, selectedDate]);

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) console.error('Fel vid hämtning av kunder:', error);
    else setCustomers(data);
  };

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('*');
    if (error) console.error('Fel vid hämtning av tjänster:', error);
    else setServices(data);
  };

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) console.error('Fel vid hämtning av medarbetare:', error);
    else setEmployees(data);
  };

  const fetchAvailableSlots = async () => {
    if (selectedService && selectedDate) {
      try {
        // Omvandla selectedDate till rätt format om nödvändigt
        const formattedDate = selectedDate; // Formatera om det behövs, ex. YYYY-MM-DD

        const { data, error } = await supabase
          .from('available_slots')
          .select('*')
          .eq('service_id', selectedService)
          .eq('date', formattedDate)
          .eq('is_booked', false);

        if (error) {
          console.error('Fel vid hämtning av lediga tider:', error);
          setErrorMessage('Fel vid hämtning av lediga tider.');
          setAvailableSlots([]); // Sätt till tom lista om fel uppstår
        } else if (data.length === 0) {
          setErrorMessage('Inga lediga tider tillgängliga för valt datum och tjänst.');
          setAvailableSlots([]);
        } else {
          setErrorMessage(null);
          setAvailableSlots(data);
        }
      } catch (error) {
        console.error('Ett oväntat fel inträffade:', error);
        setErrorMessage('Ett oväntat fel inträffade vid hämtning av lediga tider.');
      }
    }
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedSlot || !selectedCustomer || !selectedEmployee) return; // Kontrollera att slot, kund och medarbetare är valda

    // 1. Uppdatera tillgänglig tid för att markera den som bokad
    const { error: updateError } = await supabase
      .from('available_slots')
      .update({ is_booked: true })
      .eq('id', selectedSlot.id);

    if (updateError) {
      console.error('Fel vid bokning av tjänst:', updateError);
      alert('Bokning misslyckades. Försök igen.');
      return;
    }

    // 2. Infoga en ny bokning i bokningstabellen
    const { error: insertError } = await supabase.from('bookings').insert({
      customer_id: selectedCustomer,
      service_id: selectedService,
      employee_id: selectedEmployee, // Lägg till medarbetarens ID i bokningen
      booking_date: selectedDate,
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
      status: 'Confirmed',
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Fel vid skapande av bokning:', insertError);
      alert('Bokning misslyckades. Försök igen.');
    } else {
      alert('Bokning lyckades!');
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedCustomer('');
    setSelectedService('');
    setSelectedEmployee(''); // Rensa valt medarbetare
    setSelectedDate('');
    setAvailableSlots([]);
    setSelectedSlot(null);
    setErrorMessage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2 className="form-title">Bokningsformulär</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <label className="form-label">
        Kund
        <select
          className="form-select"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">Välj kund</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </label>

      <label className="form-label">
        Tjänst
        <select
          className="form-select"
          value={selectedService}
          onChange={(e) => {
            setSelectedService(e.target.value);
            setAvailableSlots([]);
            setSelectedSlot(null);
          }}
        >
          <option value="">Välj tjänst</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </label>

      <label className="form-label">
        Medarbetare
        <select
          className="form-select"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Välj medarbetare</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </label>

      <label className="form-label">
        Datum
        <input
          type="date"
          className="form-input"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setAvailableSlots([]);
            setSelectedSlot(null);
          }}
        />
      </label>

      <div className="available-slots">
        <h3 className="slots-title">Lediga Tider</h3>
        <ul className="slots-list">
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <li
                key={slot.id}
                className={`slot-item ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {`${slot.start_time} - ${slot.end_time}`}
              </li>
            ))
          ) : (
            <li>Inga lediga tider tillgängliga.</li>
          )}
        </ul>
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={!selectedSlot || !selectedCustomer || !selectedEmployee} // Inaktivera om inte alla val är gjorda
      >
        Boka nu
      </button>
    </form>
  );
};

export default BookingForm;











