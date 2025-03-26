import { useEffect, useState } from "react";
import "tailwindcss";
import "./Home.css";
import HeroSlider from "../components/HeroSlider";
import BookCard from "../components/BookCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DynamicStars from "../components/DynamicStars";
import Banner from "../components/Banner"; // Import the new Banner component

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [fictionBooks, setFictionBooks] = useState([]);
  const [scienceBooks, setScienceBooks] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    newArrivals: true,
    fiction: true,
    science: true,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/newarrivals`);
        const data = await response.json();
        setNewArrivals(data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoadingStates((prev) => ({ ...prev, newArrivals: false }));
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/books`);
        const data = await response.json();
        setFictionBooks(data.filter((book) => book.category === "Fiction"));
        setScienceBooks(data.filter((book) => book.category === "science"));
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          fiction: false,
          science: false,
        }));
      }
    };

    fetchNewArrivals();
    fetchBooks();
  }, []);

  // More aggressive approach to control body scrolling
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (isPopupOpen) {
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Re-enable scrolling
      const scrollY = document.body.style.top;
      document.body.style.overflow = originalStyle;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    
    return () => {
      // Cleanup
      document.body.style.overflow = originalStyle;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isPopupOpen]);

  // Function to handle popup state
  const handlePopupState = (isOpen) => {
    setIsPopupOpen(isOpen);
  };

  // Pass this function to BookCard components
  const bookCardWithPopupControl = (book) => (
    <BookCard
      key={book._id}
      id={book._id}
      title={book.title}
      coverImage={book.coverImage}
      price={book.price}
      discount={book.discount}
      author={book.author}
      description={book.description}
      count={book.count}
      otherImages={book.otherImages || []}
      onPopupOpen={() => handlePopupState(true)}
      onPopupClose={() => handlePopupState(false)}
    />
  );

  const LoadingIndicator = () => (
    <div className="flex items-center justify-center w-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-500"></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="home-container">
        <HeroSlider />
        <Banner /> {/* Replace the banner code with the new component */}
        <DynamicStars />

        <section className="book-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <div className="books-grid">
              {loadingStates.newArrivals ? (
                <LoadingIndicator />
              ) : newArrivals.length > 0 ? (
                newArrivals.map(bookCardWithPopupControl)
              ) : (
                <p className="text-center text-gray-500">
                  No new arrivals available.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="book-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Fiction Books</h2>
            </div>
            <div className="books-grid">
              {loadingStates.fiction ? (
                <LoadingIndicator />
              ) : fictionBooks.length > 0 ? (
                fictionBooks.map(bookCardWithPopupControl)
              ) : (
                <p className="text-center text-gray-500">
                  No fiction books available.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="book-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Science Books</h2>
            </div>
            <div className="books-grid">
              {loadingStates.science ? (
                <LoadingIndicator />
              ) : scienceBooks.length > 0 ? (
                scienceBooks.map(bookCardWithPopupControl)
              ) : (
                <p className="text-center text-gray-500">
                  No science books available.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;