import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "./Cart.css";
import DynamicStars from "../components/DynamicStars";
import { useAuth } from "../context/AuthContext";
import CheckoutForm from "../components/CheckoutForm";
import Swal from "sweetalert2";

const Cart = () => {
  const { cartItems, setCartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  // Fetch cart data from backend
  useEffect(() => {
    const fetchCartData = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_AUTH_URL}/api/cart`,
          {
            headers: {
              Authorization: JSON.parse(localStorage.getItem("userSession"))
                ?.token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        const data = await response.json();
        if (data.success) {
          setCartItems(data.cart.items);
        }
      } catch (err) {
        setError("Failed to load cart items");
        console.error("Error fetching cart:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [user, setCartItems]);

  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => {
        const discountedPrice = item.originalPrice - item.discount;
        return total + discountedPrice * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  // Format image URL correctly
  const getImageUrl = (coverImage) => {
    // If coverImage already includes http:// or https://, use it as is
    if (
      coverImage &&
      (coverImage.startsWith("http://") || coverImage.startsWith("https://"))
    ) {
      return coverImage;
    }

    // Otherwise, prepend the base URL
    return coverImage
      ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${
          coverImage.startsWith("/") ? coverImage.substring(1) : coverImage
        }`
      : `${import.meta.env.VITE_IMAGE_BASE_URL}/default-book-image.jpg`;
  };

  // Redirect unauthorized users
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="cart-container">
          <div className="error-message">{error}</div>
          <button
            className="continue-shopping"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </>
    );
  }

  // If user is not logged in, show loading or return null
  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <DynamicStars />
        <h1 className="cart-header">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p className="cart-paragraph">Your cart is empty</p>
            <button
              className="continue-shopping"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-container">
              {cartItems.map((item) => {
                const imageUrl = getImageUrl(item.coverImage);
                const discountedPrice = item.originalPrice - item.discount;
                return (
                  <div key={item.bookId} className="cart-item">
                    <div className="item-details">
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="item-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `${
                            import.meta.env.VITE_IMAGE_BASE_URL
                          }/default-book-image.jpg`;
                        }}
                      />
                      <div className="item-info">
                        <h3>{item.title}</h3>
                        <p>{item.author}</p>
                        <div className="price-info">
                          <div className="price-group">
                            {item.discount > 0 && (
                              <span className="original-price">
                                Rs. {item.originalPrice.toFixed(2)}
                              </span>
                            )}
                            <span className="discounted-price">
                              Rs. {discountedPrice.toFixed(2)}
                            </span>
                          </div>
                          <span className="total-price">
                            Total: Rs.{" "}
                            {(discountedPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item.bookId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          －
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.bookId, item.quantity + 1)
                          }
                        >
                          ＋
                        </button>
                      </div>
                      <button
                        className="remove-button"
                        onClick={() => {
                          Swal.fire({
                            title: "Remove Item",
                            text: "Are you sure you want to remove this item from your cart?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "Yes, remove it!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              removeFromCart(item.bookId);
                              Swal.fire({
                                icon: "success",
                                title: "Removed!",
                                text: "Item has been removed from your cart.",
                                showConfirmButton: false,
                                timer: 1500,
                              });
                            }
                          });
                        }}
                      >
                        <p>Remove Item</p>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-item">
                <span>Items ({getTotalItems()})</span>
                <span>Rs. {calculateSubtotal()}</span>
              </div>
              <div className="summary-item">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Total</span>
                <span>Rs. {calculateSubtotal()}</span>
              </div>
              <button
                className="checkout-button"
                onClick={() => setShowCheckoutForm(true)}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      {showCheckoutForm && (
        <CheckoutForm
          onClose={() => setShowCheckoutForm(false)}
          totalAmount={calculateSubtotal()}
        />
      )}
      <Footer />
    </>
  );
};

export default Cart;
