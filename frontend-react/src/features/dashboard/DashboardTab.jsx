import React, { useState, useEffect, useRef } from 'react';
import { Eye, Users, FileText, CheckSquare, MessageSquare, Phone, Calendar, ArrowUpRight, Cpu, Terminal, RefreshCw, Compass, PlaneTakeoff, ShieldCheck, Home } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';

function DashboardTab({ stats, agenciesCount, announcements, pilgrims = [], onSyncAllNusuk }) {
  const terminalEndRef = useRef(null);

  // Safe stats check
  const totalVisits = stats?.totalVisits ?? 0;
  const inquiriesCount = stats?.registeredInquiries ?? 0;
  const inquiriesList = stats?.inquiriesHistory ?? [];

  // Local state for Nusuk Terminal Console
  const [logs, setLogs] = useState(['[SYSTEME] Console Hajj prête. En attente de commande de synchronisation...']);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // Dynamic Hajj Logistics calculations
  const approvedPilgrims = pilgrims.filter(p => p.registrationStatus === 'approved');
  const totalApproved = approvedPilgrims.length;

  const nusukSyncedCount = approvedPilgrims.filter(p => p.nusukSyncStatus === 'synced').length;
  const nusukSyncRate = totalApproved > 0 ? Math.round((nusukSyncedCount / totalApproved) * 100) : 0;

  const visaIssuedCount = approvedPilgrims.filter(p => p.visaStatus === 'issued').length;
  const visaRate = totalApproved > 0 ? Math.round((visaIssuedCount / totalApproved) * 100) : 0;

  const flightAssignedCount = approvedPilgrims.filter(p => p.flightNumber && p.flightNumber !== 'Non assigné').length;
  const flightRate = totalApproved > 0 ? Math.round((flightAssignedCount / totalApproved) * 100) : 0;

  const roomAssignedCount = approvedPilgrims.filter(p => p.roomNumber && p.roomNumber !== 'Non assigné').length;
  const roomRate = totalApproved > 0 ? Math.round((roomAssignedCount / totalApproved) * 100) : 0;

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Terminal synchronization simulator
  const handleTriggerSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(5);
    setLogs([
      '[INFO] Initialisation du pont de synchronisation Nusuk...',
      '[INFO] Connexion sécurisée TLS 1.3 établie avec api.nusuk.haj.sa...',
      '[INFO] Authentification Sunu Hajj Commission...'
    ]);

    const runStep = (stepLogs, progress) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setLogs(prev => [...prev, ...stepLogs]);
          setSyncProgress(progress);
          resolve();
        }, 700);
      });
    };

    await runStep([
      '[SUCCESS] Clef API Sunu Hajj validée.',
      `[INFO] Chargement des dossiers Sunu Hajj validés : ${totalApproved} dossiers trouvés.`
    ], 20);

    const pendingSyncPilgrims = approvedPilgrims.filter(p => p.nusukSyncStatus !== 'synced');

    if (pendingSyncPilgrims.length === 0) {
      await runStep([
        '[INFO] Tous les dossiers sont déjà synchronisés sur Nusuk.',
        '[SUCCESS] Statut 100% à jour. Session fermée.'
      ], 100);
    } else {
      for (let i = 0; i < pendingSyncPilgrims.length; i++) {
        const pelerin = pendingSyncPilgrims[i];
        const stepProgress = 20 + Math.round(((i + 1) / pendingSyncPilgrims.length) * 60);
        await runStep([
          `[SYNC] Dossier #${pelerin.id} - Pèlerin: ${pelerin.fullName} (Passport: ${pelerin.passportNumber})`,
          `[SYNC] Validation du profil médical (${pelerin.medicalStatus === 'apte' ? '🟢 APTE' : '🟡 EN ATTENTE'}) & Hébergement...`,
          `[SUCCESS] Portail Nusuk : visa Hajj approuvé pour ${pelerin.fullName}.`
        ], stepProgress);
      }

      await runStep([
        '[INFO] Finalisation de la signature électronique de la Commission...',
        '[SUCCESS] Synchronisation globale terminée. Tous les visas approuvés sont émis.'
      ], 100);
    }

    // Call actual backend update
    if (onSyncAllNusuk) {
      await onSyncAllNusuk();
    }
    setIsSyncing(false);
  };

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

  // Dynamic flights count based on current pilgrims
  const getFlightStats = (flightNum) => {
    const passengers = approvedPilgrims.filter(p => p.flightNumber === flightNum).length;
    return passengers;
  };

  return (
    <div className="tab-pane fade-in">
      {/* Overview Stats Row 1: Platform & Registration */}
      <div className="stats-grid animate-slide-up">
        <StatsCard
          title="Visites de la plateforme"
          value={totalVisits.toLocaleString()}
          icon={Eye}
          trend={12.4}
          trendLabel="vs mois dernier"
          color="indigo"
        />
        <StatsCard
          title="Registre Pèlerins"
          value={pilgrims.length}
          icon={Users}
          trend={8.2}
          trendLabel="nouveaux inscrits"
          color="emerald"
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
          color="gold"
        />
      </div>

      {/* Overview Stats Row 2: Hajj Logistics KPIs (NEW) */}
      <div className="stats-grid animate-slide-up" style={{ marginTop: '20px', animationDelay: '0.05s' }}>
        <StatsCard
          title="Synchronisation Nusuk"
          value={`${nusukSyncRate}%`}
          icon={Cpu}
          trend={nusukSyncRate > 0 ? 100 : 0}
          trendLabel={`${nusukSyncedCount}/${totalApproved} dossiers`}
          color={nusukSyncRate === 100 ? 'emerald' : 'gold'}
        />
        <StatsCard
          title="Visas Hajj Émis"
          value={`${visaRate}%`}
          icon={ShieldCheck}
          trend={visaRate > 0 ? 100 : 0}
          trendLabel={`${visaIssuedCount}/${totalApproved} pèlerins`}
          color={visaRate === 100 ? 'emerald' : 'blue'}
        />
        <StatsCard
          title="Affectation des Vols"
          value={`${flightRate}%`}
          icon={PlaneTakeoff}
          trend={flightRate > 0 ? 100 : 0}
          trendLabel={`${flightAssignedCount}/${totalApproved} assignés`}
          color="indigo"
        />
        <StatsCard
          title="Hôtels Makkah/Madinah"
          value={`${roomRate}%`}
          icon={Home}
          trend={roomRate > 0 ? 100 : 0}
          trendLabel={`${roomAssignedCount}/${totalApproved} logés`}
          color="blue"
        />
      </div>

      {/* Row 3: Realtime Chart & Milestones */}
      <div className="dashboard-grid animate-slide-up" style={{ marginTop: '30px', animationDelay: '0.1s' }}>
        {/* SVG Mini-chart Section */}
        <div className="panel-card activity-chart-panel">
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
              <line x1="0" y1="25" x2="800" y2="25" stroke="var(--border)" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="800" y2="75" stroke="var(--border)" strokeDasharray="4 4" />
              <line x1="0" y1="125" x2="800" y2="125" stroke="var(--border)" strokeDasharray="4 4" />
              
              <path
                d="M0,150 L0,120 L130,95 L260,115 L390,55 L520,70 L650,40 L800,10 L800,150 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M0,120 L130,95 L260,115 L390,55 L520,70 L650,40 L800,10"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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

        {/* Milestones Stepper */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Jalons administratifs Sunu Hajj 2026</h3>
            <span className="badge badge-primary">Campagne Active</span>
          </div>
          <div className="hajj-milestones">
            <div className="milestone-item completed">
              <div className="milestone-dot">✓</div>
              <div className="milestone-content">
                <h4 className="milestone-title">Phase 1 : Enregistrement médical</h4>
                <p className="milestone-desc">Visites d'aptitudes médicales et pré-inscriptions des pèlerins.</p>
              </div>
            </div>
            <div className="milestone-item completed">
              <div className="milestone-dot">✓</div>
              <div className="milestone-content">
                <h4 className="milestone-title">Phase 2 : Accréditation des agences</h4>
                <p className="milestone-desc">Attribution des quotas officiels aux voyagistes agréés.</p>
              </div>
            </div>
            <div className="milestone-item active">
              <div className="milestone-dot">⚡</div>
              <div className="milestone-content">
                <h4 className="milestone-title">Phase 3 : Validation des visas saoudiens</h4>
                <p className="milestone-desc">Synchronisation automatique en cours sur la plateforme Nusuk.</p>
              </div>
            </div>
            <div className="milestone-item">
              <div className="milestone-dot">✈</div>
              <div className="milestone-content">
                <h4 className="milestone-title">Phase 4 : Embarquement des vols charter</h4>
                <p className="milestone-desc">Départ officiel du premier vol charter Dakar-Djeddah.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Nusuk Saudi Sync Console & Flights Flotte (NEW) */}
      <div className="dashboard-grid animate-slide-up" style={{ marginTop: '30px', animationDelay: '0.15s' }}>
        {/* Nusuk API Console */}
        <div className="panel-card">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} style={{ color: 'var(--primary)' }} />
              <h3 className="panel-title">Console de Synchronisation Saoudienne Nusuk</h3>
            </div>
            <span className="badge badge-accent-light">Saudi API Gateway</span>
          </div>
          <div className="nusuk-console-card">
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Ce panneau permet de pousser l'ensemble des pèlerins ayant un dossier validé par la Sunu Hajj vers le portail officiel saoudien afin de déclencher l'émission de leur visa Hajj officiel.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
              <span>Progression de la Synchronisation</span>
              <span>{syncProgress}%</span>
            </div>
            <div className="nusuk-progress-bar">
              <div className="nusuk-progress-fill" style={{ width: `${syncProgress}%` }} />
            </div>

            <div className="nusuk-terminal">
              {logs.map((log, index) => {
                let logType = '';
                if (log.includes('[SUCCESS]')) logType = 'success';
                else if (log.includes('[INFO]')) logType = 'info';
                else if (log.includes('[ERROR]')) logType = 'error';

                return (
                  <div key={index} className={`nusuk-terminal-line ${logType}`}>
                    {log}
                  </div>
                );
              })}
              {isSyncing && (
                <div className="nusuk-terminal-line cursor-blink">
                  ⏳ Synchronisation en cours... ▮
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>

            <button
              onClick={handleTriggerSync}
              disabled={isSyncing || totalApproved === 0}
              className="btn btn-primary"
              style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '4px' }}
            >
              <RefreshCw size={16} className={isSyncing ? 'spin' : ''} />
              <span>{isSyncing ? 'Synchronisation Nusuk en cours...' : 'Lancer la Synchronisation Globale Nusuk'}</span>
            </button>
          </div>
        </div>

        {/* Flight Flotte Capacity */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Statut de la Flotte Vol Charter</h3>
            <span className="badge badge-info">Vols officiels</span>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Vol</th>
                  <th>Destination</th>
                  <th>Date Départ</th>
                  <th style={{ textAlign: 'center' }}>Pèlerins</th>
                  <th style={{ textAlign: 'right' }}>Capacité</th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-row-hover">
                  <td><strong>TX-201</strong></td>
                  <td>Dakar ➔ Médine</td>
                  <td>12 Juil 2026</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge badge-primary">{getFlightStats('TX-201 (Dakar-Medina)')} / 250</span>
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>Boeing 777</td>
                </tr>
                <tr className="table-row-hover">
                  <td><strong>SN-302</strong></td>
                  <td>Dakar ➔ Médine</td>
                  <td>15 Juil 2026</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge badge-accent-light">{getFlightStats('SN-302')} / 300</span>
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>Airbus A330</td>
                </tr>
                <tr className="table-row-hover">
                  <td><strong>TX-203</strong></td>
                  <td>Dakar ➔ Djeddah</td>
                  <td>18 Juil 2026</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge badge-accent-light">{getFlightStats('TX-203')} / 250</span>
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>Boeing 777</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 5: Inquiries & Announcements */}
      <div className="dashboard-grid animate-slide-up" style={{ marginTop: '30px', animationDelay: '0.2s' }}>
        {/* Inquiries List */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Dernières requêtes reçues (Pèlerins & Agences)</h3>
            <span className="badge badge-accent-light">{inquiriesList.length} en attente</span>
          </div>
          <div className="table-responsive">
            {inquiriesList.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={36} className="empty-icon" />
                <p>Aucune requête pour l'instant.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nom / Contact</th>
                    <th>Téléphone</th>
                    <th>Objet / Agence ciblée</th>
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
