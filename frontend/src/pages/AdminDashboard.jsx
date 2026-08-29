import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { getMenuItems } from "../services/adminMenuApi";
import { getPublicTodaysMenu } from "../services/dailyMenuApi";
import "./Admin.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null); const [error, setError] = useState("");
  useEffect(() => { Promise.all([getMenuItems(), getPublicTodaysMenu()]).then(([items, today]) => setStats({ total: items.length, available: items.filter((item) => item.available).length, today: today.menuItems.length })).catch((requestError) => setError(requestError.message)); }, []);
  return <AdminLayout title="Dashboard" description="A quick view of your restaurant menu."><div className="admin-content">{error ? <p className="form-error">{error}</p> : !stats ? <p className="admin-loading">Loading your restaurant overview…</p> : <div className="stats-grid"><article><span>Today&apos;s menu</span><strong>{stats.today}</strong><p>Dishes selected for service</p></article><article><span>All menu items</span><strong>{stats.total}</strong><p>Your complete dish collection</p></article><article><span>Available now</span><strong>{stats.available}</strong><p>Visible to customers when selected</p></article></div>}<div className="quick-actions"><a href="/admin/today-menu"><span>01</span><h2>Manage today&apos;s menu</h2><p>Create today&apos;s menu and choose dishes from your collection.</p><b>Open today&apos;s menu →</b></a><a href="/admin/menu-items"><span>02</span><h2>Manage menu items</h2><p>Add, edit, remove, or change dish availability.</p><b>Open menu items →</b></a></div></div></AdminLayout>;
}
export default AdminDashboard;
