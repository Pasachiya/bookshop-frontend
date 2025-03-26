import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./CheckoutForm.css";
import PropTypes from "prop-types";
import Swal from 'sweetalert2';

const CheckoutForm = ({ onClose, totalAmount }) => {
  const { user } = useAuth();
  const { cartItems, setCartItems } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    townCity: "",
    state: "",
    postcode: "",
    country: "Sri Lanka",
    paymentMethod: "directBank",
  });

  // Auto-fill form with user data
  useEffect(() => {
    if (user) {
      // Fetch user details from backend
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/users/me`, {
            headers: {
              Authorization: JSON.parse(localStorage.getItem("userSession"))
                ?.token,
            },
          });

          if (response.ok) {
            const { user: userData } = await response.json();
            setFormData((prev) => ({
              ...prev,
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              email: userData.email || "",
              phone: userData.phone || "",
              streetAddress: userData.address || "",
              townCity: userData.city || "",
              state: userData.state || "",
              postcode: userData.zipCode || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
        !formData.streetAddress || !formData.townCity || !formData.postcode) {
          Swal.fire({
            icon: 'error',
            title: 'Required Fields Missing',
            text: 'Please fill in all required fields',
            confirmButtonColor: '#3085d6'
          });
          return;
        }
      
        try {
          const userToken = JSON.parse(localStorage.getItem('userSession'))?.token;
          
          if (!userToken) {
            throw new Error('User not authenticated');
          }
      
          // Show loading state
          Swal.fire({
            title: 'Processing Order',
            text: 'Please wait...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading();
            }
          });
  
      // Create order data matching the Order_model schema
      const orderData = {
        items: cartItems.map(item => ({
          bookId: item.bookId,
          title: item.title,
          quantity: item.quantity,
          price: item.originalPrice * (1 - item.discount / 100),
          discount: item.discount
        })),
        shippingDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.streetAddress,
          city: formData.townCity,
          state: formData.state,
          postcode: formData.postcode,
          country: formData.country
        },
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        status: 'pending',
        paymentStatus: 'pending'
      };
  
      // Create order
      const orderResponse = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken
        },
        body: JSON.stringify(orderData)
      });
  
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
  
      const orderResult = await orderResponse.json();
  
      if (!orderResult.success) {
        throw new Error(orderResult.message);
      }
  
      // Clear cart in database
      const clearCartResponse = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': userToken
        }
      });
  
      if (!clearCartResponse.ok) {
        console.error('Failed to clear cart in database');
      }
  
      // Clear cart state
      setCartItems([]);
      
      // Show success message and close form
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your order has been placed successfully!',
        confirmButtonColor: '#3085d6'
      });
      onClose();
  
    } catch (error) {
      console.error('Error placing order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: error.message || 'Failed to place order. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "radio" ? (checked ? value : formData.paymentMethod) : value,
    });
  };

  // Calculate total with shipping
  const shippingCost = 350.0;
  const total = parseFloat(totalAmount) + shippingCost;

  return (
    <div className="checkout-overlay">
      <div className="checkout-popup">
        <div className="checkout-header">
          <h2>Complete Your Order</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-row">
            <div className="billing-details">
              <h3>BILLING DETAILS</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      First name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">
                      Last name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">
                    Country / Region <span className="required">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="Sri Lanka">Sri Lanka</option>
                    {/* Add other countries as needed */}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="streetAddress">
                    Street address <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    placeholder="House number and street name"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="townCity">
                    Town / City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="townCity"
                    name="townCity"
                    value={formData.townCity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="postcode">
                    Postcode / ZIP <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </form>
            </div>

            <div className="order-summary">
              <h3>YOUR ORDER</h3>
              <table className="order-table">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const discountedPrice =
                      item.originalPrice * (1 - item.discount / 100);
                    return (
                      <tr key={item.bookId}>
                        <td>
                          {item.title} × {item.quantity}
                        </td>
                        <td>
                          Rs.{(discountedPrice * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td>Subtotal</td>
                    <td>Rs.{totalAmount}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td>Delivery Charge: Rs.{shippingCost.toFixed(2)}</td>
                  </tr>
                  <tr className="total-row">
                    <td>Total</td>
                    <td>Rs.{total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="payment-methods">
                <div className="payment-method">
                  <input
                    type="radio"
                    id="directBank"
                    name="paymentMethod"
                    value="directBank"
                    checked={formData.paymentMethod === "directBank"}
                    onChange={handleChange}
                  />
                  <label htmlFor="directBank">Direct bank transfer</label>
                  <div className="payment-description">
                    <p>
                      Make your payment directly into our bank account. Your
                      order will not be shipped until the funds have cleared in
                      our account.
                    </p>
                    <p>Our Bank Details:</p>
                    <p>Account Name: HMGT Madhusanka</p>
                    <p>Bank: Commercial Bank</p>
                    <p>Account No: 8147010056</p>
                    <p>Branch: Biyagama</p>
                    <p>
                      Please send the bank slip through whats app (071 54 00
                      618). Your order will be shipped after received the bank
                      slip. Thank You !
                    </p>
                  </div>
                </div>

                <div className="payment-method">
                  <input
                    type="radio"
                    id="cashOnDelivery"
                    name="paymentMethod"
                    value="cashOnDelivery"
                    checked={formData.paymentMethod === "cashOnDelivery"}
                    onChange={handleChange}
                  />
                  <label htmlFor="cashOnDelivery">Cash on delivery</label>
                </div>
              </div>

              <button
                type="button"
                className="place-order-button"
                onClick={handleSubmit}
                disabled={cartItems.length === 0}
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CheckoutForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    totalAmount: PropTypes.string.isRequired
  };

export default CheckoutForm;
