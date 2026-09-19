import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Ruler,
  Eye,
  CheckCircle,
  Wrench,
  AlertTriangle,
} from "lucide-react";



function History() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [potholeData, setPotholeData] = useState([]);

  useEffect(() => {
    const fetchPotholes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/potholes");
        const data = await response.json();
        if (data.success) {
          setPotholeData(
            data.potholes.map((p) => {
              const d = new Date(p.createdAt);
              return {
                id: p.complaintId,
                _id: p._id,
                location: p.location,
                depth: "N/A", // Depth is not stored yet
                severity: p.severity,
                status: p.status,
                date: d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
                time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
              };
            })
          );
        }
      } catch (err) {
        console.error("Failed to fetch potholes:", err);
      }
    };
    fetchPotholes();
  }, []);

  const filteredData = useMemo(() => {
    return potholeData.filter((pothole) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        pothole.id.toLowerCase().includes(searchText) ||
        pothole.location.toLowerCase().includes(searchText);

      const matchesSeverity =
        severityFilter === "All" ||
        pothole.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        pothole.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [search, severityFilter, statusFilter, potholeData]);

  const getSeverityClass = (severity) => {
    return severity.toLowerCase();
  };

  const getStatusIcon = (status) => {
    if (status === "Repaired") {
      return <CheckCircle size={15} />;
    }

    if (status === "Repairing") {
      return <Wrench size={15} />;
    }

    return <AlertTriangle size={15} />;
  };

  const getStatusClass = (status) => {
    if (status === "Repaired") return "repaired";
    if (status === "Repairing") return "repairing";
    return "detected";
  };

  return (
    <div className="history-page">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Pothole History</h1>
          <p>
            View and manage previously detected potholes
          </p>
        </div>

        <div className="history-count">
          <strong>{filteredData.length}</strong>
          <span>Records</span>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="history-summary">

        <div className="history-summary-card">
          <div className="summary-icon blue">
            <MapPin size={21} />
          </div>

          <div>
            <span>Total Records</span>
            <strong>{potholeData.length}</strong>
          </div>
        </div>

        <div className="history-summary-card">
          <div className="summary-icon red">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>High Severity</span>
            <strong>{potholeData.filter(p => p.severity === "High").length}</strong>
          </div>
        </div>

        <div className="history-summary-card">
          <div className="summary-icon orange">
            <Wrench size={21} />
          </div>

          <div>
            <span>In Progress</span>
            <strong>{potholeData.filter(p => p.status === "In Progress" || p.status === "Assigned").length}</strong>
          </div>
        </div>

        <div className="history-summary-card">
          <div className="summary-icon green">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Resolved</span>
            <strong>{potholeData.filter(p => p.status === "Resolved" || p.status === "Closed").length}</strong>
          </div>
        </div>

      </div>

      {/* FILTER BAR */}
      <div className="history-filter-card">

        <div className="history-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search by ID or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />

          <select
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value)
            }
          >
            <option value="All">All Severity</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Detected">Detected</option>
            <option value="Repairing">Repairing</option>
            <option value="Repaired">Repaired</option>
          </select>
        </div>

      </div>

      {/* HISTORY TABLE */}
      <div className="history-table-card">

        <div className="history-table-header">
          <div>
            <h3>Detection Records</h3>
            <p>
              Complete history of pothole detections
            </p>
          </div>

          <span className="table-record-count">
            {filteredData.length} results
          </span>
        </div>

        <div className="history-table-wrapper">

          <table className="history-table">

            <thead>
              <tr>
                <th>Pothole ID</th>
                <th>Location</th>
                <th>Depth</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredData.length > 0 ? (
                filteredData.map((pothole) => (
                  <tr key={pothole._id}>

                    <td>
                      <div className="pothole-id">
                        {pothole.id}
                      </div>
                    </td>

                    <td>
                      <div className="location-cell">
                        <MapPin size={16} />
                        <span>{pothole.location}</span>
                      </div>
                    </td>

                    <td>
                      <div className="depth-cell">
                        <Ruler size={16} />
                        {pothole.depth}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`severity-badge ${getSeverityClass(
                          pothole.severity
                        )}`}
                      >
                        <span className="severity-dot"></span>
                        {pothole.severity}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          pothole.status
                        )}`}
                      >
                        {getStatusIcon(pothole.status)}
                        {pothole.status}
                      </span>
                    </td>

                    <td>
                      <div className="date-cell">
                        <div>
                          <Calendar size={15} />
                          {pothole.date}
                        </div>

                        <span>{pothole.time}</span>
                      </div>
                    </td>

                    <td>
                      <button
                        className="view-record-btn"
                        title={`View ${pothole.id}`}
                      >
                        <Eye size={17} />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="no-history"
                  >
                    <Search size={30} />
                    <strong>No records found</strong>
                    <span>
                      Try changing your search or filters.
                    </span>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default History;