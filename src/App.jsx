import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useState, useCallback } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import MaintSidebar from "./components/MaintSidebar";

// Lazy-loaded Admin Pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const LiveMap = lazy(() => import("./pages/admin/LiveMap"));
const Detection = lazy(() => import("./pages/admin/Detection"));
const Complaints = lazy(() => import("./pages/admin/Complaints"));
const AssignWork = lazy(() => import("./pages/admin/AssignWork"));
const MonitorRepairs = lazy(() => import("./pages/admin/MonitorRepairs"));
const PotholeHistory = lazy(() => import("./pages/admin/PotholeHistory"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Settings = lazy(() => import("./pages/admin/Settings"));

// Lazy-loaded User Portal
const UserDashboard = lazy(() => import("./pages/user/UserDashboard"));

// Lazy-loaded Maintenance Pages
const MaintDashboard = lazy(() => import("./pages/maintenance/MaintDashboard"));
const MyAssignments = lazy(() => import("./pages/maintenance/MyAssignments"));
const ActiveRepair = lazy(() => import("./pages/maintenance/ActiveRepair"));
const CompletedJobs = lazy(() => import("./pages/maintenance/CompletedJobs"));
const MaintNotifications = lazy(() => import("./pages/maintenance/MaintNotifications"));
const MaintProfile = lazy(() => import("./pages/maintenance/MaintProfile"));
const MaintTeams = lazy(() => import("./pages/maintenance/MaintTeams"));

// Lazy-loaded Login Pages
const PortalSelect = lazy(() => import("./pages/login/PortalSelect"));
const UserLogin = lazy(() => import("./pages/login/UserLogin"));
const StaffLogin = lazy(() => import("./pages/login/StaffLogin"));

// Loading spinner for route transitions
function RouteLoader() {
  return (
    <div className="route-loader">
      <div className="route-spinner"></div>
    </div>
  );
}

function App() {
  const role = localStorage.getItem("pitshieldRole");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Redirect root based on role */}
          <Route
            path="/"
            element={
              role === "admin" ? <Navigate to="/admin" /> :
                role === "maintenance" ? <Navigate to="/maintenance" /> :
                  role === "user" ? <Navigate to="/user" /> :
                    <Navigate to="/login" />
            }
          />

          {/* Login — Portal Selector */}
          <Route path="/login" element={<PortalSelect />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/staff" element={<StaffLogin />} />

          {/* User Portal — internal routes handled inside UserDashboard */}
          <Route path="/user/*" element={<UserDashboard />} />

          {/* Admin Application */}
          <Route
            path="/admin/*"
            element={
              <div className={`app ${sidebarOpen ? "sidebar-open" : ""}`}>
                {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
                <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                <div className="main">
                  <Navbar onMenuToggle={toggleSidebar} />
                  <main className="content">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/live-map" element={<LiveMap />} />
                      <Route path="/detection" element={<Detection />} />
                      <Route path="/complaints" element={<Complaints />} />
                      <Route path="/assign-work" element={<AssignWork />} />
                      <Route path="/monitor-repairs" element={<MonitorRepairs />} />
                      <Route path="/history" element={<PotholeHistory />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />

          {/* Maintenance Application */}
          <Route
            path="/maintenance/*"
            element={
              <div className={`app ${sidebarOpen ? "sidebar-open" : ""}`}>
                {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
                <MaintSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                <div className="main">
                  <Navbar onMenuToggle={toggleSidebar} />
                  <main className="content">
                    <Routes>
                      <Route path="/" element={<MaintDashboard />} />
                      <Route path="/assignments" element={<MyAssignments />} />
                      <Route path="/active-repair" element={<ActiveRepair />} />
                      <Route path="/completed" element={<CompletedJobs />} />
                      <Route path="/teams" element={<MaintTeams />} />
                      <Route path="/notifications" element={<MaintNotifications />} />
                      <Route path="/profile" element={<MaintProfile />} />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;