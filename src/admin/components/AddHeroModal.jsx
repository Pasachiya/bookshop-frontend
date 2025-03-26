import { useState } from "react";
import PropTypes from "prop-types";
import "./EditHeroModal.css";

const AddHeroModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    cardTitle: "",
    image: null,
    thumbnail: null,
    description: "",
  });

  const [preview, setPreview] = useState({
    image: "",
    thumbnail: "",
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      // Preview Image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({ ...preview, [name]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("cardTitle", formData.cardTitle);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);
    if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);

    await onAdd(data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Hero Section</h2>
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
            <input type="file" id="image" name="image" onChange={handleFileChange} required />
            {preview.image && <img src={preview.image} alt="Preview" width="100" />}
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail">Upload Thumbnail</label>
            <input type="file" id="thumbnail" name="thumbnail" onChange={handleFileChange} required />
            {preview.thumbnail && <img src={preview.thumbnail} alt="Preview" width="100" />}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-button">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddHeroModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddHeroModal;
