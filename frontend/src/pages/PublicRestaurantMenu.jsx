import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPublicRestaurant,
  getPublicDailyMenu,
} from "../services/publicRestaurantApi.js";
import "../PublicRestaurantMenu.css";

function PublicRestaurantMenu() {
  const { slug } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [dailyMenu, setDailyMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPublicMenu = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [restaurantData, dailyMenuData] = await Promise.all([
          getPublicRestaurant(slug),
          getPublicDailyMenu(slug),
        ]);

        if (cancelled) return;

        setRestaurant(restaurantData);
        setDailyMenu(dailyMenuData?.dailyMenu || null);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load this restaurant's menu.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadPublicMenu();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const theme = {
    "--public-primary": restaurant?.primaryColor || "#254b36",
    "--public-secondary": restaurant?.secondaryColor || "#f5f1e8",
    "--public-accent": restaurant?.accentColor || "#d49b42",
  };

  const dishes = (dailyMenu?.items || []).filter(
    (item) => item.menu?.available !== false,
  );

  return (
    <main className="public-menu-page" style={theme}>
      {isLoading ? (
        <section className="public-menu-state">
          <div className="public-menu-spinner" aria-hidden="true" />
          <p>Preparing the menu...</p>
        </section>
      ) : error ? (
        <section className="public-menu-state public-menu-error">
          <h1>Menu unavailable</h1>
          <p>{error}</p>
          <button
            className="public-menu-retry"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </section>
      ) : restaurant ? (
        <>
          <header className="public-menu-header">
            {restaurant.logoUrl ? (
              <img
                className="public-menu-logo"
                src={restaurant.logoUrl}
                alt={`${restaurant.name} logo`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : null}

            <p className="public-menu-kicker">WELCOME TO</p>
            <h1>{restaurant.name}</h1>
            <span className="public-menu-accent-line" />
            <p className="public-menu-subtitle">
              Freshly prepared. Made with care.
            </p>
          </header>

          <section className="public-menu-content">
            <div className="public-menu-section-heading">
              <div>
                <p className="public-menu-kicker">MADE FOR TODAY</p>
                <h2>Today's Menu</h2>
              </div>

              {dailyMenu && (
                <span className="public-menu-count">
                  {dishes.length} {dishes.length === 1 ? "dish" : "dishes"}
                </span>
              )}
            </div>

            {!dailyMenu ? (
              <div className="public-menu-empty">
                <span className="public-menu-empty-icon" aria-hidden="true">
                  🍽
                </span>
                <h3>Today's menu isn't available yet</h3>
                <p>
                  Please check back soon. We're preparing something delicious.
                </p>
              </div>
            ) : dishes.length === 0 ? (
              <div className="public-menu-empty">
                <h3>No dishes available right now</h3>
                <p>Please check back later for today's selections.</p>
              </div>
            ) : (
              <div className="public-menu-grid">
                {dishes.map(({ id, menu }) => (
                  <article className="public-menu-card" key={id}>
                    {menu.imageUrl ? (
                      <img
                        className="public-menu-dish-image"
                        src={menu.imageUrl}
                        alt={menu.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="public-menu-dish-placeholder">
                        <span aria-hidden="true">🍲</span>
                        <span>Made fresh for you</span>
                      </div>
                    )}

                    <div className="public-menu-dish-content">
                      {menu.category && (
                        <span className="public-menu-category">
                          {menu.category}
                        </span>
                      )}

                      <div className="public-menu-dish-title">
                        <h3>{menu.name}</h3>
                        <span className="public-menu-price">
                          {Number(menu.price).toLocaleString()} ETB
                        </span>
                      </div>

                      {menu.description && (
                        <p className="public-menu-description">
                          {menu.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="public-menu-footer">
            <span className="public-menu-footer-mark">✦</span>
            <p>Thank you for dining with {restaurant.name}</p>
          </footer>
        </>
      ) : null}
    </main>
  );
}

export default PublicRestaurantMenu;
