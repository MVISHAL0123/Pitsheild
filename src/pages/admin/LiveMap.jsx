import { MapPin, Layers, AlertTriangle, Navigation } from "lucide-react";

import MapView from "../../components/MapView";

const potholes = [
  {
    id: "PH-001",
    location: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    depth: "8.5 cm",
    severity: "High",
    status: "Detected",
  },
  {
    id: "PH-002",
    location: "Tambaram",
    lat: 12.9249,
    lng: 80.1000,
    depth: "5.2 cm",
    severity: "Medium",
    status: "Repaired",
  },
  {
    id: "PH-003",
    location: "Velachery",
    lat: 12.9815,
    lng: 80.2180,
    depth: "3.1 cm",
    severity: "Low",
    status: "Detected",
  },
  {
    id: "PH-004",
    location: "Guindy",
    lat: 13.0067,
    lng: 80.2206,
    depth: "9.2 cm",
    severity: "High",
    status: "Repairing",
  },
];

function LiveMap() {
  return (
    <div className="live-map-page">

      {/* =====================================
          PAGE HEADER
          ===================================== */}

      <div className="page-header">

        <div>
          <h1>Live Map</h1>

          <p>
            Real-time pothole locations across the city
          </p>
        </div>

        <div className="sensor-online">
          <span></span>
          Live
        </div>

      </div>


      {/* =====================================
          MAP LEGEND
          ===================================== */}

      <div className="map-legend">

        <div className="legend-item">
          <span className="legend-dot severity-high"></span>
          High Severity
        </div>

        <div className="legend-item">
          <span className="legend-dot severity-medium"></span>
          Medium Severity
        </div>

        <div className="legend-item">
          <span className="legend-dot severity-low"></span>
          Low Severity
        </div>

      </div>


      {/* =====================================
          MAP
          ===================================== */}

      <div className="map-wrapper">
        <MapView potholes={potholes} />
      </div>


      {/* =====================================
          LOCATIONS SUMMARY
          ===================================== */}

      <div className="map-locations">

        {potholes.map((pothole) => (
          <div className="location-card" key={pothole.id}>

            <div className={`location-icon severity-${pothole.severity.toLowerCase()}`}>
              {pothole.severity === "High" ? (
                <AlertTriangle size={20} />
              ) : (
                <MapPin size={20} />
              )}
            </div>

            <div className="location-details">
              <strong>{pothole.location}</strong>
              <span>{pothole.id} · Depth {pothole.depth}</span>
            </div>

            <div className="location-meta">
              <span
                className={`severity-${pothole.severity.toLowerCase()}`}
              >
                {pothole.severity}
              </span>
              <em>{pothole.status}</em>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default LiveMap;
