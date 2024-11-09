// src/components/AddAvailableSlot.tsx

import React from "react";
// Se till att detta importerar din supabase klient
import BookingsTable from "./BookingsTable";

import "./Bookis.scss";
import CustomerManager from "../Customer/CustomerManager";

import AvailableSlotsList from "./AvailableSlotsList";
import AvailableSlots from "./AvailableSlots";
const Bookis: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title"></h1>

      <div className="dashboard-grid">
        {/* Kategori-hantering */}
        <section className="dashboard-section">
          <div className="section-header"></div>
          <BookingsTable />
        </section>

        {/* Tjänst-hantering */}
        <section className="dashboard-section">
          <div className="section-header"></div>

          <AvailableSlots />
        </section>

        {/* Lediga tider */}
        <section className="dashboard-section">
          <div className="section-header">
            <CustomerManager />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Bookis;
