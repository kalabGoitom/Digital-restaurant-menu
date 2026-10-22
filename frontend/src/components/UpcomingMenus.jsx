import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUpcomingDailyMenus } from "../services/dailyMenuApi";
import "../UpcomingMenus.css";

function UpcomingMenus() {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadUpcomingMenus = async () => {
      try {
        const upcomingMenus = await getUpcomingDailyMenus();
        setMenus(upcomingMenus);
      } catch (error) {
        setError(error.message || "Failed to load upcoming menus.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUpcomingMenus();
  }, []);

  const openMenu = (date) => {
    navigate(`/restaurant/daily-menu?date=${date}`);
  };

  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-ET", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const today = getLocalDateString();

  return (
    <section className="upcoming-menus">
      <div className="upcoming-menus__header">
        <div>
          <h2>Upcoming Menus</h2>
          <p>View your scheduled daily menus.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/restaurant/daily-menu")}
        >
          Manage menus
        </button>
      </div>

      {isLoading ? (
        <p className="upcoming-menus__message">Loading upcoming menus...</p>
      ) : error ? (
        <p className="upcoming-menus__error">{error}</p>
      ) : menus.length === 0 ? (
        <p className="upcoming-menus__message">
          No upcoming menus yet. Create one in the Daily Menu Planner.
        </p>
      ) : (
        <div className="upcoming-menus__list">
          {menus.map((menu) => {
            const menuDate = menu.date.slice(0, 10);
            const isToday = menuDate === today;

            return (
              <button
                className="upcoming-menus__item"
                type="button"
                key={menu.id}
                onClick={() => openMenu(menuDate)}
              >
                <span className="upcoming-menus__date">
                  {formatDate(menu.date)}
                </span>

                <span
                  className={`upcoming-menus__status ${
                    isToday
                      ? "upcoming-menus__status--today"
                      : "upcoming-menus__status--upcoming"
                  }`}
                >
                  {isToday ? "Today" : "Upcoming"}
                </span>

                <span className="upcoming-menus__count">
                  {menu.dishCount} {menu.dishCount === 1 ? "dish" : "dishes"}
                </span>

                <span className="upcoming-menus__arrow" aria-hidden="true">
                  →
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default UpcomingMenus;
