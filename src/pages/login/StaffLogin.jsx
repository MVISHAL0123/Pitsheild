import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Camera,
  MapPin,
  Users,
  UserCog,
  Wrench,
  Leaf,
  ShieldCheck,
  Heart,
  User,
  ShieldAlert,
} from "lucide-react";
import { api } from "../../services/api";

const logoImg = "/LOGO.png";

const roleOptions = [
  {
    id: "admin",
    icon: UserCog,
    name: "Admin",
  },
  {
    id: "maintenance",
    icon: Wrench,
    name: "Maintenance Staff",
  },
];

function StaffLogin() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("admin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await api.login(email, password, role);

      if (data.success) {
        localStorage.setItem("pitshieldLoggedIn", "true");
        localStorage.setItem("pitshieldRole", data.user.role);
        localStorage.setItem("pitshieldToken", data.token);
        localStorage.setItem(
          "pitshieldUser",
          JSON.stringify(data.user)
        );

        if (rememberMe) {
          localStorage.setItem("pitshieldRemember", "true");
        } else {
          localStorage.removeItem("pitshieldRemember");
        }

        if (data.user.role === "admin") navigate("/admin");
        else navigate("/maintenance");
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Signup (staff portal) — creates account in MongoDB with selected role
  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError("Please enter your name, email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await api.register(name, email, password, "", role);

      if (data.success) {
        // Auto login after successful signup
        localStorage.setItem("pitshieldLoggedIn", "true");
        localStorage.setItem("pitshieldRole", data.user.role);
        localStorage.setItem("pitshieldToken", data.token);
        localStorage.setItem(
          "pitshieldUser",
          JSON.stringify(data.user)
        );

        if (data.user.role === "admin") navigate("/admin");
        else navigate("/maintenance");
      } else {
        setError(data.message || "Could not create the account.");
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Demo logins
  const handleDemoLogin = (demoRole) => {
    if (demoRole === "maintenance") {
      setRole("maintenance");
      setEmail("maint@pitshield.com");
      setPassword("maint123");
    } else {
      setRole("admin");
      setEmail("admin@pitshield.com");
      setPassword("admin123");
    }
    setError("");
  };

  return (
    <div className="ul-page ul-page-staff">

      {/* ============================================
          LEFT — PHOTO BRANDING PANEL
          ============================================ */}

      <section className="ul-left">

        <div className="ul-left-inner">

          {/* LOGO ROW */}

          <div className="ul-logo-row">

            <img
              className="ul-logo-img"
              src={logoImg}
              alt="PitShield logo"
            />

            <div className="ul-logo-text">

              <h1>PitShield</h1>

              <span>ROAD • POTHOLE PROTECTION</span>

            </div>

          </div>


          {/* HERO HEADING */}

          <div className="ul-hero">

            <h2>
              <span className="ul-hero-dark">Smarter Roads.</span>
              <span className="ul-hero-green">Safer Journeys.</span>
            </h2>

            <p>
              Report potholes, manage maintenance and help us
              build safer, smoother roads for everyone.
            </p>

          </div>


          {/* FEATURE COLUMNS */}

          <div className="ul-features">

            <div className="ul-feature">

              <div className="ul-feature-icon ul-feature-blue">
                <Camera size={22} />
              </div>

              <h3>Report Easily</h3>
              <p>Capture and submit potholes in seconds.</p>

            </div>

            <div className="ul-feature">

              <div className="ul-feature-icon ul-feature-green">
                <MapPin size={22} />
              </div>

              <h3>Track Progress</h3>
              <p>Real-time status and updates.</p>

            </div>

            <div className="ul-feature">

              <div className="ul-feature-icon ul-feature-blue">
                <Users size={22} />
              </div>

              <h3>Efficient Maintenance</h3>
              <p>Manage and resolve issues faster.</p>

            </div>

          </div>

        </div>


        {/* BOTTOM BADGES */}

        <div className="ul-badges">

          <div className="ul-badge">
            <Leaf size={15} />
            <span>Cleaner Cities</span>
          </div>

          <div className="ul-badge-sep"></div>

          <div className="ul-badge">
            <ShieldCheck size={15} />
            <span>Safer Roads</span>
          </div>

          <div className="ul-badge-sep"></div>

          <div className="ul-badge">
            <Heart size={15} />
            <span>Stronger Communities</span>
          </div>

        </div>

        <div className="ul-footer ul-footer-center">
          © {new Date().getFullYear()} PitShield. All rights reserved.
        </div>

      </section>


      {/* ============================================
          RIGHT — WHITE CARD
          ============================================ */}

      <section className="ul-right">

        <div className="ul-tagline">
          <span className="ul-tagline-dash"></span>
          Together for Better Roads
        </div>


        <div className="ul-card">

          {/* CARD HEADER */}

          <div className="ul-card-header">

            <div className="ul-avatar">
              {isSignup ? <ShieldAlert size={30} /> : <ShieldCheck size={30} />}
            </div>

            <h3>
              {isSignup
                ? "Create Staff Account"
                : "Welcome to PitShield!"}
            </h3>

            <p>
              {isSignup
                ? "Register with your staff role"
                : "Login to your account to continue"}
            </p>

          </div>


          {/* FORM */}

          <form
            className="ul-form"
            onSubmit={isSignup ? handleSignup : handleLogin}
          >

            {/* ROLE SELECTION */}

            <div>

              <label className="ul-field-label">
                Select Your Role
              </label>

              <div className="ul-role-group">

                {roleOptions.map((option) => {

                  const Icon = option.icon;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`ul-role-card ${role === option.id ? "active" : ""}`}
                      onClick={() => {
                        setRole(option.id);
                        setError("");
                      }}
                    >

                      <span className="ul-role-radio"></span>

                      <Icon size={22} className="ul-role-icon" />

                      <span className="ul-role-name">
                        {option.name}
                      </span>

                    </button>
                  );
                })}

              </div>

            </div>


            {/* NAME (signup only) */}

            {isSignup && (

              <div className="ul-field">

                <User size={18} className="ul-field-icon" />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  autoComplete="name"
                  required
                />

              </div>

            )}


            {/* EMAIL */}

            <div className="ul-field">

              <Mail size={18} className="ul-field-icon" />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                autoComplete="email"
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="ul-field">

              <Lock size={18} className="ul-field-icon" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder={
                  isSignup
                    ? "Create a password (min. 6 characters)"
                    : "Enter your password"
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
              />

              <button
                type="button"
                className="ul-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>


            {/* ERROR */}

            {error && (
              <div className="ul-error">{error}</div>
            )}


            {/* OPTIONS ROW (login only) */}

            {!isSignup && (

              <div className="ul-options">

                <label className="ul-remember">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span>Remember me</span>

                </label>

                <button
                  type="button"
                  className="ul-forgot"
                  onClick={() =>
                    alert(
                      "Please contact the system administrator to reset your password."
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>

            )}


            {/* SUBMIT */}

            <button
              type="submit"
              className="ul-submit"
              disabled={isLoading}
            >

              {isLoading
                ? isSignup
                  ? "Creating account..."
                  : "Signing in..."
                : isSignup
                  ? "Create Account"
                  : "Login"}

              {!isLoading && <ArrowRight size={19} />}

            </button>

          </form>


          {/* DIVIDER + CREATE ACCOUNT */}

          <div className="ul-divider">
            <span>
              {isSignup
                ? "Already have an account?"
                : "OR"}
            </span>
          </div>

          <button
            type="button"
            className="ul-create-btn"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
          >
            {isSignup ? "Back to Login" : "Create an Account"}
          </button>


          {/* DEMO LOGINS (login only) */}

          {!isSignup && (

            <div className="ul-demo-row">

              <button
                type="button"
                className="ul-demo-link"
                onClick={() => handleDemoLogin("admin")}
              >
                Use admin demo
              </button>

              <button
                type="button"
                className="ul-demo-link"
                onClick={() => handleDemoLogin("maintenance")}
              >
                Use maintenance demo
              </button>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default StaffLogin;
