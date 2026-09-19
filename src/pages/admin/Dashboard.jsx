import {
  MapPin,
  AlertTriangle,
  CheckCircle,
  CircleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../../services/api";



function Dashboard() {
  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPotholes = async () => {
      try {
        setLoading(true);
        const data = await api.getPotholes();
        if (data.success) {
          setPotholes(data.potholes);
        }
      } catch (err) {
        console.error("Failed to fetch potholes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPotholes();
  }, []);

  const stats = {
    total: potholes.length,
    active: potholes.filter(p => p.status !== "Resolved" && p.status !== "Closed").length,
    repaired: potholes.filter(p => p.status === "Resolved" || p.status === "Closed").length,
    critical: potholes.filter(p => p.severity === "High").length,
  };

  const recentList = potholes.slice(0, 4);

  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Monitor and manage road potholes</p>
        </div>

        <Link to="detection">
          <button className="new-detection-btn">
            + New Detection
          </button>
        </Link>
      </div>


      {/* ================= STAT CARDS ================= */}

      <div className="stats-grid">

        {/* TOTAL */}

        <div className="stat-card">
          <div className="stat-card-content">
            <span>Total Potholes</span>
            <h2>{stats.total}</h2>
            <p>All detected potholes</p>
          </div>

          <div className="stat-icon">
            <MapPin size={24} />
          </div>
        </div>


        {/* ACTIVE */}

        <div className="stat-card">
          <div className="stat-card-content">
            <span>Active Potholes</span>
            <h2>{stats.active}</h2>
            <p>Needs attention</p>
          </div>

          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
        </div>


        {/* REPAIRED */}

        <div className="stat-card">
          <div className="stat-card-content">
            <span>Repaired</span>
            <h2>{stats.repaired}</h2>
            <p>Successfully repaired</p>
          </div>

          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
        </div>


        {/* CRITICAL */}

        <div className="stat-card">
          <div className="stat-card-content">
            <span>Critical</span>
            <h2>{stats.critical}</h2>
            <p>High severity</p>
          </div>

          <div className="stat-icon">
            <CircleAlert size={24} />
          </div>
        </div>

      </div>


      {/* ================= LOWER SECTION ================= */}

      <div className="dashboard-grid">

        {/* LIVE MAP */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h3>Live Pothole Map</h3>
              <p>Recent pothole locations</p>
            </div>

            <Link to="live-map" className="panel-link">
              View Map
            </Link>

          </div>


          <div className="dashboard-map">

            <div className="dashboard-map-placeholder">

              <MapPin size={48} />

              <h3>Live Map</h3>

              <p>
                GPS pothole locations will appear here
              </p>

            </div>

          </div>

        </div>


        {/* RECENT POTHOLES */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h3>Recent Potholes</h3>
              <p>Latest detected potholes</p>
            </div>

            <Link to="history" className="panel-link">
              View All
            </Link>

          </div>


          <div className="recent-list">

            {recentList.map((pothole) => (

              <div
                className="recent-item"
                key={pothole._id}
              >

                {/* LEFT */}

                <div className="recent-info">

                  <strong>
                    {pothole.complaintId}
                  </strong>

                  <span>
                    {pothole.location}
                  </span>

                </div>


                {/* RIGHT */}

                <div className="recent-right">

                  <div>

                    <span
                      className={`badge badge-${pothole.severity.toLowerCase()}`}
                    >
                      {pothole.severity}
                    </span>

                    <span className="badge badge-status">
                      {pothole.status}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;