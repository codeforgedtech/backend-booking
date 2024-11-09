import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './BookingCalendar.scss'
interface Booking {
  id: string;
  customer_id: string | null;
  service_id: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  employee_id: string | null;
}

interface Service {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  display_name: string;
}

interface Customer {
  id: string;
  name: string;
}

const BookingCalendar: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    // Fetch all bookings from the database
    const fetchBookings = async () => {
      const { data, error } = await supabase.from('bookings').select('*');
      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data);
      }
    };

    // Fetch employees, services, and customers from the database
    const fetchEmployeesAndServices = async () => {
      const [employeesRes, servicesRes, customersRes] = await Promise.all([
        supabase.from('users').select('id, display_name'),
        supabase.from('services').select('id, name'),
        supabase.from('customers').select('id, name')
      ]);

      if (employeesRes.error || servicesRes.error || customersRes.error) {
        console.error('Error fetching employees, services, or customers:', employeesRes.error || servicesRes.error || customersRes.error);
      } else {
        setEmployees(employeesRes.data || []);
        setServices(servicesRes.data || []);
        setCustomers(customersRes.data || []);
      }
    };

    fetchBookings();
    fetchEmployeesAndServices();
  }, []);

  useEffect(() => {
    // Filter bookings for the selected date
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate.toLocaleDateString() === selectedDate.toLocaleDateString();
    });

    setSelectedBookings(filteredBookings);
  }, [bookings, selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const getEmployeeName = (employeeId: string | null) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? employee.display_name : 'Ej tilldelad';
  };

  const getServiceName = (serviceId: string | null) => {
    const service = services.find((svc) => svc.id === serviceId);
    return service ? service.name : 'Ingen tjänst';
  };

  const getCustomerName = (customerId: string | null) => {
    const customer = customers.find((cust) => cust.id === customerId);
    return customer ? customer.name : 'Ingen kund';
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md mb-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
      Bokningar för {selectedDate.toLocaleDateString()}
    </h2>
    
    <div className="mb-7 w-full">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName="calendar-tile"
        className="react-calendar w-full"
      />
    </div>
  
    {selectedBookings.length === 0 ? (
      <p className="text-gray-600 text-center">Inga bokningar för den här dagen.</p>
    ) : (
      <div>
        {selectedBookings.map((booking) => (
          <div
            key={booking.id}
            className="border rounded-lg p-4 mb-2 bg-gray-100 hover:bg-gray-200 transition-all flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {getServiceName(booking.service_id)} - {booking.start_time} - {booking.end_time}
              </p>
              <p className="text-sm text-red-500">Status: {booking.status}</p>
              <p className="text-sm text-gray-600">
                Kund: {getCustomerName(booking.customer_id)} <p/>Utförs: {getEmployeeName(booking.employee_id)}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  );
};

export default BookingCalendar;


