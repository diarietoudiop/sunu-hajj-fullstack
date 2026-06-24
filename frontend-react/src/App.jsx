import React, { useState, useEffect } from 'react';
import { ApiService } from './services/api';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Alert from './components/common/Alert';
import DashboardTab from './features/dashboard/DashboardTab';
import AgenciesTab from './features/agencies/AgenciesTab';
import AnnouncementsTab from './features/announcements/AnnouncementsTab';
import PilgrimsTab from './features/pilgrims/PilgrimsTab';
import Login from './features/auth/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('dgp_session') === 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isApiOnline, setIsApiOnline] = useState(false);
  const [stats, setStats] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [pilgrims, setPilgrims] = useState([]);
  const [alert, setAlert] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  // Dark Mode Class Management
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Fetching data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      checkConnectionAndLoadData();
    }
  }, [isAuthenticated]);

  const triggerAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  const checkConnectionAndLoadData = async () => {
    const online = await ApiService.checkConnection();
    setIsApiOnline(online);
    
    // Load data
    const statsData = await ApiService.getStats();
    const agenciesData = await ApiService.getAgencies();
    const announcementsData = await ApiService.getAnnouncements();
    const pilgrimsData = await ApiService.getPilgrims();

    setStats(statsData);
    setAgencies(agenciesData);
    setAnnouncements(announcementsData);
    setPilgrims(pilgrimsData);
  };

  // Auth Handlers
  const handleLoginSuccess = () => {
    sessionStorage.setItem('dgp_session', 'true');
    setIsAuthenticated(true);
    triggerAlert("Connexion établie. Bienvenue sur le registre DGP Hajj.", "success");
  };

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      sessionStorage.removeItem('dgp_session');
      setIsAuthenticated(false);
      triggerAlert("Déconnexion réussie.", "success");
    }
  };

  // Data Actions
  const handleAddAgency = async (agency) => {
    try {
      const response = await ApiService.addAgency(agency);
      if (response.mock) {
        setAgencies((prev) => [...prev, response.data]);
        triggerAlert("Agence ajoutée localement (Serveur hors-ligne).", "success");
      } else {
        triggerAlert("Agence officielle accréditée avec succès !", "success");
        await checkConnectionAndLoadData();
      }
    } catch (err) {
      triggerAlert("Erreur lors de l'ajout de l'agence.", "error");
    }
  };

  const handleDeleteAgency = async (id) => {
    if (!window.confirm("Voulez-vous vraiment retirer l'accréditation officielle de cette agence ?")) return;

    try {
      const result = await ApiService.deleteAgency(id);
      if (result === true || result.mock) {
        setAgencies((prev) => prev.filter(a => a.id !== id));
        triggerAlert("Accréditation révoquée avec succès.", "success");
        if (!result.mock) {
          await checkConnectionAndLoadData();
        }
      }
    } catch (err) {
      triggerAlert("Impossible de supprimer l'agence.", "error");
    }
  };

  const handleAddAnnouncement = async (ann) => {
    try {
      const response = await ApiService.addAnnouncement(ann);
      if (response.mock) {
        setAnnouncements((prev) => [response.data, ...prev]);
        triggerAlert("Communiqué publié localement (Serveur hors-ligne).", "success");
      } else {
        triggerAlert("Communiqué officiel diffusé avec succès !", "success");
        await checkConnectionAndLoadData();
      }
    } catch (err) {
      triggerAlert("Erreur lors de la diffusion du communiqué.", "error");
    }
  };

  const handleDeleteAnnouncement = (id) => {
    if (!window.confirm("Voulez-vous masquer/retirer ce communiqué de l'historique ?")) return;
    setAnnouncements((prev) => prev.filter(a => a.id !== id));
    triggerAlert("Communiqué retiré de l'historique d'administration.", "success");
  };

  const handleUpdatePilgrimStatus = async (id, status) => {
    try {
      const response = await ApiService.updatePilgrimStatus(id, status);
      if (response.mock) {
        setPilgrims((prev) => prev.map(p => p.id === id ? { ...p, registrationStatus: status } : p));
        triggerAlert(`Statut d'inscription mis à jour localement.`, "success");
      } else {
        triggerAlert(`Dossier pèlerin mis à jour avec succès !`, "success");
        await checkConnectionAndLoadData();
      }
    } catch (err) {
      triggerAlert("Erreur lors de la mise à jour du dossier.", "error");
    }
  };

  const handleUpdatePilgrimMedical = async (id, medicalStatus) => {
    try {
      const response = await ApiService.updatePilgrimMedical(id, medicalStatus);
      if (response.mock) {
        setPilgrims((prev) => prev.map(p => p.id === id ? { ...p, medicalStatus } : p));
        triggerAlert(`Aptitude médicale mise à jour localement.`, "success");
      } else {
        triggerAlert(`Aptitude médicale enregistrée avec succès !`, "success");
        await checkConnectionAndLoadData();
      }
    } catch (err) {
      triggerAlert("Erreur lors de la mise à jour de l'état médical.", "error");
    }
  };

  // Render Login if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
        <Login onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <div className="admin-layout">
      {/* Alert display */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Panel */}
      <main className="main-content">
        <Header
          activeTab={activeTab}
          isApiOnline={isApiOnline}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
        />

        {/* Tab switcher */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            stats={stats}
            agenciesCount={agencies.length}
            announcements={announcements}
          />
        )}

        {activeTab === 'pilgrims' && (
          <PilgrimsTab
            pilgrims={pilgrims}
            agencies={agencies}
            onUpdateStatus={handleUpdatePilgrimStatus}
            onUpdateMedical={handleUpdatePilgrimMedical}
          />
        )}

        {activeTab === 'agencies' && (
          <AgenciesTab
            agencies={agencies}
            onAddAgency={handleAddAgency}
            onDeleteAgency={handleDeleteAgency}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsTab
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        )}
      </main>
    </div>
  );
}

export default App;
