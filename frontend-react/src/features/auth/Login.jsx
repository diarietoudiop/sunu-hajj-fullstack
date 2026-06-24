import React, { useState } from 'react';
import { User, Lock, LogIn, AlertCircle } from 'lucide-react';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate network delay for a more premium realistic feel
    setTimeout(() => {
      if (username === 'dgpadmin' && password === 'hajj2026!') {
        onLoginSuccess();
      } else {
        setError("Identifiant ou mot de passe administratif incorrect.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-page-container">
      <div className="login-card-wrapper animate-slide-up">
        {/* Flag header line */}
        <div className="flag-top-indicator">
          <div className="color-green" />
          <div className="color-yellow" />
          <div className="color-red" />
        </div>

        {/* Institution Badge */}
        <div className="login-logo-section">
          <div className="senegal-seal">🇸🇳</div>
          <h1 className="admin-title">République du Sénégal</h1>
          <p className="admin-subtitle">Délégation Générale au Pèlerinage (DGP)</p>
        </div>

        <div className="login-divider" />

        <h2 className="login-welcome-title">Portail d'Administration Hajj</h2>
        <p className="login-welcome-desc">Veuillez renseigner vos accès sécurisés pour accéder au registre de contrôle.</p>

        {/* Error message */}
        {error && (
          <div className="login-error-box fade-in">
            <AlertCircle size={16} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modern-form login-form">
          {/* Username */}
          <div className="form-group">
            <label className="form-label">Identifiant Administrateur</label>
            <div className="input-with-icon">
              <User size={16} className="input-field-icon" />
              <input
                type="text"
                className="form-control"
                required
                placeholder="Ex: dgpadmin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
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
                <span>Se connecter au registre</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="security-notice">⚠️ Accès strictement restreint. Toute tentative de connexion non autorisée est enregistrée.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
