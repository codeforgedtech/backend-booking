import React from "react";

import EmployeeList from "./EmployeeList";
import AddEmployee from "./AddEmployee";
const Bookis: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title"></h1>

      <div className="dashboard-grid">
        {/* Kategori-hantering */}
        <section className="dashboard-section">
          <div className="section-header"></div>
          <AddEmployee />
        </section>

        {/* Tjänst-hantering */}
        <section className="dashboard-section">
          <div className="section-header"></div>
          <EmployeeList/>
   
        </section>

        {/* Lediga tider */}
        <section className="dashboard-section">
          <div className="section-header">
          
          </div>
        </section>
      </div>
    </div>
  );
};

export default Bookis;