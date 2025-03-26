import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Heart } from "lucide-react";
import UserPopup from "./UserPopup";
import "./Navbar.css";
import { useCart } from "../context/CartContext"; // Add this import

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useCart(); // Add this line

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleUserIconClick = (e) => {
    e.preventDefault();
    setShowUserPopup(!showUserPopup);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src="/assets/logo.jpg" alt="BookShop Logo" className="logo-img" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <span className="nav-text">Home</span>
            <span className="nav-indicator"></span>
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            <span className="nav-text">About</span>
            <span className="nav-indicator"></span>
          </Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            <span className="nav-text">Products</span>
            <span className="nav-indicator"></span>
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            <span className="nav-text">Contact</span>
            <span className="nav-indicator"></span>
          </Link>
        </div>

        {/* Icons & Mobile Menu */}
        <div className="nav-right">
        <div className="nav-icons">
          <Link to="/wishlist" className="icon-wrapper heart-icon" aria-label="Wishlist">
            <Heart size={24} />
            <span className="icon-tooltip">Wishlist</span>
          </Link>
          <Link to="/cart" className="icon-wrapper cart-icon" aria-label="Cart">
            <FaShoppingCart size={24} />
            <span className="cart-badge">{getTotalItems()}</span>
            <span className="icon-tooltip">Cart</span>
          </Link>
            <Link to="/login" className="icon-wrapper user-icon" aria-label="Login" onClick={handleUserIconClick}>
              <FaUser size={24} />
              <span className="icon-tooltip">Account</span>
            </Link>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="menu-icon">
              <span className={`menu-line ${menuOpen ? "open" : ""}`}></span>
              <span className={`menu-line ${menuOpen ? "open" : ""}`}></span>
              <span className={`menu-line ${menuOpen ? "open" : ""}`}></span>
            </div>
          </button>
        </div>
      </div>
      
      <div className="nav-backdrop"></div>
      {showUserPopup && <UserPopup onClose={() => setShowUserPopup(false)} />}
    </nav>
  );
}