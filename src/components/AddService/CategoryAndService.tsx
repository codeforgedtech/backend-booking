import React from "react";
// Se till att detta importerar din supabase klient
import AddCategory from "./AddCategory";
import ServicesManager from "../Dashboard/ServicesManager";
import AddTime from "../Dashboard/AddAvailableSlotPage";
import "./CategoryAndService.scss";
import AvailableSlotsList from "../Dashboard/AvailableSlotsList";

const Bookis: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title"></h1>

      <div className="dashboard-grid">
        {/* Kategori-hantering */}
        <section className="dashboard-section">
          <div className="section-header"></div>
          <AddCategory />
        </section>

        {/* Tjänst-hantering */}
        <section className="dashboard-section">
          <div className="section-header"></div>
          <ServicesManager />
        </section>

        {/* Lediga tider */}
        <section className="dashboard-section">
          <div className="section-header"></div>
          <AvailableSlotsList/>
          <AddTime />
        </section>
      </div>
    </div>
  );
};

export default Bookis;
