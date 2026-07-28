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
import PilgrimPortal from './features/pilgrim/PilgrimPortal';
import ProfileTab from './features/profile/ProfileTab';
import AgentsTab from './features/agents/AgentsTab';
import AgencyPortal from './features/agency/AgencyPortal';
import PortalGateway from './features/gateway/PortalGateway';
import MedicalPortal from './features/medical/MedicalPortal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return sessionStorage.getItem('dgp_session') === 'true'; } catch { return false; }
  });
  const [userRole, setUserRole] = useState(() => {
    try { return sessionStorage.getItem('dgp_role') || 'admin'; } catch { return 'admin'; }
  });
  const [currentPilgrim, setCurrentPilgrim] = useState(() => {
    try {
      const saved = sessionStorage.getItem('dgp_pilgrim');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('dgp_admin_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 999,
      username: 'dgpadmin',
      fullName: 'Administrateur Sunu Hajj',
      email: 'admin@sunuhajj.sn',
      department: 'Direction Générale',
      phone: '+221 33 824 12 34',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    };
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isApiOnline, setIsApiOnline] = useState(false);
  const [stats, setStats] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [pilgrims, setPilgrims] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [alert, setAlert] = useState(null);
  const [selectedPortal, setSelectedPortal] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const path = window.location.pathname;
      const portal = urlParams.get('portal');
      const role = urlParams.get('role');
      if (portal === 'pelerin' || role === 'pilgrim') return 'pilgrim';
      if (role === 'doctor' || role === 'medical' || portal === 'medecin' || portal === 'medical') return 'doctor';
      if (role === 'agency' || portal === 'agence') return 'agency';
      if (role === 'admin' || portal === 'admin') return 'admin';
      if (path.includes('/account/login')) return 'agency';
      return null;
    } catch {
      return null;
    }
  });
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('darkMode') === 'true'; } catch { return false; }
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
    const adminsData = await ApiService.getAdmins();

    setStats(statsData);
    setAgencies(agenciesData);
    setAnnouncements(announcementsData);
    setPilgrims(pilgrimsData);
    setAdmins(adminsData);

    // Refresh current pilgrim data from DB/mock on load
    const savedRole = sessionStorage.getItem('dgp_role') || userRole;
    const savedPilgrim = sessionStorage.getItem('dgp_pilgrim');
    if (savedRole === 'pilgrim' && savedPilgrim) {
      try {
        const parsed = JSON.parse(savedPilgrim);
        const latestPilgrim = await ApiService.getPilgrimByPassport(parsed.passportNumber);
        if (latestPilgrim) {
          setCurrentPilgrim(latestPilgrim);
          sessionStorage.setItem('dgp_pilgrim', JSON.stringify(latestPilgrim));
        }
      } catch (e) {
        console.warn("Failed to refresh pilgrim data:", e);
      }
    }
  };

  const handleLoginSuccess = (role, authData = null) => {
    sessionStorage.setItem('dgp_session', 'true');
    sessionStorage.setItem('dgp_role', role);
    
    if (role === 'pilgrim') {
      sessionStorage.setItem('dgp_pilgrim', JSON.stringify(authData));
      setCurrentPilgrim(authData);
    } else {
      const profile = authData || {
        id: 999,
        username: 'dgpadmin',
        fullName: 'Administrateur Sunu Hajj',
        email: 'admin@sunuhajj.sn',
        department: 'Direction Générale',
        phone: '+221 33 824 12 34',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      };
      sessionStorage.setItem('dgp_admin_user', JSON.stringify(profile));
      setAdminUser(profile);
    }

    setUserRole(role);
    setIsAuthenticated(true);
    
    let welcomeMsg = `Bienvenue sur le portail Hajj.`;
    if (role === 'admin') {
      welcomeMsg = `Bienvenue sur le registre Sunu Hajj Hajj, ${authData?.fullName || 'Administrateur'}.`;
    } else if (role === 'agency') {
      welcomeMsg = `Bienvenue, Espace Agent Agence - ${authData?.fullName || 'Agence'}.`;
    } else if (role === 'pilgrim') {
      welcomeMsg = `Bienvenue sur votre Espace Pèlerin, ${authData?.fullName || 'Pèlerin'}.`;
    }
    triggerAlert(welcomeMsg, "success");
  };

  const handleLogout = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('dgp_session');
      localStorage.removeItem('dgp_role');
      localStorage.removeItem('dgp_pilgrim');
      localStorage.removeItem('dgp_admin_user');
    } catch (e) {}
    setUserRole('admin');
    setCurrentPilgrim(null);
    setIsAuthenticated(false);
    setSelectedPortal(null);
    window.location.href = '/';
  };

  const handleCreateAdmin = async (adminData) => {
    try {
      const newAdmin = await ApiService.createAdmin(adminData);
      setAdmins(prev => [...prev, newAdmin]);
      triggerAlert("Compte de l'agent Sunu Hajj créé avec succès !", "success");
    } catch (err) {
      triggerAlert(err.message || "Erreur de création de l'agent.", "error");
      throw err;
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await ApiService.deleteAdmin(id);
      setAdmins(prev => prev.filter(a => a.id !== id));
      triggerAlert("Compte de l'agent Sunu Hajj supprimé avec succès !", "success");
    } catch (err) {
      triggerAlert(err.message || "Erreur lors de la suppression de l'agent.", "error");
    }
  };

  const handleUpdateAdminProfile = async (updatedData) => {
    try {
      const updated = await ApiService.updateAdminProfile(updatedData);
      setAdminUser(updated);
      sessionStorage.setItem('dgp_admin_user', JSON.stringify(updated));
      triggerAlert("Votre profil administrateur a été mis à jour avec succès !", "success");
    } catch (err) {
      triggerAlert(err.message || "Erreur lors de la mise à jour du profil.", "error");
      throw err;
    }
  };

  const handleUpdatePilgrimProfile = async (id, profileData) => {
    try {
      const updated = await ApiService.updatePilgrimProfile(id, profileData);
      setCurrentPilgrim(updated);
      sessionStorage.setItem('dgp_pilgrim', JSON.stringify(updated));
      triggerAlert("Vos informations personnelles ont été mises à jour avec succès !", "success");
    } catch (err) {
      triggerAlert(err.message || "Erreur lors de la mise à jour des informations.", "error");
      throw err;
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

  const handleUpdatePilgrimMedical = async (id, medicalStatus, medicalDetails = {}) => {
    try {
      const response = await ApiService.updatePilgrimMedical(id, medicalStatus, medicalDetails);
      const bloodVal = medicalDetails.bloodType || medicalDetails.bloodGroup;
      
      setPilgrims((prev) => prev.map(p => (p.id === id || String(p.id) === String(id) || p.passportNumber === id) ? { 
        ...p, 
        medicalStatus, 
        ...medicalDetails,
        bloodType: bloodVal || p.bloodType,
        bloodGroup: bloodVal || p.bloodGroup
      } : p));

      // Synchronize logged-in pilgrim state in real-time
      if (currentPilgrim && (currentPilgrim.id === id || String(currentPilgrim.id) === String(id) || currentPilgrim.passportNumber === id)) {
        const updatedCurrent = { 
          ...currentPilgrim, 
          medicalStatus, 
          ...medicalDetails,
          bloodType: bloodVal || currentPilgrim.bloodType,
          bloodGroup: bloodVal || currentPilgrim.bloodGroup
        };
        setCurrentPilgrim(updatedCurrent);
        sessionStorage.setItem('dgp_pilgrim', JSON.stringify(updatedCurrent));
      }

      triggerAlert(`Aptitude médicale (${medicalStatus === 'apte' ? 'APTE 🟢' : 'INAPTE 🔴'}) enregistrée avec succès !`, "success");
    } catch (err) {
      triggerAlert("Erreur lors de la mise à jour de l'état médical.", "error");
    }
  };

  const handleUpdatePilgrimLogistics = async (id, logisticsData) => {
    try {
      const current = pilgrims.find(p => p.id === id);
      const updatedData = { ...current, ...logisticsData };
      const response = await ApiService.updatePilgrimLogistics(id, updatedData);
      
      if (response.mock) {
        setPilgrims((prev) => prev.map(p => p.id === id ? { ...p, ...logisticsData } : p));
        triggerAlert(`Données logistiques mises à jour localement.`, "success");
      } else {
        triggerAlert(`Données logistiques et hébergement enregistrées !`, "success");
        await checkConnectionAndLoadData();
      }
    } catch (err) {
      triggerAlert("Erreur lors de la mise à jour logistique.", "error");
    }
  };

  const handleSyncPilgrimNusuk = async (id) => {
    try {
      const response = await ApiService.syncPilgrimNusuk(id, 'synced');
      if (response.mock) {
        setPilgrims((prev) => prev.map(p => p.id === id ? { ...p, nusukSyncStatus: 'synced', visaStatus: 'issued' } : p));
        triggerAlert(`Pèlerin synchronisé localement avec le portail Nusuk (Visa Émis).`, "success");
      } else {
        triggerAlert(`Pèlerin synchronisé avec succès sur le portail Nusuk (Visa Émis) !`, "success");
        await checkConnectionAndLoadData();
      }
    } catch (err) {
      triggerAlert("Échec de la synchronisation Nusuk.", "error");
    }
  };

  const handleSyncAllNusuk = async () => {
    try {
      const response = await ApiService.syncAllNusuk();
      if (response.mock) {
        setPilgrims((prev) => prev.map(p => p.registrationStatus === 'approved' ? { ...p, nusukSyncStatus: 'synced', visaStatus: 'issued' } : p));
        triggerAlert(`Tous les pèlerins validés ont été synchronisés localement avec Nusuk.`, "success");
      } else {
        triggerAlert(`Synchronisation globale Nusuk achevée avec succès (Visas émis) !`, "success");
        await checkConnectionAndLoadData();
      }
    } catch (err) {
      triggerAlert("Erreur lors de la synchronisation globale Nusuk.", "error");
    }
  };

  const handleSelectPortal = (portal) => {
    setSelectedPortal(portal);
    if (portal === 'pilgrim') {
      window.history.pushState({}, '', '/account/login?portal=pelerin');
    } else if (portal === 'agency') {
      window.history.pushState({}, '', '/account/login?role=agency');
    } else if (portal === 'admin') {
      window.history.pushState({}, '', '/account/login?role=admin');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  // Render Login or PortalGateway if not authenticated
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
        {selectedPortal === null ? (
          <PortalGateway onSelectPortal={handleSelectPortal} onDirectLogin={handleLoginSuccess} />
        ) : (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            initialRole={selectedPortal} 
            onBackToHome={() => handleSelectPortal(null)}
          />
        )}
      </>
    );
  }

  if (userRole === 'pilgrim') {
    return (
      <div className="admin-layout">
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
        <PilgrimPortal
          pilgrim={currentPilgrim}
          isApiOnline={isApiOnline}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdatePilgrimProfile}
        />
      </div>
    );
  }

  if (userRole === 'agency') {
    return (
      <div className="admin-layout">
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
        <AgencyPortal
          agency={adminUser}
          isApiOnline={isApiOnline}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
          agencies={agencies}
        />
      </div>
    );
  }

  // Doctor Role Portal
  if (userRole === 'doctor') {
    return (
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
        <MedicalPortal
          doctorUser={adminUser}
          pilgrims={pilgrims}
          onUpdateMedical={handleUpdatePilgrimMedical}
          onLogout={handleLogout}
        />
      </div>
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
          adminUser={adminUser}
        />

        {/* Tab switcher */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            stats={stats}
            agenciesCount={agencies.length}
            announcements={announcements}
            pilgrims={pilgrims}
            onSyncAllNusuk={handleSyncAllNusuk}
          />
        )}

        {activeTab === 'pilgrims' && (
          <PilgrimsTab
            pilgrims={pilgrims}
            agencies={agencies}
            onUpdateStatus={handleUpdatePilgrimStatus}
            onUpdateMedical={handleUpdatePilgrimMedical}
            onUpdateLogistics={handleUpdatePilgrimLogistics}
            onSyncNusuk={handleSyncPilgrimNusuk}
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

        {activeTab === 'agents' && (
          <AgentsTab
            admins={admins}
            onCreateAdmin={handleCreateAdmin}
            onDeleteAdmin={handleDeleteAdmin}
            currentAdmin={adminUser}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            adminUser={adminUser}
            onUpdateProfile={handleUpdateAdminProfile}
          />
        )}
      </main>
    </div>
  );
}

export default App;
