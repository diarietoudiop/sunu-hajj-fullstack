import React, { useState, useEffect } from 'react';
import { User, Lock, LogIn, AlertCircle, CreditCard, Mail, Key, ShieldAlert, Calendar, Heart, Phone } from 'lucide-react';
import { ApiService } from '../../services/api';

function Login({ onLoginSuccess, initialRole = 'agency', onBackToHome }) {
  // Detect portal type from initialRole or URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const portalParam = urlParams.get('portal');
  const roleParam = urlParams.get('role');

  const isPilgrimPortal = initialRole === 'pilgrim' || portalParam === 'pelerin' || roleParam === 'pilgrim';
  const isShowingAdminToggle = !isPilgrimPortal;

  // Sub-mode for both portals: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');
  const [loginRole, setLoginRole] = useState(() => {
    const doctorParam = urlParams.get('doctor');
    if (isPilgrimPortal) return 'pilgrim';
    if (doctorParam === 'true' || roleParam === 'doctor' || initialRole === 'doctor' || initialRole === 'medical') return 'doctor';
    if (initialRole === 'admin' || roleParam === 'admin') return 'admin';
    if (initialRole === 'agency' || roleParam === 'agency') return 'agency';
    return 'agency';
  });
  
  // Form fields (Admin & Pilgrim shared)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  // Pilgrim specific fields
  const [passport, setPassport] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [region, setRegion] = useState('Dakar');
  const [bloodType, setBloodType] = useState('O+');
  const [selectedAgencyId, setSelectedAgencyId] = useState(1);
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  const SENEGAL_REGIONS = [
    "Dakar", "Thiès", "Saint-Louis", "Diourbel", "Louga", "Fatick", 
    "Kaolack", "Kaffrine", "Kolda", "Matam", "Sédhiou", "Tambacounda", 
    "Ziguinchor", "Kédougou"
  ];

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [registeredAgencies, setRegisteredAgencies] = useState([]);
  useEffect(() => {
    try {
      const custom = JSON.parse(localStorage.getItem('mock_agencies') || '[]');
      if (Array.isArray(custom)) {
        setRegisteredAgencies(custom.filter(a => a && typeof a === 'object'));
      } else {
        setRegisteredAgencies([]);
      }
    } catch (e) {
      setRegisteredAgencies([]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isPilgrimPortal) {
      if (authMode === 'login') {
        // Admin Login
        try {
          const targetRole = (username.toLowerCase().trim() === 'dgpadmin' || username.toLowerCase().trim() === 'moussa.fall') ? 'admin' : loginRole;
          const user = await ApiService.loginAdmin(username, password, targetRole);
          onLoginSuccess(targetRole, user);
        } catch (err) {
          setError(err.message || "Identifiant ou mot de passe incorrect.");
          setLoading(false);
        }
      } else {
        // Admin Registration
        try {
          if (!username || !password || !fullName || !email) {
            setError("Veuillez remplir tous les champs obligatoires.");
            setLoading(false);
            return;
          }
          const newUser = await ApiService.registerAdmin({
            username,
            password,
            fullName,
            email,
            department: 'Direction Générale',
            phone: '',
            avatar: ''
          });
          onLoginSuccess('admin', newUser);
        } catch (err) {
          setError(err.message || "Erreur lors de la création du compte.");
          setLoading(false);
        }
      }
    } else {
      if (authMode === 'login') {
        // Pilgrim Login (by Passport)
        try {
          const passportNum = passport.trim().toUpperCase();
          if (!passportNum) {
            setError("Veuillez saisir un numéro de passeport.");
            setLoading(false);
            return;
          }

          const pilgrim = await ApiService.getPilgrimByPassport(passportNum);
          if (pilgrim) {
            onLoginSuccess('pilgrim', pilgrim);
          } else {
            setError("Numéro de passeport introuvable. Veuillez vérifier la saisie ou faire une demande officielle.");
            setLoading(false);
          }
        } catch (err) {
          setError("Erreur de connexion lors de la recherche du dossier.");
          setLoading(false);
        }
      } else {
        // Pilgrim Registration (Submit Dossier Hajj)
        try {
          const passportNum = passport.trim().toUpperCase();
          if (!passportNum || !fullName || !phone || !email || !birthDate || !emergencyContactName || !emergencyContactPhone) {
            setError("Veuillez remplir tous les champs du dossier.");
            setLoading(false);
            return;
          }

          if (!passportNum.startsWith('SN') || passportNum.length < 5) {
            setError("Le numéro de passeport doit commencer par 'SN' suivi de chiffres.");
            setLoading(false);
            return;
          }

          const result = await ApiService.registerPilgrim({
            fullName,
            phone,
            email,
            passportNumber: passportNum,
            birthDate,
            region,
            bloodType: "À déterminer (Visite médicale)",
            selectedAgencyId: parseInt(selectedAgencyId),
            emergencyContactName,
            emergencyContactPhone,
            emergencyContact: {
              name: emergencyContactName,
              phone: emergencyContactPhone
            }
          });

          // Log in directly
          onLoginSuccess('pilgrim', result.data || result);
        } catch (err) {
          setError(err.message || "Erreur lors du dépôt de votre dossier.");
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="login-page-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      backgroundImage: "linear-gradient(rgba(4, 47, 26, 0.65), rgba(9, 14, 12, 0.85)), url('/assets/kaaba_hero_bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="login-card-wrapper animate-slide-up" style={{ width: '100%', maxWidth: authMode === 'register' && isPilgrimPortal ? '600px' : '440px', transition: 'max-width 0.3s ease', position: 'relative' }}>
        {onBackToHome && (
          <button 
            type="button" 
            onClick={onBackToHome}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              position: 'absolute',
              top: '16px',
              left: '20px',
              zIndex: 10
            }}
          >
            ← Accueil
          </button>
        )}
        {/* Gold & Green gradient top indicator */}
        <div style={{ height: '4px', width: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--primary-dark) 100%)' }} />

        {/* Institution / Agency Badge */}
        {isPilgrimPortal ? (
          <div className="login-logo-section">
            <img src="/assets/sunu_hajj_logo.png" alt="Sunu Hajj Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--secondary)', margin: '0 auto 12px', display: 'block', boxShadow: 'var(--shadow-sm)' }} />
            <h1 className="admin-title" style={{ color: 'var(--primary-dark)', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>SUNU HAJJ</h1>
            <p className="admin-subtitle" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>Espace Pèlerin Officiel</p>
          </div>
        ) : loginRole === 'agency' ? (
          <div className="login-logo-section">
            <img src="/assets/sunu_hajj_logo.png" alt="Sunu Hajj Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--secondary)', margin: '0 auto 12px', display: 'block', boxShadow: 'var(--shadow-sm)' }} />
            <h1 className="admin-title" style={{ color: 'var(--primary-dark)', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>SUNU HAJJ</h1>
            <p className="admin-subtitle" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>Espace Agences Agréées</p>
          </div>
        ) : (
          <div className="login-logo-section">
            <img src="/assets/sunu_hajj_logo.png" alt="Sunu Hajj Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--secondary)', margin: '0 auto 12px', display: 'block', boxShadow: 'var(--shadow-sm)' }} />
            <h1 className="admin-title" style={{ color: 'var(--primary-dark)', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>SUNU HAJJ</h1>
            <p className="admin-subtitle" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>Espace Administrateur / Agent</p>
          </div>
        )}

        <div className="login-divider" />

        {/* Auth Mode Toggle for Pilgrim */}
        {isPilgrimPortal && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: 'var(--bg)', padding: '6px', borderRadius: 'var(--radius-sm)' }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                backgroundColor: authMode === 'login' ? 'var(--surface)' : 'transparent',
                color: authMode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: authMode === 'login' ? 'var(--shadow-sm)' : 'none'
              }}
              onClick={() => { setAuthMode('login'); setError(null); }}
            >
              S'identifier
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                backgroundColor: authMode === 'register' ? 'var(--surface)' : 'transparent',
                color: authMode === 'register' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: authMode === 'register' ? 'var(--shadow-sm)' : 'none'
              }}
              onClick={() => { setAuthMode('register'); setError(null); }}
            >
              Déposer un dossier Hajj
            </button>
          </div>
        )}



        <h2 className="login-welcome-title">
          {isPilgrimPortal 
            ? authMode === 'login' 
              ? "Mon Espace Pèlerin" 
              : "Dossier d'Inscription Hajj 2026"
            : loginRole === 'doctor'
              ? "🩺 Espace Contrôle Médical Hajj"
              : loginRole === 'admin' 
              ? "🛡️ Portail d'Administration DGP" 
              : "🏢 Portail Espace Agence Agréée"}
        </h2>
        
        <p className="login-welcome-desc">
          {isPilgrimPortal 
            ? authMode === 'login'
              ? "Renseignez votre numéro de passeport sénégalais pour suivre vos visas et vols."
              : "Remplissez le formulaire officiel pour déposer votre dossier d'inscription."
            : loginRole === 'doctor'
              ? "Renseignez le Code Unique de votre Structure Médicale Agréée pour gérer les aptitudes des pèlerins."
              : loginRole === 'admin'
              ? "Veuillez renseigner vos accès sécurisés d'Agent pour accéder au registre de contrôle national DGP."
              : "Veuillez renseigner les accès de votre agence agréée pour gérer vos pèlerins."}
        </p>

        {/* Error message */}
        {error && (
          <div className="login-error-box fade-in">
            <AlertCircle size={16} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modern-form login-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isPilgrimPortal ? (
            authMode === 'login' ? (
              /* Pilgrim Login View */
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Numéro de passeport</label>
                <div className="input-with-icon">
                  <CreditCard size={16} className="input-field-icon" />
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Ex: SN9876543"
                    value={passport}
                    style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '1px' }}
                    onChange={e => setPassport(e.target.value)}
                  />
                </div>
                <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>⚡ Démos rapides :</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPassport('SN9876543');
                      setError(null);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--primary-light)',
                      backgroundColor: 'rgba(4, 47, 26, 0.08)',
                      color: 'var(--primary-dark)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    SN9876543 (Moustapha)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPassport('SN1234567');
                      setError(null);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--secondary)',
                      backgroundColor: 'rgba(212, 175, 55, 0.12)',
                      color: '#8A6D1B',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    SN1234567 (Khadidiatou)
                  </button>
                </div>
              </div>
            ) : (
              /* Pilgrim Register View (Dossier Hajj) */
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="form-label">Numéro de passeport</label>
                  <div className="input-with-icon">
                    <CreditCard size={16} className="input-field-icon" />
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Ex: SN1122334"
                      value={passport}
                      style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
                      onChange={e => setPassport(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="form-label">Nom complet</label>
                  <div className="input-with-icon">
                    <User size={16} className="input-field-icon" />
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

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="form-label">Téléphone</label>
                  <div className="input-with-icon">
                    <Phone size={16} className="input-field-icon" />
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="+221 77..."
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="form-label">Email</label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-field-icon" />
                    <input
                      type="email"
                      className="form-control"
                      required
                      placeholder="exemple@mail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="form-label">Date de naissance</label>
                  <div className="input-with-icon">
                    <Calendar size={16} className="input-field-icon" />
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                    />
                  </div>
                </div>



                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="form-label">Région de Résidence (Sénégal)</label>
                  <select
                    className="form-control"
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    style={{ fontWeight: 'bold' }}
                  >
                    {SENEGAL_REGIONS.map(r => (
                      <option key={r} value={r}>📍 Région de {r}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                  <label className="form-label">Agence de voyage sélectionnée</label>
                  <select
                    className="form-control"
                    value={selectedAgencyId}
                    onChange={e => setSelectedAgencyId(e.target.value)}
                  >
                    <option value="1">Voyages Teranga Hajj & Omra (3 600 000 F CFA)</option>
                    <option value="2">Dakar Air Services Hajj (4 900 000 F CFA)</option>
                    <option value="3">Sahel Omra & Hajj Confort (8 500 000 F CFA)</option>
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="form-label">Nom du proche d'urgence</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Ex: Awa Diop (Épouse)"
                    value={emergencyContactName}
                    onChange={e => setEmergencyContactName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="form-label">Téléphone du proche d'urgence</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Ex: +221 76..."
                    value={emergencyContactPhone}
                    onChange={e => setEmergencyContactPhone(e.target.value)}
                  />
                </div>

              </div>
            )
          ) : (
            /* Admin Login View */
            <>


              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">
                  {loginRole === 'admin' ? "Identifiant Administrateur" : loginRole === 'doctor' ? "Code Unique Médecin" : "Identifiant Agence"}
                </label>
                <div className="input-with-icon">
                  <User size={16} className="input-field-icon" />
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder={loginRole === 'admin' ? "Ex: dgpadmin" : loginRole === 'doctor' ? "Ex: MED-7890 ou MED-2026-001" : "Ex: teranga"}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
                {loginRole === 'doctor' && (
                  <span style={{ fontSize: '0.73rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🏥 L'hôpital d'affectation et le registre de l'Ordre des Médecins sont détectés automatiquement.
                  </span>
                )}
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Mot de passe</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-field-icon" />
                  <input
                    type="password"
                    className="form-control"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>⚡ Remplissage rapide :</span>
                {loginRole === 'admin' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('dgpadmin');
                      setPassword('hajj2026!');
                      setError(null);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--primary-light)',
                      backgroundColor: 'rgba(4, 47, 26, 0.08)',
                      color: 'var(--primary-dark)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    dgpadmin / hajj2026!
                  </button>
                ) : loginRole === 'doctor' ? (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('MED-DKR-01');
                        setPassword('123456');
                        setError(null);
                      }}
                      style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #16A34A', backgroundColor: 'rgba(22,163,74,0.1)', color: '#15803D', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      🏥 Hôpital Principal Dakar (MED-DKR-01)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('MED-DKR-02');
                        setPassword('123456');
                        setError(null);
                      }}
                      style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #16A34A', backgroundColor: 'rgba(22,163,74,0.1)', color: '#15803D', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      🏥 Hôpital Aristide Le Dantec (MED-DKR-02)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('MED-THIES-01');
                        setPassword('123456');
                        setError(null);
                      }}
                      style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #16A34A', backgroundColor: 'rgba(22,163,74,0.1)', color: '#15803D', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      🏥 Hôpital Thiès (MED-THIES-01)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('MED-SL-01');
                        setPassword('123456');
                        setError(null);
                      }}
                      style={{ padding: '4px 10px', borderRadius: '6px', border: '1.5px solid #16A34A', backgroundColor: 'rgba(22,163,74,0.18)', color: '#047857', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}
                    >
                      🩺 Dr. Mouhamadou Kane — Hôpital Saint-Louis (MED-SL-01)
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {registeredAgencies.map((ag, idx) => (
                      <button
                        key={ag.id || idx}
                        type="button"
                        onClick={() => {
                          setUsername(ag.name);
                          setPassword('123456');
                          setError(null);
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--primary)',
                          backgroundColor: 'rgba(10, 92, 54, 0.1)',
                          color: 'var(--primary-dark)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        🏢 {ag.name} (1-clic)
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('teranga');
                        setPassword('123456');
                        setError(null);
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--primary-light)',
                        backgroundColor: 'rgba(4, 47, 26, 0.08)',
                        color: 'var(--primary-dark)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      teranga / 123456
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-full-width btn-icon-label"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? (
              <span className="spinner-loader" />
            ) : (
              <>
                <LogIn size={16} />
                <span>
                  {isPilgrimPortal 
                    ? authMode === 'login' 
                      ? "Accéder à mon espace" 
                      : "Soumettre mon dossier d'inscription"
                    : authMode === 'login' 
                      ? "Se connecter au registre" 
                      : "Valider mon inscription"}
                </span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: '20px' }}>
          <p className="security-notice">
            {isPilgrimPortal
              ? "🔒 Vos données de voyage et documents officiels sont chiffrés et protégés par la Sunu Hajj."
              : "⚠️ Accès strictement restreint. Toute action effectuée sur le registre officiel de la Sunu Hajj est loggée."}
          </p>
          {!isPilgrimPortal && !isShowingAdminToggle && (
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <span 
                onClick={() => {
                  setLocalShowAdmin(true);
                  setLoginRole('admin');
                  setError(null);
                }}
                style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)', cursor: 'pointer', textDecoration: 'underline' }}
                className="table-row-hover"
              >
                🔐 Accéder à la connexion Administrateur Sunu Hajj
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
