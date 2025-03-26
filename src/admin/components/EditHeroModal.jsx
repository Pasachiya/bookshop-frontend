import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./EditHeroModal.css";

const EditHeroModal = ({ hero, onClose, onUpdate, onDelete }) => {
  // Define API base URL for consistency
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Helper function to get full image URL
  const getFullImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  const [formData, setFormData] = useState({
    title: hero.title || "",
    author: hero.author || "",
    cardTitle: hero.cardTitle || "",
    image: hero.image || "",
    thumbnail: hero.thumbnail || "",
    description: hero.description || "",
  });

  useEffect(() => {
    setFormData({
      title: hero.title || "",
      author: hero.author || "",
      cardTitle: hero.cardTitle || "",
      image: hero.image || "",
      thumbnail: hero.thumbnail || "",
      description: hero.description || "",
    });
  }, [hero]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Upload File
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload`, formData);
      setFormData((prev) => ({ ...prev, [fieldName]: res.data.fileUrl }));
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(hero._id, formData);
  };

  const handleDelete = () => {
    onDelete(hero._id);
    onClose();  // Close modal after deletion
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Hero Section</h2>
          <button type="button" className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="cardTitle">Card Title</label>
            <input type="text" id="cardTitle" name="cardTitle" value={formData.cardTitle} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <input type="file" id="image" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} />
            {formData.image && <img src={getFullImageUrl(formData.image)} alt="Preview" width="100" />}
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail">Upload Thumbnail</label>
            <input type="file" id="thumbnail" accept="image/*" onChange={(e) => handleFileUpload(e, "thumbnail")} />
            {formData.thumbnail && <img src={getFullImageUrl(formData.thumbnail)} alt="Preview" width="100" />}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="modal-actions">
            <button type="button" className="delete-button" onClick={handleDelete}>
              Delete
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="update-button">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditHeroModal.propTypes = {
  hero: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EditHeroModal;