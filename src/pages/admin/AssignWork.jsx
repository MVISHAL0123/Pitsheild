import { useState, useEffect } from "react";
import {
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Send,
  ChevronDown,
} from "lucide-react";
import { api } from "../../services/api";


function AssignWork() {
  const [selectedTeam, setSelectedTeam] = useState({});
  const [priority, setPriority] = useState({});
  const [assigned, setAssigned] = useState({});
  const [verifiedPotholes, setVerifiedPotholes] = useState([]);
  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    try {
      const data = await api.getTeams();
      if (data.success) {
        setTeams(data.teams.map(t => ({
          ...t,
          id: t._id
        })));
      }
    } catch (err) {
      console.error("Failed to fetch teams", err);
    }
  };

  const fetchVerifiedPotholes = async () => {
    try {
      const data = await api.getPotholes({ status: "Verified" });
      if (data.success) {
        setVerifiedPotholes(
          data.potholes.map(p => ({
            id: p.complaintId,
            _id: p._id,
            location: p.location,
            severity: p.severity,
            date: new Date(p.createdAt).toISOString().split("T")[0]
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch verified potholes", err);
    }
  };

  useEffect(() => {
    fetchVerifiedPotholes();
    fetchTeams();
  }, []);

  const handleAssign = async (id, _id) => {
    if (!selectedTeam[id]) return;
    
    try {
      const data = await api.updatePotholeStatus(_id, "Assigned");
      if (data.success) {
        setAssigned({ ...assigned, [id]: true });
      }
    } catch (err) {
      alert("Failed to assign");
    }
  };

  return (
    <div className="assign-work-page">

      <div className="page-header">
        <div>
          <h1>Assign Work</h1>
          <p>Assign verified potholes to maintenance teams</p>
        </div>
        <div className="sensor-online"><span></span>System Active</div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content"><span>Verified (Unassigned)</span><h2>{String(verifiedPotholes.filter(p => !assigned[p.id]).length).padStart(2, "0")}</h2><p>Ready for assignment</p></div>
          <div className="stat-icon"><AlertTriangle size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content"><span>Assigned Today</span><h2>{String(Object.keys(assigned).length).padStart(2, "0")}</h2><p>Work dispatched</p></div>
          <div className="stat-icon"><Send size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content"><span>Teams Available</span><h2>{String(teams.filter(t => t.status === "Available").length).padStart(2, "0")}</h2><p>Ready to deploy</p></div>
          <div className="stat-icon"><Users size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content"><span>Teams Total</span><h2>{String(teams.length).padStart(2, "0")}</h2><p>All maintenance teams</p></div>
          <div className="stat-icon"><CheckCircle size={24} /></div>
        </div>
      </div>

      {/* ASSIGNMENT CARDS */}
      <div className="assign-grid">

        {/* VERIFIED POTHOLES */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div><h3>Verified Potholes</h3><p>Assign a team to each verified pothole</p></div>
          </div>

          <div className="assign-list">
            {verifiedPotholes.map((p) => (
              <div className={`assign-card ${assigned[p.id] ? "assign-done" : ""}`} key={p.id}>
                <div className="assign-card-top">
                  <div className="complaint-item-id">{p.id}</div>
                  <span className={`badge badge-${p.severity.toLowerCase()}`}>{p.severity}</span>
                </div>
                <div className="complaint-item-location"><MapPin size={14} />{p.location}</div>
                <div className="assign-card-date">Verified: {p.date}</div>

                {!assigned[p.id] ? (
                  <div className="assign-controls">
                    <div className="complaint-select-wrapper">
                      <select value={selectedTeam[p.id] || ""} onChange={(e) => setSelectedTeam({...selectedTeam, [p.id]: e.target.value})}>
                        <option value="">Select Team</option>
                        {teams.filter(t => t.status === "Available").map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.lead})</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="select-arrow" />
                    </div>
                    <div className="complaint-severity-options" style={{ marginTop: "8px" }}>
                      {["Normal", "Urgent"].map(p2 => (
                        <button key={p2} type="button"
                          className={`severity-option ${priority[p.id] === p2 ? (p2 === "Urgent" ? "severity-active-high" : "severity-active-low") : ""}`}
                          onClick={() => setPriority({...priority, [p.id]: p2})}>{p2}</button>
                      ))}
                    </div>
                    <button className="complaint-submit-btn" style={{ marginTop: "12px" }} onClick={() => handleAssign(p.id, p._id)} disabled={!selectedTeam[p.id]}>
                      <Send size={16} /> Assign Team
                    </button>
                  </div>
                ) : (
                  <div className="assign-success">
                    <CheckCircle size={18} />
                    <span>Assigned to {teams.find(t => t.id === selectedTeam[p.id])?.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TEAMS */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div><h3>Maintenance Teams</h3><p>Available teams for deployment</p></div>
          </div>
          <div className="teams-list">
            {teams.map((t) => (
              <div className="team-card" key={t.id}>
                <div className="team-card-left">
                  <div className="team-avatar"><Users size={20} /></div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>Lead: {t.lead} • {t.members} members</span>
                  </div>
                </div>
                <span className={`team-status ${t.status === "Available" ? "team-available" : "team-busy"}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AssignWork;
