import React from 'react';

function StatsCard({ title, value, icon: Icon, trend, trendLabel, color = 'primary' }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <span className="stat-label">{title}</span>
        {Icon && (
          <div className={`stat-icon-wrapper icon-${color}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="stat-card-body">
        <span className="stat-val">{value}</span>
        {trend !== undefined && (
          <div className="stat-trend">
            <span className={`trend-badge trend-${trend >= 0 ? 'up' : 'down'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
            <span className="trend-label">{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
