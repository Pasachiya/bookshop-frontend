import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import './Contact.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DynamicStars from '../components/DynamicStars';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });

  const [focused, setFocused] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form validation could be added here
    setFormStatus({
      submitted: true,
      error: false,
      message: 'Thanks for reaching out! We\'ll get back to you soon.'
    });
    console.log('Form submitted:', formData);
    
    // Reset form after successful submission
    // setTimeout(() => {
    //   setFormData({ name: '', email: '', subject: '', message: '' });
    //   setFormStatus({ submitted: false, error: false, message: '' });
    // }, 5000);
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  return (
    <>
      <Navbar />
      <div className="contact-container">
        <DynamicStars />
        <div className="contact-wrapper">
          <div className="contact-header">
            <h2>Contact Us</h2>
            <p>We would love to hear from you. Drop us a message!</p>
            <div className="header-accent"></div>
          </div>

          <div className="contact-content">
            {/* Contact Form */}
            <div className="form-container">
              {formStatus.submitted ? (
                <div className="form-success">
                  <div className="success-icon">✓</div>
                  <h3>Message Sent!</h3>
                  <p>{formStatus.message}</p>
                  <button 
                    className="reset-button"
                    onClick={() => setFormStatus({ submitted: false, error: false, message: '' })}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className={`form-group ${focused.name ? 'focused' : ''}`}>
                      <label htmlFor="name">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        onFocus={() => handleFocus('name')}
                        onBlur={() => handleBlur('name')}
                        required
                      />
                    </div>
                    <div className={`form-group ${focused.email ? 'focused' : ''}`}>
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        required
                      />
                    </div>
                  </div>

                  <div className={`form-group ${focused.subject ? 'focused' : ''}`}>
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      onFocus={() => handleFocus('subject')}
                      onBlur={() => handleBlur('subject')}
                      required
                    />
                  </div>

                  <div className={`form-group ${focused.message ? 'focused' : ''}`}>
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      rows="6"
                      placeholder="Your message..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      onFocus={() => handleFocus('message')}
                      onBlur={() => handleBlur('message')}
                      required
                    />
                  </div>

                  <button type="submit" className="submit-button">
                    <span>Send Message</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info Cards */}
            <div className="contact-info">
              <div className="info-card">
                <div className="info-card-icon">
                  <Mail size={24} />
                </div>
                <div className="info-card-content">
                  <h3>Email</h3>
                  <p>info@wisdombooks.com</p>
                  <a href="mailto:info@wisdombooks.com" className="info-link">
                    Write to us <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Phone size={24} />
                </div>
                <div className="info-card-content">
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                  <a href="tel:+15551234567" className="info-link">
                    Call us <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <MapPin size={24} />
                </div>
                <div className="info-card-content">
                  <h3>Location</h3>
                  <p>123 Book Street, Library District</p>
                  <a href="#map" className="info-link">
                    View on map <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Clock size={24} />
                </div>
                <div className="info-card-content">
                  <h3>Business Hours</h3>
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p className="small-text">Weekend: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactForm;