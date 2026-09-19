import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  ArrowRight,
  Radar,
  MapPin,
  Activity,
} from "lucide-react";
import bgImage from "../../assets/pitshield-bg.jpg";
const logoImg = "/LOGO.png";

function PortalSelect() {
  const navigate = useNavigate();

  const portals = [
    {
      id: "user",
      title: "Citizen Portal",
      subtitle: "Report & Track Potholes",
      description:
        "Report road hazards, track repair progress, and help make your community safer.",
      icon: User,
      path: "/login/user",
      gradient: "portal-card-user",
      features: ["Report potholes", "Track repairs", "View live map"],
    },
    {
      id: "staff",
      title: "Staff Portal",
      subtitle: "Admin & Maintenance",
      description:
        "Access the command center for analytics, or the maintenance hub for field operations.",
      icon: ShieldCheck,
      path: "/login/staff",
      gradient: "portal-card-admin",
      features: ["Dashboard analytics", "Manage teams", "Update repairs"],
    },
  ];

  return (
    <div 
      className="portal-select-page"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="login-overlay"></div>

      {/* Header */}
      <header className="portal-header">
        <div className="portal-logo">
          <div className="portal-logo-icon" style={{ background: 'white', overflow: 'hidden' }}>
            <img src={logoImg} alt="PitShield Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <span className="portal-logo-name">PitShield</span>
            <span className="portal-logo-tag">Smart Pothole Detection</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="portal-main">
        <div className="portal-title-section">
          <div className="portal-badge">
            <Activity size={14} />
            <span>CHOOSE YOUR PORTAL</span>
          </div>
          <h1 className="portal-title">
            Welcome to <span>PitShield</span>
          </h1>
          <p className="portal-subtitle">
            Select your role to access the appropriate dashboard and tools.
          </p>
        </div>

        <div className="portal-cards">
          {portals.map((portal) => (
            <button
              key={portal.id}
              className={`portal-card ${portal.gradient}`}
              onClick={() => navigate(portal.path)}
              type="button"
            >
              <div className="portal-card-glow" />

              <div className="portal-card-icon">
                <portal.icon size={32} />
              </div>

              <h2 className="portal-card-title">{portal.title}</h2>
              <p className="portal-card-subtitle">{portal.subtitle}</p>
              <p className="portal-card-description">{portal.description}</p>

              <ul className="portal-card-features">
                {portal.features.map((f, i) => (
                  <li key={i}>
                    <Radar size={12} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="portal-card-cta">
                <span>Continue</span>
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="portal-footer">
        <div className="portal-footer-left">
          <MapPin size={14} />
          <span>Safer Roads. Brighter Tomorrow.</span>
        </div>
        <span>© 2026 PitShield. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default PortalSelect;
