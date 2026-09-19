import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

function UserProfile() {
  const [profile, setProfile] = useState({
    name: "Citizen User",
    email: "user@pitshield.com",
    phone: "+91 98765 43210",
    area: "Chennai",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [prefs, setPrefs] = useState({
    reportUpdates: true,
    repairNotif: true,
    weeklyDigest: false,
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [saved, setSaved]             = useState(false);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setProfile({ name: "Citizen User", email: "user@pitshield.com", phone: "+91 98765 43210", area: "Chennai" });
    setPasswords({ current: "", newPass: "", confirm: "" });
    setPrefs({ reportUpdates: true, repairNotif: true, weeklyDigest: false });
  };

  return (
    <div className="user-profile-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>
        <div className="sensor-online">
          <span></span>
          Account Active
        </div>
      </div>

      {saved && (
        <div className="complaint-success" style={{ marginBottom: "20px" }}>
          <CheckCircle size={20} />
          <div>
            <strong>Profile saved successfully!</strong>
            <span>Your changes have been updated.</span>
          </div>
        </div>
      )}

      <div className="profile-page-grid">

        {/* AVATAR CARD */}
        <div className="profile-avatar-card">
          <div className="profile-avatar-big">
            <User size={48} />
          </div>
          <h3>{profile.name}</h3>
          <span>{profile.email}</span>
          <div className="profile-role-badge">
            <Shield size={13} />
            Citizen User
          </div>
          <div className="profile-stats-mini">
            <div>
              <strong>06</strong>
              <span>Reports Filed</span>
            </div>
            <div>
              <strong>02</strong>
              <span>Resolved</span>
            </div>
          </div>
        </div>

        <div className="profile-right-col">

          {/* PROFILE INFO */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-header-icon"><User size={20} /></div>
              <div>
                <h3>Personal Information</h3>
                <p>Update your account details</p>
              </div>
            </div>

            <div className="settings-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={profile.name} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Mail size={16} style={{ position: "absolute", left: "13px", color: "#94a3b8" }} />
                  <input type="email" name="email" value={profile.email} onChange={handleProfileChange}
                    style={{ paddingLeft: "38px" }} />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Phone size={16} style={{ position: "absolute", left: "13px", color: "#94a3b8" }} />
                  <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange}
                    style={{ paddingLeft: "38px" }} />
                </div>
              </div>
              <div className="form-group">
                <label>Area / Locality</label>
                <input type="text" name="area" value={profile.area} onChange={handleProfileChange} />
              </div>
            </div>
          </div>

          {/* CHANGE PASSWORD */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-header-icon"><Lock size={20} /></div>
              <div>
                <h3>Change Password</h3>
                <p>Update your login password</p>
              </div>
            </div>
            <div className="settings-form">
              <div className="form-group">
                <label>Current Password</label>
                <div className="pass-input-wrap">
                  <input type={showCurrent ? "text" : "password"} name="current" value={passwords.current}
                    onChange={handlePasswordChange} placeholder="Enter current password" />
                  <button type="button" className="password-toggle pass-toggle-btn"
                    onClick={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>New Password</label>
                <div className="pass-input-wrap">
                  <input type={showNew ? "text" : "password"} name="newPass" value={passwords.newPass}
                    onChange={handlePasswordChange} placeholder="Enter new password" />
                  <button type="button" className="password-toggle pass-toggle-btn"
                    onClick={() => setShowNew(!showNew)}>
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" name="confirm" value={passwords.confirm}
                  onChange={handlePasswordChange} placeholder="Confirm new password" />
              </div>
            </div>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-header-icon"><Bell size={20} /></div>
              <div>
                <h3>Notification Preferences</h3>
                <p>Choose what alerts you receive</p>
              </div>
            </div>

            {[
              { key: "reportUpdates", label: "Report Status Updates",  desc: "Get notified when your report status changes" },
              { key: "repairNotif",   label: "Repair Notifications",   desc: "Get notified when repair work starts or completes" },
              { key: "weeklyDigest",  label: "Weekly Digest",          desc: "Receive a weekly summary of road conditions in your area" },
            ].map(({ key, label, desc }) => (
              <div className="settings-option" key={key}>
                <div className="settings-option-info">
                  <strong>{label}</strong>
                  <span>{desc}</span>
                </div>
                <button
                  className={`toggle ${prefs[key] ? "active" : ""}`}
                  onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })}
                >
                  <span></span>
                </button>
              </div>
            ))}
          </div>

          {/* SAVE / RESET */}
          <div className="settings-actions">
            <button className="reset-settings-btn" onClick={handleReset}>
              <RotateCcw size={17} /> Reset
            </button>
            <button className="save-settings-btn" onClick={handleSave}>
              <Save size={17} /> Save Changes
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default UserProfile;
