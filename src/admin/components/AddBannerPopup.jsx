import { useState } from "react";
import PropTypes from "prop-types";
import { X, Upload, AlertCircle } from "lucide-react";
import "./add-banner-popup.css";

const AddBannerPopup = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    active: true,
  });

  const [imagePreview, setImagePreview] = useState("/api/placeholder/800/400");
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (errors.imageUrl) {
        setErrors({
          ...errors,
          imageUrl: null,
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Banner title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Banner description is required";
    }

    if (!imageFile) {
      newErrors.imageUrl = "Banner image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("active", formData.active);

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      await onAdd(submitData); // Call the onAdd function passed as a prop
    }
  };

  return (
    <div className="banner-popup-overlay">
      <div className="banner-popup">
        <div className="popup-header">
          <h2>Add New Banner</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form className="banner-form" onSubmit={handleSubmit}>
          {/* Banner Title */}
          <div className="form-group">
            <label htmlFor="title">Banner Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter banner title"
              className={errors.title ? "input-error" : ""}
            />
            {errors.title && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Banner Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter banner description"
              rows="4"
              className={errors.description ? "input-error" : ""}
            ></textarea>
            {errors.description && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          {/* Banner Image */}
          <div className="form-group">
            <label>Banner Image</label>
            <div className="image-upload-container">
              <div className="image-preview">
                <img src={imagePreview} alt="Banner preview" />
              </div>
              <div className="image-upload">
                <label htmlFor="image-upload" className="upload-btn">
                  <Upload size={20} />
                  <span>Upload Image</span>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <p className="upload-hint">
                  Recommended size: 1200 x 400 pixels (3:1 ratio)
                </p>
                {errors.imageUrl && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{errors.imageUrl}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Checkbox */}
          <div className="form-group checkbox-group">
            <label htmlFor="active" className="checkbox-label">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <span>Set banner as active</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Add Banner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddBannerPopup.propTypes = {
  onAdd: PropTypes.func.isRequired, // Change to 'onAdd'
  onClose: PropTypes.func.isRequired,
};

export default AddBannerPopup;
