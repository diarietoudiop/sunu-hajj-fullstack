import React from 'react';
import { Eye, Users, FileText, CheckSquare, MessageSquare, Phone, Calendar, ArrowUpRight } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';

function DashboardTab({ stats, agenciesCount, announcements }) {
  // Safe stats check
  const totalVisits = stats?.totalVisits ?? 0;
  const activePilgrims = stats?.activePilgrims ?? 0;
  const inquiriesCount = stats?.registeredInquiries ?? 0;
  const inquiriesList = stats?.inquiriesHistory ?? [];

  // Helper to get relative time or formatted date
  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="tab-pane fade-in">
      {/* Overview Stats */}
      <div className="stats-grid animate-slide-up">
        <StatsCard
          title="Visites de la plateforme"
          value={totalVisits.toLocaleString()}
          icon={Eye}
          trend={12.4}
          trendLabel="vs mois dernier"
          color="emerald"
        />
        <StatsCard
          title="Pèlerins Actifs"
          value={activePilgrims.toLocaleString()}
          icon={Users}
          trend={8.2}
          trendLabel="vs semaine dernière"
          color="gold"
        />
        <StatsCard
          title="Demandes reçues"
          value={inquiriesCount}
          icon={FileText}
          trend={25.0}
          trendLabel="nouveaux contacts"
          color="blue"
        />
        <StatsCard
          title="Agences Agréées"
          value={agenciesCount}
          icon={CheckSquare}
          color="indigo"
        />
      </div>

      {/* SVG Mini-chart Section */}
      <div className="panel-card activity-chart-panel animate-slide-up" style={{ marginBottom: '30px', animationDelay: '0.1s' }}>
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Activité en temps réel</h3>
            <span className="panel-subtitle">Volume des visites journalières sur les 7 derniers jours</span>
          </div>
          <span className="chart-stat-percentage">
            <ArrowUpRight size={16} /> +14.2% d'audience
          </span>
        </div>
        <div className="chart-container">
          <svg className="activity-chart" viewBox="0 0 800 150">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            <line x1="0" y1="25" x2="800" y2="25" stroke="var(--border)" strokeDasharray="4 4" />
            <line x1="0" y1="75" x2="800" y2="75" stroke="var(--border)" strokeDasharray="4 4" />
            <line x1="0" y1="125" x2="800" y2="125" stroke="var(--border)" strokeDasharray="4 4" />
            
            {/* Area Path */}
            <path
              d="M0,150 L0,120 L130,95 L260,115 L390,55 L520,70 L650,40 L800,10 L800,150 Z"
              fill="url(#chartGrad)"
            />
            {/* Line Path */}
            <path
              d="M0,120 L130,95 L260,115 L390,55 L520,70 L650,40 L800,10"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Data points */}
            <circle cx="130" cy="95" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
            <circle cx="260" cy="115" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
            <circle cx="390" cy="55" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
            <circle cx="520" cy="70" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
            <circle cx="650" cy="40" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
            <circle cx="800" cy="10" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
          </svg>
          <div className="chart-labels">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
            <span>Sam</span>
            <span>Dim</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {/* Inquiries List */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Dernières demandes reçues des pèlerins</h3>
            <span className="badge badge-accent-light">{inquiriesList.length} en attente</span>
          </div>
          <div className="table-responsive">
            {inquiriesList.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={36} className="empty-icon" />
                <p>Aucune demande de pèlerin pour l'instant.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Pèlerin</th>
                    <th>Téléphone</th>
                    <th>Agence Ciblée</th>
                    <th>Heure</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiriesList.map((inq) => (
                    <tr key={inq.id} className="table-row-hover">
                      <td>
                        <div className="pelerin-identity">
                          <span className="pelerin-name">{inq.clientName}</span>
                        </div>
                      </td>
                      <td>
                        <span className="pelerin-phone">{inq.clientPhone}</span>
                      </td>
                      <td>
                        <span className="badge badge-info">{inq.agencyName}</span>
                      </td>
                      <td>
                        <span className="pelerin-time">{formatTime(inq.timestamp)}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons">
                          <a
                            href={`tel:${inq.clientPhone}`}
                            className="action-btn btn-phone"
                            title="Appeler le pèlerin"
                          >
                            <Phone size={14} />
                          </a>
                          <a
                            href={`https://wa.me/${inq.clientPhone.replace(/\s+/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn btn-whatsapp"
                            title="Contacter sur WhatsApp"
                          >
                            💬
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Announcements Status */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Derniers communiqués diffusés</h3>
            <span className="badge badge-accent-light">{announcements.length} publiés</span>
          </div>
          <div className="announcements-timeline">
            {announcements.length === 0 ? (
              <div className="empty-state">
                <Calendar size={36} className="empty-icon" />
                <p>Aucun communiqué officiel publié.</p>
              </div>
            ) : (
              <ul className="timeline-list">
                {announcements.slice(0, 3).map((ann) => (
                  <li key={ann.id} className="timeline-item">
                    <div className="timeline-badge-wrapper">
                      <span className={`timeline-badge-dot badge-dot-${ann.category || 'admin'}`} />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-meta">
                        <span className={`category-tag tag-${ann.category || 'admin'}`}>
                          {ann.category === 'security' ? 'Alerte' : ann.category === 'health' ? 'Santé' : 'Admin'}
                        </span>
                        <span className="timeline-date">{ann.date}</span>
                      </div>
                      <h4 className="timeline-title">{ann.title_fr}</h4>
                      <p className="timeline-desc">{ann.desc_fr.substring(0, 120)}...</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
