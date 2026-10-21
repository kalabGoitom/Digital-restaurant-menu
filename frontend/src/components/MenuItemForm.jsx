import { useState } from "react";

const initialFormData = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "",
};

function MenuItemForm({ onSubmit, onCancel, initialData, submitting }) {
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    ...(initialData || {}),
    price: initialData?.price?.toString() || "",
    imageUrl: initialData?.imageUrl || "",
  }));

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
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
        <label htmlFor="imageUrl">Image URL (optional)</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/food.jpg"
        />
      </div>

      <div className="menu-form-actions">
        <button
          type="submit"
          className="menu-button menu-button-primary"
          disabled={submitting}
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
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default MenuItemForm;
