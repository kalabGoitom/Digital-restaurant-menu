import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPastDailyMenus } from "../services/dailyMenuApi";
import "../MenuHistory.css";

function MenuHistory() {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadPastMenus = async () => {
      try {
        const pastMenus = await getPastDailyMenus();
        setMenus(pastMenus);
      } catch (error) {
        setError(error.message || "Failed to load menu history.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPastMenus();
  }, []);

  const openMenu = (date) => {
    navigate(`/restaurant/daily-menu?date=${date}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-ET", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="menu-history">
      <div className="menu-history__header">
        <div>
          <h2>Menu History</h2>
          <p>Review your restaurant's previous daily menus.</p>
        </div>
      </div>

      {isLoading ? (
        <p className="menu-history__message">Loading menu history...</p>
      ) : error ? (
        <p className="menu-history__error">{error}</p>
      ) : menus.length === 0 ? (
        <p className="menu-history__message">
          No past menus yet. Your previous menus will appear here.
        </p>
      ) : (
        <div className="menu-history__list">
          {menus.map((menu) => (
            <button
              className="menu-history__item"
              type="button"
              key={menu.id}
              onClick={() => openMenu(menu.date.slice(0, 10))}
            >
              <span className="menu-history__date">
                {formatDate(menu.date)}
              </span>

              <span className="menu-history__count">
                {menu.dishCount} {menu.dishCount === 1 ? "dish" : "dishes"}
              </span>

              <span className="menu-history__action">Review →</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default MenuHistory;
