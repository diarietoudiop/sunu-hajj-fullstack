import React, { useState, useEffect } from 'react';
import { ApiService, sendRealSms, sendRealEmail } from '../../services/api';
import StatsCard from '../../components/common/StatsCard';
import { 
  LayoutDashboard, Users, UserPlus, Building2, LogOut, Sun, Moon, 
  Search, Mail, Phone, MapPin, Activity, FileText, CheckCircle, Clock, XCircle, CreditCard, Heart, Calendar, Award, Star
} from 'lucide-react';

function AgencyPortal({ agency = {}, isApiOnline, darkMode, setDarkMode, onLogout, agencies = [] }) {
  const safeAgency = agency || {};
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pilgrims, setPilgrims] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    capacity: 250,
    revenue: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    medicalApte: 0
  });

  // Pilgrim registration form state
  const [passport, setPassport] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  // Password modification states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(safeAgency.mustChangePassword !== false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassError('');
    if (!newPassword || newPassword.length < 6) {
      setPassError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("Les mots de passe ne correspondent pas.");
      return;
    }

    const res = await ApiService.updateAgencyPassword(agency.agencyId || agency.id, newPassword);
    if (res && res.success) {
      setPassSuccess(true);
      setMustChangePassword(false);
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassSuccess(false);
        setNewPassword('');
        setConfirmPassword('');
      }, 1800);
    } else {
      setPassError("Erreur lors de la mise à jour du mot de passe.");
    }
  };

  // Find detailed agency info from the agencies list safely
  const agencyNameStr = safeAgency.fullName || safeAgency.name || "Voyages Teranga Hajj & Omra";
  const matchedAgency = (agencies || []).find(a => a && (a.id === safeAgency.agencyId || a.id === safeAgency.id || a.name === agencyNameStr));
  
  const fullAgencyDetails = {
    id: matchedAgency?.id || safeAgency.agencyId || safeAgency.id || 1,
    name: matchedAgency?.name || agencyNameStr,
    price: matchedAgency?.price || safeAgency.price || 3600000,
    type: matchedAgency?.type || safeAgency.type || "economique",
    address: matchedAgency?.address || safeAgency.address || "Dakar, Sénégal",
    phone: matchedAgency?.phone || safeAgency.phone || "+221 33 824 12 34",
    email: matchedAgency?.email || safeAgency.email || "contact@terangahajj.sn",
    rating: matchedAgency?.rating || 4.5,
    features: matchedAgency?.features || safeAgency.features || [],
    status: matchedAgency?.status || safeAgency.status || 'approved',
    isApproved: matchedAgency?.isApproved ?? safeAgency.isApproved ?? true
  };

  const getFeaturesList = () => {
    if (!fullAgencyDetails.features) return [];
    if (Array.isArray(fullAgencyDetails.features)) return fullAgencyDetails.features;
    try {
      return JSON.parse(fullAgencyDetails.features);
    } catch (e) {
      return [];
    }
  };

  const loadAgencyData = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAgencyPilgrims(agency.agencyId);
      setPilgrims(data);
      
      // Calculate Stats
      const total = data.length;
      const capacity = fullAgencyDetails.type === 'vip' ? 250 : fullAgencyDetails.type === 'standard' ? 300 : 250;
      const revenue = total * fullAgencyDetails.price;
      const approved = data.filter(p => p.registrationStatus === 'approved').length;
      const pending = data.filter(p => p.registrationStatus === 'pending').length;
      const rejected = data.filter(p => p.registrationStatus === 'rejected').length;
      const medicalApte = data.filter(p => p.medicalStatus === 'apte').length;

      setStats({
        total,
        capacity,
        revenue,
        approved,
        pending,
        rejected,
        medicalApte
      });
    } catch (err) {
      console.error("Failed to load agency pilgrims:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgencyData();
  }, [agency.agencyId, agencies]);

  const handleRegisterPilgrim = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const rawPassport = (passport || '').trim().toUpperCase();
    const rawFullName = (fullName || '').trim();

    if (!rawPassport || !rawFullName) {
      setFormError("Veuillez remplir au moins le N° de Passeport et le Nom Complet du pèlerin.");
      return;
    }

    let passportNum = rawPassport;
    if (!passportNum.startsWith('SN')) {
      passportNum = 'SN' + passportNum.replace(/[^A-Z0-9]/g, '');
    }

    try {
      const newPilgrimData = {
        passportNumber: passportNum,
        fullName: rawFullName,
        phone: (phone || '').trim() || "+221 77 000 00 00",
        email: (email || '').trim() || `${rawFullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        birthDate: birthDate || "1970-01-01",
        bloodType: bloodType || "O+",
        bloodGroup: bloodType || "O+",
        selectedAgencyId: agency.agencyId,
        registrationStatus: 'approved',
        medicalStatus: 'pending',
        emergencyContact: {
          name: (emergencyContactName || '').trim() || "Proche à contacter",
          phone: (emergencyContactPhone || '').trim() || "+221 77 000 00 00"
        }
      };

      const res = await ApiService.registerPilgrim(newPilgrimData);
      const createdPilgrim = res?.data || res || newPilgrimData;

      setFormSuccess(`Le pèlerin ${rawFullName} (Passeport ${passportNum}) a été inscrit avec succès au registre de votre agence !`);
      
      // Instantly prepend to agency pilgrims list
      setPilgrims(prev => [createdPilgrim, ...prev]);

      // Reset fields
      setPassport('');
      setFullName('');
      setPhone('');
      setEmail('');
      setBirthDate('');
      setBloodType('O+');
      setEmergencyContactName('');
      setEmergencyContactPhone('');
      
      // Reload agency data
      loadAgencyData();
    } catch (err) {
      console.error("Agency pilgrim registration error:", err);
      setFormError(err.message || "Erreur lors de l'enregistrement du pèlerin.");
    }
  };

  // Filtered pilgrims list
  const filteredPilgrims = pilgrims.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.passportNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || p.registrationStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return "Tableau de bord de l'Agence";
      case 'pilgrims':
        return "Registre des Pèlerins Inscrits";
      case 'register':
        return "Saisie et Enregistrement Pèlerin";
      case 'profile':
        return "Informations et Fiche Officielle";
      default:
        return "Portail Agence Hajj";
    }
  };

  return (
    <div className="admin-layout" style={{ width: '100%' }}>
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="logo-section">
            <div className="logo-icon" style={{ fontSize: '1.4rem' }}>🕋</div>
            <div className="logo-meta">
              <span className="logo-title" style={{ fontSize: '1.15rem' }}>{(fullAgencyDetails.name || "Agence").split(' ')[0]} Hajj</span>
              <span className="logo-subtitle">Espace Agence Agréée</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <ul className="menu-list">
              <li 
                className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={18} className="menu-icon" />
                <span className="menu-label">Tableau de bord</span>
                {activeTab === 'dashboard' && <div className="active-indicator" />}
              </li>
              <li 
                className={`menu-item ${activeTab === 'pilgrims' ? 'active' : ''}`}
                onClick={() => setActiveTab('pilgrims')}
              >
                <Users size={18} className="menu-icon" />
                <span className="menu-label">Nos Pèlerins</span>
                {activeTab === 'pilgrims' && <div className="active-indicator" />}
              </li>
              <li 
                className={`menu-item ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                <UserPlus size={18} className="menu-icon" />
                <span className="menu-label">Saisie Inscription</span>
                {activeTab === 'register' && <div className="active-indicator" />}
              </li>
              <li 
                className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <Building2 size={18} className="menu-icon" />
                <span className="menu-label">Fiche Agence</span>
                {activeTab === 'profile' && <div className="active-indicator" />}
              </li>
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="sunuhajj-badge">AGENCE CERTIFIÉE</div>
          <p className="footer-copyright">© 2026 Sunu Hajj</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Header Panel */}
        <header className="header-panel">
          <div className="header-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className="page-title">{getPageTitle()}</h2>
              {fullAgencyDetails?.status === 'pending' || fullAgencyDetails?.isApproved === false ? (
                <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#FEFCBF', color: '#744210', border: '1px solid #F6E05E', fontWeight: 700 }}>
                  🟡 Inscription en attente de validation DGP
                </span>
              ) : (
                <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(56,161,105,0.12)', color: '#276749', border: '1px solid #C6F6D5', fontWeight: 700 }}>
                  🟢 Agence Agréée & Validée par Sunu Hajj
                </span>
              )}
            </div>
            <div className={`api-status-badge ${isApiOnline ? 'online' : 'offline'}`}>
              <span className={`status-icon ${isApiOnline ? 'online' : 'offline'}`} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isApiOnline ? 'var(--accent-green)' : '#f59e0b', display: 'inline-block' }} />
              <span>{isApiOnline ? "Réseau Sunu Hajj Connecté" : "Mode Démo Local"}</span>
            </div>
          </div>

          <div className="header-right">
            <button 
              onClick={() => setShowPasswordModal(true)}
              style={{ backgroundColor: 'rgba(212,175,55,0.12)', border: '1px solid var(--secondary)', color: '#8A6D1B', borderRadius: '8px', padding: '8px 12px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              🔑 Mot de passe
            </button>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle-btn"
              title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
              aria-label="Changer de thème"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {onLogout && (
              <button 
                onClick={onLogout}
                className="theme-toggle-btn logout-btn"
                title="Se déconnecter"
                aria-label="Se déconnecter"
              >
                <LogOut size={18} />
              </button>
            )}

            <div className="user-profile">
              <div className="user-meta">
                <span className="user-name">{fullAgencyDetails.name}</span>
                <span className="user-role" style={{ textTransform: 'capitalize' }}>Package {fullAgencyDetails.type}</span>
              </div>
              <div className="user-avatar" style={{ border: '2px solid var(--secondary)' }} title={fullAgencyDetails.name}>🕋</div>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="tab-container">
          
          {/* Security Banner for Default Password */}
          {mustChangePassword && (
            <div style={{ backgroundColor: '#FEFCBF', border: '1px solid #F6E05E', color: '#744210', padding: '14px 20px', borderRadius: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>🔐</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem' }}>Sécurité Compte Agence : Mot de passe temporaire détecté</strong>
                  <span style={{ fontSize: '0.82rem', opacity: 0.9 }}>Vous utilisez le mot de passe par défaut (<code>123456</code>). Veuillez personnaliser votre mot de passe pour sécuriser votre espace.</span>
                </div>
              </div>
              <button 
                onClick={() => setShowPasswordModal(true)} 
                style={{ padding: '8px 18px', backgroundColor: '#D4AF37', color: '#042F1A', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                🔑 Personnaliser mon mot de passe
              </button>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="tab-pane fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* KPIs Stats Grid */}
              <div className="stats-grid animate-slide-up">
                
                <StatsCard 
                  title="Pèlerins Inscrits"
                  value={`${stats.total} / ${stats.capacity}`}
                  icon={Users}
                  trend={stats.capacity ? Math.round((stats.total / stats.capacity) * 100) : 0}
                  trendLabel="de remplissage"
                  color="emerald"
                />

                <StatsCard 
                  title="Chiffre d'Affaires"
                  value={`${stats.revenue.toLocaleString()} FCFA`}
                  icon={CreditCard}
                  color="gold"
                />

                <StatsCard 
                  title="Dossiers Approuvés"
                  value={stats.approved}
                  icon={CheckCircle}
                  trend={stats.total ? Math.round((stats.approved / stats.total) * 100) : 0}
                  trendLabel="des inscrits validés"
                  color="indigo"
                />

                <StatsCard 
                  title="Aptitude Médicale"
                  value={`${stats.medicalApte} / ${stats.total}`}
                  icon={Activity}
                  trend={stats.total ? Math.round((stats.medicalApte / stats.total) * 100) : 0}
                  trendLabel="taux d'aptitude"
                  color="blue"
                />

              </div>

              {/* Quota Progress Gauge */}
              <div className="panel-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Jauge de Remplissage du Quota</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Capacité maximum attribuée par la Sunu Hajj : {stats.capacity} places</p>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                    {stats.capacity - stats.total} places restantes
                  </span>
                </div>
                <div style={{ width: '100%', height: '14px', backgroundColor: 'var(--bg)', borderRadius: '10px', marginTop: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div 
                    style={{ 
                      width: `${Math.min(100, (stats.total / stats.capacity) * 100)}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)', 
                      borderRadius: '10px',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} 
                  />
                </div>
              </div>

              {/* Lower Section: Recent list & Info cards */}
              <div className="dashboard-grid">
                
                {/* Recent pilgrims */}
                <div className="panel-card" style={{ flex: 1.6 }}>
                  <div className="panel-header">
                    <h3 className="panel-title">Dernières Inscriptions Agence</h3>
                    <button onClick={() => setActiveTab('pilgrims')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Voir tout</button>
                  </div>
                  
                  {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>Chargement...</div>
                  ) : pilgrims.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Aucun pèlerin inscrit dans votre agence pour le moment.
                    </div>
                  ) : (
                    <div className="table-responsive" style={{ marginTop: '10px' }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Nom Complet</th>
                            <th>Passeport</th>
                            <th>Date Inscription</th>
                            <th>Validation Sunu Hajj</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pilgrims.slice(-5).reverse().map(p => (
                            <tr key={p.id} className="table-row-hover">
                              <td><strong>{p.fullName}</strong></td>
                              <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.passportNumber}</td>
                              <td>{p.registrationDate}</td>
                              <td>
                                <span className={`badge badge-status-${p.registrationStatus}`} style={{ fontSize: '0.75rem' }}>
                                  {p.registrationStatus === 'approved' ? "🟢 Validé" : p.registrationStatus === 'pending' ? "🟠 En cours" : "🔴 Rejeté"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Info Card */}
                <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="panel-header">
                    <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={18} style={{ color: 'var(--secondary)' }} />
                      Rappels Réglementaires
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    <div style={{ padding: '14px', backgroundColor: 'var(--primary-light)', borderLeft: '4px solid var(--primary)', borderRadius: '8px' }}>
                      <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '4px' }}>Validation des Dossiers</strong>
                      Les visas officiels Hajj ne seront délivrés par la Sunu Hajj qu'après **validation finale** du dossier administratif et constatation de **l'aptitude médicale**.
                    </div>
                    <div style={{ padding: '14px', backgroundColor: 'var(--secondary-light)', borderLeft: '4px solid var(--secondary)', borderRadius: '8px' }}>
                      <strong style={{ color: 'var(--secondary-dark)', display: 'block', marginBottom: '4px' }}>Saisie Directe</strong>
                      Pour tout pèlerin s'inscrivant directement dans vos locaux, utilisez le formulaire pour lui créer son dossier. Il pourra ensuite se connecter sur son Espace Pèlerin avec son passeport.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PILGRIMS REGISTRY */}
          {activeTab === 'pilgrims' && (
            <div className="tab-pane fade-in panel-card">
              <div className="panel-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="panel-title">Registre de nos Pèlerins</h3>
                  <span className="badge badge-primary">{filteredPilgrims.length} pèlerins trouvés</span>
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div className="search-box" style={{ flex: 1, minWidth: '250px' }}>
                    <Search size={18} className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Rechercher par nom ou numéro de passeport..." 
                      className="search-input"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <select 
                    className="form-control"
                    style={{ width: '200px' }}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Tous les statuts Sunu Hajj</option>
                    <option value="pending">En attente (🟠)</option>
                    <option value="approved">Validés (🟢)</option>
                    <option value="rejected">Rejetés (🔴)</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div style={{ padding: '50px', textAlign: 'center' }}>Chargement du registre...</div>
              ) : filteredPilgrims.length === 0 ? (
                <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Aucun pèlerin ne correspond à vos critères de recherche.
                </div>
              ) : (
                <div className="table-responsive" style={{ marginTop: '10px' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nom Complet</th>
                        <th>Passeport</th>
                        <th>Coordonnées</th>
                        <th>Aptitude Médicale</th>
                        <th>Dossier Sunu Hajj</th>
                        <th>Paiement Acompte</th>
                        <th>Nusuk Sync</th>
                        <th>Visa Hajj</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPilgrims.map(p => (
                        <tr key={p.id} className="table-row-hover">
                          <td>
                            <strong style={{ display: 'block', color: 'var(--text)' }}>{p.fullName}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Inscrit le {p.registrationDate}</span>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.5px' }}>{p.passportNumber}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.78rem' }}>
                              <span>📞 {p.phone}</span>
                              <span style={{ color: 'var(--text-muted)' }}>✉️ {p.email}</span>
                            </div>
                          </td>
                          <td>
                            <span 
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                borderRadius: '20px',
                                backgroundColor: p.medicalStatus === 'apte' ? 'rgba(34, 197, 94, 0.12)' : p.medicalStatus === 'inapte' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(212, 175, 55, 0.12)',
                                color: p.medicalStatus === 'apte' ? '#15803D' : p.medicalStatus === 'inapte' ? '#B91C1C' : '#B45309',
                                fontWeight: 800,
                                border: '1px solid rgba(0,0,0,0.05)'
                              }}
                              title="Décision médicale réservée exclusivement au médecin agréé certifié"
                            >
                              {p.medicalStatus === 'apte' ? '🟢 Apte' : p.medicalStatus === 'inapte' ? '🔴 Inapte' : '🟡 En attente'} <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>🔒</span>
                            </span>
                          </td>
                          <td>
                            <span className={`badge badge-status-${p.registrationStatus}`} style={{ fontSize: '0.75rem' }}>
                              {p.registrationStatus === 'approved' ? "Validé" : p.registrationStatus === 'pending' ? "En cours" : "Rejeté"}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <select
                                value={p.paymentStatus || 'pending'}
                                onChange={async (e) => {
                                  const newPaymentStatus = e.target.value;
                                  try {
                                    await ApiService.updatePilgrimPaymentStatus(p.id, newPaymentStatus);
                                    loadAgencyData();
                                  } catch (err) {
                                    alert("Erreur lors de la mise à jour du paiement : " + err.message);
                                  }
                                }}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  border: '1px solid var(--border)',
                                  backgroundColor: 
                                    (p.paymentStatus || 'pending') === 'paid' 
                                      ? 'rgba(16, 185, 129, 0.1)' 
                                      : (p.paymentStatus || 'pending') === 'refunded' 
                                        ? 'rgba(239, 68, 68, 0.1)' 
                                        : 'rgba(245, 158, 11, 0.1)',
                                  color: 
                                    (p.paymentStatus || 'pending') === 'paid' 
                                      ? 'var(--primary)' 
                                      : (p.paymentStatus || 'pending') === 'refunded' 
                                        ? '#ef4444' 
                                        : 'var(--secondary-dark)',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="pending">⌛ En attente</option>
                                <option value="paid">🟢 Payé</option>
                                <option value="refunded">🔴 Remboursé</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600, color: p.nusukSyncStatus === 'synced' ? 'var(--primary)' : 'var(--text-muted)' }}>
                              {p.nusukSyncStatus === 'synced' ? <CheckCircle size={14} style={{ color: 'var(--primary)' }} /> : <Clock size={14} />}
                              {p.nusukSyncStatus === 'synced' ? "Synchronisé" : "En attente"}
                            </span>
                          </td>
                          <td>
                            <span className={`badge badge-status-${p.visaStatus === 'issued' ? 'approved' : 'pending'}`} style={{ fontSize: '0.75rem' }}>
                              {p.visaStatus === 'issued' ? "🎫 Émis" : "⌛ En cours"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REGISTER NEW PILGRIM */}
          {activeTab === 'register' && (
            <div className="tab-pane fade-in panel-card" style={{ width: '100%' }}>
              <div className="panel-header">
                <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={20} style={{ color: 'var(--primary)' }} />
                  Formulaire Officiel d'Inscription Hajj (Saisie Agence)
                </h3>
              </div>

              {formError && (
                <div style={{ padding: '14px', margin: '16px 0', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span>⚠️ {formError}</span>
                </div>
              )}

              {formSuccess && (
                <div style={{ padding: '14px', margin: '16px 0', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)' }}>
                  <span>✅ {formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegisterPilgrim} className="modern-form" style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="form-label">Numéro de Passeport *</label>
                  <div className="input-with-icon">
                    <CreditCard size={16} className="input-field-icon" />
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      placeholder="Ex: SN1234567"
                      value={passport}
                      onChange={e => setPassport(e.target.value)}
                      style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="form-label">Prénom & Nom du Pèlerin *</label>
                  <div className="input-with-icon">
                    <Users size={16} className="input-field-icon" />
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      placeholder="Prénom Nom"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="form-label">Téléphone Mobile</label>
                  <div className="input-with-icon">
                    <Phone size={16} className="input-field-icon" />
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="+221 77 123 45 67 (Optionnel)"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="form-label">Adresse Email</label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-field-icon" />
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="email@adresse.com (Optionnel)"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="form-label">Date de Naissance</label>
                  <div className="input-with-icon">
                    <Calendar size={16} className="input-field-icon" />
                    <input 
                      type="date" 
                      className="form-control" 
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="form-label">Groupe Sanguin</label>
                  <div className="input-with-icon">
                    <Heart size={16} className="input-field-icon" />
                    <select 
                      className="form-control"
                      value={bloodType}
                      onChange={e => setBloodType(e.target.value)}
                      style={{ paddingLeft: '32px' }}
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                  <label className="form-label">Agence de Voyage Hajj</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    disabled 
                    value={`${fullAgencyDetails.name} (Verrouillée — Votre agence)`}
                    style={{ backgroundColor: 'var(--bg)', color: 'var(--text-muted)' }}
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="form-label">Nom du Proche d'Urgence</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Fatoumata Ndiaye (Optionnel)"
                    value={emergencyContactName}
                    onChange={e => setEmergencyContactName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="form-label">Téléphone du Proche d'Urgence</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: +221 77 987 65 43 (Optionnel)"
                    value={emergencyContactPhone}
                    onChange={e => setEmergencyContactPhone(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full-width" style={{ gridColumn: 'span 2', marginTop: '10px', height: '46px', fontWeight: 700 }}>
                  Enregistrer le Pèlerin et Transmettre à la Sunu Hajj
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: PROFILE - ACCREDITATION STYLE */}
          {activeTab === 'profile' && (
            <div className="tab-pane fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div 
                className="panel-card" 
                style={{ 
                  border: '2px solid var(--secondary)', 
                  position: 'relative', 
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface-hover) 100%)'
                }}
              >
                {/* Watermark/Accreditation background pattern */}
                <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', fontSize: '10rem', opacity: 0.05, transform: 'rotate(-25deg)', pointerEvents: 'none' }}>
                  🇸🇳
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border)', paddingBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '14px', backgroundColor: 'var(--primary-dark)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                      🕋
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{fullAgencyDetails.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span className="badge badge-type-vip" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', backgroundColor: 'var(--primary)', color: '#fff', padding: '3px 8px' }}>
                          <Award size={12} /> Agrément Administrateur Sunu Hajj
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>
                          <Star size={12} fill="#fbbf24" style={{ marginRight: '2px' }} /> {fullAgencyDetails.rating} / 5
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>ID Homologation</span>
                    <strong style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>Sunu Hajj-2026-AG{agency.agencyId}</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Tarif Forfait Hajj Homologué</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{fullAgencyDetails.price.toLocaleString()} FCFA</strong>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Type de Package Hajj</span>
                    <strong style={{ textTransform: 'capitalize', fontSize: '1.1rem', color: 'var(--text)' }}>Package {fullAgencyDetails.type}</strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Téléphone Officiel</span>
                    <strong style={{ fontSize: '0.95rem' }}>{fullAgencyDetails.phone || "+221 33 824 12 34"}</strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Email d'Assistance</span>
                    <strong style={{ fontSize: '0.95rem' }}>{fullAgencyDetails.email || "contact@terangahajj.sn"}</strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Adresse du Siège Social</span>
                    <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} style={{ color: 'var(--secondary)' }} /> 
                      {fullAgencyDetails.address}
                    </strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '10px' }}>
                  <h4 style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '0.9rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Prestations & Engagements Inclus
                  </h4>
                  <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', paddingLeft: '16px', listStyleType: 'square', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {getFeaturesList().map((f, i) => (
                      <li key={i} style={{ lineHeight: '1.4' }}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'var(--primary-light)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--primary-dark)', fontWeight: 600 }}>
                  🔒 Cette agence est officiellement agréée et accréditée par la Commission Nationale Sunu Hajj du Sénégal pour l'édition Hajj 2026.
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#042F1A', margin: 0 }}>🔑 Personnaliser mon mot de passe</h3>
              <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            {passSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
                <h4 style={{ color: '#042F1A', fontSize: '1.1rem', fontWeight: 800 }}>Mot de passe mis à jour !</h4>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '6px' }}>Votre nouveau mot de passe a été enregistré avec succès.</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {passError && (
                  <div style={{ color: '#E53E3E', backgroundColor: '#FFF5F5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
                    {passError}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1A202C' }}>Nouveau mot de passe *</label>
                  <input 
                    type="password"
                    required 
                    placeholder="Ex: MonAgence2026!"
                    className="form-control"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ height: '44px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #E2E8F0', padding: '0 12px' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1A202C' }}>Confirmer le nouveau mot de passe *</label>
                  <input 
                    type="password"
                    required 
                    placeholder="••••••••"
                    className="form-control"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{ height: '44px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #E2E8F0', padding: '0 12px' }}
                  />
                </div>
                <button 
                  type="submit"
                  style={{ height: '48px', backgroundColor: '#0A5C36', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', marginTop: '8px' }}
                >
                  Enregistrer mon nouveau mot de passe
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default AgencyPortal;
