import { useState, useEffect } from "react";
import { CheckCircle, MapPin, Calendar, Clock, ThumbsUp, ThumbsDown } from "lucide-react";



function CompletedJobs() {
  const [filter, setFilter] = useState("All");
  const [completedData, setCompletedData] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/potholes");
        const data = await response.json();
        if (data.success) {
          setCompletedData(
            data.potholes
              .filter(p => p.status === "Resolved" || p.status === "Closed")
              .map(p => ({
                id: p.complaintId,
                _id: p._id,
                location: p.location,
                severity: p.severity,
                completed: new Date(p.updatedAt || p.createdAt).toISOString().split("T")[0],
                status: "Approved", // Mapping both to "Approved" for this view
              }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch completed jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const filtered = filter === "All" ? completedData : completedData.filter(c => c.status === filter);

  return (
    <div className="my-reports-page">
      <div className="page-header">
        <div>
          <h1>Completed Jobs</h1>
          <p>History of repairs and admin approvals</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content"><span>Total Completed</span><h2>{String(completedData.length).padStart(2, "0")}</h2><p>All time</p></div>
          <div className="stat-icon"><CheckCircle size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content"><span>Approved</span><h2>{String(completedData.filter(c => c.status === "Approved").length).padStart(2, "0")}</h2><p>Passed QA</p></div>
          <div className="stat-icon"><ThumbsUp size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content"><span>Rejected</span><h2>{String(completedData.filter(c => c.status === "Rejected").length).padStart(2, "0")}</h2><p>Requires rework</p></div>
          <div className="stat-icon"><ThumbsDown size={24} /></div>
        </div>
      </div>

      <div className="complaint-table-card">
        <div className="complaint-table-header">
          <div>
            <h3>Job History</h3>
          </div>
          <div className="complaint-filter-tabs">
            {["All", "Approved", "Rejected"].map(s => (
              <button key={s} className={`complaint-filter-tab ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Completed Date</th>
                <th>Admin Verdict</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(j => (
                  <tr key={j._id}>
                    <td><div className="pothole-id">{j.id}</div></td>
                    <td><div className="location-cell"><MapPin size={16} /><span>{j.location}</span></div></td>
                    <td><span className={`severity-badge badge-${j.severity.toLowerCase()}`}><span className="severity-dot"></span>{j.severity}</span></td>
                    <td><div className="date-cell"><div><Calendar size={15} />{j.completed}</div></div></td>
                    <td>
                      <span className={`status-badge ${j.status === "Approved" ? "repaired" : "detected"}`}>
                        {j.status === "Approved" ? <ThumbsUp size={15} /> : <ThumbsDown size={15} />}
                        {j.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px 20px", color: "#64748b", fontSize: "14px" }}>
                    No completed jobs found in the database. When repairs are verified and closed, they will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CompletedJobs;
