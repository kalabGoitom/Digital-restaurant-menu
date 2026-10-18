import { Link } from "react-router-dom";

function PlatformSettings() {
  return (
    <main className="platform-restaurants">
      <div className="restaurants-heading">
        <h1>Settings</h1>
        <p>Manage your NOVA platform preferences.</p>
      </div>

      <section className="create-restaurant-form">
        <h2>Platform Settings</h2>
        <p>
          Platform settings will be available here as we expand the NOVA admin
          dashboard.
        </p>

        <Link to="/platform/dashboard">Back to Dashboard</Link>
      </section>
    </main>
  );
}

export default PlatformSettings;
