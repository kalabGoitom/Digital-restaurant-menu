import "./Hero.css";
function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-subtitle">AUTHENTIC ETHIOPIAN CUISINE</p>

        <h1>Taste Ethiopia, one dish at a time.</h1>

        <p className="hero-description">
          Discover today's freshly prepared dishes, made with traditional
          Ethiopian flavors and ingredients.
        </p>

        <a href="#today-menu" className="hero-button">
          View Today's Menu
        </a>
      </div>
    </section>
  );
}

export default Hero;
