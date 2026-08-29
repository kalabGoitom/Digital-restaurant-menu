import "./EmptyMenu.css";

function EmptyMenu({ message }) {
  return (
    <div className="empty-menu">
      <h2>{message || "Today’s menu is not available yet."}</h2>

      <p>Our menu is being prepared. Please check back later.</p>
    </div>
  );
}

export default EmptyMenu;
