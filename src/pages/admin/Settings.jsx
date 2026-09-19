import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Wifi,
  MapPin,
  Save,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

function Settings() {
  const [settings, setSettings] = useState({
    name: "PitShield Admin",
    email: "admin@pitshield.com",
    notifications: true,
    sensorInterval: "10",
    gpsTracking: true,
    autoRepair: false,
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSettings = () => {
    alert("Settings saved successfully!");
  };

  const resetSettings = () => {
    setSettings({
      name: "PitShield Admin",
      email: "admin@pitshield.com",
      notifications: true,
      sensorInterval: "10",
      gpsTracking: true,
      autoRepair: false,
    });
  };

  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>
            Manage your PitShield system configuration
          </p>
        </div>

        <div className="sensor-online">
          <span></span>
          System Online
        </div>
      </div>


      {/* PROFILE */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-header-icon">
            <User size={20} />
          </div>

          <div>
            <h3>Profile Settings</h3>
            <p>Manage your account information</p>
          </div>
        </div>

        <div className="settings-form">

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              value={settings.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
            />
          </div>

        </div>

      </div>


      {/* SENSOR SETTINGS */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-header-icon">
            <Wifi size={20} />
          </div>

          <div>
            <h3>Sensor Configuration</h3>
            <p>Configure ultrasonic sensor monitoring</p>
          </div>

        </div>


        <div className="settings-option">

          <div className="settings-option-info">

            <strong>
              Sensor Update Rate
            </strong>

            <span>
              Frequency of ultrasonic sensor readings
            </span>

          </div>

          <select
            value={settings.sensorInterval}
            onChange={(e) =>
              handleChange(
                "sensorInterval",
                e.target.value
              )
            }
          >
            <option value="5">5 Hz</option>
            <option value="10">10 Hz</option>
            <option value="20">20 Hz</option>
          </select>

        </div>

      </div>


      {/* GPS SETTINGS */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-header-icon">
            <MapPin size={20} />
          </div>

          <div>
            <h3>GPS Configuration</h3>
            <p>Manage location tracking</p>
          </div>

        </div>


        <div className="settings-option">

          <div className="settings-option-info">

            <strong>
              GPS Tracking
            </strong>

            <span>
              Record GPS coordinates for detected potholes
            </span>

          </div>

          <button
            className={`toggle ${
              settings.gpsTracking ? "active" : ""
            }`}
            onClick={() =>
              handleChange(
                "gpsTracking",
                !settings.gpsTracking
              )
            }
          >
            <span></span>
          </button>

        </div>

      </div>


      {/* NOTIFICATIONS */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-header-icon">
            <Bell size={20} />
          </div>

          <div>
            <h3>Notifications</h3>
            <p>Configure system alerts</p>
          </div>

        </div>


        <div className="settings-option">

          <div className="settings-option-info">

            <strong>
              Pothole Detection Alerts
            </strong>

            <span>
              Receive notifications when potholes are detected
            </span>

          </div>

          <button
            className={`toggle ${
              settings.notifications ? "active" : ""
            }`}
            onClick={() =>
              handleChange(
                "notifications",
                !settings.notifications
              )
            }
          >
            <span></span>
          </button>

        </div>

      </div>


      {/* REPAIR SETTINGS */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-header-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h3>Repair Configuration</h3>
            <p>Manage automatic repair operations</p>
          </div>

        </div>


        <div className="settings-option">

          <div className="settings-option-info">

            <strong>
              Automatic Repair
            </strong>

            <span>
              Automatically begin repair after pothole detection
            </span>

          </div>

          <button
            className={`toggle ${
              settings.autoRepair ? "active" : ""
            }`}
            onClick={() =>
              handleChange(
                "autoRepair",
                !settings.autoRepair
              )
            }
          >
            <span></span>
          </button>

        </div>

      </div>


      {/* ACTIONS */}

      <div className="settings-actions">

        <button
          className="reset-settings-btn"
          onClick={resetSettings}
        >
          <RotateCcw size={17} />
          Reset
        </button>

        <button
          className="save-settings-btn"
          onClick={saveSettings}
        >
          <Save size={17} />
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default Settings;