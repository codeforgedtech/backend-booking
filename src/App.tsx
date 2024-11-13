// src/App.tsx

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CustomerManager from './components/Customer/CustomerManager';
import BookingForm from './components/Booking/BookingForm';
import Category from './components/AddService/CategoryAndService'
import Navbar from './components/Navbar/Navbar';
import TimeChart from './components/TimeChart/TimeChart'
import AddAvailableSlotPage from './components/Dashboard/AddAvailableSlotPage';
import Bookis from './components/Dashboard/AvailableSlotsManager';
import ProtectRoute from './components/Authentication/ProtectedRoute'; // Import ProtectRoute
import LoginModal from './components/Authentication/LoginModal'; // Assuming LoginModal is your login page component
import AddEmployee from './components/Employee/Employeer';

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginModal />} />

        {/* Protected Routes */}
        <Route element={<ProtectRoute />}>
          {/* Navbar only displays for authenticated users */}
          <Route path="/" element={<><Navbar /><DashboardPage /></>} />
          <Route path="/customers" element={<><Navbar /><CustomerManager /></>} />
          <Route path="/addBooking" element={<><Navbar /><BookingForm /></>} />
          <Route path="/categories" element={<><Navbar /><Category /></>} />
          <Route path="/time" element={<><Navbar /><TimeChart /></>} />
          <Route path="/employeer" element={<><Navbar /><AddEmployee /></>} />
          <Route path="/bookings" element={<><Navbar /><Bookis /></>} />
          <Route path="/add-slot" element={<><Navbar /><AddAvailableSlotPage /></>} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;





