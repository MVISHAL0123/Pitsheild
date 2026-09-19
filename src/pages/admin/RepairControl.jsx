import { useState } from "react";
import {
  Wrench,
  Play,
  Square,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Gauge,
  Package,
  Activity,
} from "lucide-react";

function RepairControl() {
  const [isRepairing, setIsRepairing] = useState(false);
  const [materialLevel, setMaterialLevel] = useState(72);

  const [repairStatus, setRepairStatus] = useState("Ready");

  const selectedPothole = {
    id: "PTH-001",
    location: "Chennai",
    depth: "7.2 cm",
    severity: "High",
    detectedAt: "Just now",
  };

  const startRepair = () => {
    setIsRepairing(true);
    setRepairStatus("Repairing");

    setTimeout(() => {
      setMaterialLevel((prev) => Math.max(prev - 8, 0));
    }, 1000);
  };

  const stopRepair = () => {
    setIsRepairing(false);
    setRepairStatus("Stopped");
  };

  const emergencyStop = () => {
    setIsRepairing(false);
    setRepairStatus("Emergency Stop");
  };

  return (
    <div className="repair-page">

      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <h1>Repair Control</h1>

          <p>
            Control and monitor pothole repair operations
          </p>
        </div>

        <div
          className={`sensor-online ${
            isRepairing ? "" : ""
          }`}
        >
          <span></span>
          System Online
        </div>
      </div>


      {/* REPAIR STATUS */}

      <div className="sensor-status-card">

        <div className="sensor-status-left">

          <div className="sensor-icon">
            <Wrench size={27} />
          </div>

          <div>
            <h3>Automatic Repair System</h3>

            <p>
              IoT controlled pothole repair mechanism
            </p>
          </div>

        </div>

        <div
          className={`sensor-running ${
            isRepairing ? "running" : ""
          }`}
        >
          <span></span>

          {repairStatus}
        </div>

      </div>


      {/* STAT CARDS */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-card-top">

            <div>
              <div className="stat-title">
                Pending Repairs
              </div>

              <div className="stat-value">
                08
              </div>

              <div className="stat-description">
                Potholes waiting for repair
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
                Repairs Completed
              </div>

              <div className="stat-value">
                124
              </div>

              <div className="stat-description">
                Successfully repaired
              </div>
            </div>

            <div className="stat-icon">
              <CheckCircle size={23} />
            </div>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-card-top">

            <div>
              <div className="stat-title">
                Repairing Now
              </div>

              <div className="stat-value">
                {isRepairing ? "01" : "00"}
              </div>

              <div className="stat-description">
                Active repair operations
              </div>
            </div>

            <div className="stat-icon">
              <Activity size={23} />
            </div>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-card-top">

            <div>
              <div className="stat-title">
                Success Rate
              </div>

              <div className="stat-value">
                96%
              </div>

              <div className="stat-description">
                Overall repair success
              </div>
            </div>

            <div className="stat-icon">
              <Gauge size={23} />
            </div>

          </div>

        </div>

      </div>


      {/* MAIN REPAIR AREA */}

      <div className="repair-grid">

        {/* SELECTED POTHOLE */}

        <div className="repair-card">

          <div className="repair-card-header">

            <div>
              <h3>Selected Pothole</h3>

              <p>
                Pothole selected for repair
              </p>
            </div>

            <span className="badge high">
              {selectedPothole.severity}
            </span>

          </div>


          {/* Pothole information */}

          <div className="result-details">

            <div className="result-detail">

              <span>Pothole ID</span>

              <strong>
                {selectedPothole.id}
              </strong>

            </div>


            <div className="result-detail">

              <span>Depth</span>

              <strong>
                {selectedPothole.depth}
              </strong>

            </div>


            <div className="result-detail">

              <span>Location</span>

              <strong>
                {selectedPothole.location}
              </strong>

            </div>


            <div className="result-detail">

              <span>Detected</span>

              <strong>
                {selectedPothole.detectedAt}
              </strong>

            </div>

          </div>


          {/* GPS */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
              padding: "14px",
              background: "#f8fafc",
              borderRadius: "9px",
            }}
          >

            <MapPin
              size={19}
              color="#2867e8"
            />

            <div>
              <span
                style={{
                  display: "block",
                  color: "#91a0b7",
                  fontSize: "12px",
                }}
              >
                GPS Coordinates
              </span>

              <strong
                style={{
                  color: "#17233b",
                  fontSize: "13px",
                }}
              >
                13.0827° N, 80.2707° E
              </strong>
            </div>

          </div>

        </div>


        {/* MATERIAL STATUS */}

        <div className="repair-card">

          <div className="repair-card-header">

            <div>
              <h3>Repair Material</h3>

              <p>
                Current material availability
              </p>
            </div>

            <Package
              size={22}
              color="#2867e8"
            />

          </div>


          <div
            style={{
              textAlign: "center",
              padding: "15px 0 20px",
            }}
          >

            <div
              style={{
                fontSize: "34px",
                fontWeight: "750",
                color: "#17233b",
              }}
            >
              {materialLevel}%
            </div>

            <div
              style={{
                color: "#91a0b7",
                fontSize: "13px",
                marginTop: "4px",
              }}
            >
              Material Available
            </div>

          </div>


          {/* Progress */}

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${materialLevel}%`,
              }}
            />

          </div>


          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "9px",
              color: "#8190a8",
              fontSize: "12px",
            }}
          >

            <span>
              0%
            </span>

            <span>
              100%
            </span>

          </div>


          {/* Material status */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "20px",
              padding: "12px",
              background: "#ecfdf3",
              borderRadius: "8px",
              color: "#16a34a",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >

            <CheckCircle size={17} />

            Material level is sufficient

          </div>

        </div>

      </div>


      {/* REPAIR CONTROL */}

      <div
        className="repair-card"
        style={{
          marginTop: "22px",
        }}
      >

        <div className="repair-card-header">

          <div>
            <h3>Repair Controls</h3>

            <p>
              Control the automatic repair mechanism
            </p>
          </div>

          <Wrench
            size={22}
            color="#2867e8"
          />

        </div>


        <div className="repair-controls">

          <div className="repair-control-row">

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "11px",
              }}
            >

              <Play
                size={19}
                color="#16a34a"
              />

              <div>

                <strong>
                  Start Repair
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: "2px",
                  }}
                >
                  Begin automatic pothole filling
                </span>

              </div>

            </div>


            <button
              className="start-detection-btn"
              onClick={startRepair}
              disabled={isRepairing}
              style={{
                opacity: isRepairing ? 0.55 : 1,
              }}
            >
              <Play size={16} />

              {isRepairing
                ? "Repairing..."
                : "Start Repair"}
            </button>

          </div>


          <div className="repair-control-row">

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "11px",
              }}
            >

              <Square
                size={19}
                color="#64748b"
              />

              <div>

                <strong>
                  Stop Repair
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: "2px",
                  }}
                >
                  Stop the current repair operation
                </span>

              </div>

            </div>


            <button
              className="action-btn"
              onClick={stopRepair}
              style={{
                width: "120px",
              }}
            >
              <Square size={15} />

              Stop

            </button>

          </div>


          <div className="repair-control-row">

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "11px",
              }}
            >

              <AlertTriangle
                size={19}
                color="#ef4444"
              />

              <div>

                <strong>
                  Emergency Stop
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: "2px",
                  }}
                >
                  Immediately stop all repair activity
                </span>

              </div>

            </div>


            <button
              onClick={emergencyStop}
              style={{
                minHeight: "38px",
                padding: "0 15px",
                border: "0",
                borderRadius: "8px",
                background: "#fee2e2",
                color: "#dc2626",
                fontWeight: "650",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
              }}
            >

              <AlertTriangle size={15} />

              Emergency Stop

            </button>

          </div>

        </div>

      </div>


      {/* SYSTEM INFORMATION */}

      <div
        className="gps-panel"
        style={{
          marginTop: "22px",
          marginBottom: "0",
        }}
      >

        <div className="gps-icon">
          <Activity size={22} />
        </div>

        <div className="gps-info">

          <span>
            Repair System Status
          </span>

          <strong>
            {isRepairing
              ? "Automatic repair mechanism is active"
              : repairStatus === "Emergency Stop"
              ? "System stopped for safety"
              : "System is ready for repair"}
          </strong>

          <p>
            Motor controller and material dispenser connected
          </p>

        </div>

        <div className="gps-status">
          Connected
        </div>

      </div>

    </div>
  );
}

export default RepairControl;