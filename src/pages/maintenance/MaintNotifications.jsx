import { useState, useEffect } from "react";
import { Bell, CheckCircle, Info } from "lucide-react";

function MaintNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/potholes");
        const data = await res.json();
        if (data.success && Array.isArray(data.potholes)) {
          // Generate notifications purely from MongoDB potholes
          const items = [];
          data.potholes.forEach((p) => {
            const timeStr = new Date(p.updatedAt || p.createdAt).toLocaleString();
            if (p.status === "Assigned") {
              items.push({
                id: `${p._id}-assigned`,
                title: `New Assignment (${p.complaintId || "Pothole"})`,
                message: `${p.complaintId} at ${p.location} has been assigned for maintenance. Severity: ${p.severity}.`,
                time: timeStr,
                unread: true,
                type: "info",
              });
            } else if (p.status === "In Progress") {
              items.push({
                id: `${p._id}-progress`,
                title: `Repair In Progress (${p.complaintId || "Pothole"})`,
                message: `${p.complaintId} at ${p.location} is currently active and under repair.`,
                time: timeStr,
                unread: false,
                type: "info",
              });
            } else if (p.status === "Awaiting Review") {
              items.push({
                id: `${p._id}-review`,
                title: `Awaiting Review (${p.complaintId || "Pothole"})`,
                message: `${p.complaintId} repair marked as completed. Awaiting Highways Admin QA verification.`,
                time: timeStr,
                unread: true,
                type: "alert",
              });
            } else if (p.status === "Resolved" || p.status === "Closed") {
              items.push({
                id: `${p._id}-closed`,
                title: `Repair Approved (${p.complaintId || "Pothole"})`,
                message: `Admin verified and closed repair for ${p.complaintId} at ${p.location}.`,
                time: timeStr,
                unread: false,
                type: "success",
              });
            }
          });
          setNotifications(items);
        }
      } catch (err) {
        console.error("Failed to load notifications from database:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, unread: false })));
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Team Notifications</h1>
          <p>Live status and assignment updates from MongoDB</p>
        </div>
        {notifications.length > 0 && (
          <button className="notif-mark-all-btn" onClick={markAllAsRead}>
            <CheckCircle size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="notif-summary">
        <div className="notif-summary-item">
          <div className="notif-summary-icon" style={{ background: "#eff6ff", color: "#2563eb" }}><Bell size={24} /></div>
          <div><strong>{unreadCount}</strong><span>Unread</span></div>
        </div>
        <div className="notif-summary-item">
          <div className="notif-summary-icon" style={{ background: "#f8fafc", color: "#64748b" }}><Info size={24} /></div>
          <div><strong>{notifications.length}</strong><span>Total</span></div>
        </div>
      </div>

      <div className="notif-card">
        <div className="notif-card-header">
          <h3>Recent Notifications</h3>
          {unreadCount > 0 && <span className="notif-unread-badge">{unreadCount} New</span>}
        </div>
        <div className="notif-list">
          {loading ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
              Loading notifications from database...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(n => (
              <div className={`notif-item ${n.unread ? "notif-unread" : ""}`} key={n.id}>
                <div className="notif-icon" style={{ background: n.type === "success" ? "#f0fdf4" : n.type === "alert" ? "#fef2f2" : "#eff6ff", color: n.type === "success" ? "#16a34a" : n.type === "alert" ? "#ef4444" : "#2563eb" }}>
                  <Bell size={20} />
                </div>
                <div className="notif-body">
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-message">{n.message}</div>
                  <div className="notif-time">{n.time}</div>
                </div>
                {n.unread && <div className="notif-dot"></div>}
              </div>
            ))
          ) : (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
              No notifications found. Real-time updates from MongoDB will appear here when potholes are assigned or updated.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MaintNotifications;
