import {
  LayoutDashboard,
  FileText,
  Map,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Radar,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/user" },
  { name: "Live Detection", icon: Radar, path: "/user/detection" },
  { name: "Report Pothole", icon: FileText, path: "/user/report" },
  { name: "Live Map", icon: Map, path: "/user/map" },
  { name: "My Reports", icon: ClipboardList, path: "/user/my-reports" },
  { name: "Notifications", icon: Bell, path: "/user/notifications" },
  { name: "Profile", icon: User, path: "/user/profile" },
];

function UserSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("pitshieldLoggedIn");
    localStorage.removeItem("pitshieldRole");
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-mobile-open" : ""}`}>

      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">P</div>
        <div>
          <span style={{ display: "block", lineHeight: 1.1 }}>PitShield</span>
          <span style={{ display: "block", fontSize: "10px", color: "#6b7280", fontWeight: 400, letterSpacing: "0.5px" }}>
            Citizen Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              to={item.path}
              end={item.path === "/user"}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
              key={item.name}
              onClick={onClose}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}

export default UserSidebar;
