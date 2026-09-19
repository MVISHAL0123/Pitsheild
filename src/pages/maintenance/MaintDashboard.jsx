import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Wrench, ClipboardList, CheckCircle, Activity, ChevronRight, AlertTriangle } from "lucide-react";



function MaintDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/potholes");
        const data = await response.json();
        if (data.success) {
          const myAssignments = data.potholes.filter(p => 
            p.status === "Assigned" || p.status === "In Progress" || p.status === "Awaiting Review"
          );
          setAssignments(myAssignments);

          const resolved = data.potholes.filter(p => p.status === "Resolved" || p.status === "Closed");
          setCompletedCount(resolved.length);
        }
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      }
    };
    fetchAssignments();
  }, []);

  const counts = {
    assigned: assignments.filter(a => a.status === "Assigned").length,
    progress: assignments.filter(a => a.status === "In Progress" || a.status === "Awaiting Review").length,
    completed: completedCount,
  };

  const recentList = assignments.slice(0, 3);

  return (
    <div className="user-home-page">
      {/* Banner */}
      <div className="user-welcome-banner">
        <div className="user-welcome-left">
          <div className="user-welcome-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <Wrench size={32} />
          </div>
          <div>
            <h2>Welcome back, Team Alpha</h2>
            <p>
              {assignments.length > 0
                ? `You have ${assignments.length} active assignment${assignments.length === 1 ? "" : "s"} today`
                : "No active assignments right now"}
            </p>
          </div>
        </div>
        <div className="user-welcome-stats">
          <div className="user-welcome-stat">
            <strong>{counts.assigned}</strong>
            <span>Assigned</span>
          </div>
          <div className="user-welcome-stat">
            <strong>{counts.progress}</strong>
            <span>In Progress</span>
          </div>
          <div className="user-welcome-stat">
            <strong>{counts.completed}</strong>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="user-quick-actions">
        <Link to="/maintenance/assignments" className="user-quick-card">
          <div className="user-quick-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <ClipboardList size={24} />
          </div>
          <strong>View Assignments</strong>
          <span>See pending jobs</span>
          <ChevronRight size={18} className="user-quick-arrow" />
        </Link>
        <Link to="/maintenance/active-repair" className="user-quick-card">
          <div className="user-quick-icon" style={{ background: "#fef2f2", color: "#ef4444" }}>
            <Activity size={24} />
          </div>
          <strong>Active Repair</strong>
          <span>Continue current job</span>
          <ChevronRight size={18} className="user-quick-arrow" />
        </Link>
        <Link to="/maintenance/completed" className="user-quick-card">
          <div className="user-quick-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
            <CheckCircle size={24} />
          </div>
          <strong>Completed Jobs</strong>
          <span>History & approvals</span>
          <ChevronRight size={18} className="user-quick-arrow" />
        </Link>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div><h3>Recent Activity</h3><p>Your latest job updates</p></div>
            <Link to="/maintenance/assignments" className="panel-link">View All</Link>
          </div>
          <div className="recent-list">
            {recentList.length > 0 ? (
              recentList.map(a => (
                <div className="recent-item" key={a._id}>
                  <div className="recent-info">
                    <strong>{a.complaintId}</strong>
                    <span>{a.location}</span>
                  </div>
                  <div className="recent-right">
                    <span className={`badge badge-${a.severity.toLowerCase()}`} style={{ marginBottom: "5px" }}>{a.severity}</span>
                    <span className={`complaint-status-badge ${a.status === "In Progress" || a.status === "Awaiting Review" ? "complaint-status-progress" : "complaint-status-pending"}`}>
                      {a.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "30px 20px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                No active or assigned repairs currently in the database.
              </div>
            )}
          </div>
        </div>
        
        <div className="dashboard-panel">
          <div className="panel-header">
            <div><h3>Safety Notice</h3><p>Important reminders</p></div>
          </div>
          <div style={{ padding: "20px" }}>
            <div style={{ background: "#fffbeb", border: "1px solid #fef3c7", padding: "16px", borderRadius: "8px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <AlertTriangle size={24} color="#d97706" />
              <div>
                <strong style={{ color: "#92400e", display: "block", marginBottom: "4px" }}>Wear Safety Gear</strong>
                <p style={{ color: "#b45309", fontSize: "14px", lineHeight: "1.5" }}>Always wear high-visibility vests and deploy traffic cones before beginning any repair work on active roads.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaintDashboard;
