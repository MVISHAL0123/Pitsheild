import { useEffect, useState } from "react";

import {
  Radar,
  Play,
  Square,
  Wifi,
  MapPin,
  Activity,
  Clock,
  Gauge,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import DetectionCard from "../../components/DetectionCard";

function Detection() {
  const [isDetecting, setIsDetecting] = useState(false);

  const [gpsData, setGpsData] = useState({
    lat: "13.0827",
    lng: "80.2707",
    address: "Chennai",
    status: "Initializing...",
    hasGeocoded: false
  });

  const [detection, setDetection] = useState({
    detected: true,
    depth: "8.5",
    distance: "8.5",
    severity: "High",
    location: "Chennai",
  });

  const [lastUpdate, setLastUpdate] = useState("Just now");

  /* =========================================
     GEOLOCATION MONITORING
     ========================================= */

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsData(prev => ({ ...prev, status: "GPS Not Supported" }));
      return;
    }

    setGpsData(prev => ({ ...prev, status: "Locating..." }));

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lng = position.coords.longitude.toFixed(4);

        setGpsData(prev => {
          if (!prev.hasGeocoded) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
              .then(res => res.json())
              .then(data => {
                if (data && data.address) {
                  const city = data.address.city || data.address.town || data.address.village || data.address.state || "Live Location";
                  setGpsData(g => ({ ...g, address: city, hasGeocoded: true }));
                  setDetection(d => ({ ...d, location: city }));
                }
              })
              .catch(() => {
                 setGpsData(g => ({ ...g, address: "Live Location", hasGeocoded: true }));
                 setDetection(d => ({ ...d, location: "Live Location" }));
              });
          }
          return { ...prev, lat, lng, status: "GPS Locked" };
        });
      },
      (error) => {
        setGpsData(prev => ({ ...prev, status: "GPS Error" }));
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* =========================================
     SIMULATED SENSOR MONITORING
     ========================================= */

  useEffect(() => {
    if (!isDetecting) return;

    const interval = setInterval(() => {
      const distance = (Math.random() * 8 + 2).toFixed(1);

      let severity = "Low";

      if (Number(distance) >= 7) {
        severity = "High";
      } else if (Number(distance) >= 4) {
        severity = "Medium";
      }

      setDetection(prev => ({
        ...prev,
        detected: true,
        depth: distance,
        distance,
        severity,
      }));

      setLastUpdate("Just now");
    }, 2000);

    return () => clearInterval(interval);
  }, [isDetecting]);


  /* =========================================
     START DETECTION
     ========================================= */

  const startDetection = () => {
    setIsDetecting(true);

    setDetection(prev => ({
      ...prev,
      detected: true,
      depth: "7.2",
      distance: "7.2",
      severity: "High",
    }));

    setLastUpdate("Just now");
  };


  /* =========================================
     STOP DETECTION
     ========================================= */

  const stopDetection = () => {
    setIsDetecting(false);
    setLastUpdate("Stopped");
  };


  return (
    <div className="detection-page">

      {/* =====================================
          PAGE HEADER
          ===================================== */}

      <div className="page-header">

        <div>
          <h1>Pothole Detection</h1>

          <p>
            Real-time ultrasonic sensor monitoring
          </p>
        </div>

        <div className="sensor-online">
          <span></span>
          Sensor Online
        </div>

      </div>


      {/* =====================================
          SENSOR STATUS
          ===================================== */}

      <div className="sensor-status-card">

        <div className="sensor-status-left">

          <div className="sensor-icon">
            <Radar size={28} />
          </div>

          <div>
            <h3>Ultrasonic Sensor</h3>

            <p>
              HC-SR04 distance measurement system
            </p>
          </div>

        </div>

        <div
          className={`sensor-running ${
            isDetecting ? "running" : ""
          }`}
        >
          <span></span>

          {isDetecting
            ? "Detection Running"
            : "Ready"}
        </div>

      </div>


      {/* =====================================
          MAIN DETECTION GRID
          ===================================== */}

      <div className="detection-grid">


        {/* SENSOR MONITORING */}

        <div className="detection-panel">

          <div className="detection-panel-header">

            <div>
              <h3>Sensor Monitoring</h3>

              <p>
                Live sensor readings
              </p>
            </div>

            <Wifi size={21} />

          </div>


          {/* DISTANCE READING */}

          <div className="sensor-reading">

            <div className="reading-circle">

              <Radar size={42} />

              <strong>
                {detection.distance}
              </strong>

              <span>cm</span>

            </div>

            <div className="reading-title">
              Ultrasonic Distance
            </div>

            <p>
              Current distance measured by sensor
            </p>

          </div>


          {/* SENSOR INFORMATION */}

          <div className="sensor-info">

            <div>
              <span>Sensor</span>
              <strong>HC-SR04</strong>
            </div>

            <div>
              <span>Connection</span>

              <strong className="connected">
                Connected
              </strong>
            </div>

            <div>
              <span>Update Rate</span>
              <strong>10 Hz</strong>
            </div>

          </div>

        </div>


        {/* DETECTION RESULT */}

        <DetectionCard detection={detection} />

      </div>


      {/* =====================================
          SENSOR METRICS
          ===================================== */}

      <div className="detection-metrics">

        <div className="metric-card">

          <div className="metric-icon">
            <Gauge size={21} />
          </div>

          <div>
            <span>Distance</span>
            <strong>{detection.distance} cm</strong>
          </div>

        </div>


        <div className="metric-card">

          <div className="metric-icon">
            <Radar size={21} />
          </div>

          <div>
            <span>Pothole Depth</span>
            <strong>{detection.depth} cm</strong>
          </div>

        </div>


        <div className="metric-card">

          <div className="metric-icon">
            {detection.severity === "High" ? (
              <AlertTriangle size={21} />
            ) : (
              <CheckCircle size={21} />
            )}
          </div>

          <div>
            <span>Severity</span>

            <strong
              className={`severity-${detection.severity.toLowerCase()}`}
            >
              {detection.severity}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          GPS LOCATION
          ===================================== */}

      <div className="gps-panel">

        <div className="gps-icon">
          <MapPin size={24} />
        </div>

        <div className="gps-info">

          <span>Current GPS Location</span>

          <strong>
            {gpsData.address}
          </strong>

          <p>
            {gpsData.lat}° N, {gpsData.lng}° E
          </p>

        </div>

        <div className="gps-status">
          {gpsData.status}
        </div>

      </div>


      {/* =====================================
          DETECTION CONTROL
          ===================================== */}

      <div className="detection-control">

        <div className="control-info">

          <Activity size={20} />

          <div>

            <strong>
              Detection System
            </strong>

            <span>
              {isDetecting
                ? "System is actively monitoring"
                : "System is ready to detect potholes"}
            </span>

          </div>

        </div>


        {!isDetecting ? (

          <button
            className="start-detection-btn"
            onClick={startDetection}
          >
            <Play size={18} />
            Start Detection
          </button>

        ) : (

          <button
            className="stop-detection-btn"
            onClick={stopDetection}
          >
            <Square size={18} />
            Stop Detection
          </button>

        )}

      </div>


      {/* =====================================
          LAST UPDATE
          ===================================== */}

      <div className="last-update">

        <Clock size={15} />

        Last sensor update: {lastUpdate}

      </div>

    </div>
  );
}

export default Detection;