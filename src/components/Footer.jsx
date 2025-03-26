import 'react';
import './Footer.css';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/assets/logo.jpg" alt="Wisdom Books Logo" />
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* <div className="footer-section">
          <h3>Categories</h3>
          <ul>
            <li><a href="/fiction">Fiction</a></li>
            <li><a href="/science">Science</a></li>
            <li><a href="/maths">Maths</a></li>
            <li><a href="/story">Story</a></li>
          </ul>
        </div> */}

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li>Tel: +94 755 755 666</li>
            <li>+94 700 700 437</li>
            <li>
              <a href="mailto:info@wisdom.com">
                info@wishwayenawathana.com
              </a>
            </li>
          </ul>
        </div>


        <div className="footer-section">
          <h3>Follow Us :</h3>
          <div className="social-links">
            {/* Add your social media icons/links here */}
            <a href="#" className="social-link"><FaFacebook/></a>
            <a href="#" className="social-link"><FaInstagram/></a>
            <a href="#" className="social-link"><FaTiktok/></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Copyright © 2025 VespineIT. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;