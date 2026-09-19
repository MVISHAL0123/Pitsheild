import {
  LayoutDashboard,
  Map,
  Radar,
  History,
  Wrench,
  BarChart3,
  FileText,
  UserPlus,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Live Map", icon: Map, path: "/admin/live-map" },
  { name: "Detection", icon: Radar, path: "/admin/detection" },
  { name: "Complaints", icon: FileText, path: "/admin/complaints" },
  { name: "Assign Work", icon: UserPlus, path: "/admin/assign-work" },
  { name: "Monitor Repairs", icon: Wrench, path: "/admin/monitor-repairs" },
  { name: "History", icon: History, path: "/admin/history" },
  { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar-mobile-open" : ""}`}>
      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">P</div>
        <span>PitShield</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              end={item.path === "/admin"}
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

export default Sidebar;