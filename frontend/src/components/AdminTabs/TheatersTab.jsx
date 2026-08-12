import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";
import {
  fetchAdminTheaters, createTheater, updateTheater, deleteTheater,
  fetchScreensByTheater, createScreen, deleteScreen,
} from "../../api/theaters";
import "../AdminTabs/AdminPanel.css";
import "./TheatersTab.css";

export default function TheatersTab() {
  const [theaters, setTheaters] = useState([]);
  const [screens, setScreens] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedTheater, setExpandedTheater] = useState(null);
  const [showTheaterForm, setShowTheaterForm] = useState(false);
  const [editTheater, setEditTheater] = useState(null);
  const [theaterForm, setTheaterForm] = useState({ name: "", location: "" });
  const [showScreenForm, setShowScreenForm] = useState(null);
  const [screenForm, setScreenForm] = useState({ name: "", rows: 8, seatsPerRow: 12, screenType: "2D" });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadTheaters = async () => {
    setLoading(true);
    try {
      const list = await fetchAdminTheaters();
      setTheaters(list || []);
    } catch (e) {
      setTheaters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTheaters(); }, []);

  const loadScreens = async (theaterId) => {
    try {
      const s = await fetchScreensByTheater(theaterId);
      setScreens((prev) => ({ ...prev, [theaterId]: s || [] }));
    } catch (e) {
      setScreens((prev) => ({ ...prev, [theaterId]: [] }));
    }
  };

  const toggleTheater = (tid) => {
    if (expandedTheater === tid) {
      setExpandedTheater(null);
    } else {
      setExpandedTheater(tid);
      if (!screens[tid]) loadScreens(tid);
    }
  };

  const handleSaveTheater = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (editTheater) {
        await updateTheater(editTheater._id, theaterForm);
      } else {
        await createTheater(theaterForm);
      }
      setShowTheaterForm(false);
      loadTheaters();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save theater");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteTheater = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await deleteTheater(deleteTarget._id);
      setDeleteTarget(null);
      loadTheaters();
    } catch (e) {
      alert(e.response?.data?.message || "Cannot delete — remove screens first.");
      setDeleteTarget(null);
    } finally {
      setBusy(false);
    }
  };

  const handleAddScreen = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await createScreen(showScreenForm, { ...screenForm, rows: Number(screenForm.rows), seatsPerRow: Number(screenForm.seatsPerRow) });
      setShowScreenForm(null);
      loadScreens(showScreenForm);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to add screen");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteScreen = async (screenId, theaterId) => {
    if (!window.confirm("Delete this screen? This cannot be undone.")) return;
    try {
      await deleteScreen(screenId);
      loadScreens(theaterId);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete screen.");
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Theaters & Screens</h2>
        <button className="btn-primary" onClick={() => {
          setTheaterForm({ name: "", location: "" });
          setEditTheater(null);
          setError("");
          setShowTheaterForm(true);
        }}>+ Add Theater</button>
      </div>

      {loading ? (
        <p style={{ color: "#a0a5b5", paddingTop: "1rem" }}>Loading theaters…</p>
      ) : theaters.length === 0 ? (
        <p style={{ color: "#a0a5b5", paddingTop: "1rem" }}>No theaters yet. Add your first theater above.</p>
      ) : (
        <div className="theaters-list">
          {theaters.map((t) => (
            <div key={t._id} className="theater-block">
              <div className="theater-row" onClick={() => toggleTheater(t._id)}>
                <div>
                  <h3 className="theater-name">{t.name}</h3>
                  <p className="theater-location">📍 {t.location}</p>
                </div>
                <div className="theater-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-action-edit" onClick={() => {
                    setTheaterForm({ name: t.name, location: t.location });
                    setEditTheater(t);
                    setError("");
                    setShowTheaterForm(true);
                  }}>Edit</button>
                  <button className="btn-action-delete" onClick={() => setDeleteTarget(t)}>Delete</button>
                  <button className="btn-primary" style={{ fontSize: "0.78rem", padding: "0.35rem 0.75rem" }}
                    onClick={() => { setShowScreenForm(t._id); setScreenForm({ name: "", rows: 8, seatsPerRow: 12, screenType: "2D" }); setError(""); }}>
                    + Screen
                  </button>
                  <span className="expand-arrow">{expandedTheater === t._id ? "▲" : "▼"}</span>
                </div>
              </div>

              {expandedTheater === t._id && (
                <div className="screens-section">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Screen Name</th>
                        <th>Type</th>
                        <th>Rows</th>
                        <th>Seats/Row</th>
                        <th>Capacity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(screens[t._id] || []).length === 0 ? (
                        <tr className="admin-empty-row"><td colSpan={6}>No screens yet.</td></tr>
                      ) : (
                        (screens[t._id] || []).map((s) => (
                          <tr key={s._id}>
                            <td className="admin-td-title">{s.name}</td>
                            <td><span className="status-pill active">{s.screenType}</span></td>
                            <td>{s.rows}</td>
                            <td>{s.seatsPerRow}</td>
                            <td className="admin-td-gold">{s.rows * s.seatsPerRow}</td>
                            <td>
                              <button className="btn-action-delete" onClick={() => handleDeleteScreen(s._id, t._id)}>Remove</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showTheaterForm && (
        <Modal title={editTheater ? "Edit Theater" : "Add Theater"} onClose={() => setShowTheaterForm(false)}>
          <form className="admin-form" onSubmit={handleSaveTheater}>
            {error && <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>{error}</p>}
            <div className="admin-form-group">
              <label>Theater Name</label>
              <input value={theaterForm.name} onChange={(e) => setTheaterForm({ ...theaterForm, name: e.target.value })} required />
            </div>
            <div className="admin-form-group">
              <label>Location / Address</label>
              <input value={theaterForm.location} onChange={(e) => setTheaterForm({ ...theaterForm, location: e.target.value })} required />
            </div>
            <div className="admin-form-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowTheaterForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Saving…" : editTheater ? "Save Changes" : "Create Theater"}</button>
            </div>
          </form>
        </Modal>
      )}

      {showScreenForm && (
        <Modal title="Add Screen" onClose={() => setShowScreenForm(null)}>
          <form className="admin-form" onSubmit={handleAddScreen}>
            {error && <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>{error}</p>}
            <div className="admin-form-group">
              <label>Screen Name</label>
              <input value={screenForm.name} onChange={(e) => setScreenForm({ ...screenForm, name: e.target.value })} placeholder="Screen 1 - IMAX Hall" required />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Rows</label>
                <input type="number" value={screenForm.rows} onChange={(e) => setScreenForm({ ...screenForm, rows: e.target.value })} min={1} max={30} required />
              </div>
              <div className="admin-form-group">
                <label>Seats per Row</label>
                <input type="number" value={screenForm.seatsPerRow} onChange={(e) => setScreenForm({ ...screenForm, seatsPerRow: e.target.value })} min={1} max={40} required />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Screen Type</label>
              <select value={screenForm.screenType} onChange={(e) => setScreenForm({ ...screenForm, screenType: e.target.value })}>
                {["2D", "3D", "IMAX", "4DX"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowScreenForm(null)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Adding…" : "Add Screen"}</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Theater"
          message={`Delete "${deleteTarget.name}"? All its screens must already be removed.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteTheater}
          onCancel={() => setDeleteTarget(null)}
          busy={busy}
        />
      )}
    </div>
  );
}
