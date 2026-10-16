function PlatformDashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="logo">NOVA</h2>

        <p className="sidebar-label">PLATFORM</p>

        <nav className="sidebar-nav">
          <a href="/platform/dashboard" className="active">
            Overview
          </a>

          <a href="/platform/restaurants">Restaurants</a>

          <a href="/platform/settings">Settings</a>
        </nav>

        <button className="logout-button" type="button">
          Log out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Overview</h1>
            <p>Welcome back to NOVA.</p>
          </div>

          <div className="admin-avatar">A</div>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <p>Total restaurants</p>
            <h2>—</h2>
          </article>

          <article className="stat-card">
            <p>Active restaurants</p>
            <h2>—</h2>
          </article>
        </section>

        <section className="recent-section">
          <div className="section-heading">
            <h2>Recent restaurants</h2>
            <button type="button">View all</button>
          </div>

          <p className="empty-state">Your restaurant list will appear here.</p>
        </section>
      </main>
    </div>
  );
}

export default PlatformDashboard;
