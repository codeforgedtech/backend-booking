import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './BookingsTable.module.scss';

interface Booking {
  id: string;
  customer_name: string;
  service_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

const BookingsTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          start_time,
          end_time,
          status,
          customers ( name ),
          services ( name )
        `);

      if (error) {
        console.error('Fel vid hämtning av bokningar:', error);
        setError('Kunde inte hämta bokningar.');
      } else {
        setBookings(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((item: any) => ({
            id: item.id,
            customer_name: item.customers.name,
            service_name: item.services.name,
            booking_date: item.booking_date,
            start_time: item.start_time,
            end_time: item.end_time,
            status: item.status,
          }))
        );
      }
    };

    fetchBookings();
  }, []);
  return (
    <div className={styles['table-container']}>
      <div className={styles['table-wrapper']}>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <table>
          <thead>
            <tr>
              <th>Kund</th>
              <th>Tjänst</th>
              <th>Datum</th>
              <th>Tid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length ? bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.customer_name}</td>
                <td>{booking.service_name}</td>
                <td>{booking.booking_date}</td>
                <td>{`${booking.start_time} - ${booking.end_time}`}</td>
                <td className={`status ${booking.status.toLowerCase()}`}>{booking.status}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500">Inga bokningar tillgängliga.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;




