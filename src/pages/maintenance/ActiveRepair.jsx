import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wrench, MapPin, Camera, CheckCircle, Navigation, ClipboardList, AlertCircle, Layers } from "lucide-react";
import MapView from "../../components/MapView";

function ActiveRepair() {
  const [activeJobs, setActiveJobs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchActiveJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/potholes");
      const data = await res.json();
      if (data.success && Array.isArray(data.potholes)) {
        const active = data.potholes.filter(
          (p) => p.status === "In Progress" || p.status === "Awaiting Review"
        );
        setActiveJobs(active);
        if (selectedIndex >= active.length) {
          setSelectedIndex(0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch active repairs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveJobs();
  }, []);

  const currentJob = activeJobs[selectedIndex] || null;

  const handleUpload = () => {
    setTimeout(() => {
      setProofUploaded(true);
    }, 800);
  };

  const handleFinish = async () => {
    if (!currentJob) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch(`http://localhost:5000/api/potholes/${currentJob._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Awaiting Review" }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Repair marked as done! Sent for Highways Admin review." });
        await fetchActiveJobs();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update status." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error while updating status." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="report-page">
        <div className="page-header">
          <div>
            <h1>Active Repair</h1>
            <p>Loading active repairs from MongoDB...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="report-page">
        <div className="page-header">
          <div>
            <h1>Active Repair</h1>
            <p>Current job details and status updates</p>
          </div>
        </div>

        <div className="complaint-table-card" style={{ padding: "48px 24px", textAlign: "center", maxWidth: "600px", margin: "20px auto" }}>
          <div style={{ background: "#fef3c7", color: "#d97706", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Wrench size={32} />
          </div>
          <h2 style={{ fontSize: "20px", color: "#1e293b", marginBottom: "8px" }}>No Active Repairs in Progress</h2>
          <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
            There are no pothole repairs currently marked as "In Progress" or "Awaiting Review" in MongoDB. Accept an assigned pothole to begin work.
          </p>
          <Link to="/maintenance/assignments" style={{ textDecoration: "none" }}>
            <button className="complaint-submit-btn" style={{ margin: "0 auto" }}>
              <ClipboardList size={18} style={{ marginRight: "8px" }} /> View My Assignments
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isDone = currentJob.status === "Awaiting Review" || currentJob.status === "Resolved" || currentJob.status === "Closed";

  return (
    <div className="report-page">
      <div className="page-header">
        <div>
          <h1>Active Repair</h1>
          <p>Current job details and status updates from database</p>
        </div>
        {activeJobs.length > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={16} color="#64748b" />
            <select
              value={selectedIndex}
              onChange={(e) => {
                setSelectedIndex(Number(e.target.value));
                setProofUploaded(false);
                setMessage(null);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                background: "#fff",
              }}
            >
              {activeJobs.map((job, idx) => (
                <option key={job._id} value={idx}>
                  {job.complaintId} — {job.location}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {message && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: message.type === "success" ? "#16a34a" : "#ef4444",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="report-layout">
        {/* Left: Map & Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          
          {/* Job Header */}
          <div className="complaint-table-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h2 style={{ fontSize: "20px", color: "#1e293b", marginBottom: "4px" }}>
                  {currentJob.complaintId || "CMP-ACTIVE"}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "14px" }}>
                  <MapPin size={16} /> {currentJob.location}
                </div>
              </div>
              <span className={`complaint-status-badge ${isDone ? "complaint-status-resolved" : "complaint-status-progress"}`}>
                {currentJob.status}
              </span>
            </div>
            
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
              <span className={`badge badge-${(currentJob.severity || "medium").toLowerCase()}`}>
                {currentJob.severity || "Medium"} Severity
              </span>
              <span className="badge" style={{ background: "#eff6ff", color: "#2563eb" }}>
                {currentJob.category || "Pothole"}
              </span>
              {currentJob.reporter && (
                <span className="badge" style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" }}>
                  Reporter: {currentJob.reporter}
                </span>
              )}
            </div>
            
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
              {currentJob.description || "No description provided."}
            </p>
          </div>

          {/* Map */}
          <div className="complaint-table-card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "16px", color: "#1e293b" }}>Location Map</h3>
              <button className="complaint-view-btn" style={{ fontSize: "13px", padding: "6px 12px" }}>
                <Navigation size={14} style={{ marginRight: "6px" }} /> {currentJob.location}
              </button>
            </div>
            <div style={{ height: "300px", borderRadius: "8px", overflow: "hidden" }}>
              <MapView />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="report-info-panel">
          
          {/* Status Update */}
          <div className="report-info-card">
            <h3>Job Status</h3>
            <div className="report-steps">
              <div className="report-step">
                <div className="report-step-num" style={{ background: "#10b981" }}><CheckCircle size={16} /></div>
                <div>
                  <strong>Job Accepted</strong>
                  <span>{new Date(currentJob.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="report-step">
                <div className="report-step-num" style={{ background: isDone ? "#10b981" : "#2563eb" }}>
                  {isDone ? <CheckCircle size={16} /> : "2"}
                </div>
                <div>
                  <strong>Repair In Progress</strong>
                  <span>Team working at location</span>
                </div>
              </div>
              <div className="report-step" style={{ opacity: isDone ? 1 : 0.5 }}>
                <div className="report-step-num" style={{ background: isDone ? "#2563eb" : "#cbd5e1" }}>3</div>
                <div>
                  <strong>{isDone ? "Submitted for Review" : "Repair Done"}</strong>
                  <span>{isDone ? "Awaiting Highways Admin review" : "Upload proof to submit"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Proof */}
          <div className="report-info-card">
            <h3>Upload Proof</h3>
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>
              Take a clear photo of the repaired road surface before marking the job as done.
            </p>
            
            {proofUploaded ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                <CheckCircle size={32} color="#16a34a" style={{ margin: "0 auto 12px" }} />
                <strong style={{ display: "block", color: "#16a34a", fontSize: "14px" }}>Proof Photo Attached</strong>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Ready for submission to Highways Admin</span>
              </div>
            ) : (
              <div className="complaint-upload-area" onClick={handleUpload} style={{ cursor: "pointer" }}>
                <Camera size={32} style={{ color: "#94a3b8", margin: "0 auto 12px" }} />
                <span style={{ display: "block", color: "#2563eb", fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>
                  Tap to take photo
                </span>
                <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>or click to browse files</p>
              </div>
            )}
            
            <button 
              className="complaint-submit-btn" 
              style={{ width: "100%", marginTop: "16px", opacity: !proofUploaded || isDone || submitting ? 0.5 : 1 }}
              disabled={!proofUploaded || isDone || submitting}
              onClick={handleFinish}
            >
              <CheckCircle size={18} /> {submitting ? "Updating Status..." : isDone ? "Submitted for Review" : "Mark as Repaired"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActiveRepair;
