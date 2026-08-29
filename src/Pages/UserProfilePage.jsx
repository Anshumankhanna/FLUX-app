import { useState } from "react";
import { useUser } from "../App";
import { useNavigate } from "react-router-dom";

function UserProfilePage({ onLogout }) {
  const user = useUser();
  const navigate = useNavigate();

  /* Editable profile state */
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "",
    department: user.department || "",
    company: user.company || "Reliance Industries Ltd",
    joined: user.joined || "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // In a real app you'd call an API here
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const field = (id, label, key, type = "text", readOnly = false) => (
    <div className="upp-field">
      <label htmlFor={id}>{label}</label>
      {editing && !readOnly ? (
        <input
          id={id}
          type={type}
          value={form[key]}
          onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
        />
      ) : (
        <p id={id}>{form[key] || "—"}</p>
      )}
    </div>
  );

  const inits = form.name.trim().split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="user-profile-page">

      <div className="page-heading">
        <div>
          <p className="small-label">ACCOUNT</p>
          <h2>My Profile</h2>
          <p className="sub-text">Manage your personal information &amp; preferences</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {editing ? (
            <>
              <button className="flux-btn secondary" id="cancel-edit-profile" onClick={() => setEditing(false)}>Cancel</button>
              <button className="flux-btn" id="save-profile" onClick={handleSave}>Save Changes</button>
            </>
          ) : (
            <button className="flux-btn" id="edit-profile" onClick={() => setEditing(true)}>✎ Edit Profile</button>
          )}
        </div>
      </div>

      {saved && (
        <div className="upp-success">✓ Profile saved successfully.</div>
      )}

      {/* Avatar + basics */}
      <div className="upp-hero flux-card">
        <div className="upp-avatar" style={{ background: "var(--color-accent-purple)" }}>
          {inits}
        </div>
        <div className="upp-hero-info">
          <h3>{form.name}</h3>
          <p>{form.role} · {form.department}</p>
          <p className="upp-email">{form.email}</p>
        </div>
        <div className="upp-hero-badge">
          <span className="status-badge healthy">Active Account</span>
        </div>
      </div>

      {/* Personal details */}
      <div className="upp-grid">
        <div className="flux-card upp-section">
          <span className="card-label">PERSONAL INFORMATION</span>
          <h3 className="card-title">Basic Details</h3>
          <div className="upp-fields">
            {field("upp-name", "Full Name", "name")}
            {field("upp-email", "Email Address", "email", "email")}
            {field("upp-phone", "Phone Number", "phone", "tel")}
            {field("upp-company", "Company", "company", "text", true)}
          </div>
        </div>

        <div className="flux-card upp-section">
          <span className="card-label">JOB DETAILS</span>
          <h3 className="card-title">Work Information</h3>
          <div className="upp-fields">
            {field("upp-role", "Role / Title", "role")}
            {field("upp-dept", "Department", "department")}
            {field("upp-joined", "Joined", "joined", "text", true)}
          </div>

          <div className="upp-divider" />

          <div className="upp-danger-zone">
            <p className="card-label" style={{ color: "var(--color-negative)" }}>DANGER ZONE</p>
            <button
              className="flux-btn danger"
              id="logout-from-profile"
              onClick={onLogout}
            >
              ↩ Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Activity / stats */}
      <div className="flux-card">
        <span className="card-label">ACCOUNT ACTIVITY</span>
        <h3 className="card-title">Session &amp; Access</h3>
        <div className="upp-activity-grid">
          <div className="upp-activity-item">
            <span>Last Login</span>
            <strong>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>
          </div>
          <div className="upp-activity-item">
            <span>Access Level</span>
            <strong>Full Dashboard</strong>
          </div>
          {/* <div className="upp-activity-item">
            <span>Theme</span>
            <strong>Dark Mode</strong>
          </div> */}
          <div className="upp-activity-item">
            <span>Data Currency</span>
            <strong>₹ INR</strong>
          </div>
        </div>
      </div>

    </div>
  );
}

export default UserProfilePage;
