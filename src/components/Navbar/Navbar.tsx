import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCog, faClipboardList, faUser, faBook } from '@fortawesome/free-solid-svg-icons';
import './Navbar.scss';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar-container">
      <div className="logo">
        {/* Add your logo path */}
        <span className="title">Admin Dashboard</span>
      </div>
      <ul>
        <li>
          <Link to="/" className="hover:text-gray-300">
            <FontAwesomeIcon icon={faHome} className="icon" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/services" className="hover:text-gray-300">
            <FontAwesomeIcon icon={faBook} className="icon" />
            Bokningar
          </Link>
        </li>
        <li>
          <Link to="/categories" className="hover:text-gray-300">
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            Kategorier
          </Link>
        </li>
        <li>
          <Link to="/settings" className="hover:text-gray-300">
            <FontAwesomeIcon icon={faCog} className="icon" />
            Inställningar
          </Link>
        </li>
        <li>
          <Link to="/profile" className="hover:text-gray-300">
            <FontAwesomeIcon icon={faUser} className="icon" />
            Profil
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

