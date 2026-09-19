import { useState, useMemo, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Eye,
  ShieldCheck,
  XCircle,
  Search,
} from "lucide-react";
import { api } from "../../services/api";

const getSeverityClass = (s) => s === "High" ? "badge-high" : s === "Medium" ? "badge-medium" : "badge-low";
const getStatusClass = (s) => {
  if (s === "Closed" || s === "Resolved") return "complaint-status-resolved";
  if (s === "Verified" || s === "Assigned" || s === "In Progress") return "complaint-status-progress";
  return "complaint-status-pending";
};

function Complaints() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const data = await api.getPotholes();
      if (data.success) {
        setComplaints(
          data.potholes.map((p) => ({
            id: p.complaintId,
            _id: p._id,
            location: p.location,
            severity: p.severity,
            reporter: p.reporter,
            date: new Date(p.createdAt).toISOString().split("T")[0],
            status: p.status,
            description: p.description,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const data = await api.updatePotholeStatus(id, newStatus);
      if (data.success) {
        fetchComplaints(); // Refresh the list
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      alert("Server not reachable. Please try again.");
    }
  };

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchFilter = filter === "All" || c.status === filter;
      const matchSearch = c.id.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [filter, search, complaints]);

  const counts = {
    new: complaints.filter(c => c.status === "New" || c.status === "Pending").length,
    verified: complaints.filter(c => c.status === "Verified").length,
    assigned: complaints.filter(c => c.status === "Assigned" || c.status === "In Progress").length,
    closed: complaints.filter(c => c.status === "Closed" || c.status === "Resolved").length,
  };

  return (
    <div className="complaints-admin-page">

      <div className="page-header">
        <div>
          <h1>Complaints Management</h1>
          <p>Review, verify, and manage incoming pothole complaints</p>
        </div>
        <div className="history-count">
          <strong>{filtered.length}</strong>
          <span>Records</span>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content"><span>New</span><h2>{String(counts.new).padStart(2, "0")}</h2><p>Awaiting verification</p></div>
          <div className="stat-icon"><FileText size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content"><span>Verified</span><h2>{String(counts.verified).padStart(2, "0")}</h2><p>Ready for assignment</p></div>
          <div className="stat-icon"><ShieldCheck size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content"><span>Assigned</span><h2>{String(counts.assigned).padStart(2, "0")}</h2><p>Work assigned</p></div>
          <div className="stat-icon"><Clock size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content"><span>Closed</span><h2>{String(counts.closed).padStart(2, "0")}</h2><p>Resolved</p></div>
          <div className="stat-icon"><CheckCircle size={24} /></div>
        </div>
      </div>

      {/* TABLE */}
      <div className="complaint-table-card">
        <div className="complaint-table-header">
          <div>
            <h3>All Complaints</h3>
            <p>Manage incoming complaints from sensors and citizens</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div className="admin-search-box">
              <Search size={16} />
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="complaint-filter-tabs">
              {["All", "New", "Verified", "Assigned", "Closed"].map((s) => (
                <button key={s} className={`complaint-filter-tab ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="complaint-list">
          {filtered.map((c) => (
            <div className="complaint-item" key={c.id}>
              <div className="complaint-item-left">
                <div className="complaint-item-id">{c.id}</div>
                <div className="complaint-item-info">
                  <div className="complaint-item-location"><MapPin size={14} />{c.location}</div>
                  <div className="complaint-item-desc">{c.description}</div>
                </div>
              </div>
              <div className="complaint-item-right">
                <span className="complaint-item-reporter">{c.reporter}</span>
                <span className={`badge ${getSeverityClass(c.severity)}`}>{c.severity}</span>
                <span className={`complaint-status-badge ${getStatusClass(c.status)}`}>{c.status}</span>
                <span className="complaint-item-date">{c.date}</span>
                {(c.status === "New" || c.status === "Pending") && (
                  <div className="admin-action-btns">
                    <button className="admin-verify-btn" title="Verify" onClick={() => handleStatusUpdate(c._id, "Verified")}><ShieldCheck size={15} /></button>
                    <button className="admin-reject-btn" title="Reject" onClick={() => handleStatusUpdate(c._id, "Closed")}><XCircle size={15} /></button>
                  </div>
                )}
                {(c.status !== "New" && c.status !== "Pending") && <button className="complaint-view-btn"><Eye size={15} /></button>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="complaint-empty"><FileText size={40} /><h4>No complaints found</h4><p>No complaints match the selected filter.</p></div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Complaints;
