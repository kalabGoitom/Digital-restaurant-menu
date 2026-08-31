import "./NotFound.css";

function NotFound({ path }) {
  return (
    <main className="not-found-page">
      <a href="/" className="not-found-logo">
        NOVA
      </a>
      <section className="not-found-content" aria-labelledby="not-found-title">
        <p className="not-found-code">404</p>
        <p className="not-found-eyebrow">Route not found</p>
        <h1 id="not-found-title">This page isn&apos;t on the menu.</h1>
        <p>
          We couldn&apos;t find the page you requested. It may have moved, or
          the address may be incorrect.
        </p>
        <code>Route not found: {path}</code>
        <div className="not-found-actions">
          <a href="/">Return to restaurant</a>
          <a className="not-found-secondary" href="/admin/login">
            Admin sign in
          </a>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
