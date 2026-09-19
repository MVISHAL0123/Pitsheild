import { useState } from "react";
import {
  MessageSquareWarning,
  Send,
  MapPin,
  Camera,
  Loader,
  X,
  ChevronDown,
  CheckCircle,
} from "lucide-react";

function ReportPothole() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    category: "Pothole",
    severity: "Medium",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [reportId, setReportId] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFileName(e.target.files[0].name);
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
        setReportId(data.pothole.complaintId);
        setSubmitted(true);
        setFormData({ name: "", phone: "", location: "", category: "Pothole", severity: "Medium", description: "" });
        setFileName("");
      } else {
        alert(data.message || "Failed to submit report");
      }
    } catch (err) {
      alert("Server not reachable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Report a Pothole</h1>
          <p>Fill in the details below to file a new report</p>
        </div>
        <div className="sensor-online">
          <span></span>
          Portal Active
        </div>
      </div>


      <div className="report-layout">

        {/* FORM CARD */}
        <div className="complaint-form-card">

          <div className="complaint-form-header">
            <div className="complaint-form-header-left">
              <div className="complaint-form-icon">
                <MessageSquareWarning size={22} />
              </div>
              <div>
                <h3>Pothole Report</h3>
                <p>Report a pothole or road damage in your area</p>
              </div>
            </div>
          </div>

          {/* SUCCESS */}
          {submitted && (
            <div className="complaint-success">
              <CheckCircle size={20} />
              <div>
                <strong>Report submitted! ID: {reportId}</strong>
                <span>We'll review your report within 24–48 hours. Track it in My Reports.</span>
              </div>
            </div>
          )}

          <form className="complaint-form" onSubmit={handleSubmit}>

            {/* Name & Phone */}
            <div className="complaint-form-row">
              <div className="complaint-field">
                <label>Your Name</label>
                <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="complaint-field">
                <label>Phone Number</label>
                <input type="tel" name="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            {/* Location */}
            <div className="complaint-field">
              <label>Location</label>
              <div className="complaint-input-icon">
                <MapPin size={17} />
                <input type="text" name="location" placeholder="Enter the exact location of the pothole" value={formData.location} onChange={handleChange} required />
              </div>
            </div>

            {/* Category & Severity */}
            <div className="complaint-form-row">

              <div className="complaint-field">
                <label>Category</label>
                <div className="complaint-select-wrapper">
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="Pothole">Pothole</option>
                    <option value="Road Damage">Road Damage</option>
                    <option value="Crack">Road Crack</option>
                    <option value="Sinkhole">Sinkhole</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown size={16} className="select-arrow" />
                </div>
              </div>

              <div className="complaint-field">
                <label>Severity</label>
                <div className="complaint-severity-options">
                  {["Low", "Medium", "High"].map((level) => (
                    <button
                      type="button"
                      key={level}
                      className={`severity-option ${formData.severity === level ? `severity-active-${level.toLowerCase()}` : ""}`}
                      onClick={() => setFormData({ ...formData, severity: level })}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Description */}
            <div className="complaint-field">
              <label>Description</label>
              <textarea name="description" placeholder="Describe the pothole — size, depth, any hazards..." rows={4} value={formData.description} onChange={handleChange} required />
            </div>

            {/* Photo Upload */}
            <div className="complaint-field">
              <label>Upload Photo (Optional)</label>
              <div className="complaint-upload">
                <input type="file" accept="image/*" id="report-photo" onChange={handleFileChange} hidden />
                <label htmlFor="report-photo" className="complaint-upload-area">
                  <Camera size={24} />
                  <span>{fileName || "Click to upload a photo"}</span>
                  <p>JPG, PNG up to 5MB</p>
                </label>
                {fileName && (
                  <button type="button" className="complaint-remove-file"
                    onClick={() => { setFileName(""); document.getElementById("report-photo").value = ""; }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <button type="submit" className="complaint-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader size={17} className="spin-icon" /> Submitting...</>
              ) : (
                <><Send size={17} /> Submit Report</>
              )}
            </button>

          </form>
        </div>


        {/* INFO PANEL */}
        <div className="report-info-panel">

          <div className="report-info-card">
            <h3>How It Works</h3>
            <div className="report-steps">
              <div className="report-step">
                <div className="report-step-num">1</div>
                <div>
                  <strong>Submit Report</strong>
                  <span>Fill in the pothole details and submit</span>
                </div>
              </div>
              <div className="report-step">
                <div className="report-step-num">2</div>
                <div>
                  <strong>Review (24–48 hrs)</strong>
                  <span>Our team reviews and verifies your report</span>
                </div>
              </div>
              <div className="report-step">
                <div className="report-step-num">3</div>
                <div>
                  <strong>Repair Assigned</strong>
                  <span>A repair team is dispatched to the location</span>
                </div>
              </div>
              <div className="report-step">
                <div className="report-step-num">4</div>
                <div>
                  <strong>Resolved</strong>
                  <span>You get notified once the pothole is fixed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="report-info-card">
            <h3>Tips for a Good Report</h3>
            <ul className="report-tips">
              <li>Provide the exact street name or landmark</li>
              <li>Estimate the pothole size (small / car-tyre sized / large)</li>
              <li>Mention if it's filled with water — very dangerous</li>
              <li>Upload a photo for faster processing</li>
              <li>Set High severity if it has caused accidents</li>
            </ul>
          </div>

          <div className="report-info-card report-info-stats">
            <div>
              <strong>96%</strong>
              <span>Resolution Rate</span>
            </div>
            <div>
              <strong>48 hrs</strong>
              <span>Avg. Response</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Portal Active</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ReportPothole;
