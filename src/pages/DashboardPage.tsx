// src/pages/DashboardPage.tsx

import React from 'react';
import { DocumentCheckIcon, CogIcon, ClockIcon } from '@heroicons/react/24/solid'; // Importing icons
import AddCategory from '../components/AddService/AddCategory';
import ServicesManager from '../components/Dashboard/ServicesManager';
import AvailableSlotsList from '../components/Dashboard/AvailableSlotsList';
import './styles.scss'; // Import the Sass file

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-container flex flex-col">
      <h1>Admin Dashboard</h1>
      
      
      <div className="flex flex-wrap -mx-4">
        {/* Kategori-hantering */}
        <section className="section mb-6">
          <div className="header">
            <DocumentCheckIcon />
            
          </div>
          <AddCategory />
        </section>
        
        {/* Tjänst-hantering */}
        <section className="section mb-6">
          <div className="header">
            <CogIcon />

          </div>
          <ServicesManager />
        </section>
        
        {/* Lediga tider */}
        <section className="section mb-6">
          <div className="header">
            <ClockIcon />
            
          </div>
          <AvailableSlotsList />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;







