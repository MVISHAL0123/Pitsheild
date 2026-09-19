import {
  MapPin,
  Ruler,
  AlertTriangle,
  Calendar,
  Eye,
} from "lucide-react";

function PotholeCard({ pothole, onView }) {
  if (!pothole) {
    return null;
  }

  const {
    id,
    location,
    depth,
    severity,
    status,
    date,
    time,
    latitude,
    longitude,
  } = pothole;

  const severityClass =
    severity?.toLowerCase() || "low";

  const statusClass =
    status?.toLowerCase().replace(/\s+/g, "-") || "detected";

  return (
    <div className="pothole-card">

      {/* HEADER */}

      <div className="pothole-card-header">

        <div>
          <span className="pothole-id">
            {id || "PH-000"}
          </span>

          <h3>
            {location || "Unknown Location"}
          </h3>
        </div>

        <span
          className={`pothole-severity ${severityClass}`}
        >
          <AlertTriangle size={14} />
          {severity || "Low"}
        </span>

      </div>


      {/* LOCATION */}

      <div className="pothole-location">

        <MapPin size={16} />

        <div>
          <span>GPS Location</span>

          <strong>
            {latitude !== undefined &&
            longitude !== undefined
              ? `${latitude}, ${longitude}`
              : "Location unavailable"}
          </strong>
        </div>

      </div>


      {/* DETAILS */}

      <div className="pothole-details">

        <div className="pothole-detail">

          <Ruler size={16} />

          <div>
            <span>Depth</span>
            <strong>
              {depth || "0"} cm
            </strong>
          </div>

        </div>


        <div className="pothole-detail">

          <Calendar size={16} />

          <div>
            <span>Date</span>

            <strong>
              {date || "N/A"}
            </strong>
          </div>

        </div>

      </div>


      {/* FOOTER */}

      <div className="pothole-card-footer">

        <span
          className={`pothole-status ${statusClass}`}
        >
          <span className="status-dot"></span>
          {status || "Detected"}
        </span>


        <button
          type="button"
          className="pothole-view-btn"
          onClick={() => onView?.(pothole)}
        >
          <Eye size={15} />
          View
        </button>

      </div>

    </div>
  );
}

export default PotholeCard;
