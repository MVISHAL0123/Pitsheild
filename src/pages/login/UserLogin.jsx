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
  User,
  Phone,
  ShieldCheck,
  Leaf,
  Heart,
} from "lucide-react";import { api } from "../../services/api";

const logoImg = "/LOGO.png";

function UserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
      const data = await api.login(email, password, "user");

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

        navigate("/user");
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

  // Signup (creates account in MongoDB via backend)
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
      const data = await api.register(name, email, password, phone);

      if (data.success) {
        // Auto login after successful signup
        localStorage.setItem("pitshieldLoggedIn", "true");
        localStorage.setItem("pitshieldRole", data.user.role);
        localStorage.setItem("pitshieldToken", data.token);
        localStorage.setItem(
          "pitshieldUser",
          JSON.stringify(data.user)
        );

        navigate("/user");
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

  // Demo login
  const handleDemoLogin = () => {
    setEmail("user@pitshield.com");
    setPassword("user123");
    setError("");
  };

  return (
    <div className="ul-page">

      {/* ============================================
          LEFT — PHOTO BRANDING PANEL
          ============================================ */}

      <section className="ul-left">

        <div className="ul-left-overlay"></div>

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
              Report potholes, track progress and help us
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

              <h3>GPS Tracking</h3>
              <p>Automatic location detection.</p>

            </div>

            <div className="ul-feature">

              <div className="ul-feature-icon ul-feature-blue">
                <Users size={22} />
              </div>

              <h3>Safer Communities</h3>
              <p>Together we make a difference.</p>

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

      </section>


      {/* ============================================
          RIGHT — WHITE LOGIN CARD
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
              <User size={30} />
            </div>

            <h3>{isSignup ? "Create Account" : "User Login"}</h3>
            <p>
              {isSignup
                ? "Join PitShield. It only takes a minute."
                : "Report potholes. Make roads safer."}
            </p>

          </div>


          {/* FORM */}

          <form
            className="ul-form"
            onSubmit={isSignup ? handleSignup : handleLogin}
          >

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


            {/* PHONE (signup only) */}

            {isSignup && (
              <div className="ul-field">
                <Phone size={18} className="ul-field-icon" />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError("");
                  }}
                />
              </div>
            )}

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
                    "Please contact the administrator to reset your password."
                  )
                }
              >
                Forgot password?
              </button>

            </div>
            )}


            {/* SIGN IN */}

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
                  : "Sign In"}

              <ArrowRight size={19} />

            </button>

          </form>


          {/* DIVIDER + CREATE ACCOUNT */}

          <div className="ul-divider">
            <span>
              {isSignup ? "Already have an account?" : "New to PitShield?"}
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
            {isSignup ? "Back to Sign In" : "Create an Account"}
          </button>


          {!isSignup && (
          <>
          {/* SECURE INFO BOX */}

          <div className="ul-info-box">

            <ShieldCheck size={20} className="ul-info-icon" />

            <div>

              <strong>Together for safer roads</strong>
              <p>Your reports help build safer communities</p>

            </div>

          </div>


          {/* DEMO LOGIN (subtle) */}

          <button
            type="button"
            className="ul-demo-link"
            onClick={handleDemoLogin}
          >
            Use demo account (user@pitshield.com)
          </button>
          </>
          )}

        </div>


        {/* CARD FOOTER */}

        <div className="ul-footer">
          © {new Date().getFullYear()} PitShield. All rights reserved.
        </div>

      </section>

    </div>
  );
}

export default UserLogin;
