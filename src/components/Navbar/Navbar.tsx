import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCog, faClipboardList, faUser, faBook, faPeopleGroup, faClock, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar-container">
      <div className="logo">
        <span className="title">Admin Dashboard</span>
      </div>
      <button className="mobile-menu-icon" onClick={toggleMobileMenu}>
        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
      </button>
      <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            <FontAwesomeIcon icon={faHome} className="icon" />
            Kontrollpaneln
          </Link>
        </li>
        
        <li>
          <Link to="/bookings" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            <FontAwesomeIcon icon={faBook} className="icon" />
            Bokningar
          </Link>
        </li>
     
        <li>
          <Link to="/categories" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            Kategorier
          </Link>
        </li>
        <li>
          <Link to="/add-slot" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            <FontAwesomeIcon icon={faClock} className="icon" />
            Lägg till ledig tid
          </Link>
        </li>
        <li>
          <Link to="/settings" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            <FontAwesomeIcon icon={faCog} className="icon" />
            Inställningar
          </Link>
        </li>
        <li>
          <Link to="/profile" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            <FontAwesomeIcon icon={faUser} className="icon" />
            Profil
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;


