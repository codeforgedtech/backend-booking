import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ServiceList = () => {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null);
  const [bookingFilter, setBookingFilter] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const fetchData = async () => {
      const { data: servicesData, error: servicesError } = await supabase.from('services').select('*');
      if (servicesError) console.error('Error fetching services:', servicesError);
      else setServices(servicesData);

      const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('*');
      if (categoriesError) console.error('Error fetching categories:', categoriesError);
      else setCategories(categoriesData);

      const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('booking_date, service_id, payment_status');
      if (bookingsError) console.error('Error fetching bookings:', bookingsError);
      else setBookings(bookingsData);
    };

    fetchData();
  }, []);

  const handleToggleExpand = (id: number) => {
    setExpandedServiceId(expandedServiceId === id ? null : id);
  };

  const getBookingsForService = (serviceId: number) => {
    const today = new Date();
    const currentWeek = getWeekNumber(today);
    const currentMonth = today.getMonth();

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.booking_date);
      const bookingWeek = getWeekNumber(bookingDate);
      const bookingMonth = bookingDate.getMonth();

      if (bookingFilter === 'week') {
        return booking.service_id === serviceId && bookingWeek === currentWeek;
      } else if (bookingFilter === 'month') {
        return booking.service_id === serviceId && bookingMonth === currentMonth;
      }

      return false;
    });
  };

  const getWeekNumber = (date: Date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const dayOfYear = Math.floor(diff / oneDay);
    return Math.ceil((dayOfYear + 1) / 7);
  };

  const handleBookingFilterChange = (filter: 'week' | 'month') => {
    setBookingFilter(filter);
  };

  const getBookingStatusData = () => {
    const statusCount = { Paid: 0, Pending: 0, Unpaid: 0 };
    const statusIncome = { Paid: 0, Pending: 0, Unpaid: 0 };

    bookings.forEach((booking) => {
      const service = services.find((s) => s.id === booking.service_id);
      if (service) {
        const price = service.price;
        statusCount[booking.payment_status as 'Paid' | 'Pending' | 'Unpaid']++;
        if (booking.payment_status === 'Paid') {
          statusIncome.Paid += price;
        } else if (booking.payment_status === 'Pending') {
          statusIncome.Pending += price;
        } else {
          statusIncome.Unpaid += price;
        }
      }
    });

    return {
      labels: ['Betald', 'Väntande', 'Obetald'],
      datasets: [
        {
          label: 'Antal Bokningar',
          data: [statusCount.Paid, statusCount.Pending, statusCount.Unpaid],
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Tydligare grön
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Total Inkomst (SEK)',
          data: [statusIncome.Paid, statusIncome.Pending, statusIncome.Unpaid],
          backgroundColor: 'rgba(255, 206, 86, 0.6)', // Tydligare gul
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold text-gray-800">Statestik</h2>
      <div className="mt-4 mb-4">
        <button onClick={() => handleBookingFilterChange('week')} className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2">
          Veckobokningar
        </button>
        <button onClick={() => handleBookingFilterChange('month')} className="bg-green-500 text-white py-2 px-4 rounded-md">
          Månadens Bokningar
        </button>
      </div>
      
      {/* Stapeldiagram över bokningsstatus och inkomster */}
      <div className="my-6">
        <Bar
          data={getBookingStatusData()}
          options={{
            responsive: true,
            scales: {
              x: { stacked: false },
              y: { beginAtZero: true },
            },
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Bokningsstatus och Inkomst' },
            },
          }}
        />
      </div>

      <ul className="list-disc pl-5 space-y-2 mt-4">
        {services.map((service) => {
          const bookingsForService = getBookingsForService(service.id);
          return (
            <li key={service.id} className="flex flex-col mb-2 bg-gray-100 p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-center cursor-pointer">
                <div className="font-semibold text-gray-800">{service.name}</div>
                <div className="text-sm text-gray-500">
                  {bookingsForService.length} bokningar
                </div>
              </div>
              <div className="mt-2">
                {expandedServiceId === service.id && (
                  <div>
                    <div className="mt-4">
                      <h4 className="text-md font-semibold text-gray-700">Bokningar</h4>
                      {bookingsForService.length === 0 ? (
                        <p>Inga bokningar för denna period.</p>
                      ) : (
                        bookingsForService.map((booking) => (
                          <div key={booking.id} className="flex justify-between items-center mt-2">
                            <div className="text-black">Betalning</div>
                            <span className={`text-sm ${
                              booking.payment_status === 'Paid' ? 'text-green-500' :
                              booking.payment_status === 'Pending' ? 'text-yellow-500' :
                              'text-red-500'
                            }`}>
                              {booking.payment_status === 'Paid' ? 'Betald' :
                              booking.payment_status === 'Pending' ? 'Väntande' :
                              'Obetald'}
                            </span>
                            <p className='text-black'>{booking.booking_date}</p>
                            <p className='text-black'>{service.price} SEK</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => handleToggleExpand(service.id)}
                  className="mt-2 bg-yellow-600 text-white py-1 px-3 rounded-lg hover:bg-yellow-700 text-sm"
                >
                  {expandedServiceId === service.id ? 'Dölj' : 'Visa'} detaljer
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ServiceList;








