import React, { useState } from 'react';
import { services, categories, bookings } from './servicesData';

const ServiceList = () => {
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null);
  const [bookingFilter, setBookingFilter] = useState<'week' | 'month'>('week');

  const handleToggleExpand = (id: number) => {
    setExpandedServiceId(expandedServiceId === id ? null : id);
  };

  // Filtrera bokningar per vecka
  const getBookingsForService = (serviceId: number) => {
    const today = new Date();
    const currentWeek = getWeekNumber(today);
    const currentMonth = today.getMonth();

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
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

  // Funktion för att beräkna veckonummer
  const getWeekNumber = (date: Date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const dayOfYear = Math.floor(diff / oneDay);
    return Math.ceil((dayOfYear + 1) / 7);
  };

  // Hantera filterändringar
  const handleBookingFilterChange = (filter: 'week' | 'month') => {
    setBookingFilter(filter);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-800">Tillgängliga Tjänster</h3>
      <div className="mt-4 mb-4">
        <button onClick={() => handleBookingFilterChange('week')} className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2">
          Veckobokningar
        </button>
        <button onClick={() => handleBookingFilterChange('month')} className="bg-green-500 text-white py-2 px-4 rounded-md">
          Månadens Bokningar
        </button>
      </div>
      <ul className="list-disc pl-5 space-y-2 mt-4">
        {services.map((service) => {
          const bookingsForService = getBookingsForService(service.id);
          return (
            <li key={service.id} className="flex flex-col mb-2 bg-gray-100 p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-center cursor-pointer">
                <div className="font-semibold text-gray-800">{service.name}</div>
                {/* Visa antal bokningar */}
                <div className="text-sm text-gray-500">
                  {bookingsForService.length} bokningar
                </div>
              </div>
              <div className="mt-2">
                {expandedServiceId === service.id && (
                  <div>
                    <p><strong>Beskrivning:</strong> {service.description}</p>
                    <p><strong>Pris:</strong> {service.price} SEK</p>
                    <p><strong>Kategori:</strong> {categories.find(cat => cat.id === service.category_id)?.name}</p>

                    <div className="mt-4">
                      <h4 className="text-md font-semibold text-gray-700">Bokningar</h4>
                      {bookingsForService.length === 0 ? (
                        <p>Inga bokningar för denna period.</p>
                      ) : (
                        bookingsForService.map((booking) => (
                          <div key={booking.id} className="flex justify-between items-center mt-2">
                            <span className="text-gray-600">{new Date(booking.date).toLocaleDateString()}</span>
                            <span className={`text-sm ${booking.payment_status === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>
                              {booking.payment_status}
                            </span>
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


