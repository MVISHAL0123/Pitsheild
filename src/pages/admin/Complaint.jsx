import { useState, useEffect } from "react";
import {
  MessageSquareWarning,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Camera,
  FileText,
  Loader,
  X,
  ChevronDown,
  Eye,
} from "lucide-react";



function Complaint() {
  const [formData, setFormData] = useState({
    location: "",
    category: "Pothole",
    severity: "Medium",
    description: "",
    name: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [complaints, setComplaints] = useState([]);

  // Fetch complaints from backend
  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/potholes");
      const data = await response.json();
      if (data.success) {
        setComplaints(
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
      console.error("Failed to fetch complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/potholes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({
          location: "",
          category: "Pothole",
          severity: "Medium",
          description: "",
          name: "",
          phone: "",
        });
        setFileName("");
        // Refresh the complaints list
        fetchComplaints();
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        alert(data.message || "Failed to submit complaint");
      }
    } catch (err) {
      alert("Server not reachable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === "Pending"
  ).length;
  const inProgressCount = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const filteredComplaints =
    filterStatus === "All"
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "complaint-status-pending";
      case "In Progress":
        return "complaint-status-progress";
      case "Resolved":
        return "complaint-status-resolved";
      default:
        return "";
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "High":
        return "badge-high";
      case "Medium":
        return "badge-medium";
      case "Low":
        return "badge-low";
      default:
        return "";
    }
  };

  return (
    <div className="complaint-page">

      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <h1>Complaints</h1>

          <p>
            File and track pothole complaints
          </p>
        </div>

        <div className="sensor-online">
          <span></span>
          Portal Active
        </div>
      </div>


      {/* STAT CARDS */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-title">
                Total Complaints
              </div>

              <div className="stat-value">
                {String(totalComplaints).padStart(2, "0")}
              </div>

              <div className="stat-description">
                All filed complaints
              </div>
            </div>

            <div className="stat-icon">
              <FileText size={23} />
            </div>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-title">
                Pending
              </div>

              <div className="stat-value">
                {String(pendingCount).padStart(2, "0")}
              </div>

              <div className="stat-description">
                Awaiting review
              </div>
            </div>

            <div className="stat-icon">
              <Clock size={23} />
            </div>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-title">
                In Progress
              </div>

              <div className="stat-value">
                {String(inProgressCount).padStart(2, "0")}
              </div>

              <div className="stat-description">
                Being addressed
              </div>
            </div>

            <div className="stat-icon">
              <AlertTriangle size={23} />
            </div>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-title">
                Resolved
              </div>

              <div className="stat-value">
                {String(resolvedCount).padStart(2, "0")}
              </div>

              <div className="stat-description">
                Successfully resolved
              </div>
            </div>

            <div className="stat-icon">
              <CheckCircle size={23} />
            </div>
          </div>
        </div>

      </div>


      {/* MAIN GRID — FORM + COMPLAINTS TABLE */}

      <div className="complaint-grid">

        {/* FILE COMPLAINT FORM */}

        <div className="complaint-form-card">

          <div className="complaint-form-header">

            <div className="complaint-form-header-left">
              <div className="complaint-form-icon">
                <MessageSquareWarning size={22} />
              </div>

              <div>
                <h3>File a Complaint</h3>

                <p>
                  Report a pothole or road damage
                </p>
              </div>
            </div>

          </div>


          {/* SUCCESS MESSAGE */}

          {submitted && (
            <div className="complaint-success">
              <CheckCircle size={20} />

              <div>
                <strong>Complaint submitted successfully!</strong>

                <span>
                  Your complaint ID has been generated. You can track it below.
                </span>
              </div>
            </div>
          )}


          {/* FORM */}

          <form
            className="complaint-form"
            onSubmit={handleSubmit}
          >

            {/* Name & Phone */}

            <div className="complaint-form-row">

              <div className="complaint-field">
                <label>Your Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="complaint-field">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>


            {/* Location */}

            <div className="complaint-field">
              <label>Location</label>

              <div className="complaint-input-icon">
                <MapPin size={17} />

                <input
                  type="text"
                  name="location"
                  placeholder="Enter the exact location of the pothole"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>


            {/* Category & Severity */}

            <div className="complaint-form-row">

              <div className="complaint-field">
                <label>Category</label>

                <div className="complaint-select-wrapper">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Pothole">Pothole</option>
                    <option value="Road Damage">Road Damage</option>
                    <option value="Crack">Road Crack</option>
                    <option value="Sinkhole">Sinkhole</option>
                    <option value="Other">Other</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="select-arrow"
                  />
                </div>
              </div>

              <div className="complaint-field">
                <label>Severity</label>

                <div className="complaint-severity-options">

                  {["Low", "Medium", "High"].map(
                    (level) => (
                      <button
                        type="button"
                        key={level}
                        className={`severity-option ${
                          formData.severity === level
                            ? `severity-active-${level.toLowerCase()}`
                            : ""
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            severity: level,
                          })
                        }
                      >
                        {level}
                      </button>
                    )
                  )}

                </div>
              </div>

            </div>


            {/* Description */}

            <div className="complaint-field">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Describe the pothole size, depth, and any dangers it poses..."
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>


            {/* Photo Upload */}

            <div className="complaint-field">
              <label>Upload Photo (Optional)</label>

              <div className="complaint-upload">

                <input
                  type="file"
                  accept="image/*"
                  id="complaint-photo"
                  onChange={handleFileChange}
                  hidden
                />

                <label
                  htmlFor="complaint-photo"
                  className="complaint-upload-area"
                >

                  <Camera size={24} />

                  <span>
                    {fileName
                      ? fileName
                      : "Click to upload a photo"}
                  </span>

                  <p>
                    JPG, PNG up to 5MB
                  </p>

                </label>

                {fileName && (
                  <button
                    type="button"
                    className="complaint-remove-file"
                    onClick={() => {
                      setFileName("");
                      document.getElementById(
                        "complaint-photo"
                      ).value = "";
                    }}
                  >
                    <X size={14} />
                  </button>
                )}

              </div>
            </div>


            {/* Submit */}

            <button
              type="submit"
              className="complaint-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader
                    size={17}
                    className="spin-icon"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={17} />
                  Submit Complaint
                </>
              )}
            </button>

          </form>

        </div>


        {/* COMPLAINTS TABLE */}

        <div className="complaint-table-card">

          <div className="complaint-table-header">

            <div>
              <h3>Complaint History</h3>

              <p>
                Track your filed complaints
              </p>
            </div>

            <div className="complaint-filter-tabs">

              {["All", "Pending", "In Progress", "Resolved"].map(
                (status) => (
                  <button
                    key={status}
                    className={`complaint-filter-tab ${
                      filterStatus === status
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setFilterStatus(status)
                    }
                  >
                    {status}
                  </button>
                )
              )}

            </div>

          </div>


          <div className="complaint-list">

            {filteredComplaints.map((complaint) => (
              <div
                className="complaint-item"
                key={complaint.id}
              >

                <div className="complaint-item-left">

                  <div className="complaint-item-id">
                    {complaint.id}
                  </div>

                  <div className="complaint-item-info">

                    <div className="complaint-item-location">
                      <MapPin size={14} />
                      {complaint.location}
                    </div>

                    <div className="complaint-item-desc">
                      {complaint.description}
                    </div>

                  </div>

                </div>


                <div className="complaint-item-right">

                  <span
                    className={`badge ${getSeverityClass(
                      complaint.severity
                    )}`}
                  >
                    {complaint.severity}
                  </span>

                  <span
                    className={`complaint-status-badge ${getStatusClass(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>

                  <span className="complaint-item-date">
                    {complaint.date}
                  </span>

                  <button className="complaint-view-btn">
                    <Eye size={15} />
                  </button>

                </div>

              </div>
            ))}

            {filteredComplaints.length === 0 && (
              <div className="complaint-empty">
                <FileText size={40} />

                <h4>No complaints found</h4>

                <p>
                  No complaints match the selected filter.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Complaint;
