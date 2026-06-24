import React from 'react';
import { LayoutDashboard, Plane, Megaphone, Users } from 'lucide-react';

function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'pilgrims', label: 'Pèlerins Inscrits', icon: Users },
    { id: 'agencies', label: 'Agences Agréées', icon: Plane },
    { id: 'announcements', label: 'Communiqués Officiels', icon: Megaphone }
  ];

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo-icon">🇸🇳</div>
        <div className="logo-meta">
          <span className="logo-title">Sunu Hajj</span>
          <span className="logo-subtitle">Portail DGP Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li
                key={item.id}
                className={`menu-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} className="menu-icon" />
                <span className="menu-label">{item.label}</span>
                {isActive && <div className="active-indicator" />}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="dgp-badge">OFFICIEL DGP</div>
        <p className="footer-copyright">© 2026 DGP Sénégal</p>
      </div>
    </aside>
  );
}

export default Sidebar;
