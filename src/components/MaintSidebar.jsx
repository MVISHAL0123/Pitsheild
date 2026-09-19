import {
  Wrench,
  ClipboardList,
  CheckSquare,
  Bell,
  User,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const maintMenuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/maintenance" },
  { name: "My Assignments", icon: ClipboardList, path: "/maintenance/assignments" },
  { name: "Active Repair", icon: Wrench, path: "/maintenance/active-repair" },
  { name: "Completed Jobs", icon: CheckSquare, path: "/maintenance/completed" },
  { name: "Manage Teams", icon: User, path: "/maintenance/teams" },
  { name: "Notifications", icon: Bell, path: "/maintenance/notifications" },
  { name: "Profile", icon: User, path: "/maintenance/profile" },
];

function MaintSidebar({ isOpen, onClose }) {
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
        <div className="logo-icon" style={{ background: "#f59e0b" }}>W</div>
        <span>Maintenance</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">
        {maintMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              end={item.path === "/maintenance"}
              to={item.path}
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

export default MaintSidebar;
