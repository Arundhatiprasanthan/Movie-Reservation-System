import { useState, useEffect } from "react";
import ConfirmDialog from "../common/ConfirmDialog";
import { fetchAdminUsers, updateUserRole } from "../../api/users";
import "../AdminTabs/AdminPanel.css";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleTarget, setRoleTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchAdminUsers();
      setUsers(list || []);
    } catch (e) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async () => {
    if (!roleTarget) return;
    setBusy(true);
    const newRole = roleTarget.currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole(roleTarget._id, newRole);
      setRoleTarget(null);
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update role");
      setRoleTarget(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Users & Roles</h2>
        <span style={{ color: "#a0a5b5", fontSize: "0.85rem" }}>{users.length} registered users</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="admin-empty-row"><td colSpan={5}>Loading users…</td></tr>
            ) : users.length === 0 ? (
              <tr className="admin-empty-row"><td colSpan={5}>No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td className="admin-td-title">{u.name}</td>
                  <td className="admin-td-muted">{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td className="admin-td-muted">
                    {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td>
                    <button
                      className={u.role === "admin" ? "btn-action-delete" : "btn-action-edit"}
                      onClick={() => setRoleTarget({ ...u, currentRole: u.role })}
                    >
                      {u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {roleTarget && (
        <ConfirmDialog
          title={roleTarget.currentRole === "admin" ? "Demote to User" : "Promote to Admin"}
          message={
            roleTarget.currentRole === "admin"
              ? `Remove admin privileges from "${roleTarget.name}" (${roleTarget.email})? They will lose all admin access.`
              : `Grant admin privileges to "${roleTarget.name}" (${roleTarget.email})? They will have full admin access.`
          }
          confirmLabel={roleTarget.currentRole === "admin" ? "Demote" : "Promote"}
          onConfirm={handleRoleChange}
          onCancel={() => setRoleTarget(null)}
          busy={busy}
        />
      )}
    </div>
  );
}
