import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items from backend on mount and when user changes
  useEffect(() => {
    const fetchCartItems = async () => {
      const userSession = JSON.parse(localStorage.getItem('userSession'));
      if (!userSession?.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/cart`, {
          headers: {
            'Authorization': userSession.token
          }
        });

        if (!response.ok) throw new Error('Failed to fetch cart');

        const data = await response.json();
        if (data.success) {
          setCartItems(data.cart.items || []);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load cart items'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const addToCart = async (item) => {
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    if (!userSession?.token) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You need to login first to add items to cart'
      });
      return false;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userSession.token
        },
        body: JSON.stringify({
          bookId: item.id,
          title: item.title,
          author: item.author,
          originalPrice: item.price,
          coverImage: item.coverImage,
          quantity: 1,
          discount: item.discount,
          count: item.count
        })
      });

      const data = await response.json();
      if (data.success) {
        setCartItems(data.cart.items);
        return true;
      }
      throw new Error(data.message);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add item to cart'
      });
      return false;
    }
  };

  const removeFromCart = async (bookId) => {
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    if (!userSession?.token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/cart/remove/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': userSession.token
        }
      });

      const data = await response.json();
      if (data.success) {
        setCartItems(prevItems => prevItems.filter(item => item.bookId !== bookId));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove item from cart'
      });
    }
  };

  const updateQuantity = async (bookId, newQuantity) => {
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    if (!userSession?.token) return;

    if (newQuantity <= 0) {
      return removeFromCart(bookId);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/cart/update/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userSession.token
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      const data = await response.json();
      if (data.success) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.bookId === bookId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update quantity'
      });
    }
  };

  const clearCart = async () => {
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    if (!userSession?.token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': userSession.token
        }
      });

      const data = await response.json();
      if (data.success) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to clear cart'
      });
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.originalPrice * (1 - item.discount / 100);
      return total + (discountedPrice * item.quantity);
    }, 0).toFixed(2);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      calculateTotal,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartContext;