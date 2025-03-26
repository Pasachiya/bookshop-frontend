import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./HeroSlider.css";

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [heroes, setHeroes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % heroes.length);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 600);
  }, [heroes.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 600);
  }, [heroes.length, isTransitioning]);

  const goToSlide = (index) => {
    if (isTransitioning || index === activeIndex) return;
    
    setIsTransitioning(true);
    setActiveIndex(index);
    setIsAutoPlaying(false);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const toggleAutoplay = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  // Helper function to get full image URL
  const getFullImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  // Fetch heroes from the backend API
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/heroes`);
        setHeroes(response.data);
        console.log("Fetched Heroes Data:", response.data);
      } catch (error) {
        console.error("Error fetching heroes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  useEffect(() => {
    let timer;
    if (isAutoPlaying && heroes.length > 0 && !isTransitioning) {
      timer = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(timer);
  }, [nextSlide, isAutoPlaying, heroes.length, isTransitioning]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Loading featured books...</span>
      </div>
    );
  }

  if (heroes.length === 0) {
    return <div className="error-container">No books found</div>;
  }

  return (
    <div className="hero-slider" style={{ "--theme-color": heroes[activeIndex]?.color || "#f1c92a" }}>
      <div className="slider-images">
        {heroes.map((hero, index) => (
          <img
            key={hero._id}
            src={getFullImageUrl(hero.image)}
            alt={hero.title}
            className={`slider-image ${index === activeIndex ? "active" : ""}`}
          />
        ))}
      </div>

      <div className="gradient-overlay" />

      <div className="content-container">
        <div className="slider-content">
          <div className="text-content">
            <h1 className="animate-slide-up">{heroes[activeIndex].title}</h1>
            <h2 className="animate-slide-up-delay-1">By {heroes[activeIndex].author}</h2>
            <p className="animate-slide-up-delay-2">{heroes[activeIndex].description}</p>
            <div className="button-group animate-slide-up-delay-3">
              <button className="primary-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add to Cart
              </button>
              <button className="secondary-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Explore More
              </button>
            </div>
          </div>
        </div>

        <div className="featured-books-container">
          {heroes.map((book, index) => (
            <div 
              key={book._id} 
              className={`featured-book ${index === activeIndex ? 'active-book' : ''}`}
              onClick={() => goToSlide(index)}
            >
              <div className="book-preview">
                <img src={getFullImageUrl(book.thumbnail)} alt={`${book.title} preview`} />
              </div>
              <div className="book-info">
                <h3>{book.cardTitle || "Featured"}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-controls">
        <button className="slider-button left" onClick={prevSlide} aria-label="Previous slide">
          ‹
        </button>
        <button className="slider-button right" onClick={nextSlide} aria-label="Next slide">
          ›
        </button>
      </div>

      <button className="autoplay-toggle" onClick={toggleAutoplay} aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}>
        {isAutoPlaying ? "⏸" : "▶"}
      </button>

      <div className="progress-indicator">
        {heroes.map((_, index) => (
          <div 
            key={index} 
            className={`progress-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;