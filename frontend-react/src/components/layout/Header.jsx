import React from 'react';
import { Sun, Moon, Wifi, WifiOff, LogOut } from 'lucide-react';

function Header({ activeTab, isApiOnline, darkMode, setDarkMode, onLogout, adminUser }) {
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Tableau de bord Sunu Hajj';
      case 'pilgrims':
        return 'Registre des Pèlerins Sunu Hajj';
      case 'agencies':
        return 'Gestion des Agences Agréées';
      case 'announcements':
        return 'Publication des Communiqués';
      case 'profile':
        return 'Mon Profil Administrateur';
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
          className="btn btn-outline"
          onClick={() => alert("📱 Sunu Hajj App : Pour installer l'application sur votre écran d'accueil, appuyez sur le menu de votre navigateur et sélectionnez 'Ajouter à l'écran d'accueil'.")}
          style={{ height: '36px', fontSize: '0.78rem', padding: '0 12px', borderRadius: '8px', border: '1px solid #D4AF37', color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)', fontWeight: 700 }}
        >
          📱 Installer l'App Mobile
        </button>

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
            <span className="user-name">{adminUser?.fullName || 'Sunu Hajj'}</span>
            <span className="user-role">{adminUser?.department || 'Super Administrateur'}</span>
          </div>
          {adminUser?.avatar ? (
            <img 
              src={adminUser.avatar} 
              alt="Avatar" 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--secondary)' }} 
            />
          ) : (
            <div className="user-avatar" title="Sénégal">🇸🇳</div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
