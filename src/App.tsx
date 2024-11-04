// src/App.tsx

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CustomerManager from './components/Customer/CustomerManager';
import BookingForm from './components/Booking/BookingForm';
import BookingTable from './components/Dashboard/BookingsTable';
import Navbar from './components/Navbar/Navbar';

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomerManager />} />
          <Route path="/addBooking" element={<BookingForm />} />
          <Route path="/bookings" element={<BookingTable />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;



