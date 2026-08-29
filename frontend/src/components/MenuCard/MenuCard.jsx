import "./MenuCard.css";

function MenuCard({ menuItem }) {
  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";
    event.currentTarget.nextElementSibling.hidden = false;
  };

  return (
    <article className="menu-card">
      <div className="menu-card-image-container">
        <img
          className="menu-card-image"
          src={menuItem.imageUrl}
          alt={menuItem.name}
          loading="lazy"
          onError={handleImageError}
        />
        <div className="menu-card-image-fallback" hidden aria-hidden="true">
          NOVA
        </div>

        {!menuItem.available && (
          <span className="menu-card-unavailable">Unavailable</span>
        )}
      </div>

      <div className="menu-card-content">
        <div className="menu-card-header">
          <h2>{menuItem.name}</h2>

          <span className="menu-card-price">{Number(menuItem.price).toLocaleString()} ETB</span>
        </div>

        <p className="menu-card-category">{menuItem.category}</p>

        <p className="menu-card-description">{menuItem.description}</p>
      </div>
    </article>
  );
}

export default MenuCard;
