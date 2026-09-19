import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const defaultPotholes = [
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

function MapView({ potholes }) {
  const displayPotholes = potholes || defaultPotholes;

  const getCoordinates = (pothole, index) => {
    if (pothole.lat && pothole.lng) return [pothole.lat, pothole.lng];
    // Deterministic mock coordinate around Chennai center if missing
    const lat = 13.0827 + (Math.sin(index * 13) * 0.07);
    const lng = 80.2707 + (Math.cos(index * 13) * 0.07);
    return [lat, lng];
  };

  return (
    <MapContainer
      center={[13.0827, 80.2707]}
      zoom={11}
      scrollWheelZoom={true}
      className="map-container"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {displayPotholes.map((pothole, index) => (
        <Marker
          key={pothole._id || pothole.id || index}
          position={getCoordinates(pothole, index)}
        >
          <Popup>
            <div className="map-popup">
              <h3>{pothole.complaintId || pothole.id || "Pothole"}</h3>

              <p>
                <strong>Location:</strong>{" "}
                {pothole.location}
              </p>

              {(pothole.depth) && (
                <p>
                  <strong>Depth:</strong>{" "}
                  {pothole.depth}
                </p>
              )}

              <p>
                <strong>Severity:</strong>{" "}
                {pothole.severity}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {pothole.status}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
