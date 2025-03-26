import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [previousPath, setPreviousPath] = useState('/');


  useEffect(() => {
    // Get the previous path from location state or default to '/'
    const location = window.location;
    const prevPath = location.state?.from?.pathname || '/';
    setPreviousPath(prevPath);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Add input validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.msg || 'Login failed. Please try again.');
      }
      
      if (!data || !data.user) {
        throw new Error('Invalid response format from server');
      }
      
      const sessionData = {
        email: data.user.email,
        userId: data.user._id,
        token: data.token,
        name: `${data.user.firstName} ${data.user.lastName}`,
        phone: data.user.phone,
        lastLogin: new Date().toISOString(),
        isAuthenticated: true
      };
      
      // Save to localStorage
      localStorage.setItem('userSession', JSON.stringify(sessionData));
      
      login(sessionData);
      
      navigate(previousPath);
      
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Welcome back!',
          text: `Successfully logged in as ${sessionData.name}`,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          customClass: {
            popup: 'swal-z-index-fix'
          }
        });
      }, 100);
      
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-popup-overlay">
      <div className="login-popup-content">
        <button 
          className="login-popup-close-button"
          onClick={() => navigate('/')}
        >
          ×
        </button>
        
        <div className="login-popup-grid">
          {/* Left panel - Image */}
          <div className="login-popup-image-panel">
            <div className="login-popup-image-container">
              <div className="login-popup-welcome">
                <h2>Welcome Back!</h2>
                <p>Were excited to see you again. Access your account to continue your journey with us.</p>
              </div>
            </div>
          </div>
          
          {/* Right panel - Form */}
          <div className="login-popup-form-panel">
            <h1 className="login-popup-title">Sign In</h1>
            <p className="login-popup-subtitle">Access your account and continue your journey</p>
            
            {error && (
              <div className="login-popup-error">
                {error}
              </div>
            )}
            
            <form className="login-popup-form" onSubmit={handleSubmit}>
              <div className="login-popup-input-group">
                <label htmlFor="email">Email Address</label>
                <div className="login-popup-input-container">
                  <span className="login-popup-input-icon">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="login-popup-input-group">
                <label htmlFor="password">Password</label>
                <div className="login-popup-input-container">
                  <span className="login-popup-input-icon">
                    <FaLock />
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="login-popup-button"
                disabled={loading}
              >
                {loading ? 'Signing in...' : (
                  <>
                    <FaSignInAlt /> Sign In
                  </>
                )}
              </button>
              
              <div className="login-popup-forgot-password">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </form>
            
            <div className="login-popup-divider">
              <span>OR</span>
            </div>
            
            <div className="login-popup-register">
              <p>Dont have an account?</p>
              <Link to="/register" className="login-popup-register-link">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;