import { useWishlist } from '../context/WishlistContext';
import BookCard from '../components/BookCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Wishlist.css';
import DynamicStars from '../components/DynamicStars';

const Wishlist = () => {
  const { wishlistItems, loading, error } = useWishlist();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="wishlist-container">
        <DynamicStars />
        <h1>My Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <p>Your wishlist is empty</p>
          </div>
        ) : (
          <div className="products-grid">
            {wishlistItems.map((book) => (
              <BookCard key={book.bookId} id={book.bookId} {...book} /> // Ensure bookId is passed as id
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
