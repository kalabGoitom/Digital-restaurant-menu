import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer" id="about">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="/" aria-label="NOVA home">NOVA</a>
          <p>Authentic Ethiopian cuisine, served with warmth and tradition.</p>
        </div>
        <div>
          <h2>Visit us</h2>
          <p>Addis Ababa, Ethiopia<br />Every day, 8:00 AM – 10:00 PM</p>
        </div>
        <div>
          <h2>Contact</h2>
          <p><a href="tel:+251900000000">+251 900 000 000</a><br /><a href="mailto:hello@nova.restaurant">hello@nova.restaurant</a></p>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} NOVA Restaurant. Made for good company.</div>
    </footer>
  );
}

export default Footer;
