import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";

function Analytics() {
  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>
            Analyze pothole detection and repair performance
          </p>
        </div>

        <div className="sensor-online">
          <span></span>
          Live Data
        </div>
      </div>


      {/* STATISTICS */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-title">
                Total Detections
              </div>

              <div className="stat-value">
                156
              </div>

              <div className="stat-description">
                +12% from last month
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
                High Severity
              </div>

              <div className="stat-value">
                42
              </div>

              <div className="stat-description">
                Critical potholes detected
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
                Repaired
              </div>

              <div className="stat-value">
                124
              </div>

              <div className="stat-description">
                Successfully completed
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
                Success Rate
              </div>

              <div className="stat-value">
                96%
              </div>

              <div className="stat-description">
                Overall repair efficiency
              </div>
            </div>

            <div className="stat-icon">
              <TrendingUp size={23} />
            </div>
          </div>
        </div>

      </div>


      {/* ANALYTICS CARDS */}

      <div className="analytics-grid">

        {/* DETECTION TREND */}

        <div className="analytics-card">

          <div className="repair-card-header">

            <div>
              <h3>Detection Trend</h3>

              <p>
                Potholes detected over recent months
              </p>
            </div>

            <BarChart3
              size={22}
              color="#2867e8"
            />

          </div>


          <div className="chart-container">

            <div
              style={{
                width: "90%",
                height: "180px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
                gap: "12px",
              }}
            >

              {[45, 62, 52, 78, 68, 91, 82].map(
                (value, index) => (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: `${value}%`,
                      background: "#2867e8",
                      borderRadius: "6px 6px 0 0",
                      minWidth: "20px",
                    }}
                  />
                )
              )}

            </div>

          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "10px",
              color: "#91a0b7",
              fontSize: "11px",
            }}
          >
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
          </div>

        </div>


        {/* SEVERITY */}

        <div className="analytics-card">

          <div className="repair-card-header">

            <div>
              <h3>Severity Distribution</h3>

              <p>
                Detection severity breakdown
              </p>
            </div>

            <AlertTriangle
              size={22}
              color="#2867e8"
            />

          </div>


          <div style={{ marginTop: "22px" }}>

            <div className="progress-item">

              <div className="progress-label">
                <span>High Severity</span>
                <strong>42</strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "72%" }}
                />
              </div>

            </div>


            <div className="progress-item">

              <div className="progress-label">
                <span>Medium Severity</span>
                <strong>68</strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "58%" }}
                />
              </div>

            </div>


            <div className="progress-item">

              <div className="progress-label">
                <span>Low Severity</span>
                <strong>46</strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "38%" }}
                />
              </div>

            </div>

          </div>

        </div>


        {/* REPAIR PERFORMANCE */}

        <div className="analytics-card">

          <div className="repair-card-header">

            <div>
              <h3>Repair Performance</h3>

              <p>
                Current repair operation status
              </p>
            </div>

            <CheckCircle
              size={22}
              color="#16a34a"
            />

          </div>


          <div style={{ marginTop: "20px" }}>

            <div className="repair-control-row">

              <span>
                Completed Repairs
              </span>

              <strong>
                124
              </strong>

            </div>


            <div className="repair-control-row">

              <span>
                Pending Repairs
              </span>

              <strong>
                08
              </strong>

            </div>


            <div className="repair-control-row">

              <span>
                Failed Repairs
              </span>

              <strong>
                05
              </strong>

            </div>


            <div className="repair-control-row">

              <span>
                Average Repair Time
              </span>

              <strong>
                4.2 min
              </strong>

            </div>

          </div>

        </div>


        {/* SYSTEM ACTIVITY */}

        <div className="analytics-card">

          <div className="repair-card-header">

            <div>
              <h3>System Activity</h3>

              <p>
                Detection system performance
              </p>
            </div>

            <Clock
              size={22}
              color="#2867e8"
            />

          </div>


          <div style={{ marginTop: "20px" }}>

            <div className="repair-control-row">

              <span>
                Sensor Availability
              </span>

              <strong className="text-success">
                99.2%
              </strong>

            </div>


            <div className="repair-control-row">

              <span>
                GPS Availability
              </span>

              <strong className="text-success">
                98.7%
              </strong>

            </div>


            <div className="repair-control-row">

              <span>
                Detection Accuracy
              </span>

              <strong className="text-primary">
                94.5%
              </strong>

            </div>


            <div className="repair-control-row">

              <span>
                System Uptime
              </span>

              <strong className="text-success">
                99.8%
              </strong>

            </div>

          </div>

        </div>


        {/* FULL WIDTH SUMMARY */}

        <div className="analytics-card full-width">

          <div className="repair-card-header">

            <div>
              <h3>Performance Summary</h3>

              <p>
                Overall PitShield system performance
              </p>
            </div>

            <TrendingUp
              size={22}
              color="#2867e8"
            />

          </div>


          <div className="stats-grid">

            <div className="history-stat-card">
              <span>
                Detection Accuracy
              </span>

              <strong>
                94.5%
              </strong>
            </div>


            <div className="history-stat-card">
              <span>
                Repair Success
              </span>

              <strong>
                96%
              </strong>
            </div>


            <div className="history-stat-card">
              <span>
                Average Depth
              </span>

              <strong>
                6.8 cm
              </strong>
            </div>


            <div className="history-stat-card">
              <span>
                Average Repair
              </span>

              <strong>
                4.2 min
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;