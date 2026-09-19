import { useState, useEffect } from "react";
import { User, Mail, Shield, CheckCircle, Save, Phone } from "lucide-react";

function MaintProfile() {
  const [stats, setStats] = useState({ completed: 0, inProgress: 0 });
  const [teamInfo, setTeamInfo] = useState({
    teamName: localStorage.getItem("maintTeamName") || "Team Alpha",
    email: localStorage.getItem("pitshieldEmail") || "maint@pitshield.com",
    teamLead: localStorage.getItem("maintTeamLead") || "Lead Technician",
    members: localStorage.getItem("maintTeamMembers") || "4",
  });
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/potholes");
        const data = await res.json();
        if (data.success && Array.isArray(data.potholes)) {
          const completed = data.potholes.filter(p => p.status === "Resolved" || p.status === "Closed").length;
          const inProgress = data.potholes.filter(p => p.status === "In Progress" || p.status === "Awaiting Review").length;
          setStats({ completed, inProgress });
        }
      } catch (err) {
        console.error("Failed to fetch profile stats:", err);
      }
    };
    fetchStats();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("maintTeamName", teamInfo.teamName);
    localStorage.setItem("maintTeamLead", teamInfo.teamLead);
    localStorage.setItem("maintTeamMembers", teamInfo.members);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="user-profile-page">
      <div className="page-header">
        <div>
          <h1>Team Profile</h1>
          <p>Manage your maintenance team details and view live MongoDB stats</p>
        </div>
      </div>

      <div className="profile-page-grid">
        <div className="profile-avatar-card">
          <div className="profile-avatar-big" style={{ background: "#fef3c7", color: "#d97706", borderColor: "#fde68a" }}>
            <WrenchIcon />
          </div>
          <h3>{teamInfo.teamName}</h3>
          <span>{teamInfo.email}</span>
          <span className="profile-role-badge" style={{ background: "#fef3c7", color: "#d97706" }}>
            <Shield size={14} /> Maintenance Team
          </span>

          <div className="profile-stats-mini">
            <div>
              <strong>{stats.completed}</strong>
              <span>Repaired</span>
            </div>
            <div>
              <strong>{stats.inProgress}</strong>
              <span>Active</span>
            </div>
          </div>
        </div>

        <div className="profile-right-col">
          <form className="complaint-table-card" style={{ padding: "24px" }} onSubmit={handleSave}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", color: "#1e293b", margin: 0 }}>Team Information</h3>
              {savedMsg && (
                <span style={{ color: "#16a34a", fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle size={16} /> Changes saved successfully!
                </span>
              )}
            </div>
            
            <div className="complaint-form-row">
              <div className="complaint-field">
                <label>Team Name</label>
                <div className="complaint-input-icon">
                  <User size={18} />
                  <input
                    type="text"
                    value={teamInfo.teamName}
                    onChange={(e) => setTeamInfo({ ...teamInfo, teamName: e.target.value })}
                  />
                </div>
              </div>
              <div className="complaint-field">
                <label>Email Address</label>
                <div className="complaint-input-icon">
                  <Mail size={18} />
                  <input type="email" value={teamInfo.email} disabled />
                </div>
              </div>
            </div>

            <div className="complaint-form-row">
              <div className="complaint-field">
                <label>Team Lead</label>
                <input
                  type="text"
                  value={teamInfo.teamLead}
                  onChange={(e) => setTeamInfo({ ...teamInfo, teamLead: e.target.value })}
                />
              </div>
              <div className="complaint-field">
                <label>Number of Members</label>
                <input
                  type="number"
                  min="1"
                  value={teamInfo.members}
                  onChange={(e) => setTeamInfo({ ...teamInfo, members: e.target.value })}
                />
              </div>
            </div>
            
            <button type="submit" className="complaint-submit-btn" style={{ marginTop: "10px" }}>
              <Save size={18} /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function WrenchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  );
}

export default MaintProfile;
