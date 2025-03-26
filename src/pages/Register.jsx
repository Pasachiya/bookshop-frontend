import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Account created successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="register-popup-overlay">
        <div className="register-popup-content">
          <button
            className="register-popup-close-button"
            onClick={() => navigate("/")}
          >
            ×
          </button>
          
          <div className="register-popup-grid">
            {/* Left panel with image/graphics */}
            <div className="register-popup-image-panel">
              <div className="register-popup-image-container">
                <div className="register-popup-welcome">
                  <h2>Welcome to Our Community</h2>
                  <p>Create an account to get started with our services and explore all the features we offer.</p>
                </div>
              </div>
            </div>
            
            {/* Right panel with form */}
            <div className="register-popup-form-panel">
              <h1 className="register-popup-title">Create Account</h1>
              <p className="register-popup-subtitle">Fill in your details to get started</p>
              
              {error && <div className="register-popup-error">{error}</div>}
              {success && <div className="register-popup-success">{success}</div>}
              
              <form onSubmit={handleSubmit} className="register-popup-form">
                <div className="register-popup-form-row">
                  <div className="register-popup-input-group">
                    <label>First Name</label>
                    <div className="register-popup-input-container">
                      <span className="register-popup-input-icon">👤</span>
                      <input
                        type="text"
                        name="firstName"
                        required
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="register-popup-input-group">
                    <label>Last Name</label>
                    <div className="register-popup-input-container">
                      <span className="register-popup-input-icon">👤</span>
                      <input
                        type="text"
                        name="lastName"
                        required
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="register-popup-form-row">
                  <div className="register-popup-input-group">
                    <label>Email Address</label>
                    <div className="register-popup-input-container">
                      <span className="register-popup-input-icon">✉️</span>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="register-popup-input-group">
                    <label>Phone Number</label>
                    <div className="register-popup-input-container">
                      <span className="register-popup-input-icon">📱</span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="register-popup-input-group">
                  <label>Address</label>
                  <div className="register-popup-input-container">
                    <span className="register-popup-input-icon">🏠</span>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Enter street address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="register-popup-form-row">
                  <div className="register-popup-input-group">
                    <label>City</label>
                    <div className="register-popup-input-container">
                      <span className="register-popup-input-icon">🏙️</span>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="register-popup-input-group">
                    <label>District</label>
                    <div className="register-popup-input-container">
                      <span className="register-popup-input-icon">📍</span>
                      <select
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                      >
                        <option value="">Select District</option>
                        <option value="Ampara">Ampara</option>
                        <option value="Anuradhapura">Anuradhapura</option>
                        <option value="Badulla">Badulla</option>
                        <option value="Batticaloa">Batticaloa</option>
                        <option value="Colombo">Colombo</option>
                        <option value="Galle">Galle</option>
                        <option value="Gampaha">Gampaha</option>
                        <option value="Hambantota">Hambantota</option>
                        <option value="Jaffna">Jaffna</option>
                        <option value="Kalutara">Kalutara</option>
                        <option value="Kandy">Kandy</option>
                        <option value="Kegalle">Kegalle</option>
                        <option value="Kilinochchi">Kilinochchi</option>
                        <option value="Kurunegala">Kurunegala</option>
                        <option value="Mannar">Mannar</option>
                        <option value="Matale">Matale</option>
                        <option value="Matara">Matara</option>
                        <option value="Monaragala">Monaragala</option>
                        <option value="Mullaitivu">Mullaitivu</option>
                        <option value="Nuwara Eliya">Nuwara Eliya</option>
                        <option value="Polonnaruwa">Polonnaruwa</option>
                        <option value="Puttalam">Puttalam</option>
                        <option value="Ratnapura">Ratnapura</option>
                        <option value="Trincomalee">Trincomalee</option>
                        <option value="Vavuniya">Vavuniya</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="register-popup-input-group">
                    <label>ZIP Code</label>
                    <div className="register-popup-input-container">
                      <span className="register-popup-input-icon">🔢</span>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="register-popup-form-row">
                  <div className="register-popup-input-group">
                    <label>Password</label>
                    <div className="register-popup-input-container">
                      <span className="register-popup-input-icon">🔒</span>
                      <input
                        type="password"
                        name="password"
                        required
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="register-popup-input-group">
                    <label>Confirm Password</label>
                    <div className="register-popup-input-container">
                      <span className="register-popup-input-icon">🔒</span>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="register-popup-button"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
                
                <div className="register-popup-divider">
                  <span>or</span>
                </div>
                
                <div className="register-popup-login">
                  <p>Already have an account?</p>
                  <a href="/login" className="register-popup-login-link">
                    Log in to your account
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;