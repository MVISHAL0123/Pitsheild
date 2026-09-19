import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
} from "lucide-react";

const getStatusClass = (s) => {
  if (s === "Resolved")    return "complaint-status-resolved";
  if (s === "In Progress") return "complaint-status-progress";
  return "complaint-status-pending";
};
const getSeverityClass = (s) => {
  if (s === "High")   return "badge-high";
  if (s === "Medium") return "badge-medium";
  return "badge-low";
};

function MyReports() {
  const [filter, setFilter] = useState("All");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/potholes");
        const data = await response.json();
        if (data.success) {
          setReports(
            data.potholes.map((p) => ({
              id: p.complaintId,
              _id: p._id,
              location: p.location,
              description: p.description,
              severity: p.severity,
              status: p.status,
              date: new Date(p.createdAt).toISOString().split("T")[0],
              category: p.category,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = useMemo(() =>
    filter === "All" ? reports : reports.filter((r) => r.status === filter),
    [filter, reports]
  );

  const total    = reports.length;
  const pending  = reports.filter((r) => r.status === "Pending").length;
  const progress = reports.filter((r) => r.status === "In Progress").length;
  const resolved = reports.filter((r) => r.status === "Resolved").length;

  return (
    <div className="my-reports-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>My Reports</h1>
          <p>Track all your submitted pothole reports</p>
        </div>
        <div className="history-count">
          <strong>{filtered.length}</strong>
          <span>Records</span>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-card-content">
            <span>Total Reports</span>
            <h2>{String(total).padStart(2, "0")}</h2>
            <p>All filed reports</p>
          </div>
          <div className="stat-icon"><FileText size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <span>Pending</span>
            <h2>{String(pending).padStart(2, "0")}</h2>
            <p>Awaiting review</p>
          </div>
          <div className="stat-icon"><Clock size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <span>In Progress</span>
            <h2>{String(progress).padStart(2, "0")}</h2>
            <p>Being addressed</p>
          </div>
          <div className="stat-icon"><AlertTriangle size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <span>Resolved</span>
            <h2>{String(resolved).padStart(2, "0")}</h2>
            <p>Fixed successfully</p>
          </div>
          <div className="stat-icon"><CheckCircle size={24} /></div>
        </div>

      </div>


      {/* TABLE CARD */}
      <div className="complaint-table-card">

        <div className="complaint-table-header">
          <div>
            <h3>Report History</h3>
            <p>All reports you have submitted</p>
          </div>
          <div className="complaint-filter-tabs">
            {["All", "Pending", "In Progress", "Resolved"].map((s) => (
              <button
                key={s}
                className={`complaint-filter-tab ${filter === s ? "active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="complaint-list">
          {filtered.map((report) => (
            <div className="complaint-item" key={report.id}>

              <div className="complaint-item-left">
                <div className="complaint-item-id">{report.id}</div>
                <div className="complaint-item-info">
                  <div className="complaint-item-location">
                    <MapPin size={14} />
                    {report.location}
                  </div>
                  <div className="complaint-item-desc">{report.description}</div>
                </div>
              </div>

              <div className="complaint-item-right">
                <span className={`badge ${getSeverityClass(report.severity)}`}>
                  {report.severity}
                </span>
                <span className={`complaint-status-badge ${getStatusClass(report.status)}`}>
                  {report.status}
                </span>
                <span className="complaint-item-date">{report.date}</span>
                <button className="complaint-view-btn"><Eye size={15} /></button>
              </div>

            </div>
          ))}

          {filtered.length === 0 && (
            <div className="complaint-empty">
              <FileText size={40} />
              <h4>No reports found</h4>
              <p>No reports match the selected filter.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default MyReports;
