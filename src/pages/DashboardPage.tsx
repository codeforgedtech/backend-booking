import React from "react";
import "./styles.scss";
import AddEmployee from "../components/Employee/AddEmployee";
import EmployeeList from "../components/Employee/EmployeeList";
import BookingCalendar from "../components/Dashboard/BookingCalendar";
import ServiceList from "../components/ServiceState/ServiceList";

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title"></h1>

      <div className="dashboard-grid">
        {/* Kategori-hantering */}
        <section className="dashboard-section">
          <div className="section-header"></div>
          <BookingCalendar />
        </section>

        {/* Tjänst-hantering */}
        <section className="dashboard-section">
          <div className="section-header"></div>
          <ServiceList/>
        </section>

        {/* Lediga tider */}
        <section className="dashboard-section">
          <div className="section-header"></div>
          <AddEmployee />
          <EmployeeList />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
