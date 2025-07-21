import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <span className="logo-text">Fittr</span>
          </Link>
        </div>
        
        <div className="navbar-links">
          {currentUser ? (
            <>
              <Link to="/" className="nav-link">Calorie Counter</Link>
              <Link to="/meal-planner" className="nav-link">Meal Planner</Link>
              <Link to="/about" className="nav-link">About Us</Link>
              <Link to="/contact" className="nav-link">Contact Us</Link>
              <button
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/about" className="nav-link">About Us</Link>
              <Link to="/contact" className="nav-link">Contact Us</Link>
              <Link
                to="/login"
                className="login-button"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 