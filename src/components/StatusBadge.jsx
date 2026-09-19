
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Wrench,
  Circle,
} from "lucide-react";

function StatusBadge({ status, type = "status" }) {
  const value = String(status || "Unknown").toLowerCase();

  let className = "status-badge unknown";
  let Icon = Circle;

  if (type === "severity") {
    if (value === "high" || value === "critical") {
      className = "status-badge severity-high";
      Icon = AlertTriangle;
    } else if (value === "medium") {
      className = "status-badge severity-medium";
      Icon = AlertTriangle;
    } else if (value === "low") {
      className = "status-badge severity-low";
      Icon = CheckCircle;
    }
  } else {
    if (value === "detected") {
      className = "status-badge status-detected";
      Icon = AlertTriangle;
    } else if (value === "pending") {
      className = "status-badge status-pending";
      Icon = Clock;
    } else if (
      value === "repairing" ||
      value === "in progress"
    ) {
      className = "status-badge status-repairing";
      Icon = Wrench;
    } else if (
      value === "repaired" ||
      value === "completed"
    ) {
      className = "status-badge status-repaired";
      Icon = CheckCircle;
    }
  }

  return (
    <span className={className}>
      <Icon size={14} />
      <span>{status || "Unknown"}</span>
    </span>
  );
}

export default StatusBadge;
