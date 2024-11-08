import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

interface Booking {
  id: string;
  customer_id: string | null;
  service_id: string | null;
  employee_id: string | null; // Lägg till employee_id för att koppla till användare
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string | null;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface Category {
  id: string;
  name: string;
}

interface User {  // Ändra till att hämta användare från users-tabellen
  id: string;
  display_name: string;
}

const BookingsTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Hämta användare istället för employees
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings') // Bokningar
        .select('*')
        .eq('status', 'Confirmed'); // Endast bekräftade bokningar

      if (error) {
        console.error('Error fetching bookings:', error);
        setError(error.message);
      } else {
        setBookings(data);
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

    const fetchCustomers = async () => {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) {
        console.error('Error fetching customers:', error);
      } else {
        setCustomers(data);
      }
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*'); // Hämtar användare
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    };

    fetchBookings();
    fetchServices();
    fetchCategories();
    fetchCustomers();
    fetchUsers(); // Hämta användare
  }, []);

  const groupedBookings = bookings.reduce((acc: Record<string, Booking[]>, booking) => {
    const service = services.find((s) => s.id === booking.service_id);
    const category = categories.find((c) => c.id === service?.category_id);
    const customer = customers.find((cust) => cust.id === booking.customer_id);
    const user = users.find((usr) => usr.id === booking.employee_id); // Hämta användare baserat på employee_id

    // Logga för att kontrollera vad vi får
    console.log(`Bokning ID: ${booking.id}, Employee ID: ${booking.employee_id}, Found User:`, user);

    const categoryName = category ? category.name : 'Okänd kategori';

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push({ ...booking, service, customer, user }); // Lägg till användaren till bokningen
    return acc;
  }, {});

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Bokningar</h2>
      {error && <p className="text-red-500">{error}</p>}
      {Object.keys(groupedBookings).length === 0 ? (
        <p className="text-gray-600">Inga bokade tider just nu.</p>
      ) : (
        Object.keys(groupedBookings).map((categoryName) => (
          <div key={categoryName} className="mb-6">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">{categoryName}</h3>
            {groupedBookings[categoryName].map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4 mb-2 bg-gray-50 flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                  <p className="font-semibold text-gray-800">
                    {booking.service?.name} - {booking.booking_date} kl. {booking.start_time} - {booking.end_time}
                  </p>
                  <p className="text-sm text-red-500">Bokad</p>
                  <p className="text-sm text-gray-600">
                    Kund: {booking.customer?.name} - Telefon: {booking.customer?.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    Utförare: {booking.user?.display_name || 'Ej tilldelad'}
                  </p> {/* Visa vem som är utövare */}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default BookingsTable;













