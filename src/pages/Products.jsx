import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import './Products.css';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch books from the API
        const booksRes = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/books`);
        const booksData = await booksRes.json();
        setBooks(booksData);

        // Extract unique categories from books
        const uniqueCategories = [...new Set(booksData.map(book => book.category))];
        const formattedCategories = [
          { id: 'all', name: 'All Books' },
          ...uniqueCategories.map(category => ({
            id: category,
            name: category.charAt(0).toUpperCase() + category.slice(1)
          }))
        ];
        setCategories(formattedCategories);
      } catch (err) {
        setError('Failed to load books');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <div className="products-container">
        <div className="header-section">
          <h1>Our Books</h1>
          <div className="searchbar">
            <input
              placeholder="Search books by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="categories-section">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {loading ? (
            // Show loading skeleton cards while loading
            [...Array(10)].map((_, index) => (
              <div key={index} className="book-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            ))
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : currentBooks.length === 0 ? (
            <div className="no-results">No books found</div>
          ) : (
            currentBooks.map(book => (
              <BookCard
                key={book._id}
                id={book._id}
                title={book.title}
                coverImage={book.coverImage}
                price={book.price}
                discount={book.discount}
                description={book.description}
                count={book.count}
                author={book.author}
                otherImages={book.otherImages || []}
              />
            ))
          )}
        </div>

        {!loading && !error && filteredBooks.length > 0 && (
          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Products;