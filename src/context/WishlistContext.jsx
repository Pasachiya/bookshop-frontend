import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist data from the backend
  useEffect(() => {
    const fetchWishlist = async () => {
      const userSession = JSON.parse(localStorage.getItem("userSession"));
      if (!userSession?.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/wishlist`, {
          method: "GET",
          headers: {
            "Authorization": userSession.token
          },
        });

        if (!response.ok) throw new Error("Failed to fetch wishlist");

        const data = await response.json();
        if (data.success) {
          setWishlistItems(data.books); // Assuming the response returns an object with a 'books' key
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load wishlist items",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Add item to wishlist
  const addToWishlist = async (book) => {
    const userData = JSON.parse(localStorage.getItem("userSession"));
    if (!userData || !userData.token) return null;

    if (!book.id) {
      console.error("Error: Book ID is required");
      return null;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.token,
        },
        body: JSON.stringify({
          bookId: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          price: book.price,
          discount: book.discount,
          description: book.description,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.message === "Book already in wishlist") {
          Swal.fire({
            icon: "info",
            title: "Already in Wishlist",
            text: "This book is already in your wishlist.",
            timer: 1500,
            showConfirmButton: false,
          });
          return false;
        }
        throw new Error(data.message || "Failed to add to wishlist");
      }

      // Update the wishlist items state
      setWishlistItems(prev => [...prev, { ...book, bookId: book.id }]);
      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return false;
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (bookId) => {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    if (!userSession?.token) return false;

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/wishlist/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": userSession.token,
        },
        body: JSON.stringify({ bookId }),
      });

      const data = await response.json();
      if (data.success) {
        setWishlistItems(prevItems => prevItems.filter(item => item.bookId !== bookId));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove item from wishlist",
      });
      return false;
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (bookId) => {
    return wishlistItems.some((item) => item.bookId.toString() === bookId.toString());
  };
  

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist, 
      loading 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

// PropTypes validation
WishlistProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export default WishlistContext;
