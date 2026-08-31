import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  updateMenuItem,
} from "../services/adminMenuApi";
import "./Admin.css";

const blankItem = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "",
};
function ManageMenu() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(blankItem);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      setItems(await getMenuItems());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const loadInitialMenu = async () => {
      try {
        setItems(await getMenuItems());
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };
    loadInitialMenu();
  }, []);
  const openNew = () => {
    setEditing("new");
    setValues(blankItem);
    setError("");
  };
  const openEdit = (item) => {
    setEditing(item.id);
    setValues({
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      category: item.category,
    });
    setError("");
  };
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing === "new")
        await createMenuItem({ ...values, price: Number(values.price) });
      else
        await updateMenuItem(editing, {
          ...values,
          price: Number(values.price),
        });
      setEditing(null);
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };
  const toggleAvailability = async (item) => {
    try {
      await updateMenuItem(item.id, { available: !item.available });
      await load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.name}? This cannot be undone.`)) return;
    try {
      await deleteMenuItem(item.id);
      await load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  return (
    <AdminLayout
      title="All menu items"
      description="Your reusable collection of restaurant dishes."
    >
      <div className="admin-content">
        <div className="content-action">
          <p>{items.length} saved dishes</p>
          <button className="primary-button" onClick={openNew}>
            + Add menu item
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
        {loading ? (
          <p className="admin-loading">Loading menu items…</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      <span>{item.description}</span>
                    </td>
                    <td>{item.category}</td>
                    <td>{Number(item.price).toLocaleString()} ETB</td>
                    <td>
                      <button
                        className={`availability ${item.available ? "on" : ""}`}
                        onClick={() => toggleAvailability(item)}
                      >
                        {item.available ? "On" : "Off"}
                      </button>
                    </td>
                    <td className="row-actions">
                      <button onClick={() => openEdit(item)}>Edit</button>
                      <button
                        className="delete-button"
                        onClick={() => remove(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan="5" className="admin-empty">
                      No menu items yet. Add your first dish to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {editing && (
          <div className="modal-backdrop">
            <form className="item-form" onSubmit={save}>
              <div className="form-heading">
                <h2>
                  {editing === "new" ? "Add menu item" : "Edit menu item"}
                </h2>
                <button type="button" onClick={() => setEditing(null)}>
                  ×
                </button>
              </div>
              <label>
                Dish name
                <input
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                  required
                  minLength="2"
                />
              </label>
              <label>
                Description
                <textarea
                  value={values.description}
                  onChange={(e) =>
                    setValues({ ...values, description: e.target.value })
                  }
                  required
                  minLength="5"
                />
              </label>
              <div className="form-row">
                <label>
                  Price (ETB)
                  <input
                    type="number"
                    min="1"
                    value={values.price}
                    onChange={(e) =>
                      setValues({ ...values, price: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Category
                  <input
                    value={values.category}
                    onChange={(e) =>
                      setValues({ ...values, category: e.target.value })
                    }
                    required
                    minLength="2"
                  />
                </label>
              </div>
              <label>
                Image URL
                <input
                  type="url"
                  value={values.imageUrl}
                  onChange={(e) =>
                    setValues({ ...values, imageUrl: e.target.value })
                  }
                  required
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="primary-button" disabled={saving}>
                {saving ? "Saving…" : "Save menu item"}
              </button>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
export default ManageMenu;
