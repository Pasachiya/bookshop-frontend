import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import AddBannerPopup from "../components/AddBannerPopup";
import EditBannerPopup from "../components/EditBannerPopup";
import "./BannerPage.css";

const BannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/banners`);
        setBanners(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to fetch banners. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleAddBanner = async (bannerData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/banners`,
        bannerData
      );
      setBanners([...banners, response.data]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Error adding banner:", err);
      alert("Failed to add banner. Please try again.");
    }
  };

  const handleUpdateBanner = async (id, bannerData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/banners/${id}`,
        bannerData
      );
      setBanners(
        banners.map((banner) => (banner._id === id ? response.data : banner))
      );
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating banner:", err);
      alert("Failed to update banner. Please try again.");
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/banners/${id}`);
      setBanners(banners.filter((banner) => banner._id !== id));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error deleting banner:", err);
      alert("Failed to delete banner. Please try again.");
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="banner-section-container">
        <h1 className="page-title">Banner Management</h1>
        <div className="action-bar">
          <button
            className="add-button"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Banner
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <span className="loading-text">Loading banners...</span>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="table-container">
            <table className="banners-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Active</th> {/* New column for Active status */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No banners found.
                    </td>
                  </tr>
                ) : (
                  banners.map((banner) => (
                    <tr key={banner._id}>
                      <td>{banner.title}</td>
                      <td>{banner.description}</td>
                      <td>
                        {banner.imageUrl && (
                          <img
                            src={`${API_BASE_URL}${banner.imageUrl}`}
                            alt={banner.title}
                            className="thumbnail-preview"
                          />
                        )}
                      </td>
                      <td>
                        {/* Display Active/Inactive based on the active status */}
                        {banner.active ? (
                          <span className="status-active">Active</span>
                        ) : (
                          <span className="status-inactive">Inactive</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => {
                            setCurrentBanner(banner);
                            setIsEditModalOpen(true);
                          }}
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

        {isAddModalOpen && (
          <AddBannerPopup
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddBanner}
          />
        )}
        {isEditModalOpen && currentBanner && (
          <EditBannerPopup
            banner={currentBanner}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={handleUpdateBanner}
            onDelete={handleDeleteBanner}
          />
        )}
      </div>
    </div>
  );
};
export default BannerPage;
