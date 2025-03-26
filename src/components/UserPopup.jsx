import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Added missing import
import './UserPopup.css';

const UserPopup = ({ onClose }) => {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="user-popup-overlay" onClick={onClose}>
      <div className="user-popup" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="user-popup-content">
          <h3 className="popup-title">Account</h3>
          
          {isLoggedIn ? (
            <div className="user-details">
              <div className="user-avatar">
                <div className="avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-name">{user.name || 'User'}</div>
              </div>
              
              <div className="user-info">
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{user.phone}</span>
                  </div>
                )}
              </div>
                
              <div className="user-popup-links">
                <button 
                  className="logout-button" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div> // Added missing closing bracket for user-details
          ) : (
            <div className="login-section">
              <div className="login-image">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <p className="login-message">Sign in to access your account</p>
              <div className="auth-buttons">
                <Link to="/login" className="login-button" onClick={onClose}>Login</Link>
                <Link to="/register" className="register-button" onClick={onClose}>Create Account</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

UserPopup.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default UserPopup;