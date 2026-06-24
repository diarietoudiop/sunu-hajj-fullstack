import React from 'react';
import { Sun, Moon, Wifi, WifiOff, LogOut } from 'lucide-react';

function Header({ activeTab, isApiOnline, darkMode, setDarkMode, onLogout }) {
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Tableau de bord DGP';
      case 'pilgrims':
        return 'Registre des Pèlerins DGP';
      case 'agencies':
        return 'Gestion des Agences Agréées';
      case 'announcements':
        return 'Publication des Communiqués';
      default:
        return 'Administration Sunu Hajj';
    }
  };

  return (
    <header className="header-panel">
      <div className="header-left">
        <h2 className="page-title">{getPageTitle()}</h2>
        <div className={`api-status-badge ${isApiOnline ? 'online' : 'offline'}`}>
          {isApiOnline ? (
            <>
              <Wifi size={14} className="status-icon" />
              <span>Serveur Connecté</span>
            </>
          ) : (
            <>
              <WifiOff size={14} className="status-icon" />
              <span>Mode Simulé (Hors-ligne)</span>
            </>
          )}
        </div>
      </div>

      <div className="header-right">
        <button
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          aria-label="Changer de thème"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {onLogout && (
          <button
            className="theme-toggle-btn logout-btn"
            onClick={onLogout}
            title="Se déconnecter"
            aria-label="Se déconnecter"
          >
            <LogOut size={18} />
          </button>
        )}

        <div className="user-profile">
          <div className="user-meta">
            <span className="user-name">DGP Sénégal</span>
            <span className="user-role">Super Administrateur</span>
          </div>
          <div className="user-avatar" title="Sénégal">🇸🇳</div>
        </div>
      </div>
    </header>
  );
}

export default Header;
