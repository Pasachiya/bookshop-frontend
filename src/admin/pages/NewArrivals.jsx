import { useState, useEffect } from "react";
import { AlertCircle, Save, Trash2 } from "lucide-react";
import "./NewArrivals.css";
import Sidebar from "../components/sidebar";
import SearchBar from "../components/SearchBar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL  = import.meta.env.VITE_IMAGE_BASE_URL;

const NewArrivals = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await fetch(`${API_BASE_URL}/api/books`);
        const arrivalsResponse = await fetch(`${API_BASE_URL}/api/new-arrivals`);
    
        if (!booksResponse.ok || !arrivalsResponse.ok) {
          throw new Error("Failed to fetch data");
        }
    
        const booksData = await booksResponse.json();
        const arrivalsData = await arrivalsResponse.json();
    
        const formatImageUrl = (book) => ({
          ...book,
          coverImage: book.coverImage.startsWith("http") 
            ? book.coverImage 
            : `${IMAGE_BASE_URL}${book.coverImage}`,
        });
  
        const formattedBooks = booksData.map(formatImageUrl);
        const formattedArrivals = arrivalsData.map(formatImageUrl);
    
        const availableBooks = formattedBooks.filter(book => book.isAvailable);
    
        setNewArrivals(formattedArrivals);
        setAllBooks(availableBooks);
        setFilteredBooks(
          availableBooks.filter(
            book => !formattedArrivals.some(arrival => arrival.title === book.title)
          )
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleSearch = (query) => {
    setFilteredBooks(
      query
        ? allBooks.filter((book) =>
            book.title.toLowerCase().includes(query.toLowerCase())
          )
        : allBooks
    );
  };

  const addToNewArrivals = async (book) => {
    try {
      if (newArrivals.some(arrival => arrival.title === book.title)) {
        setError("This book is already in New Arrivals");
        setTimeout(() => setError(null), 3000);
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/new-arrivals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book._id }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add book");
      }
  
      const addedBook = await response.json();
  
      const formattedBook = {
        ...addedBook,
        coverImage: addedBook.coverImage.startsWith("http")
          ? addedBook.coverImage
          : `${IMAGE_BASE_URL}${addedBook.coverImage}`,
      };
  
      setNewArrivals((prev) => [...prev, formattedBook]);
      setSuccessMessage("Book added to New Arrivals");
    } catch (error) {
      setError(error.message || "Failed to add book");
    } finally {
      setTimeout(() => setError(null), 3000);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };
  

  const removeFromNewArrivals = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/new-arrivals/${bookId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to remove book");
  
      // Find the book being removed
      const removedBook = newArrivals.find(book => book._id === bookId);
      
      // Remove from new arrivals
      setNewArrivals((prev) => prev.filter((book) => book._id !== bookId));
      
      // Add back to available books if it exists in allBooks
      if (removedBook) {
        const bookInAllBooks = allBooks.find(book => book.title === removedBook.title);
        if (bookInAllBooks && !filteredBooks.some(book => book.title === removedBook.title)) {
          setFilteredBooks(prev => [...prev, bookInAllBooks]);
        }
      }
      
      setSuccessMessage("Book removed from New Arrivals");
    } catch {
      setError("Failed to remove book");
    } finally {
      setTimeout(() => setError(null), 3000);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="new-arrivals-container">
          <header className="page-header">
            <h2>New Arrivals Management</h2>
            <SearchBar onSearch={handleSearch} disabled={true} />
          </header>
          
          <div className="available-books-table">
            <section className="available-books">
              <h3>Available Books</h3>
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i}>
                      <td><div className="skeleton skeleton-image"></div></td>
                      <td><div className="skeleton skeleton-text"></div></td>
                      <td><div className="skeleton skeleton-text"></div></td>
                      <td><div className="skeleton skeleton-text"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
  
          <div className="current-arrivals-table">
            <section className="current-arrivals">
              <h3>Current New Arrivals</h3>
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td><div className="skeleton skeleton-image"></div></td>
                      <td><div className="skeleton skeleton-text"></div></td>
                      <td><div className="skeleton skeleton-text"></div></td>
                      <td><div className="skeleton skeleton-text"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="new-arrivals-container">
        <header className="page-header">
          <h2>New Arrivals Management</h2>
          <SearchBar onSearch={handleSearch} />
          {error && (
            <div className="error-message">
              <AlertCircle size={20} /> <span>{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="success-message">
              <Save size={20} /> <span>{successMessage}</span>
            </div>
          )}
        </header>
        <div className="available-books-table">
        <section className="available-books">
          <h3>Available Books</h3>
          <table className="books-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book._id}>
                  <td>
                    <img src={book.coverImage} alt={book.title} className="book-cover" />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.category}</td>
                  <td>
                    <button onClick={() => addToNewArrivals(book)} className="add-button">
                      <Save size={16} /> Add to New Arrivals
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        </div>


      <div className="current-arrivals-table">
        <section className="current-arrivals">
          <h3>Current New Arrivals</h3>
          <table className="books-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newArrivals.map((book) => (
                <tr key={book._id}>
                  <td>
                    <img src={book.coverImage} alt={book.title} className="book-cover" />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.category}</td>
                  <td>
                    <button onClick={() => removeFromNewArrivals(book._id)} className="remove-button">
                      <Trash2 size={16} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        </div>
      </div>
    </>
  );
};

export default NewArrivals;
