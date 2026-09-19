import { useState, useEffect } from "react";
import { MapPin, Clock, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";



function MyAssignments() {
  const [filter, setFilter] = useState("All");
  const [assignmentsData, setAssignmentsData] = useState([]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/potholes");
      const data = await response.json();
      if (data.success) {
        setAssignmentsData(
          data.potholes
            .filter(p => p.status === "Assigned" || p.status === "In Progress")
            .map(p => ({
              id: p.complaintId,
              _id: p._id,
              location: p.location,
              severity: p.severity,
              priority: p.severity === "High" ? "Urgent" : "Normal",
              assignedDate: new Date(p.updatedAt || p.createdAt).toISOString().split("T")[0],
              status: p.status === "Assigned" ? "Assigned" : "Accepted",
            }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleAcceptJob = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/potholes/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "In Progress" }),
      });
      const data = await response.json();
      if (data.success) {
        fetchAssignments();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      alert("Server error.");
    }
  };

  const filtered = filter === "All" ? assignmentsData : assignmentsData.filter(a => a.status === filter);

  return (
    <div className="my-reports-page">
      <div className="page-header">
        <div>
          <h1>My Assignments</h1>
          <p>Potholes assigned to your team for repair</p>
        </div>
      </div>

      <div className="complaint-table-card">
        <div className="complaint-table-header">
          <div>
            <h3>Assigned Jobs</h3>
          </div>
          <div className="complaint-filter-tabs">
            {["All", "Assigned", "Accepted"].map(s => (
              <button key={s} className={`complaint-filter-tab ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="assign-list" style={{ padding: "20px" }}>
          {filtered.length > 0 ? (
            filtered.map(p => (
              <div className="assign-card" key={p._id}>
                <div className="assign-card-top">
                  <div className="complaint-item-id">{p.id}</div>
                  <span className={`badge badge-${p.severity.toLowerCase()}`}>{p.severity}</span>
                </div>
                <div className="complaint-item-location"><MapPin size={14} />{p.location}</div>
                
                <div style={{ display: "flex", gap: "10px", marginTop: "10px", fontSize: "13px", color: "#64748b" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Calendar size={14} /> Assigned: {p.assignedDate}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><AlertTriangle size={14} color={p.priority === "Urgent" ? "#ef4444" : "#64748b"} /> Priority: <strong style={{ color: p.priority === "Urgent" ? "#ef4444" : "inherit" }}>{p.priority}</strong></div>
                </div>

                <div style={{ marginTop: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                  {p.status === "Assigned" ? (
                    <button className="complaint-submit-btn" style={{ width: "100%" }} onClick={() => handleAcceptJob(p._id)}>Accept Job</button>
                  ) : (
                    <Link to="/maintenance/active-repair" style={{ textDecoration: "none" }}>
                      <button className="complaint-submit-btn" style={{ width: "100%", background: "#10b981", color: "#fff" }}>
                        <CheckCircle size={16} style={{ marginRight: "6px" }} /> Job Accepted - Go to Active Repair
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b", fontSize: "14px", width: "100%" }}>
              No assignments found in the database. Potholes assigned by the Highways Department will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAssignments;
