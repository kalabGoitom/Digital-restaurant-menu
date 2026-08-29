import { useAuth } from "../../context/useAuth";
import "./AdminLayout.css";

function AdminLayout({ title, description, children }) {
  const { admin, signOut } = useAuth();
  const logout = () => { signOut(); window.location.assign("/admin/login"); };
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a className="admin-logo" href="/admin/dashboard">NOVA <span>ADMIN</span></a>
      <nav aria-label="Admin navigation">
        <a href="/admin/dashboard">Overview</a>
        <a href="/admin/today-menu">Today&apos;s menu</a>
        <a href="/admin/menu-items">All menu items</a>
        <a href="/">View restaurant site ↗</a>
      </nav>
      <div className="admin-profile"><span>{admin?.name?.slice(0, 1) || "A"}</span><div><strong>{admin?.name || "Admin"}</strong><button onClick={logout}>Sign out</button></div></div>
    </aside>
    <main className="admin-main"><header className="admin-page-header"><div><p>Restaurant control center</p><h1>{title}</h1>{description && <span>{description}</span>}</div></header>{children}</main>
  </div>;
}

export default AdminLayout;
