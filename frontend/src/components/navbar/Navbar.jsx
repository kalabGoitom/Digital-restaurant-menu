import "./Navbar.css";
function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-container">
        <a href="/" className="navbar-logo">
          NOVA
        </a>

        <ul className="navbar-links">
          <li>
            <a href="/">Home</a>
          </li>

          <li>
            <a href="#today-menu">Menu</a>
          </li>

          <li><a href="#about">About</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
