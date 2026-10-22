import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getDailyMenu,
  createDailyMenu,
  addMenuItemToDailyMenu,
  removeMenuItemFromDailyMenu,
} from "../services/dailyMenuApi.js";
import { getMenuItems } from "../services/menuApi.js";
import { getCurrentRestaurantAdmin } from "../services/authApi.js";
import RestaurantBranding from "../components/RestaurantBranding.jsx";
import "../DailyMenu.css";

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function DailyMenu() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [date, setDate] = useState(
    () => searchParams.get("date") || getLocalDateString(),
  );
  const [restaurant, setRestaurant] = useState(null);
  const [dailyMenu, setDailyMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [busyItemId, setBusyItemId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadPage = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [admin, items, currentDailyMenu] = await Promise.all([
          getCurrentRestaurantAdmin(),
          getMenuItems(),
          getDailyMenu(date),
        ]);

        setRestaurant(admin?.restaurant || null);
        setMenuItems(items);
        setDailyMenu(currentDailyMenu);
      } catch (err) {
        setError(err.message || "Failed to load the daily menu.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [date]);

  const handleCreateDailyMenu = async () => {
    setIsCreating(true);
    setError("");
    setSuccess("");

    try {
      const createdMenu = await createDailyMenu(date);

      setDailyMenu({
        ...createdMenu,
        items: [],
      });

      setSuccess("Today's menu has been created.");
    } catch (err) {
      setError(err.message || "Failed to create today's menu.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddItem = async (menuId) => {
    if (!dailyMenu) return;

    setBusyItemId(menuId);
    setError("");
    setSuccess("");

    try {
      const addedItem = await addMenuItemToDailyMenu(dailyMenu.id, menuId);

      setDailyMenu((current) => ({
        ...current,
        items: [...(current.items || []), addedItem],
      }));

      setSuccess("Dish added to today's menu.");
    } catch (err) {
      setError(err.message || "Failed to add the dish.");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRemoveItem = async (dailyMenuItemId) => {
    setBusyItemId(dailyMenuItemId);
    setError("");
    setSuccess("");

    try {
      await removeMenuItemFromDailyMenu(dailyMenuItemId);

      setDailyMenu((current) => ({
        ...current,
        items: current.items.filter((item) => item.id !== dailyMenuItemId),
      }));

      setSuccess("Dish removed from today's menu.");
    } catch (err) {
      setError(err.message || "Failed to remove the dish.");
    } finally {
      setBusyItemId(null);
    }
  };

  const selectedMenuIds = new Set(
    (dailyMenu?.items || []).map((item) => item.menuId),
  );

  const availableItems = menuItems.filter((item) => item.available !== false);

  return (
    <main className="daily-menu-page">
      <header className="daily-menu-header">
        <RestaurantBranding restaurant={restaurant} />

        <button
          className="daily-menu-button daily-menu-button-secondary"
          onClick={() => navigate("/restaurant/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <section className="daily-menu-intro">
        <p className="daily-menu-eyebrow">MENU MANAGEMENT</p>
        <h1>Daily Menu Planner</h1>
        <p>
          Choose which dishes your restaurant will serve on a selected date.
        </p>

        <div className="daily-menu-date-picker">
          <label htmlFor="daily-menu-date">Select menu date</label>
          <input
            id="daily-menu-date"
            type="date"
            value={date}
            min={getLocalDateString()}
            onChange={(event) => {
              setDate(event.target.value);
              setError("");
              setSuccess("");
            }}
          />
        </div>

        <p className="daily-menu-date">
          Menu for{" "}
          {new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </section>

      {error && (
        <div
          className="daily-menu-message daily-menu-message-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="daily-menu-message daily-menu-message-success"
          role="status"
        >
          {success}
        </div>
      )}

      {isLoading ? (
        <div className="daily-menu-state">Loading your daily menu...</div>
      ) : !dailyMenu ? (
        <section className="daily-menu-empty">
          <h2>No menu created for today</h2>
          <p>
            Create today's menu first, then choose dishes from your saved menu
            items.
          </p>
          <button
            className="daily-menu-button daily-menu-button-primary"
            onClick={handleCreateDailyMenu}
            disabled={isCreating}
          >
            {isCreating
              ? "Creating..."
              : `Create Menu for ${
                  date === getLocalDateString() ? "Today" : "Selected Date"
                }`}
          </button>
        </section>
      ) : (
        <>
          <section className="daily-menu-section">
            <div className="daily-menu-section-heading">
              <div>
                <h2>Selected Dishes</h2>
                <p>{dailyMenu.items?.length || 0} dishes on today's menu</p>
              </div>
            </div>

            {!dailyMenu.items?.length ? (
              <div className="daily-menu-state">
                No dishes selected yet. Add dishes below.
              </div>
            ) : (
              <div className="daily-menu-grid">
                {dailyMenu.items.map((dailyItem) => (
                  <article className="daily-menu-card" key={dailyItem.id}>
                    {dailyItem.menu.imageUrl ? (
                      <img
                        className="daily-menu-card-image"
                        src={dailyItem.menu.imageUrl}
                        alt={dailyItem.menu.name}
                      />
                    ) : (
                      <div className="daily-menu-card-image daily-menu-image-placeholder">
                        No image
                      </div>
                    )}

                    <div className="daily-menu-card-content">
                      <span className="daily-menu-category">
                        {dailyItem.menu.category}
                      </span>
                      <h3>{dailyItem.menu.name}</h3>
                      <p>{dailyItem.menu.description}</p>
                      <strong>
                        {Number(dailyItem.menu.price).toLocaleString()} ETB
                      </strong>

                      <button
                        className="daily-menu-button daily-menu-button-danger"
                        onClick={() => handleRemoveItem(dailyItem.id)}
                        disabled={busyItemId === dailyItem.id}
                      >
                        {busyItemId === dailyItem.id
                          ? "Removing..."
                          : "Remove Dish"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="daily-menu-section">
            <div className="daily-menu-section-heading">
              <div>
                <h2>Add Dishes</h2>
                <p>Select from your existing menu items.</p>
              </div>
            </div>

            {!availableItems.length ? (
              <div className="daily-menu-state">
                No available menu items found. Add items in Menu Management
                first.
              </div>
            ) : (
              <div className="daily-menu-grid">
                {availableItems.map((item) => {
                  const isSelected = selectedMenuIds.has(item.id);

                  return (
                    <article className="daily-menu-card" key={item.id}>
                      {item.imageUrl ? (
                        <img
                          className="daily-menu-card-image"
                          src={item.imageUrl}
                          alt={item.name}
                        />
                      ) : (
                        <div className="daily-menu-card-image daily-menu-image-placeholder">
                          No image
                        </div>
                      )}

                      <div className="daily-menu-card-content">
                        <span className="daily-menu-category">
                          {item.category}
                        </span>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <strong>
                          {Number(item.price).toLocaleString()} ETB
                        </strong>

                        <button
                          className={`daily-menu-button ${
                            isSelected
                              ? "daily-menu-button-selected"
                              : "daily-menu-button-primary"
                          }`}
                          onClick={() => handleAddItem(item.id)}
                          disabled={isSelected || busyItemId === item.id}
                        >
                          {isSelected
                            ? "Already Added"
                            : busyItemId === item.id
                              ? "Adding..."
                              : "Add to Today's Menu"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default DailyMenu;
