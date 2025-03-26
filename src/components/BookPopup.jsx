import { useState } from "react";
import PropTypes from "prop-types";
import "./BookPopup.css";
import {
  FaHeart,
  FaRegHeart,
  FaTimes,
  FaShoppingCart,
  FaBook,
} from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BookPopup = ({ book, onClose }) => {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const currentPrice = book.price - book.discount;
  const [selectedImage, setSelectedImage] = useState(book.coverImage);

  const toggleWishlist = () => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const handleAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userSession"));

    if (!userData || !userData.token) {
      Swal.fire({
        icon: "warning",
        title: "Please Login",
        text: "You need to login first to add items to cart",
        showConfirmButton: true,
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.token,
        },
        body: JSON.stringify({
          bookId: book.id,
          title: book.title,
          author: book.author,
          originalPrice: book.price,
          image: book.coverImage,
          quantity: 1,
          discount: book.discount,
          count: book.count,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Book added to cart successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add item to cart. Please try again.",
      });
    }
  };

  return (
    <div className="book-popup-overlay">
      <div className="book-popup-content">
        <button className="book-popup-close-button" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="book-popup-grid">
          {/* Left Panel - Image Gallery */}
          <div className="book-popup-image-panel">
            <div className="book-popup-main-image">
              <img
                src={`${API_BASE_URL}${selectedImage}`}
                alt={book.title}
                onError={(e) => {
                  e.target.src = "/assets/placeholder.jpg";
                  e.target.onerror = null;
                }}
              />
            </div>
            <div className="book-popup-thumbnail-grid">
              <div
                className={`book-popup-thumbnail ${
                  book.coverImage === selectedImage ? "active" : ""
                }`}
                onClick={() => setSelectedImage(book.coverImage)}
              >
                <img
                  src={`${API_BASE_URL}${book.coverImage}`}
                  alt={book.title}
                  onError={(e) => {
                    e.target.src = "/assets/placeholder.jpg";
                    e.target.onerror = null;
                  }}
                />
              </div>
              {book.otherImages?.map((img, index) => (
                <div
                  key={index}
                  className={`book-popup-thumbnail ${
                    img === selectedImage ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={`${API_BASE_URL}${img}`}
                    alt={`${book.title} view ${index + 1}`}
                    onError={(e) => {
                      e.target.src = "/assets/placeholder.jpg";
                      e.target.onerror = null;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Book Info */}
          <div className="book-popup-details-panel">
            <h2>{book.title}</h2>
            <p className="book-popup-author">by {book.author}</p>

            <div className="book-popup-price-section">
              <span className="book-popup-current-price">
                Rs. {currentPrice.toFixed(2)}
              </span>
              <span className="book-popup-original-price">
                Rs. {book.price.toFixed(2)}
              </span>
              {book.discount > 0 && (
                <span className="book-popup-discount">{book.discount} OFF</span>
              )}
            </div>

            <h3 className="book-popup-section-title">Description</h3>
            <div className="book-popup-description-container">
              <p className="book-popup-description">{book.description}</p>
            </div>

            <h3 className="book-popup-section-title">Details</h3>
            <div className="book-popup-details-list">
              <div className="book-popup-detail-item">
                <FaBook style={{ marginRight: "8px", color: "#ff8c00" }} />
                <strong>Stock:</strong> <p>{parseInt(book.count).toLocaleString()}{" "}
                available</p>
              </div>
            </div>

            <div className="book-popup-action-buttons">
              <button
                className="book-popup-add-to-cart"
                onClick={handleAddToCart}
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                className={`book-popup-wishlist-button ${
                  isInWishlist(book.id) ? "active" : ""
                }`}
                onClick={toggleWishlist}
              >
                {isInWishlist(book.id) ? (
                  <>
                    <FaHeart /> Remove
                  </>
                ) : (
                  <>
                    <FaRegHeart /> Wishlist
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BookPopup.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    coverImage: PropTypes.string.isRequired,
    otherImages: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    description: PropTypes.string.isRequired,
    count: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BookPopup;
