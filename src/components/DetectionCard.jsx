import {
  Activity,
  MapPin,
  Gauge,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

function DetectionCard({ detection }) {
  const getSeverityClass = () => {
    if (detection.severity === "High") return "severity-high";
    if (detection.severity === "Medium") return "severity-medium";
    return "severity-low";
  };

  return (
    <div className="detection-result-card">
      <div className="detection-card-header">
        <div>
          <span className="detection-label">Detection Result</span>
          <h2>
            {detection.detected
              ? "Pothole Detected"
              : "No Pothole Detected"}
          </h2>
        </div>

        <div
          className={`detection-status ${
            detection.detected
              ? "status-danger"
              : "status-success"
          }`}
        >
          {detection.detected ? (
            <AlertTriangle size={18} />
          ) : (
            <CheckCircle size={18} />
          )}

          {detection.detected ? "Detected" : "Clear"}
        </div>
      </div>

      {detection.detected && (
        <>
          <div className="detection-main-value">
            <span>Depth</span>
            <strong>{detection.depth} cm</strong>
          </div>

          <div className="detection-details">

            <div className="detection-detail">
              <Gauge size={20} />

              <div>
                <span>Ultrasonic Distance</span>
                <strong>{detection.distance} cm</strong>
              </div>
            </div>

            <div className="detection-detail">
              <Activity size={20} />

              <div>
                <span>Severity</span>

                <strong
                  className={getSeverityClass()}
                >
                  {detection.severity}
                </strong>
              </div>
            </div>

            <div className="detection-detail">
              <MapPin size={20} />

              <div>
                <span>GPS Location</span>
                <strong>{detection.location}</strong>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default DetectionCard;