import React from "react";


import AddTime from "./AddTime";
import TimeBooking from "./TimeBooking";
const Bookis: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title"></h1>

      <div className="dashboard-grid">
        {/* Kategori-hantering */}
        <section className="dashboard-section">
          <div className="section-header"></div>
          <AddTime />
        </section>

        {/* Tjänst-hantering */}
        <section className="dashboard-section">
          <div className="section-header"></div>
          <TimeBooking/>
   
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