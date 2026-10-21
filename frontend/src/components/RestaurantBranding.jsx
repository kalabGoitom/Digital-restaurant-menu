import { useEffect, useState } from "react";
import "../RestaurantDashboard.css";

function RestaurantBranding({ restaurant }) {
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    setLogoFailed(false);
  }, [restaurant?.logoUrl]);

  return (
    <div className="restaurant-branding">
      {restaurant?.logoUrl && !logoFailed ? (
        <img
          className="restaurant-branding-logo"
          src={restaurant.logoUrl}
          alt={`${restaurant.name || "Restaurant"} logo`}
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <div className="restaurant-branding-placeholder" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
            <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
            <path d="M16 13v.01M16 16v.01M16 19v.01" />
          </svg>
        </div>
      )}

      <div className="restaurant-branding-details">
        <span className="restaurant-branding-name">
          {restaurant?.name || "Your Restaurant"}
        </span>
        <span className="restaurant-branding-label">Restaurant Management</span>
      </div>
    </div>
  );
}

export default RestaurantBranding;
