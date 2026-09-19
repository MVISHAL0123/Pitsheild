import {
  Search,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onMenuToggle }) {
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [role, setRole] = useState("admin");

  useEffect(() => {
    const savedRole = localStorage.getItem("pitshieldRole");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSettings = () => {
    setShowProfile(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    setShowProfile(false);
    localStorage.removeItem("pitshieldLoggedIn");
    localStorage.removeItem("pitshieldRole");
    localStorage.removeItem("pitshieldToken");
    localStorage.removeItem("pitshieldUser");
    navigate("/login");
  };

  return (
    <header className="top-navbar">

      {/* HAMBURGER (mobile only) */}
      <button
        className="hamburger-btn"
        type="button"
        onClick={onMenuToggle}
        aria-label="Toggle sidebar menu"
      >
        <Menu size={22} />
      </button>

      {/* SEARCH */}

      <div className="navbar-search">

        <Search size={19} />

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search potholes, locations..."
        />

        {search && (
          <button
            className="search-clear"
            onClick={() => setSearch("")}
            type="button"
          >
            ×
          </button>
        )}

      </div>


      {/* RIGHT SIDE */}

      <div className="navbar-right">

        {/* NOTIFICATION */}

        <button
          className="notification-btn"
          type="button"
          title="Notifications"
        >
          <Bell size={20} />

          <span className="notification-dot"></span>
        </button>


        {/* PROFILE */}

        <div className="profile-wrapper">

          <button
            className="profile-btn"
            type="button"
            onClick={() =>
              setShowProfile(!showProfile)
            }
          >

            <div className="profile-avatar">
              <User size={19} />
            </div>

            <div className="profile-info">
              <strong>{role === "maintenance" ? "Team Alpha" : "Admin"}</strong>
              <span style={{ textTransform: "capitalize" }}>{role === "maintenance" ? "Maintenance Team" : "Administrator"}</span>
            </div>

            <ChevronDown
              size={17}
              className={`profile-arrow ${showProfile ? "profile-arrow-open" : ""
                }`}
            />

          </button>


          {/* PROFILE DROPDOWN */}

          {showProfile && (
            <div className="profile-dropdown">

              <div className="dropdown-user">

                <div className="dropdown-avatar">
                  <User size={20} />
                </div>

                <div>
                  <strong>{role === "maintenance" ? "Team Alpha" : "Admin"}</strong>
                  <span style={{ textTransform: "capitalize" }}>{role === "maintenance" ? "Maintenance Team" : "Administrator"}</span>
                </div>

              </div>


              <div className="dropdown-divider"></div>


              <button
                className="dropdown-item logout-item"
                onClick={handleLogout}
                type="button"
              >
                <LogOut size={17} />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;