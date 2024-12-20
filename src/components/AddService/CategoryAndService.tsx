import React from "react";
// Se till att detta importerar din supabase klient
import AddCategory from "./AddCategory";
import CategoryList from "./CategoryList";
import BookingCalendar from "../Dashboard/BookingCalendar";


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
     <BookingCalendar/> 
        </section>

        {/* Lediga tider */}
        <section className="dashboard-section">
          <div className="section-header"></div>
        <CategoryList/>
        </section>
      </div>
    </div>
  );
};

export default Bookis;
