import { useState, useEffect } from "react";
import { Users, UserPlus, Mail, Shield, CheckCircle } from "lucide-react";

function MaintTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lead: "",
    email: "",
    members: "",
  });
  const [msg, setMsg] = useState(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/teams");
      const data = await res.json();
      if (data.success) {
        setTeams(data.teams);
      }
    } catch (err) {
      console.error("Failed to fetch teams", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch("http://localhost:5000/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: "Team added successfully!" });
        setFormData({ name: "", lead: "", email: "", members: "" });
        setShowAddForm(false);
        fetchTeams();
      } else {
        setMsg({ type: "error", text: data.message || "Failed to add team" });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error" });
    }
  };

  return (
    <div className="user-profile-page">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Manage Teams</h1>
          <p>View and add maintenance teams</p>
        </div>
        <button className="complaint-submit-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : <><UserPlus size={18} style={{ marginRight: "6px" }} /> Add New Team</>}
        </button>
      </div>

      {msg && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          background: msg.type === "success" ? "#f0fdf4" : "#fef2f2",
          color: msg.type === "success" ? "#16a34a" : "#ef4444",
          border: `1px solid ${msg.type === "success" ? "#bbf7d0" : "#fecaca"}`
        }}>
          {msg.text}
        </div>
      )}

      {showAddForm && (
        <div className="complaint-table-card" style={{ padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px", color: "#1e293b", fontSize: "18px" }}>Add New Maintenance Team</h3>
          <form onSubmit={handleAddTeam}>
            <div className="complaint-form-row">
              <div className="complaint-field">
                <label>Team Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Team Delta" />
              </div>
              <div className="complaint-field">
                <label>Team Lead</label>
                <input type="text" name="lead" value={formData.lead} onChange={handleChange} required placeholder="e.g., Priya M." />
              </div>
            </div>
            <div className="complaint-form-row">
              <div className="complaint-field">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="e.g., delta@pitshield.com" />
              </div>
              <div className="complaint-field">
                <label>Number of Members</label>
                <input type="number" min="1" name="members" value={formData.members} onChange={handleChange} required placeholder="e.g., 5" />
              </div>
            </div>
            <button type="submit" className="complaint-submit-btn" style={{ marginTop: "16px" }}>
              <CheckCircle size={18} style={{ marginRight: "6px" }} /> Create Team
            </button>
          </form>
        </div>
      )}

      <div className="dashboard-grid">
        {loading ? (
          <p>Loading teams...</p>
        ) : teams.length > 0 ? (
          teams.map(team => (
            <div className="complaint-table-card" style={{ padding: "20px" }} key={team._id}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", color: "#1e293b", margin: 0 }}>{team.name}</h3>
                  <span style={{ fontSize: "14px", color: "#64748b" }}>{team.email}</span>
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#475569" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Team Lead:</span>
                  <strong>{team.lead}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Members:</span>
                  <strong>{team.members}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Status:</span>
                  <span className={`badge ${team.status === "Available" ? "badge-low" : "badge-medium"}`}>
                    {team.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
            No maintenance teams found in the database. Add a new team above.
          </div>
        )}
      </div>
    </div>
  );
}

export default MaintTeams;
