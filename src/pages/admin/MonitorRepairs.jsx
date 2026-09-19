import { useState, useEffect } from "react";
import {
  Wrench,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Eye,
  Camera,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";



const getStatusClass = (s) => {
  if (s === "Approved") return "complaint-status-resolved";
  if (s === "In Progress" || s === "Awaiting Review") return "complaint-status-progress";
  if (s === "Rejected") return "complaint-status-rejected";
  return "complaint-status-pending";
};
const getSeverityClass = (s) => s === "High" ? "badge-high" : s === "Medium" ? "badge-medium" : "badge-low";

function MonitorRepairs() {
  const [filter, setFilter] = useState("All");
  const [repairsData, setRepairsData] = useState([]);

  const fetchRepairs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/potholes");
      const data = await response.json();
      if (data.success) {
        setRepairsData(
          data.potholes.map(p => ({
            id: p.complaintId,
            _id: p._id,
            location: p.location,
            team: p.assignedTo || "Unassigned",
            severity: p.severity,
            status: p.status,
            started: new Date(p.createdAt).toISOString().split("T")[0],
            hasProof: false, // Proof not supported in backend yet
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch repairs:", err);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/potholes/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        fetchRepairs();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      alert("Server error.");
    }
  };

  const filtered = filter === "All" ? repairsData : repairsData.filter(r => r.status === filter);

  const counts = {
    progress: repairsData.filter(r => r.status === "In Progress").length,
    review: repairsData.filter(r => r.status === "Awaiting Review").length,
    approved: repairsData.filter(r => r.status === "Resolved" || r.status === "Approved" || r.status === "Closed").length,
    rejected: repairsData.filter(r => r.status === "Rejected").length,
  };

  return (
    <div className="monitor-repairs-page">

      <div className="page-header">
        <div>
          <h1>Monitor Repairs</h1>
          <p>Track ongoing repairs, review proof, and approve completions</p>
        </div>
        <div className="sensor-online"><span></span>Live Tracking</div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content"><span>In Progress</span><h2>{String(counts.progress).padStart(2, "0")}</h2><p>Active repairs</p></div>
          <div className="stat-icon"><Wrench size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content"><span>Awaiting Review</span><h2>{String(counts.review).padStart(2, "0")}</h2><p>Proof submitted</p></div>
          <div className="stat-icon"><Clock size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content"><span>Approved</span><h2>{String(counts.approved).padStart(2, "0")}</h2><p>Completed & closed</p></div>
          <div className="stat-icon"><CheckCircle size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content"><span>Rejected</span><h2>{String(counts.rejected).padStart(2, "0")}</h2><p>Sent back for re-repair</p></div>
          <div className="stat-icon"><XCircle size={24} /></div>
        </div>
      </div>

      {/* TABLE */}
      <div className="complaint-table-card">
        <div className="complaint-table-header">
          <div><h3>Repair Tracking</h3><p>Monitor all ongoing and completed repairs</p></div>
          <div className="complaint-filter-tabs">
            {["All", "In Progress", "Awaiting Review", "Approved", "Rejected"].map(s => (
              <button key={s} className={`complaint-filter-tab ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="complaint-list">
          {filtered.map(r => (
            <div className="complaint-item" key={r.id}>
              <div className="complaint-item-left">
                <div className="complaint-item-id">{r.id}</div>
                <div className="complaint-item-info">
                  <div className="complaint-item-location"><MapPin size={14} />{r.location}</div>
                  <div className="complaint-item-desc">
                    Team: <strong>{r.team}</strong> • Started: {r.started}
                    {r.hasProof && <span className="proof-badge"><Camera size={12} /> Proof Uploaded</span>}
                  </div>
                </div>
              </div>
              <div className="complaint-item-right">
                <span className={`badge ${getSeverityClass(r.severity)}`}>{r.severity}</span>
                <span className={`complaint-status-badge ${getStatusClass(r.status)}`}>{r.status}</span>
                {r.status === "Awaiting Review" ? (
                  <div className="admin-action-btns">
                    <button className="admin-approve-btn" title="Approve" onClick={() => handleStatusUpdate(r._id, "Resolved")}><ThumbsUp size={15} /></button>
                    <button className="admin-reject-btn" title="Reject" onClick={() => handleStatusUpdate(r._id, "In Progress")}><ThumbsDown size={15} /></button>
                  </div>
                ) : (
                  <button className="complaint-view-btn"><Eye size={15} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default MonitorRepairs;
