import React, { useState } from 'react';
import { Activity, Search, ShieldCheck, UserCheck, AlertTriangle, FileText, CheckCircle, XCircle, LogOut, Sun, Moon, MapPin, Stethoscope, Phone, Mail, Building2 } from 'lucide-react';
import { ApiService, MOCK_MEDICAL_STRUCTURES } from '../../services/api';

export default function MedicalPortal({ doctorUser, pilgrims = [], onUpdateMedical, onLogout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPilgrim, setSelectedPilgrim] = useState(null);
  
  // Medical Consultation Form States
  const [medicalStatus, setMedicalStatus] = useState('apte');
  const [bloodType, setBloodType] = useState('O+');
  
  // Vaccine & Date States
  const [yellowFever, setYellowFever] = useState(true);
  const [yellowFeverDate, setYellowFeverDate] = useState('2026-05-12');
  const [yellowFeverBatch, setYellowFeverBatch] = useState('LOT-YF2026-DKR');

  const [meningitis, setMeningitis] = useState(true);
  const [meningitisDate, setMeningitisDate] = useState('2026-05-12');
  const [meningitisBatch, setMeningitisBatch] = useState('LOT-MN2026-DKR');

  const [fluVaccine, setFluVaccine] = useState(true);
  const [fluVaccineDate, setFluVaccineDate] = useState('2026-05-12');

  const [covidVaccine, setCovidVaccine] = useState(true);
  const [covidVaccineDate, setCovidVaccineDate] = useState('2026-04-10');

  const [medicalNotes, setMedicalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // QR Code Scanner States
  const [showQrScannerModal, setShowQrScannerModal] = useState(false);
  const [qrScannedPilgrim, setQrScannedPilgrim] = useState(null);
  const [qrInputCode, setQrInputCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Find structure details dynamically from doctorUser or local storage
  const localMedicals = (() => {
    try { return JSON.parse(localStorage.getItem('mock_medical_structures') || '[]'); } catch (e) { return []; }
  })();
  const allMedicals = [...localMedicals, ...MOCK_MEDICAL_STRUCTURES];

  const structureCode = String(doctorUser?.code || doctorUser?.id || 'MED-DKR-01').toUpperCase();
  const foundMatch = allMedicals.find(m => m && (
    String(m.code || '').toUpperCase() === structureCode ||
    String(m.id || '').toUpperCase() === structureCode
  ));

  const structureInfo = {
    code: doctorUser?.code || doctorUser?.id || foundMatch?.code || foundMatch?.id || structureCode,
    name: doctorUser?.hospital || doctorUser?.name || foundMatch?.name || 'Structure Médicale Agréée',
    doctorName: doctorUser?.doctorName || doctorUser?.fullName || foundMatch?.doctorName || 'Dr. Médecin Chef',
    region: doctorUser?.region || foundMatch?.region || 'Dakar',
    phone: doctorUser?.phone || foundMatch?.phone || '+221 33 824 00 00',
    email: doctorUser?.email || foundMatch?.email || 'medecin@sante.gouv.sn'
  };

  const doctorName = doctorUser?.doctorName || doctorUser?.fullName || structureInfo.doctorName || 'Dr. Médecin Chef';

  // Filter pilgrims specifically for THIS doctor/hospital's waiting list
  const myDoctorPilgrims = pilgrims.filter(p => {
    if (!p) return false;
    const targetCode = String(structureCode || '').toUpperCase();
    const targetName = String(doctorName || '').toLowerCase();
    const targetHospital = String(structureInfo?.name || '').toLowerCase();

    const pCode = String(p.selectedMedicalCode || p.selectedDoctorId || p.doctorCode || p.medicalDetails?.doctorCode || '').toUpperCase();
    const pDoctorName = String(p.selectedDoctorName || p.medicalDetails?.doctorName || '').toLowerCase();
    const pHospital = String(p.selectedHospital || p.medicalDetails?.structureName || '').toLowerCase();

    // 1. Direct code match (ex: MED-DKR-02)
    if (pCode && targetCode && pCode === targetCode) return true;

    // 2. Doctor name or hospital name match
    if (pDoctorName && targetName && (pDoctorName.includes(targetName) || targetName.includes(pDoctorName))) return true;
    if (pHospital && targetHospital && (pHospital.includes(targetHospital) || targetHospital.includes(pHospital))) return true;

    // 3. Fallback for demo static test pilgrims (id 1 or id 50) without explicit doctor code
    if (!pCode && !pDoctorName && !pHospital) {
      if (p.id === 1 || p.id === 50) {
        return targetCode === 'MED-DKR-01' || targetCode === 'MED-DKR-02';
      }
      return false;
    }

    return false;
  });

  const filteredPilgrims = myDoctorPilgrims.filter(p => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      (p.fullName && p.fullName.toLowerCase().includes(query)) || 
      (p.passportNumber && p.passportNumber.toLowerCase().includes(query)) ||
      (p.phone && p.phone.includes(query));
    
    const matchesStatus = statusFilter === 'all' || p.medicalStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics for THIS doctor's pilgrims
  const totalCount = myDoctorPilgrims.length;
  const apteCount = myDoctorPilgrims.filter(p => p.medicalStatus === 'apte').length;
  const pendingCount = myDoctorPilgrims.filter(p => !p.medicalStatus || p.medicalStatus === 'pending').length;
  const inapteCount = myDoctorPilgrims.filter(p => p.medicalStatus === 'inapte').length;

  const handleDirectBloodTypeChange = async (pilgrim, newBloodType) => {
    try {
      const currentDetails = pilgrim.medicalDetails || {};
      const updatedDetails = {
        ...currentDetails,
        bloodType: newBloodType,
        bloodGroup: newBloodType,
        vaccines: currentDetails.vaccines || pilgrim.vaccines || {
          yellowFever: true,
          yellowFeverDate: '2026-05-12',
          yellowFeverBatch: 'LOT-YF2026-DKR',
          meningitis: true,
          meningitisDate: '2026-05-12',
          meningitisBatch: 'LOT-MN2026-DKR',
          fluVaccine: true,
          fluVaccineDate: '2026-05-12',
          covidVaccine: true,
          covidVaccineDate: '2026-04-10'
        },
        doctorCode: structureInfo.code,
        doctorName: doctorName,
        structureName: structureInfo.name,
        validationDate: pilgrim.validationDate || new Date().toISOString().split('T')[0]
      };

      const currentStatus = pilgrim.medicalStatus || 'pending';
      if (onUpdateMedical) {
        await onUpdateMedical(pilgrim.id, currentStatus, updatedDetails);
      } else {
        await ApiService.updatePilgrimMedical(pilgrim.id, currentStatus, updatedDetails);
      }
    } catch (err) {
      console.error("Direct blood type update error:", err);
    }
  };

  const handleOpenConsultation = (pilgrim) => {
    setSelectedPilgrim(pilgrim);
    setMedicalStatus(pilgrim.medicalStatus === 'inapte' ? 'inapte' : 'apte');
    const existingBlood = pilgrim.bloodType || pilgrim.bloodGroup || 'O+';
    setBloodType(existingBlood.includes('déterminer') ? 'O+' : existingBlood);

    const v = pilgrim.vaccines || pilgrim.medicalDetails?.vaccines || {};
    setYellowFever(v.yellowFever !== false);
    setYellowFeverDate(v.yellowFeverDate || '2026-05-12');
    setYellowFeverBatch(v.yellowFeverBatch || 'LOT-YF2026-DKR');

    setMeningitis(v.meningitis !== false);
    setMeningitisDate(v.meningitisDate || '2026-05-12');
    setMeningitisBatch(v.meningitisBatch || 'LOT-MN2026-DKR');

    setFluVaccine(v.fluVaccine !== false);
    setFluVaccineDate(v.fluVaccineDate || '2026-05-12');

    setCovidVaccine(v.covidVaccine !== false);
    setCovidVaccineDate(v.covidVaccineDate || '2026-04-10');

    setMedicalNotes(pilgrim.medicalNotes || 'Aptitude physique et psychologique validée pour le pèlerinage.');
    setSaveSuccess(false);
    setValidationError('');
  };

  const handleSaveConsultation = async (e) => {
    e.preventDefault();
    if (!selectedPilgrim) return;
    setValidationError('');

    // MANDATORY VALIDATIONS BEFORE DELIVERING MEDICAL FITNESS
    if (medicalStatus === 'apte') {
      if (!bloodType || bloodType.includes('déterminer')) {
        setValidationError("⚠️ OBLIGATOIRE : Vous devez sélectionner le groupe sanguin réel du pèlerin (ex: O+, A+, B+...) avant de valider l'aptitude médicale.");
        return;
      }
      if (!yellowFever || !meningitis) {
        setValidationError("⚠️ OBLIGATOIRE : Le vaccin Fièvre Jaune ET le vaccin Méningite Tétravalente ACYW135 doivent être TOUS LES DEUX cochés/confirmés avant de valider l'aptitude médicale.");
        return;
      }
    }
    
    setIsSubmitting(true);
    const medicalDetails = {
      bloodType,
      bloodGroup: bloodType,
      vaccines: { 
        yellowFever, 
        yellowFeverDate,
        yellowFeverBatch,
        meningitis, 
        meningitisDate,
        meningitisBatch,
        fluVaccine, 
        fluVaccineDate,
        covidVaccine,
        covidVaccineDate
      },
      medicalNotes,
      doctorCode: structureInfo.code,
      doctorName: doctorName,
      structureName: structureInfo.name,
      validationDate: new Date().toISOString().split('T')[0]
    };

    try {
      if (onUpdateMedical) {
        await onUpdateMedical(selectedPilgrim.id, medicalStatus, medicalDetails);
      } else {
        await ApiService.updatePilgrimMedical(selectedPilgrim.id, medicalStatus, medicalDetails);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSelectedPilgrim(null);
      }, 1400);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setValidationError("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  return (
    <div className={`medical-portal-layout ${darkMode ? 'dark-mode' : ''}`} style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      
      {/* Top Bar Navigation */}
      <header style={{ width: '100%', backgroundColor: '#042F1A', color: '#ffffff', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #D4AF37', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
            🩺
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              Espace Contrôle Médical Hajj 2026
            </h1>
            <span style={{ fontSize: '0.82rem', color: '#D4AF37', fontWeight: 600 }}>
              Structure Médicale Agréée — Code Unique : <strong>{structureInfo.code}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <strong style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 800 }}>{doctorName}</strong>
            <span style={{ fontSize: '0.78rem', color: '#CBD5E1', fontWeight: 600 }}>🏥 {structureInfo.name} ({structureInfo.region})</span>
          </div>

          <button 
            onClick={() => setShowPasswordModal(true)}
            style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: '#FCD34D', border: '1px solid #D4AF37', borderRadius: '8px', padding: '8px 12px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            🔑 Mot de passe
          </button>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle-btn"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {onLogout && (
            <button 
              onClick={onLogout}
              style={{ backgroundColor: '#E53E3E', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={16} /> Déconnexion
            </button>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Banner Info Structure */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px 32px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#042F1A', margin: 0 }}>
                {doctorName}
              </h2>
              <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '0.85rem', color: '#64748B', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#0A5C36', backgroundColor: 'rgba(10,92,54,0.08)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.82rem' }}>
                  🏥 {structureInfo.name}
                </span>
                <span>📍 Région : <strong>{structureInfo.region}</strong></span>
                <span>📞 Tél : <strong>{structureInfo.phone}</strong></span>
                <span>✉️ Email : <strong>{structureInfo.email}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', border: '1px solid #D4AF37', borderRadius: '12px', padding: '10px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#744210', display: 'block' }}>
              Code Habilitation Médicale
            </span>
            <strong style={{ fontSize: '1.2rem', color: '#042F1A', letterSpacing: '1px' }}>
              {structureInfo.code}
            </strong>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#E2E8F0', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Total Pèlerins</span>
              <strong style={{ fontSize: '1.5rem', color: '#0F172A' }}>{totalCount}</strong>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(34,197,94,0.15)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Aptes au Hajj 🟢</span>
              <strong style={{ fontSize: '1.5rem', color: '#16A34A' }}>{apteCount}</strong>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(234,179,8,0.15)', color: '#CA8A04', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, display: 'block' }}>En Attente Visite 🟡</span>
              <strong style={{ fontSize: '1.5rem', color: '#CA8A04' }}>{pendingCount}</strong>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Inaptes Médicaux 🔴</span>
              <strong style={{ fontSize: '1.5rem', color: '#DC2626' }}>{inapteCount}</strong>
            </div>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ position: 'relative', minWidth: '320px', flex: 1 }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Rechercher pèlerin par Nom ou Passeport (SN...)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', height: '46px', paddingLeft: '42px', paddingRight: '16px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Filtrer par aptitude :</span>
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ height: '46px', borderRadius: '10px', border: '1px solid #CBD5E1', padding: '0 16px', fontSize: '0.88rem', fontWeight: 600, backgroundColor: '#ffffff' }}
            >
              <option value="all">Tous les pèlerins ({totalCount})</option>
              <option value="pending">🟡 En attente de visite ({pendingCount})</option>
              <option value="apte">🟢 Validé Apte ({apteCount})</option>
              <option value="inapte">🔴 Inapte ({inapteCount})</option>
            </select>
          </div>

        </div>

        {/* Pilgrims Medical Register Table */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#042F1A', margin: 0 }}>
              📋 Registre Officiel des Visites Médicales Aptitude Hajj
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
              {filteredPilgrims.length} pèlerins trouvés
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Pèlerin</th>
                  <th style={{ padding: '14px 20px' }}>N° Passeport</th>
                  <th style={{ padding: '14px 20px' }}>Téléphone</th>
                  <th style={{ padding: '14px 20px' }}>Groupe Sanguin</th>
                  <th style={{ padding: '14px 20px' }}>Aptitude Médicale</th>
                  <th style={{ padding: '14px 20px' }}>Dernière Validation</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action Visite</th>
                </tr>
              </thead>
              <tbody>
                {filteredPilgrims.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                      Aucun pèlerin ne correspond à votre recherche.
                    </td>
                  </tr>
                ) : (
                  filteredPilgrims.map(p => {
                    const isApte = p.medicalStatus === 'apte';
                    const isInapte = p.medicalStatus === 'inapte';
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#ffffff' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <strong style={{ color: '#0F172A', display: 'block' }}>{p.fullName}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{p.email || 'Email non renseigné'}</span>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 700, color: '#334155' }}>
                          {p.passportNumber}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#475569' }}>
                          {p.phone || 'Non renseigné'}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <select
                            value={p.bloodType || p.bloodGroup || 'O+'}
                            onChange={(e) => handleDirectBloodTypeChange(p, e.target.value)}
                            title="Modifier directement le groupe sanguin de ce pèlerin"
                            style={{ 
                              padding: '6px 10px', 
                              borderRadius: '8px', 
                              backgroundColor: '#FAF9F5', 
                              border: '1.5px solid #D4AF37', 
                              fontWeight: 900, 
                              color: '#0A5C36', 
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}
                          >
                            <option value="O+">🩸 O Rh+ (O+)</option>
                            <option value="O-">🩸 O Rh- (O-)</option>
                            <option value="A+">🩸 A Rh+ (A+)</option>
                            <option value="A-">🩸 A Rh- (A-)</option>
                            <option value="B+">🩸 B Rh+ (B+)</option>
                            <option value="B-">🩸 B Rh- (B-)</option>
                            <option value="AB+">🩸 AB Rh+ (AB+)</option>
                            <option value="AB-">🩸 AB Rh- (AB-)</option>
                          </select>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ 
                            padding: '6px 14px', 
                            borderRadius: '20px', 
                            fontWeight: 800, 
                            fontSize: '0.8rem', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            backgroundColor: isApte ? 'rgba(34,197,94,0.15)' : isInapte ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)',
                            color: isApte ? '#15803D' : isInapte ? '#B91C1C' : '#A16207'
                          }}>
                            {isApte ? '🟢 APTE AU HAJJ' : isInapte ? '🔴 INAPTE MÉDICAL' : '🟡 EN ATTENTE VISITE'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '0.82rem', color: '#64748B' }}>
                          {p.validationDate ? (
                            <div>
                              <div>{p.validationDate}</div>
                              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{p.doctorName || structureInfo.doctorName}</span>
                            </div>
                          ) : (
                            'Non encore examinée'
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleOpenConsultation(p)}
                            style={{ padding: '8px 16px', backgroundColor: '#0A5C36', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            🩺 {isApte || isInapte ? 'Modifier Visite' : 'Passer Visite'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Modal Fiche de Consultation & Validation Médicale */}
      {selectedPilgrim && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#042F1A', margin: 0 }}>
                  🩺 Fiche de Consultation Médicale
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Validation sous la responsabilité du <strong>{doctorName}</strong> ({structureInfo.code})
                </span>
              </div>
              <button onClick={() => setSelectedPilgrim(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: '#64748B' }}>✕</button>
            </div>

            {saveSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
                <h4 style={{ color: '#042F1A', fontSize: '1.3rem', fontWeight: 800 }}>Visite Médicale Validée !</h4>
                <p style={{ color: '#64748B', fontSize: '0.92rem', marginTop: '8px' }}>
                  La décision <strong>{medicalStatus === 'apte' ? '🟢 APTE AU VOYAGE' : '🔴 INAPTE'}</strong> a été transmise en temps réel au Portail Pèlerin et à l'Administration DGP.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveConsultation} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {validationError && (
                  <div style={{ backgroundColor: '#FEF2F2', border: '1.5px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.4 }}>
                    {validationError}
                  </div>
                )}
                
                {/* Pilgrim Summary Card */}
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '16px 20px', border: '1px solid #E2E8F0' }}>
                  <strong style={{ fontSize: '1.05rem', color: '#0F172A', display: 'block' }}>{selectedPilgrim.fullName}</strong>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.85rem', color: '#64748B' }}>
                    <span>Passeport : <strong>{selectedPilgrim.passportNumber}</strong></span>
                    <span>Tél : <strong>{selectedPilgrim.phone || 'N/A'}</strong></span>
                  </div>
                </div>

                {/* Verdict Aptitude Médicale */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                    Décision Officielle d'Aptitude Physique & Médicale *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setMedicalStatus('apte')}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: medicalStatus === 'apte' ? '2px solid #16A34A' : '1px solid #CBD5E1',
                        backgroundColor: medicalStatus === 'apte' ? 'rgba(34,197,94,0.12)' : '#ffffff',
                        color: medicalStatus === 'apte' ? '#15803D' : '#64748B',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        gap: '8px'
                      }}
                    >
                      🟢 APTE AU HAJJ
                    </button>

                    <button
                      type="button"
                      onClick={() => setMedicalStatus('inapte')}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: medicalStatus === 'inapte' ? '2px solid #DC2626' : '1px solid #CBD5E1',
                        backgroundColor: medicalStatus === 'inapte' ? 'rgba(239,68,68,0.12)' : '#ffffff',
                        color: medicalStatus === 'inapte' ? '#B91C1C' : '#64748B',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        gap: '8px'
                      }}
                    >
                      🔴 INAPTE AU HAJJ
                    </button>
                  </div>
                </div>

                {/* Groupe Sanguin */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Groupe Sanguin du Pèlerin</label>
                  <select 
                    value={bloodType}
                    onChange={e => setBloodType(e.target.value)}
                    style={{ height: '44px', borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0 12px', fontWeight: 700 }}
                  >
                    <option value="O+">O Rhésus Positif (O+)</option>
                    <option value="O-">O Rhésus Négatif (O-)</option>
                    <option value="A+">A Rhésus Positif (A+)</option>
                    <option value="A-">A Rhésus Négatif (A-)</option>
                    <option value="B+">B Rhésus Positif (B+)</option>
                    <option value="B-">B Rhésus Négatif (B-)</option>
                    <option value="AB+">AB Rhésus Positif (AB+)</option>
                    <option value="AB-">AB Rhésus Négatif (AB-)</option>
                  </select>
                </div>

                {/* Vaccins Obligatoires et Dates d'Injection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    💉 Contrôle du Carnet & Dates de Vaccination :
                  </span>
                  
                  {/* Fièvre Jaune */}
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem' }}>
                      <input type="checkbox" checked={yellowFever} onChange={e => setYellowFever(e.target.checked)} />
                      <strong style={{ color: '#0F172A' }}>🟡 Fièvre Jaune (Stamaril — Obligatoire)</strong>
                    </label>
                    {yellowFever && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px', fontSize: '0.8rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Date d'Injection :</span>
                          <input 
                            type="date" 
                            value={yellowFeverDate} 
                            onChange={e => setYellowFeverDate(e.target.value)}
                            style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '0.8rem' }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>N° de Lot :</span>
                          <input 
                            type="text" 
                            value={yellowFeverBatch} 
                            onChange={e => setYellowFeverBatch(e.target.value)}
                            placeholder="LOT-YF2026-DKR"
                            style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '0.8rem' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Méningite */}
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem' }}>
                      <input type="checkbox" checked={meningitis} onChange={e => setMeningitis(e.target.checked)} />
                      <strong style={{ color: '#0F172A' }}>🟢 Méningite ACYW135 (Menactra — Obligatoire)</strong>
                    </label>
                    {meningitis && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px', fontSize: '0.8rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Date d'Injection :</span>
                          <input 
                            type="date" 
                            value={meningitisDate} 
                            onChange={e => setMeningitisDate(e.target.value)}
                            style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '0.8rem' }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>N° de Lot :</span>
                          <input 
                            type="text" 
                            value={meningitisBatch} 
                            onChange={e => setMeningitisBatch(e.target.value)}
                            placeholder="LOT-MN2026-DKR"
                            style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '0.8rem' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Grippe Saisonnière */}
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem' }}>
                      <input type="checkbox" checked={fluVaccine} onChange={e => setFluVaccine(e.target.checked)} />
                      <span>🔵 Grippe Saisonnière (Recommandé)</span>
                    </label>
                    {fluVaccine && (
                      <div style={{ marginTop: '2px', fontSize: '0.8rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Date d'Injection :</span>
                        <input 
                          type="date" 
                          value={fluVaccineDate} 
                          onChange={e => setFluVaccineDate(e.target.value)}
                          style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '0.8rem', marginTop: '2px' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Observations & Remarques Médicales */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Observations et Certificat Médical</label>
                  <textarea 
                    rows={3}
                    value={medicalNotes}
                    onChange={e => setMedicalNotes(e.target.value)}
                    placeholder="Remarques médicales, allergies, traitements en cours..."
                    style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '10px', fontSize: '0.88rem' }}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  style={{ height: '52px', backgroundColor: '#0A5C36', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.98rem', cursor: 'pointer', marginTop: '10px' }}
                >
                  {isSubmitting ? "Enregistrement en cours..." : "💾 Valider la Visite & Signer la Fiche Médicale →"}
                </button>

              </form>
            )}

          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#042F1A', margin: 0 }}>
                🔑 Modifier le Mot de Passe Structure
              </h3>
              <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <XCircle size={24} />
              </button>
            </div>

            {passwordMsg && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', backgroundColor: passwordMsg.type === 'success' ? '#DEF7EC' : '#FDE8E8', color: passwordMsg.type === 'success' ? '#03543F' : '#9B1C1C', fontSize: '0.85rem', fontWeight: 600 }}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              if (newPassword.length < 4) {
                setPasswordMsg({ text: "Le mot de passe doit contenir au moins 4 caractères.", type: 'error' });
                return;
              }
              if (newPassword !== confirmPassword) {
                setPasswordMsg({ text: "Les mots de passe ne correspondent pas.", type: 'error' });
                return;
              }

              try {
                // Save to mock_passwords map in localStorage
                const mockPasswords = JSON.parse(localStorage.getItem('mock_passwords') || '{}');
                const targetCode = String(structureInfo.code || doctorUser?.code || doctorUser?.id || 'MED-DKR-01').toUpperCase();
                mockPasswords[targetCode] = newPassword;
                localStorage.setItem('mock_passwords', JSON.stringify(mockPasswords));

                // Also update mock_medical_structures list in localStorage
                const localMedicals = JSON.parse(localStorage.getItem('mock_medical_structures') || '[]');
                const idx = localMedicals.findIndex(m => m && (String(m.code || '').toUpperCase() === targetCode || String(m.id || '').toUpperCase() === targetCode));
                if (idx !== -1) {
                  localMedicals[idx].password = newPassword;
                  localStorage.setItem('mock_medical_structures', JSON.stringify(localMedicals));
                }

                // Update active user profile in sessionStorage
                const currentUser = JSON.parse(sessionStorage.getItem('dgp_admin_user') || '{}');
                currentUser.password = newPassword;
                sessionStorage.setItem('dgp_admin_user', JSON.stringify(currentUser));
              } catch (err) {
                console.error("Failed to save password change:", err);
              }

              setPasswordMsg({ text: "✅ Mot de passe modifié et enregistré avec succès ! Utilisez ce nouveau mot de passe pour vos prochaines connexions.", type: 'success' });
              setTimeout(() => { setShowPasswordModal(false); setPasswordMsg(null); setNewPassword(''); setConfirmPassword(''); }, 1800);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                  Nouveau mot de passe
                </label>
                <input 
                  type="password" 
                  required 
                  className="form-control"
                  placeholder="Minimum 6 caractères"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                  Confirmer le mot de passe
                </label>
                <input 
                  type="password" 
                  required 
                  className="form-control"
                  placeholder="Répétez le mot de passe"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowPasswordModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>
                  Annuler
                </button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#0A5C36', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
