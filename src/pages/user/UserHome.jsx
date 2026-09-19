import {
  MapPin,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";



const getStatusClass = (status) => {
  if (status === "Resolved")    return "complaint-status-resolved";
  if (status === "In Progress") return "complaint-status-progress";
  return "complaint-status-pending";
};

const getSeverityClass = (sev) => {
  if (sev === "High")   return "badge-high";
  if (sev === "Medium") return "badge-medium";
  return "badge-low";
};

function UserHome() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/potholes");
        const data = await response.json();
        if (data.success) {
          setReports(data.potholes);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };
    fetchReports();
  }, []);

  const counts = {
    total: reports.length,
    pending: reports.filter(r => r.status === "Pending" || r.status === "New" || r.status === "Verified").length,
    progress: reports.filter(r => r.status === "In Progress" || r.status === "Assigned").length,
    resolved: reports.filter(r => r.status === "Resolved" || r.status === "Closed").length,
  };

  const recentList = reports.slice(0, 4);

  return (
    <div className="user-home-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>My Dashboard</h1>
          <p>Track and manage your pothole reports</p>
        </div>

        <Link to="/user/report">
          <button className="new-detection-btn" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <Plus size={16} />
            Report Pothole
          </button>
        </Link>
      </div>


      {/* STAT CARDS */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-card-content">
            <span>Total Reports</span>
            <h2>{String(counts.total).padStart(2, "0")}</h2>
            <p>All submitted reports</p>
          </div>
          <div className="stat-icon">
            <ClipboardList size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <span>Pending</span>
            <h2>{String(counts.pending).padStart(2, "0")}</h2>
            <p>Awaiting review</p>
          </div>
          <div className="stat-icon">
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <span>In Progress</span>
            <h2>{String(counts.progress).padStart(2, "0")}</h2>
            <p>Being addressed</p>
          </div>
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <span>Resolved</span>
            <h2>{String(counts.resolved).padStart(2, "0")}</h2>
            <p>Fixed successfully</p>
          </div>
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
        </div>

      </div>


      {/* LOWER GRID */}
      <div className="dashboard-grid">

        {/* QUICK ACTIONS */}
        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>What would you like to do today?</p>
            </div>
          </div>

          <div className="user-quick-actions">

            <Link to="/user/report" className="user-quick-card">
              <div className="user-quick-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <Plus size={24} />
              </div>
              <strong>Report a Pothole</strong>
              <span>File a new complaint</span>
              <ArrowRight size={16} className="user-quick-arrow" />
            </Link>

            <Link to="/user/map" className="user-quick-card">
              <div className="user-quick-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                <MapPin size={24} />
              </div>
              <strong>View Live Map</strong>
              <span>See pothole locations</span>
              <ArrowRight size={16} className="user-quick-arrow" />
            </Link>

            <Link to="/user/my-reports" className="user-quick-card">
              <div className="user-quick-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
                <ClipboardList size={24} />
              </div>
              <strong>My Reports</strong>
              <span>Track your reports</span>
              <ArrowRight size={16} className="user-quick-arrow" />
            </Link>

          </div>

        </div>


        {/* RECENT REPORTS */}
        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h3>Recent Reports</h3>
              <p>Your latest submitted reports</p>
            </div>
            <Link to="/user/my-reports" className="panel-link">
              View All
            </Link>
          </div>

          <div className="recent-list">
            {recentList.map((report) => (
              <div className="recent-item" key={report._id}>

                <div className="recent-info">
                  <strong>{report.complaintId}</strong>
                  <span>{report.location}</span>
                </div>

                <div className="recent-right">
                  <span className="recent-depth">{new Date(report.createdAt).toISOString().split("T")[0]}</span>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    <span className={`badge ${getSeverityClass(report.severity)}`}>
                      {report.severity}
                    </span>
                    <span className={`complaint-status-badge ${getStatusClass(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}

export default UserHome;
