import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { getMenuItems } from "../services/adminMenuApi";
import {
  addToTodaysMenu,
  ensureTodaysDailyMenu,
  getPublicTodaysMenu,
  removeFromTodaysMenu,
} from "../services/dailyMenuApi";
import "./Admin.css";

function ManageDailyMenu() {
  const [allItems, setAllItems] = useState([]);
  const [todayItems, setTodayItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      await ensureTodaysDailyMenu();
      const [items, today] = await Promise.all([getMenuItems(), getPublicTodaysMenu()]);
      setAllItems(items);
      setTodayItems(today.menuItems);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialDailyMenu = async () => {
      try {
        await ensureTodaysDailyMenu();
        const [items, today] = await Promise.all([getMenuItems(), getPublicTodaysMenu()]);
        setAllItems(items);
        setTodayItems(today.menuItems);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };
    loadInitialDailyMenu();
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timeoutId = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const toggle = (id) => setSelected((current) => (
    current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
  ));

  const addSelected = async () => {
    if (!selected.length) return;
    setSaving(true);
    setError("");
    try {
      await Promise.all(selected.map(addToTodaysMenu));
      setSelected([]);
      setNotice("Selected dishes were added to today's menu.");
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async () => {
    if (!itemToRemove) return;
    setSaving(true);
    setError("");
    try {
      await removeFromTodaysMenu(itemToRemove.dailyMenuItemId);
      setNotice(`${itemToRemove.name} was removed from today's menu.`);
      setItemToRemove(null);
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedIds = new Set(todayItems.map((item) => item.id));
  const availableToAdd = allItems.filter((item) => !selectedIds.has(item.id));

  return (
    <AdminLayout title="Today's menu" description="Select existing menu items for today's service.">
      <div className="admin-content">
        {error && <p className="form-error">{error}</p>}
        {notice && <p className="form-notice">{notice}</p>}
        {loading ? <p className="admin-loading">Preparing today&apos;s menu…</p> : (
          <div className="daily-grid">
            <section className="admin-panel">
              <div className="panel-heading"><div><p className="panel-label">Serving today</p><h2>{todayItems.length} selected dishes</h2></div></div>
              {todayItems.length ? <div className="today-items">{todayItems.map((item) => (
                <article key={item.dailyMenuItemId}>
                  <img src={item.imageUrl} alt="" />
                  <div><strong>{item.name}</strong><span>{item.category} · {Number(item.price).toLocaleString()} ETB</span></div>
                  <button className="remove-daily-item" disabled={saving} onClick={() => setItemToRemove(item)}>Remove</button>
                </article>
              ))}</div> : <div className="admin-empty"><strong>No dishes selected yet</strong><p>Select dishes from the collection to publish them to customers.</p></div>}
            </section>
            <section className="admin-panel">
              <div className="panel-heading"><div><p className="panel-label">Your collection</p><h2>Add dishes</h2></div><button className="primary-button small" disabled={!selected.length || saving} onClick={addSelected}>{saving ? "Saving…" : `Add selected${selected.length ? ` (${selected.length})` : ""}`}</button></div>
              <div className="selectable-items">{availableToAdd.map((item) => (
                <label key={item.id}><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} /><span><strong>{item.name}</strong><small>{item.category} · {Number(item.price).toLocaleString()} ETB</small></span></label>
              ))}{!availableToAdd.length && <p className="admin-empty">All saved dishes are already on today&apos;s menu.</p>}</div>
            </section>
          </div>
        )}
        {itemToRemove && <div className="modal-backdrop" role="presentation">
          <section className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="remove-dialog-title">
            <p className="panel-label">Remove from today&apos;s menu</p>
            <h2 id="remove-dialog-title">Remove {itemToRemove.name}?</h2>
            <p>This dish will no longer appear on today&apos;s customer menu. It will remain in your complete menu collection.</p>
            <div className="confirmation-actions">
              <button className="secondary-button" disabled={saving} onClick={() => setItemToRemove(null)}>Keep dish</button>
              <button className="danger-button" disabled={saving} onClick={removeItem}>{saving ? "Removing…" : "Remove dish"}</button>
            </div>
          </section>
        </div>}
      </div>
    </AdminLayout>
  );
}

export default ManageDailyMenu;
