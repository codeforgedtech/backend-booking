// src/App.tsx

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';

import Navbar from './components/Navbar/Navbar';

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
      
        </Routes>
      </div>
    </div>
  );
};

export default App;



