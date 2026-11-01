import { useState } from "react";
import { uploadImage } from "../services/menuApi.js";

const initialFormData = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  imagePublicId: "",
  category: "",
};

function MenuItemForm({ onSubmit, onCancel, initialData, submitting }) {
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    ...(initialData || {}),
    price: initialData?.price?.toString() || "",
    imageUrl: initialData?.imageUrl || "",
    imagePublicId: initialData?.imagePublicId || "",
  }));

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setSelectedImage(file || null);
    setUploadError("");
    setUploadSuccess("");
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      setUploadError("Please select an image first.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const result = await uploadImage(selectedImage, "dish");

      setFormData((previousData) => ({
        ...previousData,
        imageUrl: result.url,
        imagePublicId: result.publicId,
      }));
      setSelectedImage(null);
      setUploadSuccess("Image uploaded successfully.");

      // Clear the file input after a successful upload.
      const fileInput = document.getElementById("dishImage");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setUploadError(error.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...formData,
      price: Number(formData.price),
    });
  };

  return (
    <form className="menu-item-form" onSubmit={handleSubmit}>
      <h2 className="menu-form-field-full">
        {initialData ? "Edit menu item" : "Add menu item"}
      </h2>

      <div className="menu-form-field">
        <label htmlFor="name">Item name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </div>

      <div className="menu-form-field menu-form-field-full">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="menu-form-field">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="menu-form-field">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g. Main Course, Drinks"
          required
        />
      </div>

      <div className="menu-form-field menu-form-field-full">
        <label htmlFor="dishImage">Dish image</label>

        <input
          id="dishImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          disabled={uploading || submitting}
        />

        <p className="menu-image-help">
          Choose a JPEG, PNG, or WebP image up to 5 MB.
        </p>

        {selectedImage && (
          <p className="menu-image-filename">Selected: {selectedImage.name}</p>
        )}

        <button
          type="button"
          className="menu-button menu-button-secondary menu-upload-button"
          onClick={handleImageUpload}
          disabled={!selectedImage || uploading || submitting}
        >
          {uploading ? "Uploading image..." : "Upload image"}
        </button>

        {uploadError && (
          <p className="menu-upload-message menu-upload-error" role="alert">
            {uploadError}
          </p>
        )}

        {uploadSuccess && (
          <p className="menu-upload-message menu-upload-success" role="status">
            {uploadSuccess}
          </p>
        )}

        {formData.imageUrl && (
          <div className="menu-image-preview">
            <img src={formData.imageUrl} alt="Menu item preview" />
            <span>Image ready to save</span>
          </div>
        )}

        <label htmlFor="imageUrl">Image URL (optional)</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Upload an image or paste an image URL"
        />
      </div>

      <div className="menu-form-actions">
        <button
          type="submit"
          className="menu-button menu-button-primary"
          disabled={submitting || uploading}
        >
          {submitting
            ? "Saving..."
            : initialData
              ? "Save changes"
              : "Add menu item"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="menu-button menu-button-secondary"
            onClick={onCancel}
            disabled={submitting || uploading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default MenuItemForm;
