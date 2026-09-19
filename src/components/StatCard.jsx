import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

const iconMap = {
  activity: Activity,
  alert: AlertTriangle,
  success: CheckCircle,
  clock: Clock,
  trend: TrendingUp,
};

function StatCard({
  title,
  value,
  description,
  icon = "activity",
  trend,
}) {
  const Icon = iconMap[icon] || Activity;

  return (
    <div className="stat-card">

      <div className="stat-card-top">

        <div className="stat-content">

          <span className="stat-title">
            {title}
          </span>

          <strong className="stat-value">
            {value}
          </strong>

          {description && (
            <span className="stat-description">
              {description}
            </span>
          )}

          {trend && (
            <span className="stat-trend">
              <TrendingUp size={13} />
              {trend}
            </span>
          )}

        </div>

        <div className="stat-icon">
          <Icon size={22} />
        </div>

      </div>

    </div>
  );
}

export default StatCard;