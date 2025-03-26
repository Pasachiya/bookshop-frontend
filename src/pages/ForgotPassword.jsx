import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import Swal from 'sweetalert2';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.msg || 'An error occurred while processing your request. Please try again.');
      }

      Swal.fire({
        icon: 'success',
        title: 'Email Sent!',
        text: 'If an account exists with this email, you will receive password reset instructions.',
        showConfirmButton: true
      }).then(() => {
        navigate('/login');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'An unexpected error occurred. Please try again later.',
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-content">
        <button 
          className="forgot-password-close-button"
          onClick={() => navigate('/login')}
        >
          ×
        </button>
        
        <div className="forgot-password-grid">
          {/* Left panel - Image */}
          <div className="forgot-password-image-panel">
            <div className="forgot-password-image-container">
              <div className="forgot-password-welcome">
                <h2>Password Recovery</h2>
                <p>Don t worry! It happens to the best of us. Enter your email and we ll send you instructions to reset your password.</p>
              </div>
            </div>
          </div>
          
          {/* Right panel - Form */}
          <div className="forgot-password-form-panel">
            <h1 className="forgot-password-title">Forgot Password?</h1>
            <p className="forgot-password-subtitle">Enter your email address to receive a password reset link</p>
            
            {error && (
              <div className="forgot-password-error">
                {error}
              </div>
            )}
            
            <form className="forgot-password-form" onSubmit={handleSubmit}>
              <div className="forgot-password-input-group">
                <label htmlFor="email">Email Address</label>
                <div className="forgot-password-input-container">
                  <span className="forgot-password-input-icon">
                    <FiMail />
                  </span>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="forgot-password-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
                {!loading && <FiArrowRight />}
              </button>
            </form>
            
            <div className="forgot-password-divider">
              <span>or</span>
            </div>
            
            <div className="forgot-password-register">
              <p>Remember your password?</p>
              <a 
                href="/login" 
                className="forgot-password-register-link"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;