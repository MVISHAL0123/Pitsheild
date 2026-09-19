import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Wrench,
  Clock,
  Check,
} from "lucide-react";


const typeConfig = {
  resolved:     { icon: CheckCircle,    color: "#16a34a", bg: "#dcfce7" },
  progress:     { icon: Wrench,         color: "#2563eb", bg: "#dbeafe" },
  acknowledged: { icon: Clock,          color: "#d97706", bg: "#fef3c7" },
  info:         { icon: Info,           color: "#6366f1", bg: "#ede9fe" },
  alert:        { icon: AlertTriangle,  color: "#ef4444", bg: "#fee2e2" },
};

function UserNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/potholes");
        const data = await response.json();
        if (data.success) {
          const generatedNotifs = [];
          data.potholes.forEach((p, idx) => {
            if (p.status === "Resolved" || p.status === "Closed") {
              generatedNotifs.push({
                id: `${p._id}-res`,
                type: "resolved",
                title: `Report ${p.complaintId} Resolved`,
                message: `Your pothole report at ${p.location} has been successfully repaired.`,
                time: new Date(p.updatedAt || p.createdAt).toLocaleDateString(),
                read: false,
              });
            } else if (p.status === "In Progress" || p.status === "Assigned") {
              generatedNotifs.push({
                id: `${p._id}-prog`,
                type: "progress",
                title: `Repair In Progress — ${p.complaintId}`,
                message: `Repair work has started at ${p.location}.`,
                time: new Date(p.updatedAt || p.createdAt).toLocaleDateString(),
                read: false,
              });
            } else {
              generatedNotifs.push({
                id: `${p._id}-ack`,
                type: "acknowledged",
                title: `Report ${p.complaintId} Acknowledged`,
                message: `Your report at ${p.location} has been received.`,
                time: new Date(p.createdAt).toLocaleDateString(),
                read: true,
              });
            }
          });
          setNotifications(generatedNotifs);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };
    fetchReports();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="notifications-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated on your report status</p>
        </div>
        {unreadCount > 0 && (
          <button className="notif-mark-all-btn" onClick={markAllRead}>
            <Check size={16} />
            Mark All as Read
          </button>
        )}
      </div>


      {/* SUMMARY ROW */}
      <div className="notif-summary">
        <div className="notif-summary-item">
          <div className="notif-summary-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <Bell size={20} />
          </div>
          <div>
            <strong>{notifications.length}</strong>
            <span>Total</span>
          </div>
        </div>
        <div className="notif-summary-item">
          <div className="notif-summary-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <Clock size={20} />
          </div>
          <div>
            <strong>{unreadCount}</strong>
            <span>Unread</span>
          </div>
        </div>
        <div className="notif-summary-item">
          <div className="notif-summary-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <strong>{notifications.filter((n) => n.read).length}</strong>
            <span>Read</span>
          </div>
        </div>
      </div>


      {/* NOTIFICATION LIST */}
      <div className="notif-card">

        <div className="notif-card-header">
          <h3>All Notifications</h3>
          {unreadCount > 0 && (
            <span className="notif-unread-badge">{unreadCount} new</span>
          )}
        </div>

        <div className="notif-list">
          {notifications.map((notif) => {
            const config = typeConfig[notif.type] || typeConfig.info;
            const Icon = config.icon;
            return (
              <div
                key={notif.id}
                className={`notif-item ${!notif.read ? "notif-unread" : ""}`}
                onClick={() => markRead(notif.id)}
              >
                <div
                  className="notif-icon"
                  style={{ background: config.bg, color: config.color }}
                >
                  <Icon size={20} />
                </div>

                <div className="notif-body">
                  <div className="notif-title">{notif.title}</div>
                  <div className="notif-message">{notif.message}</div>
                  <div className="notif-time">
                    <Clock size={12} />
                    {notif.time}
                  </div>
                </div>

                {!notif.read && <div className="notif-dot"></div>}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}

export default UserNotifications;
