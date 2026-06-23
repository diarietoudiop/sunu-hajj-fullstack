import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalVisits: 1245,
    activePilgrims: 412,
    registeredInquiries: 3,
    announcementsCount: 2,
    agenciesCount: 3,
    inquiriesHistory: []
  });
  const [agencies, setAgencies] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [alert, setAlert] = useState(null);

  // New Agency Form State
  const [newAgency, setNewAgency] = useState({
    name: '',
    price: '',
    type: 'standard',
    address: '',
    phone: '',
    email: '',
    desc_fr: '',
    desc_wo: '',
    desc_ar: '',
    featuresString: 'Vol direct, Hôtel proche, Assistance médicale'
  });

  // New Announcement Form State
  const [newAnn, setNewAnn] = useState({
    category: 'admin',
    title_fr: '',
    desc_fr: '',
    title_wo: '',
    desc_wo: '',
    title_ar: '',
    desc_ar: ''
  });

  useEffect(() => {
    fetchStats();
    fetchAgencies();
    fetchAnnouncements();
  }, []);

  const triggerAlert = (msg) => {
    setAlert(msg);
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Backend offline, using local mock stats.');
    }
  };

  const fetchAgencies = async () => {
    try {
      const res = await fetch(`${API_BASE}/agencies`);
      if (res.ok) {
        const data = await res.json();
        setAgencies(data);
      }
    } catch (err) {
      // Fallback
      setAgencies([
        { id: 1, name: "Voyages Teranga Hajj & Omra", price: 3600000, type: "economique", address: "Dakar", rating: 4.8 },
        { id: 2, name: "Dakar Air Services Hajj", price: 4900000, type: "standard", address: "Dakar", rating: 4.5 },
        { id: 3, name: "Sahel Omra & Hajj Confort", price: 8500000, type: "vip", address: "Almadies", rating: 4.9 }
      ]);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/announcements`);
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      setAnnouncements([
        { id: 1, date: "23 Juin 2026", category: "admin", title_fr: "Ouverture des visites médicales", desc_fr: "Les visites médicales ont débuté dans les hôpitaux régionaux." }
      ]);
    }
  };

  const handleAddAgency = async (e) => {
    e.preventDefault();
    const features = newAgency.featuresString.split(',').map(f => f.trim());
    const payload = { ...newAgency, features };

    try {
      const res = await fetch(`${API_BASE}/agencies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        triggerAlert('Agence accréditée ajoutée avec succès !');
        fetchAgencies();
        fetchStats();
        setNewAgency({
          name: '',
          price: '',
          type: 'standard',
          address: '',
          phone: '',
          email: '',
          desc_fr: '',
          desc_wo: '',
          desc_ar: '',
          featuresString: 'Vol direct, Hôtel proche, Assistance médicale'
        });
      }
    } catch (err) {
      // Offline mock addition
      const mockNew = {
        id: Date.now(),
        ...newAgency,
        price: parseInt(newAgency.price) || 4000000,
        rating: 4.5
      };
      setAgencies([...agencies, mockNew]);
      triggerAlert('[Mock Mode] Agence ajoutée localement.');
    }
  };

  const handleDeleteAgency = async (id) => {
    if (!window.confirm('Voulez-vous vraiment retirer cette agence de la liste officielle ?')) return;

    try {
      const res = await fetch(`${API_BASE}/agencies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerAlert('Agence retirée de l\'annuaire officiel.');
        fetchAgencies();
        fetchStats();
      }
    } catch (err) {
      setAgencies(agencies.filter(a => a.id !== id));
      triggerAlert('[Mock Mode] Agence retirée localement.');
    }
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnn)
      });
      if (res.ok) {
        triggerAlert('Communiqué officiel publié !');
        fetchAnnouncements();
        fetchStats();
        setNewAnn({
          category: 'admin',
          title_fr: '',
          desc_fr: '',
          title_wo: '',
          desc_wo: '',
          title_ar: '',
          desc_ar: ''
        });
      }
    } catch (err) {
      const mockNew = {
        id: Date.now(),
        date: "Aujourd'hui",
        ...newAnn
      };
      setAnnouncements([mockNew, ...announcements]);
      triggerAlert('[Mock Mode] Communiqué ajouté localement.');
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-text">Sunu Hajj</div>
          <span className="dgp-badge">DGP ADMIN</span>
        </div>

        <ul className="menu-list">
          <li className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Tableau de bord
          </li>
          <li className={`menu-item ${activeTab === 'agencies' ? 'active' : ''}`} onClick={() => setActiveTab('agencies')}>
            ✈️ Agences Agréées
          </li>
          <li className={`menu-item ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>
            📢 Communiqués Officiels
          </li>
        </ul>
      </aside>

      {/* Main Panel Content */}
      <main className="main-content">
        <header className="header-panel">
          <h2 className="page-title">
            {activeTab === 'dashboard' && 'Statistiques & Activité'}
            {activeTab === 'agencies' && 'Gestion des agences accréditées'}
            {activeTab === 'announcements' && 'Publication des communiqués DGP'}
          </h2>
          <div className="user-profile">
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>DGP Sénégal</span>
            <div className="user-avatar">🇸🇳</div>
          </div>
        </header>

        {alert && <div className="alert-box alert-success">{alert}</div>}

        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-val">{stats.totalVisits}</span>
                <span className="stat-label">Visites de la plateforme</span>
              </div>
              <div className="stat-card">
                <span className="stat-val">{stats.activePilgrims}</span>
                <span className="stat-label">Pèlerins actifs</span>
              </div>
              <div className="stat-card">
                <span className="stat-val">{stats.registeredInquiries}</span>
                <span className="stat-label">Demandes d'information reçues</span>
              </div>
              <div className="stat-card">
                <span className="stat-val">{agencies.length}</span>
                <span className="stat-label">Agences certifiées</span>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="panel-card">
                <div className="panel-header">
                  <h3 className="panel-title">Dernières demandes reçues des pèlerins</h3>
                </div>
                {stats.inquiriesHistory.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Aucune demande de pèlerin pour l'instant.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Pèlerin</th>
                        <th>Téléphone</th>
                        <th>Agence ciblée</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.inquiriesHistory.map((inq) => (
                        <tr key={inq.id}>
                          <td><strong>{inq.clientName}</strong></td>
                          <td>{inq.clientPhone}</td>
                          <td><span className="badge badge-info">{inq.agencyName}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <h3 className="panel-title">État des communiqués en ligne</h3>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none' }}>
                  {announcements.map(ann => (
                    <li key={ann.id} style={{ fontSize: '0.85rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong>{ann.title_fr}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ann.date}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)' }}>{ann.desc_fr.substring(0, 100)}...</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: AGENCIES ================= */}
        {activeTab === 'agencies' && (
          <div className="dashboard-grid">
            <div className="panel-card" style={{ flex: 1.5 }}>
              <div className="panel-header">
                <h3 className="panel-title">Liste des agences agréées</h3>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Agence</th>
                    <th>Forfait</th>
                    <th>Prix</th>
                    <th>Téléphone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agencies.map(agency => (
                    <tr key={agency.id}>
                      <td>
                        <strong>{agency.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {agency.address}</div>
                      </td>
                      <td>
                        <span className="badge badge-info">{agency.type}</span>
                      </td>
                      <td><strong>{agency.price.toLocaleString()} F CFA</strong></td>
                      <td>{agency.phone}</td>
                      <td>
                        <button className="btn btn-danger-outline btn-sm" onClick={() => handleDeleteAgency(agency.id)}>
                          Retirer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel-card">
              <div className="panel-header">
                <h3 className="panel-title">Ajouter une agence agréée</h3>
              </div>
              <form onSubmit={handleAddAgency}>
                <div className="form-group">
                  <label className="form-label">Nom de l'agence</label>
                  <input type="text" className="form-control" required value={newAgency.name} onChange={e => setNewAgency({ ...newAgency, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Prix de départ (FCFA)</label>
                  <input type="number" className="form-control" required value={newAgency.price} onChange={e => setNewAgency({ ...newAgency, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Catégorie Forfait</label>
                  <select className="form-control" value={newAgency.type} onChange={e => setNewAgency({ ...newAgency, type: e.target.value })}>
                    <option value="economique">Économique</option>
                    <option value="standard">Standard</option>
                    <option value="vip">VIP / Confort</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Adresse physique</label>
                  <input type="text" className="form-control" value={newAgency.address} onChange={e => setNewAgency({ ...newAgency, address: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input type="text" className="form-control" value={newAgency.phone} onChange={e => setNewAgency({ ...newAgency, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description (Français)</label>
                  <textarea className="form-control" style={{ minHeight: '80px' }} value={newAgency.desc_fr} onChange={e => setNewAgency({ ...newAgency, desc_fr: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Services inclus (séparés par des virgules)</label>
                  <input type="text" className="form-control" value={newAgency.featuresString} onChange={e => setNewAgency({ ...newAgency, featuresString: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary btn-full-width">
                  Enregistrer et publier
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ANNOUNCEMENTS ================= */}
        {activeTab === 'announcements' && (
          <div className="dashboard-grid">
            <div className="panel-card">
              <div className="panel-header">
                <h3 className="panel-title">Publier un communiqué officiel de la DGP</h3>
              </div>
              <form onSubmit={handleAddAnnouncement}>
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <select className="form-control" value={newAnn.category} onChange={e => setNewAnn({ ...newAnn, category: e.target.value })}>
                    <option value="admin">Administratif</option>
                    <option value="health">Santé / Hygiène</option>
                    <option value="security">Sécurité / Alerte</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Titre (Français)</label>
                  <input type="text" className="form-control" required value={newAnn.title_fr} onChange={e => setNewAnn({ ...newAnn, title_fr: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Message (Français)</label>
                  <textarea className="form-control" style={{ minHeight: '100px' }} required value={newAnn.desc_fr} onChange={e => setNewAnn({ ...newAnn, desc_fr: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Titre en Wolof (Optionnel)</label>
                    <input type="text" className="form-control" value={newAnn.title_wo} onChange={e => setNewAnn({ ...newAnn, title_wo: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Titre en Arabe (Optionnel)</label>
                    <input type="text" className="form-control" value={newAnn.title_ar} onChange={e => setNewAnn({ ...newAnn, title_ar: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full-width">
                  Diffuser le communiqué
                </button>
              </form>
            </div>

            <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="panel-header">
                <h3 className="panel-title">Historique des communiqués diffusés</h3>
              </div>
              {announcements.map(ann => (
                <div key={ann.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-warning" style={{ textTransform: 'uppercase' }}>{ann.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📅 {ann.date}</span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '6px' }}>{ann.title_fr}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{ann.desc_fr}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
