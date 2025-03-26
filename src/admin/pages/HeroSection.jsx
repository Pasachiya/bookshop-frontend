import Sidebar from "../components/sidebar";
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddHeroModal from '../components/AddHeroModal';
import EditHeroModal from '../components/EditHeroModal';
import './HeroSection.css';

const HeroSection = () => {
  const [heroes, setHeroes] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentHero, setCurrentHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limitMessage, setLimitMessage] = useState(null);
  
  // Define maximum number of heroes allowed
  const MAX_HEROES = 4;
  
  // Define API base URL in one place for consistency
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setLoading(true);
        console.log('Fetching heroes from API...');
        const response = await axios.get(`${API_BASE_URL}/api/heroes`);
        console.log('API response:', response);
  
        const heroesData = Array.isArray(response.data) ? response.data : [];
        console.log('Processed heroes data:', heroesData);
  
        // Ensure both thumbnail and image paths are processed correctly
        const processedHeroes = heroesData.map(hero => ({
          ...hero,
          // Store the original paths from the API - don't modify them here
        }));
  
        setHeroes(processedHeroes);
        setError(null);
      } catch (err) {
        console.error('Error fetching heroes (detailed):', err);
        setError('Failed to fetch hero sections. Please try again later.');
        setHeroes([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHeroes();
  }, []);
  
  // Function to handle adding a new hero
  const handleAddHero = async (heroData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/heroes`, heroData);
      
      // Add the new hero to state
      setHeroes([...heroes, response.data]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding hero:', err);
      alert('Failed to add hero section. Please try again.');
    }
  };
  
  // Function to handle updating a hero
  const handleUpdateHero = async (id, heroData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/heroes/${id}`, heroData);
      setHeroes(heroes.map(hero => hero._id === id ? response.data : hero));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating hero:', err);
      alert('Failed to update hero section. Please try again.');
    }
  };

  // Function to handle deleting a hero
  const handleDeleteHero = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/heroes/${id}`);
      setHeroes(heroes.filter(hero => hero._id !== id));
      setIsEditModalOpen(false);
      // Clear limit message if it was displayed
      setLimitMessage(null);
    } catch (err) {
      console.error('Error deleting hero:', err);
      alert('Failed to delete hero section. Please try again.');
    }
  };

  // Function to open edit modal with hero data
  const openEditModal = (hero) => {
    setCurrentHero(hero);
    setIsEditModalOpen(true);
  };

  // Function to handle add button click with limit check
  const handleAddButtonClick = () => {
    if (heroes.length >= MAX_HEROES) {
      setLimitMessage("Maximum limit of 4 heroes reached. Please remove one hero before adding a new one.");
      // Auto-hide the message after 5 seconds
      setTimeout(() => setLimitMessage(null), 5000);
    } else {
      setIsAddModalOpen(true);
    }
  };

  // Helper function to get full image URL
  const getFullImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="hero-section-container">
        <h1 className="page-title">Hero Section Management</h1>
        
        <div className="action-bar">
          <button className="add-button" onClick={handleAddButtonClick}>
            Add New Hero
          </button>
          {limitMessage && (
            <div className="limit-message">
              {limitMessage}
            </div>
          )}
        </div>

        {loading ? (
  <div className="table-container">
    <div className="hero-count-info">
      Loading hero sections...
    </div>
    <table className="books-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Card Title</th>
          <th>Thumbnail</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3].map((index) => (
          <tr key={index} className="skeleton-row">
            <td><div className="skeleton-cell"></div></td>
            <td><div className="skeleton-cell"></div></td>
            <td><div className="skeleton-cell"></div></td>
            <td><div className="skeleton-thumbnail"></div></td>
            <td><div className="skeleton-cell"></div></td>
            <td><div className="skeleton-cell"></div></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="table-container">
            <div className="hero-count-info">
              {heroes.length} of {MAX_HEROES} hero slots used
            </div>
            <table className="books-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Card Title</th>
                  <th>Thumbnail</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {heroes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No hero sections found. Add one to get started.</td>
                  </tr>
                ) : (
                  // Add an additional safety check here
                  Array.isArray(heroes) && heroes.map(hero => (
                    <tr key={hero._id}>
                      <td>{hero.title}</td>
                      <td>{hero.author}</td>
                      <td>{hero.cardTitle}</td>
                      <td>
                        {hero.thumbnail && (
                          <img 
                            src={getFullImageUrl(hero.thumbnail)}
                            alt={hero.title}
                            className="thumbnail-preview" 
                          />
                        )}
                      </td>
                      <td className="description-cell">{hero.description}</td>
                      <td>
                        <button 
                          className="edit-button" 
                          onClick={() => openEditModal(hero)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Hero Modal */}
        {isAddModalOpen && (
          <AddHeroModal 
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddHero}
          />
        )}

        {/* Edit Hero Modal */}
        {isEditModalOpen && currentHero && (
          <EditHeroModal 
            hero={currentHero}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={handleUpdateHero}
            onDelete={handleDeleteHero}
          />
        )}
      </div>
    </div>
  );
};

export default HeroSection;