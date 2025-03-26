import PropTypes from "prop-types";
import "./BookCard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import BookPopup from "./BookPopup";
import Swal from "sweetalert2";
import { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

const BookItem = ({
  id,
  title,
  coverImage,
  price,
  discount = 0,
  description,
  count,
  author,
  otherImages = [],
  onPopupOpen,
  onPopupClose
}) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const inWishlist = isInWishlist(id);


  const navigate = useNavigate();

  const discountPrice = price - discount;

  
  
  
  const [isProcessing, setIsProcessing] = useState(false);
  const toggleWishlist = async (e) => {
    e.stopPropagation();
  
    if (isProcessing) return;
    setIsProcessing(true);
  
    const userData = JSON.parse(localStorage.getItem("userSession"));
    if (!userData || !userData.token) {
      Swal.fire({
        icon: "warning",
        title: "Please Login",
        text: "You need to login first to add items to wishlist",
        showConfirmButton: true,
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      setIsProcessing(false);
      return;
    }
  
    if (inWishlist) {
      const result = await removeFromWishlist(id);
      if (result) {
        Swal.fire({
          icon: "success",
          title: "Removed!",
          text: "Book removed from wishlist.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to remove from wishlist. Please try again.",
        });
      }
    } else {
      const bookDetails = { id, title, coverImage, price, discount, description, count, author, otherImages };
      if (!bookDetails.id) {
        console.error("Error: Book ID is required for wishlist.");
        setIsProcessing(false);
        return;
      }
  
      // Use the function from the context directly
      const result = await addToWishlist(bookDetails);
      if (result) {
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Book added to wishlist.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  
    setIsProcessing(false);
  };
  

  const handleCardClick = (e) => {
    if (!e.target.closest(".card-actions")) {
      setShowPopup(true);
      if (onPopupOpen) onPopupOpen();
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    if (onPopupClose) onPopupClose();
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

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
          bookId: id,
          title,
          author,
          originalPrice: price,
          coverImage,
          quantity: 1,
          discount,
          count,
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

  const renderPopup = () => {
    if (!showPopup) return null;
    
    return ReactDOM.createPortal(
      <BookPopup
        book={{
          id,
          title,
          author,
          coverImage,
          price,
          discount,
          description,
          count,
          otherImages,
        }}
        onClose={handleClosePopup}
      />,
      document.body
    );
  };

  return (
    <>
      <div className="book-item" onClick={handleCardClick}>
        <div className="book-image-wrapper">
        {coverImage && (
            <img
              src={`${import.meta.env.VITE_IMAGE_BASE_URL}${coverImage}`}
              alt={title}
              className="book-image"
              onLoad={() =>
                console.log("Loaded Image URL:", `${import.meta.env.VITE_IMAGE_BASE_URL}${coverImage}`)
              }
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
        </div>

        <div className="book-details">
          <p className="book-author">{author}</p>
          <h3 className="book-title">{title}</h3>
          <div className="price-info">
            {discount > 0 && (
              <span className="original-price">Rs. {price.toFixed(2)}</span>
            )}
            <span className="current-price">
              Rs. {discountPrice.toFixed(2)}
            </span>
            {discount > 0 && (
              <div className="discount-label"> Rs. {discount} Off</div>
            )}
          </div>
        </div>

        <div className="card-actions">
          <button
            className="wishlist-button"
            onClick={toggleWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {inWishlist ? (
              <FaHeart className="heart-icon filled" />
            ) : (
              <FaRegHeart className="heart-icon" />
            )}
          </button>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      {renderPopup()}
    </>
  );
};

BookItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  coverImage: PropTypes.string,
  price: PropTypes.number.isRequired,
  discount: PropTypes.number,
  description: PropTypes.string,
  count: PropTypes.string,
  author: PropTypes.string.isRequired,
  otherImages: PropTypes.arrayOf(PropTypes.string),
  onPopupOpen: PropTypes.func,
  onPopupClose: PropTypes.func,
};

export default BookItem;