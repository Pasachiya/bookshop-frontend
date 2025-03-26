import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaLock, FaUnlock, FaKey } from 'react-icons/fa';
import './ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Please make sure both passwords are the same'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      Swal.fire({
        icon: 'success',
        title: 'Password Reset Successful',
        text: 'Your password has been updated. Please login with your new password.'
      }).then(() => {
        navigate('/login');
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'An error occurred while resetting your password'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-popup-overlay">
      <div className="reset-password-popup-content">
        <button 
          className="reset-password-popup-close-button"
          onClick={() => navigate('/login')}
        >
          ×
        </button>
        
        <div className="reset-password-popup-grid">
          {/* Left panel - Image */}
          <div className="reset-password-popup-image-panel">
            <div className="reset-password-popup-image-container">
              <div className="reset-password-popup-welcome">
                <h2>Reset Your Password</h2>
                <p>Create a strong new password for your account to keep your information secure.</p>
              </div>
            </div>
          </div>
          
          {/* Right panel - Form */}
          <div className="reset-password-popup-form-panel">
            <h1 className="reset-password-popup-title">New Password</h1>
            <p className="reset-password-popup-subtitle">Please create a secure password that youll remember</p>
            
            <form className="reset-password-popup-form" onSubmit={handleSubmit}>
              <div className="reset-password-popup-input-group">
                <label htmlFor="password">New Password</label>
                <div className="reset-password-popup-input-container">
                  <span className="reset-password-popup-input-icon">
                    <FaLock />
                  </span>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              
              <div className="reset-password-popup-input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="reset-password-popup-input-container">
                  <span className="reset-password-popup-input-icon">
                    <FaKey />
                  </span>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="reset-password-popup-button"
                disabled={loading}
              >
                {loading ? 'Resetting...' : (
                  <>
                    <FaUnlock /> Set New Password
                  </>
                )}
              </button>
            </form>
            
            <div className="reset-password-popup-divider">
              <span>OR</span>
            </div>
            
            <div className="reset-password-popup-login">
              <p>Remember your password?</p>
              <button 
                onClick={() => navigate('/login')} 
                className="reset-password-popup-login-link"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;