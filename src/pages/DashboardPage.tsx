import React from 'react';

import AddCategory from '../components/AddService/AddCategory';
import ServicesManager from '../components/Dashboard/ServicesManager';
import AvailableSlotsList from '../components/Dashboard/AvailableSlotsList';
import './styles.scss';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title"></h1>
      
      <div className="dashboard-grid">
        {/* Kategori-hantering */}
        <section className="dashboard-section">
          <div className="section-header">
         
          
          </div>
          <AddCategory />
        </section>
        
        {/* Tjänst-hantering */}
        <section className="dashboard-section">
          <div className="section-header">
           
           
          </div>
          <ServicesManager />
        </section>
        
        {/* Lediga tider */}
        <section className="dashboard-section">
          <div className="section-header">
           
            
          </div>
          <AvailableSlotsList />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;









