import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './AdminLogin.css';

const ADMIN_CREDENTIALS = {
  email: 'admin@bookshop.com',
  password: 'admin123'
};

const AdminLogin = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if credentials match predefined admin credentials
      if (formData.email === ADMIN_CREDENTIALS.email && 
          formData.password === ADMIN_CREDENTIALS.password) {
        
        const sessionData = {
          id: 'admin-1',
          email: ADMIN_CREDENTIALS.email,
          name: 'Admin User',
          token: 'admin-token',
          isAdmin: true,
          isAuthenticated: true
        };

        localStorage.setItem('adminSession', JSON.stringify(sessionData));
        login(sessionData);

        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });

        Swal.fire({
          icon: 'success',
          title: 'Welcome Admin!',
          text: 'Successfully logged in to admin panel',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });
        return;
      }

      // If credentials don't match, throw error
      throw new Error('Invalid credentials');

    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1>Admin Login</h1>
        {error && <div className="admin-login-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <label htmlFor="email">Email Address</label>
            <div className="admin-input-container">
              <FaEnvelope className="admin-input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label htmlFor="password">Password</label>
            <div className="admin-input-container">
              <FaLock className="admin-input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : (
              <>
                <FaSignInAlt /> Login to Admin Panel
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;