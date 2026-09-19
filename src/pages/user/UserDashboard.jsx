import { Routes, Route } from "react-router-dom";
import { useState, useCallback, lazy, Suspense } from "react";
import { Search, Bell, User, ChevronDown, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

import UserSidebar from "../../components/UserSidebar";

const UserHome = lazy(() => import("./UserHome"));
const ReportPothole = lazy(() => import("./ReportPothole"));
const UserLiveMap = lazy(() => import("./UserLiveMap"));
const MyReports = lazy(() => import("./MyReports"));
const UserNotifications = lazy(() => import("./UserNotifications"));
const UserProfile = lazy(() => import("./UserProfile"));
const Detection = lazy(() => import("../admin/Detection"));

function RouteLoader() {
  return (
    <div className="route-loader">
      <div className="route-spinner"></div>
    </div>
  );
}

function UserNavbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    setShowProfile(false);
    localStorage.removeItem("pitshieldLoggedIn");
    localStorage.removeItem("pitshieldRole");
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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reports, locations..."
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch("")} type="button">×</button>
        )}
      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        <button className="notification-btn" type="button" title="Notifications">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="profile-wrapper">
          <button className="profile-btn" type="button" onClick={() => setShowProfile(!showProfile)}>
            <div className="profile-avatar">
              <User size={19} />
            </div>
            <div className="profile-info">
              <strong>Citizen User</strong>
              <span>User</span>
            </div>
            <ChevronDown size={17} className={`profile-arrow ${showProfile ? "profile-arrow-open" : ""}`} />
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="dropdown-user">
                <div className="dropdown-avatar"><User size={20} /></div>
                <div>
                  <strong>Citizen User</strong>
                  <span>user@pitshield.com</span>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-item" onClick={handleLogout} type="button">
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

function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className={`app ${sidebarOpen ? "sidebar-open" : ""}`}>

      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      <UserSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="main">
        <UserNavbar onMenuToggle={toggleSidebar} />

        <main className="content">
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route path="/" element={<UserHome />} />
              <Route path="/detection" element={<Detection />} />
              <Route path="/report" element={<ReportPothole />} />
              <Route path="/map" element={<UserLiveMap />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/notifications" element={<UserNotifications />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </Suspense>
        </main>
      </div>

    </div>
  );
}

export default UserDashboard;
