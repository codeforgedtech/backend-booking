import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faUser, faBook, faClock, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../supabaseClient';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
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

        {/* Profile Dropdown */}
        <li className="relative">
          <button onClick={toggleProfileDropdown} className="hover:text-gray-300">
            <FontAwesomeIcon icon={faUser} className="icon" />
            Profil
          </button>
          {isProfileDropdownOpen && (
            <ul className="profile-dropdown absolute bg-white shadow-md mt-2 rounded-md">
              <li>
                <Link to="/profile" className="hover:text-gray-300 px-4 py-2 block" onClick={() => setIsProfileDropdownOpen(false)}>
                  Profil
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-gray-300 px-4 py-2 block" onClick={() => setIsProfileDropdownOpen(false)}>
                  Inställningar
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:text-gray-300 px-4 py-2 block w-full text-left">
                  Logga ut
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;




