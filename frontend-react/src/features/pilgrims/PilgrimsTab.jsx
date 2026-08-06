import React, { useState } from 'react';
import { Search, Check, X, ShieldAlert, HeartPulse, UserCheck, UserX, ChevronDown, ChevronUp, MapPin, Phone, Mail, FileText, Calendar, Activity, Download, RefreshCw } from 'lucide-react';

function PilgrimsTab({ pilgrims, agencies, onUpdateStatus, onUpdateMedical, onUpdateLogistics, onSyncNusuk }) {
  const [expandedPilgrimId, setExpandedPilgrimId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [medicalFilter, setMedicalFilter] = useState('all');
  const [agencyFilter, setAgencyFilter] = useState('all');

  const [viewMode, setViewMode] = useState('table'); // 'table' (Tableau Senior Lisible) | 'cards'
  const [isSeniorText, setIsSeniorText] = useState(true); // Large text enabled by default for accessibility

  // Input states for logistics forms
  const [flightInputs, setFlightInputs] = useState({});
  const [hotelMakkahInputs, setHotelMakkahInputs] = useState({});
  const [hotelMadinahInputs, setHotelMadinahInputs] = useState({});
  const [roomNumberInputs, setRoomNumberInputs] = useState({});
  const [visaInputs, setVisaInputs] = useState({});
  const [syncLoading, setSyncLoading] = useState({});

  const handleFlightInputChange = (id, val) => {
    setFlightInputs(prev => ({ ...prev, [id]: val }));
  };
  const handleHotelMakkahInputChange = (id, val) => {
    setHotelMakkahInputs(prev => ({ ...prev, [id]: val }));
  };
  const handleHotelMadinahInputChange = (id, val) => {
    setHotelMadinahInputs(prev => ({ ...prev, [id]: val }));
  };
  const handleRoomNumberInputChange = (id, val) => {
    setRoomNumberInputs(prev => ({ ...prev, [id]: val }));
  };
  const handleVisaInputChange = (id, val) => {
    setVisaInputs(prev => ({ ...prev, [id]: val }));
  };

  const toggleExpand = (id) => {
    if (expandedPilgrimId === id) {
      setExpandedPilgrimId(null);
    } else {
      setExpandedPilgrimId(id);
    }
  };

  const getAgencyName = (agencyId) => {
    if (agencyId === null || agencyId === undefined || agencyId === '') return 'Non sélectionnée';
    const agency = (agencies || []).find(a => String(a.id) === String(agencyId));
    if (agency) return agency.name;
    if (agencyId === 0 || agencyId === '0') return 'Commission Nationale (État)';
    if (agencyId === 1 || agencyId === '1') return 'Voyages Teranga Hajj & Omra';
    if (agencyId === 2 || agencyId === '2') return 'Dakar Air Services Hajj';
    if (agencyId === 3 || agencyId === '3') return 'Sahel Omra & Hajj Confort';
    if (agencyId === 101 || agencyId === '101') return 'Diary Voyages';
    if (agencyId === 102 || agencyId === '102') return 'Marie Voyages';
    return 'Voyages Teranga Hajj & Omra';
  };

  // Filter logic
  const filteredPilgrims = pilgrims.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.passportNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || p.registrationStatus === statusFilter;
    const matchesMedical = medicalFilter === 'all' || p.medicalStatus === medicalFilter;
    
    let matchesAgency = true;
    if (agencyFilter !== 'all') {
      if (agencyFilter === 'none') {
        matchesAgency = !p.selectedAgencyId;
      } else {
        matchesAgency = String(p.selectedAgencyId) === String(agencyFilter);
      }
    }

    return matchesSearch && matchesStatus && matchesMedical && matchesAgency;
  });

  const handleSaveLogistics = async (id) => {
    const current = pilgrims.find(p => p.id === id);
    const flightNumber = flightInputs[id] ?? current.flightNumber ?? 'Non assigné';
    const hotelMakkah = hotelMakkahInputs[id] ?? current.hotelMakkah ?? 'Non assigné';
    const hotelMadinah = hotelMadinahInputs[id] ?? current.hotelMadinah ?? 'Non assigné';
    const roomNumber = roomNumberInputs[id] ?? current.roomNumber ?? 'Non assigné';
    const visaStatus = visaInputs[id] ?? current.visaStatus ?? 'pending';

    if (onUpdateLogistics) {
      await onUpdateLogistics(id, { flightNumber, hotelMakkah, hotelMadinah, roomNumber, visaStatus });
    }
  };

  const handleManualSync = async (id) => {
    setSyncLoading(prev => ({ ...prev, [id]: true }));
    setTimeout(async () => {
      if (onSyncNusuk) {
        await onSyncNusuk(id);
      }
      setSyncLoading(prev => ({ ...prev, [id]: false }));
    }, 1200);
  };

  const handleExportCSV = () => {
    if (filteredPilgrims.length === 0) {
      alert("Aucun pèlerin à exporter.");
      return;
    }

    const headers = [
      "Nom complet", "Passeport", "Téléphone", "E-mail", "Agence", 
      "Aptitude Médicale", "Validation Inscription", "Nusuk Sync", 
      "Visa Hajj", "Vol Charter", "Hôtel Makkah", "Hôtel Madinah", "Chambre"
    ];
    
    const rows = filteredPilgrims.map(p => [
      p.fullName,
      p.passportNumber,
      p.phone,
      p.email,
      getAgencyName(p.selectedAgencyId),
      p.medicalStatus === 'apte' ? 'Apte' : p.medicalStatus === 'inapte' ? 'Inapte' : 'En attente',
      p.registrationStatus === 'approved' ? 'Approuvé' : p.registrationStatus === 'rejected' ? 'Rejeté' : 'En attente',
      p.nusukSyncStatus === 'synced' ? 'Synchronisé' : p.nusukSyncStatus === 'error' ? 'Erreur' : 'En attente',
      p.visaStatus === 'issued' ? 'Émis' : p.visaStatus === 'rejected' ? 'Refusé' : 'En cours',
      p.flightNumber || 'Non assigné',
      p.hotelMakkah || 'Non assigné',
      p.hotelMadinah || 'Non assigné',
      p.roomNumber || 'Non assigné'
    ]);

    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(r => r.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `registre_pelerins_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="tab-pane fade-in">
      {/* Search and Filters panel */}
      <div className="agencies-header-bar animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '16px', width: '100%' }}>
          {/* Search */}
          <div className="form-group" style={{ margin: 0, position: 'relative' }}>
            <label className="form-label">Rechercher un pèlerin</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '40px' }}
                placeholder="Nom ou numéro de passeport..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Status Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Statut Inscription</label>
            <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente validation</option>
              <option value="approved">Inscription validée</option>
              <option value="rejected">Inscription refusée</option>
            </select>
          </div>

          {/* Medical Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Aptitude Médicale</label>
            <select className="form-control" value={medicalFilter} onChange={e => setMedicalFilter(e.target.value)}>
              <option value="all">Toutes aptitudes</option>
              <option value="pending">En attente visite</option>
              <option value="apte">Apte à voyager</option>
              <option value="inapte">Inapte / Contre-indiqué</option>
            </select>
          </div>

          {/* Agency Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Agence choisie</label>
            <select className="form-control" value={agencyFilter} onChange={e => setAgencyFilter(e.target.value)}>
              <option value="all">Toutes les agences</option>
              <option value="none">Sans agence</option>
              {agencies.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          <button
            type="button"
            className="action-btn btn-phone"
            style={{ width: 'auto', height: 'auto', padding: '10px 18px', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '8px', fontSize: '0.88rem', fontWeight: 700 }}
            onClick={handleExportCSV}
          >
            <Download size={16} style={{ color: 'var(--primary)' }} />
            <span>Exporter le registre filtré (CSV)</span>
          </button>
        </div>
      </div>

      {/* Pilgrims List Header & Senior UX View Switcher */}
      <div className="panel-card animate-slide-up" style={{ animationDelay: '0.1s', marginTop: '20px' }}>
        <div className="panel-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 className="panel-title" style={{ fontSize: isSeniorText ? '1.25rem' : '1.1rem' }}>Registre Officiel des Demandes d'Inscription</h3>
            <span className="badge badge-primary" style={{ marginTop: '4px' }}>{filteredPilgrims.length} pèlerins trouvés</span>
          </div>

          {/* Senior UX View Switcher Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: viewMode === 'cards' ? '2px solid #0A5C36' : '1px solid #cbd5e1',
                backgroundColor: viewMode === 'cards' ? '#0A5C36' : '#ffffff',
                color: viewMode === 'cards' ? '#ffffff' : '#042F1A',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              👵 Mode Cartes Senior Lisibles (Recommandé)
            </button>

            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: viewMode === 'table' ? '2px solid #0A5C36' : '1px solid #cbd5e1',
                backgroundColor: viewMode === 'table' ? '#0A5C36' : '#ffffff',
                color: viewMode === 'table' ? '#ffffff' : '#042F1A',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📊 Mode Tableau Standard
            </button>

            <button
              onClick={() => setIsSeniorText(!isSeniorText)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #D4AF37',
                backgroundColor: isSeniorText ? 'rgba(212,175,55,0.15)' : '#ffffff',
                color: '#042F1A',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
              title="Agrandir la taille du texte pour les personnes âgées"
            >
              🔍 Textes : {isSeniorText ? 'Grands (Senior)' : 'Normaux'}
            </button>
          </div>
        </div>

        {/* SENIOR CARDS VIEW MODE */}
        {viewMode === 'cards' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {filteredPilgrims.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
                <FileText size={48} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                <p style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Aucun dossier pèlerin trouvé avec ces filtres.</p>
              </div>
            ) : (
              filteredPilgrims.map(p => {
                const isExpanded = expandedPilgrimId === p.id;
                const speakPilgrimInfo = () => {
                  if ('speechSynthesis' in window) {
                    const textToSpeak = `Pèlerin ${p.fullName}. Passeport ${p.passportNumber}. Aptitude médicale : ${p.medicalStatus === 'apte' ? 'Apte' : 'En attente'}. Inscription : ${p.registrationStatus === 'approved' ? 'Validée' : 'En attente'}.`;
                    const utterance = new SpeechSynthesisUtterance(textToSpeak);
                    utterance.lang = 'fr-FR';
                    window.speechSynthesis.speak(utterance);
                  }
                };

                return (
                  <div 
                    key={p.id} 
                    style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '16px', 
                      border: p.registrationStatus === 'approved' ? '2px solid #0A5C36' : '1px solid #cbd5e1', 
                      padding: '20px', 
                      boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      position: 'relative'
                    }}
                  >
                    {/* Header: Avatar + Name + Passport */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, border: '2px solid #D4AF37', flexShrink: 0 }}>
                        {(p.gender === 'F' || p.fullName.toLowerCase().includes('marie') || p.fullName.toLowerCase().includes('khadidiatou') || p.fullName.toLowerCase().includes('nabou') || p.fullName.toLowerCase().includes('noor')) ? '🧕' : '👳‍♂️'}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: isSeniorText ? '1.25rem' : '1.1rem', fontWeight: 900, color: '#042F1A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.fullName}
                          </h4>
                          <button 
                            onClick={speakPilgrimInfo}
                            title="🔊 Écouter l'assistance vocale Wolof/Français"
                            style={{ border: 'none', background: 'rgba(212,175,55,0.15)', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}
                          >
                            🔊
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0A5C36', backgroundColor: '#e6f4ea', padding: '2px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                            🇸🇳 Passeport : {p.passportNumber}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                            📍 {p.region || 'Dakar'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Selected Agency Tag */}
                    <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
                      <span style={{ color: '#64748b' }}>Agence Choisie : </span>
                      <strong style={{ color: '#042F1A' }}>{getAgencyName(p.selectedAgencyId)}</strong>
                    </div>

                    {/* Status Badges Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
                      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: p.medicalStatus === 'apte' ? '#e6f4ea' : '#fff7ed', border: p.medicalStatus === 'apte' ? '1px solid #38a169' : '1px solid #fdba74' }}>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Aptitude Médicale :</span>
                        <strong style={{ color: p.medicalStatus === 'apte' ? '#047857' : '#c2410c' }}>
                          {p.medicalStatus === 'apte' ? '🟢 APTE CERTIFIÉ' : '⏳ EN ATTENTE'}
                        </strong>
                      </div>

                      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: p.nusukSyncStatus === 'synced' ? '#e6f4ea' : '#f1f5f9', border: p.nusukSyncStatus === 'synced' ? '1px solid #38a169' : '1px solid #cbd5e1' }}>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Nusuk Saudi Sync :</span>
                        <strong style={{ color: p.nusukSyncStatus === 'synced' ? '#047857' : '#475569' }}>
                          {p.nusukSyncStatus === 'synced' ? '🟢 SYNCHRONISÉ' : '⏳ EN ATTENTE'}
                        </strong>
                      </div>

                      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: p.visaStatus === 'issued' ? '#e6f4ea' : '#f1f5f9', border: p.visaStatus === 'issued' ? '1px solid #38a169' : '1px solid #cbd5e1' }}>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Visa Hajj 2026 :</span>
                        <strong style={{ color: p.visaStatus === 'issued' ? '#047857' : '#475569' }}>
                          {p.visaStatus === 'issued' ? '🟢 VISA ÉMIS' : '⏳ EN COURS'}
                        </strong>
                      </div>

                      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: p.registrationStatus === 'approved' ? '#e6f4ea' : p.registrationStatus === 'rejected' ? '#fef2f2' : '#fff7ed', border: p.registrationStatus === 'approved' ? '1px solid #38a169' : p.registrationStatus === 'rejected' ? '1px solid #fca5a5' : '1px solid #fdba74' }}>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Dossier Sunu Hajj :</span>
                        <strong style={{ color: p.registrationStatus === 'approved' ? '#047857' : p.registrationStatus === 'rejected' ? '#b91c1c' : '#c2410c' }}>
                          {p.registrationStatus === 'approved' ? '🟢 VALIDÉ' : p.registrationStatus === 'rejected' ? '🔴 REFUSÉ' : '⏳ ATTENTE'}
                        </strong>
                      </div>
                    </div>

                    {/* Action Buttons (Large Senior Touch Targets) */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      {p.registrationStatus !== 'approved' && (
                        <button
                          style={{
                            flex: 1,
                            height: '46px',
                            borderRadius: '10px',
                            backgroundColor: '#0A5C36',
                            color: '#ffffff',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                          onClick={() => onUpdateStatus(p.id, 'approved')}
                        >
                          <Check size={18} /> Valider le Dossier
                        </button>
                      )}

                      {p.registrationStatus !== 'rejected' && (
                        <button
                          style={{
                            height: '46px',
                            padding: '0 16px',
                            borderRadius: '10px',
                            backgroundColor: '#ffffff',
                            color: '#dc2626',
                            border: '2px solid #fca5a5',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                          onClick={() => onUpdateStatus(p.id, 'rejected')}
                        >
                          <X size={18} /> Refuser
                        </button>
                      )}
                    </div>

                    {/* Toggle Logistics Details */}
                    <button
                      onClick={() => toggleExpand(p.id)}
                      style={{ border: 'none', background: 'transparent', color: '#0A5C36', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', paddingTop: '4px' }}
                    >
                      {isExpanded ? "▲ Masquer la logistique" : "▼ Détails logistique (Vols, Hôtels & Chambres)"}
                    </button>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div><strong>📞 Téléphone :</strong> {p.phone || p.email}</div>
                        <div><strong>✈️ N° Vol Charter :</strong> {p.flightNumber || 'En cours d\'affectation'}</div>
                        <div><strong>🏨 Hôtel La Mecque :</strong> {p.hotelMakkah || 'En cours'}</div>
                        <div><strong>🏨 Hôtel Médine :</strong> {p.hotelMadinah || 'En cours'}</div>
                        <div><strong>🔑 N° Chambre :</strong> {p.roomNumber || 'Attribuée sur place'}</div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* STANDARD TABLE VIEW MODE */
          <div className="table-responsive">
            <table className="admin-table">
            <thead>
              <tr style={{ backgroundColor: '#cbd5e1', color: '#0f172a', borderBottom: '2.5px solid #94a3b8' }}>
                <th style={{ width: '40px', padding: '14px 10px', textAlign: 'center', color: '#0f172a' }}></th>
                <th style={{ padding: '14px 14px', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#0f172a' }}>Pèlerin</th>
                <th style={{ padding: '14px 14px', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#0f172a' }}>Passeport</th>
                <th style={{ padding: '14px 14px', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#0f172a' }}>Agence Choisie</th>
                <th style={{ padding: '14px 14px', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#0f172a' }}>Aptitude</th>
                <th style={{ padding: '14px 14px', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#0f172a' }}>Nusuk Sync</th>
                <th style={{ padding: '14px 14px', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#0f172a' }}>Visa Hajj</th>
                <th style={{ padding: '14px 14px', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#0f172a' }}>Dossier</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', width: '210px', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#0f172a' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPilgrims.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="empty-state">
                      <FileText size={36} className="empty-icon" />
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#64748b' }}>Aucun dossier de pèlerin ne correspond à vos critères.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPilgrims.map((p, pIdx) => {
                  const isExpanded = expandedPilgrimId === p.id;
                  const speakPilgrimInfo = (e) => {
                    e.stopPropagation();
                    if ('speechSynthesis' in window) {
                      const textToSpeak = `Pèlerin ${p.fullName}. Passeport ${p.passportNumber}. Aptitude médicale : ${p.medicalStatus === 'apte' ? 'Apte' : 'En attente'}. Inscription : ${p.registrationStatus === 'approved' ? 'Validée' : 'En attente'}.`;
                      const utterance = new SpeechSynthesisUtterance(textToSpeak);
                      utterance.lang = 'fr-FR';
                      window.speechSynthesis.speak(utterance);
                    }
                  };

                  return (
                    <React.Fragment key={p.id}>
                      <tr className={`table-row-hover ${isExpanded ? 'row-expanded-parent' : ''}`} onClick={() => toggleExpand(p.id)} style={{ cursor: 'pointer', borderBottom: '1px solid #cbd5e1', backgroundColor: isExpanded ? 'rgba(10,92,54,0.08)' : (pIdx % 2 === 0 ? '#f1f5f9' : '#ffffff'), transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '12px 10px', textAlign: 'center', color: '#94a3b8' }}>
                          {isExpanded ? <ChevronUp size={18} style={{ color: '#0A5C36' }} /> : <ChevronDown size={18} />}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(10,92,54,0.08)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                              {(p.gender === 'F' || p.fullName.toLowerCase().includes('marie') || p.fullName.toLowerCase().includes('khadidiatou') || p.fullName.toLowerCase().includes('nabou') || p.fullName.toLowerCase().includes('noor')) ? '🧕' : '👳‍♂️'}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <strong style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{p.fullName}</strong>
                                <button 
                                  onClick={speakPilgrimInfo}
                                  title="🔊 Assistance vocale"
                                  style={{ border: 'none', background: 'rgba(212,175,55,0.15)', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem' }}
                                >
                                  🔊
                                </button>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '1px' }}>
                                {p.email || 'Sans e-mail'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.86rem', fontWeight: 700, backgroundColor: '#f8fafc', padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#1e293b' }}>
                            🇸🇳 {p.passportNumber}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0A5C36', backgroundColor: '#ecfdf5', padding: '4px 10px', borderRadius: '20px', border: '1px solid #a7f3d0', display: 'inline-block' }}>
                            {getAgencyName(p.selectedAgencyId)}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.78rem', padding: '4px 10px', borderRadius: '20px', backgroundColor: p.medicalStatus === 'apte' ? '#ecfdf5' : p.medicalStatus === 'inapte' ? '#fef2f2' : '#fffbeb', color: p.medicalStatus === 'apte' ? '#047857' : p.medicalStatus === 'inapte' ? '#dc2626' : '#d97706', border: p.medicalStatus === 'apte' ? '1px solid #a7f3d0' : p.medicalStatus === 'inapte' ? '1px solid #fecaca' : '1px solid #fde68a', display: 'inline-block' }}>
                            {p.medicalStatus === 'apte' ? '🟢 Apte' : p.medicalStatus === 'inapte' ? '🔴 Inapte' : '⏳ Attente'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.78rem', padding: '4px 10px', borderRadius: '20px', backgroundColor: p.nusukSyncStatus === 'synced' ? '#ecfdf5' : '#f8fafc', color: p.nusukSyncStatus === 'synced' ? '#047857' : '#64748b', border: p.nusukSyncStatus === 'synced' ? '1px solid #a7f3d0' : '1px solid #e2e8f0', display: 'inline-block' }}>
                            {p.nusukSyncStatus === 'synced' ? '🇸🇦 Synchro' : '⏳ Attente'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.78rem', padding: '4px 10px', borderRadius: '20px', backgroundColor: p.visaStatus === 'issued' ? '#ecfdf5' : '#f8fafc', color: p.visaStatus === 'issued' ? '#047857' : '#64748b', border: p.visaStatus === 'issued' ? '1px solid #a7f3d0' : '1px solid #e2e8f0', display: 'inline-block' }}>
                            {p.visaStatus === 'issued' ? '🟢 Émis' : '⏳ En cours'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.78rem', padding: '4px 10px', borderRadius: '20px', backgroundColor: p.registrationStatus === 'approved' ? '#ecfdf5' : p.registrationStatus === 'rejected' ? '#fef2f2' : '#fffbeb', color: p.registrationStatus === 'approved' ? '#047857' : p.registrationStatus === 'rejected' ? '#dc2626' : '#d97706', border: p.registrationStatus === 'approved' ? '1px solid #a7f3d0' : p.registrationStatus === 'rejected' ? '1px solid #fecaca' : '1px solid #fde68a', display: 'inline-block' }}>
                            {p.registrationStatus === 'approved' ? '🟢 Validé' : p.registrationStatus === 'rejected' ? '🔴 Refusé' : '⏳ Attente'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            {p.registrationStatus !== 'approved' && (
                              <button
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  backgroundColor: '#0A5C36',
                                  color: '#ffffff',
                                  border: 'none',
                                  fontWeight: 700,
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  boxShadow: '0 2px 6px rgba(10,92,54,0.15)'
                                }}
                                onClick={() => onUpdateStatus(p.id, 'approved')}
                              >
                                <Check size={14} /> Valider
                              </button>
                            )}
                            {p.registrationStatus !== 'rejected' && (
                              <button
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  backgroundColor: '#f1f5f9',
                                  color: '#dc2626',
                                  border: '1px solid #fee2e2',
                                  fontWeight: 700,
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                onClick={() => onUpdateStatus(p.id, 'rejected')}
                              >
                                <X size={14} /> Refuser
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="row-expanded-detail" onClick={e => e.stopPropagation()}>
                          <td colSpan="9">
                            <div className="agency-detail-content fade-in" style={{ padding: '20px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                {/* General info */}
                                <div className="detail-meta">
                                  <h4 className="detail-subtitle">Informations Personnelles</h4>
                                  <div className="meta-item">
                                    <Calendar size={14} className="meta-icon" />
                                    <span>Né(e) le : <strong>{p.birthDate || 'Non spécifiée'}</strong></span>
                                  </div>
                                  <div className="meta-item">
                                    <Phone size={14} className="meta-icon" />
                                    <span>Tél : <strong>{p.phone}</strong></span>
                                  </div>
                                  <div className="meta-item">
                                    <Activity size={14} className="meta-icon" />
                                    <span>Groupe Sanguin : <strong style={{ color: 'var(--accent-red)' }}>{p.bloodType}</strong></span>
                                  </div>
                                </div>

                                {/* Emergency Contact */}
                                <div className="detail-meta">
                                  <h4 className="detail-subtitle">Contact d'urgence</h4>
                                  {p.emergencyContact?.name ? (
                                    <>
                                      <div className="meta-item">
                                        <span>Nom : <strong>{p.emergencyContact.name}</strong></span>
                                      </div>
                                      <div className="meta-item">
                                        <Phone size={14} className="meta-icon" />
                                        <span>Tél : <strong>{p.emergencyContact.phone}</strong></span>
                                      </div>
                                    </>
                                  ) : (
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Aucun renseigné.</span>
                                  )}
                                  {/* Medical Aptitude Certification (READ ONLY - Reserved for Doctors) */}
                                  <div className="detail-meta">
                                    <h4 className="detail-subtitle">Contrôle Médical Sunu Hajj</h4>
                                    <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(10,92,54,0.06)', border: '1px solid rgba(10,92,54,0.15)', marginTop: '6px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Décision Médicale :</span>
                                        <span className={`badge badge-type-${p.medicalStatus === 'apte' ? 'economique' : p.medicalStatus === 'inapte' ? 'danger' : 'standard'}`} style={{ fontWeight: 800, padding: '4px 10px', borderRadius: '12px' }}>
                                          {p.medicalStatus === 'apte' ? '🟢 APTE AU HAJJ' : p.medicalStatus === 'inapte' ? '🔴 INAPTE' : '🟡 EN ATTENTE'}
                                        </span>
                                      </div>
                                      <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#0A5C36', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <ShieldAlert size={12} />
                                        <span>🔒 Certification réservée exclusivement au Médecin Agréé ({p.assignedDoctor?.doctorName || "Dr. Médecin Référent"})</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Logistics Form (NEW) */}
                                <div className="detail-meta" style={{ gridColumn: 'span 3', borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '10px' }}>
                                  <h4 className="detail-subtitle" style={{ marginBottom: '14px' }}>Voyage & Logistique Hajj (Saudi Nusuk / Vol / Hébergement)</h4>
                                  <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSaveLogistics(p.id);
                                  }} className="modern-form">
                                    <div className="logistics-form-grid">
                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Vol Charter</label>
                                        <select
                                          className="form-control"
                                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                          value={flightInputs[p.id] ?? p.flightNumber ?? 'Non assigné'}
                                          onChange={(e) => handleFlightInputChange(p.id, e.target.value)}
                                        >
                                          <option value="Non assigné">✈ Non assigné</option>
                                          <option value="TX-201 (Dakar-Medina)">TX-201 (Dakar ➔ Médine)</option>
                                          <option value="SN-302">SN-302 (Dakar ➔ Médine)</option>
                                          <option value="TX-203">TX-203 (Dakar ➔ Djeddah)</option>
                                        </select>
                                      </div>

                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Hôtel La Mecque (Makkah)</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                          placeholder="Ex: Abraj Al-Janadriyah"
                                          value={hotelMakkahInputs[p.id] ?? p.hotelMakkah ?? ''}
                                          onChange={(e) => handleHotelMakkahInputChange(p.id, e.target.value)}
                                        />
                                      </div>

                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Hôtel Médine (Madinah)</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                          placeholder="Ex: Dar Al-Taqwa"
                                          value={hotelMadinahInputs[p.id] ?? p.hotelMadinah ?? ''}
                                          onChange={(e) => handleHotelMadinahInputChange(p.id, e.target.value)}
                                        />
                                      </div>

                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Chambre</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                          placeholder="Ex: 1204"
                                          value={roomNumberInputs[p.id] ?? p.roomNumber ?? ''}
                                          onChange={(e) => handleRoomNumberInputChange(p.id, e.target.value)}
                                        />
                                      </div>

                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Visa Hajj Saoudien</label>
                                        <select
                                          className="form-control"
                                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                          value={visaInputs[p.id] ?? p.visaStatus ?? 'pending'}
                                          onChange={(e) => handleVisaInputChange(p.id, e.target.value)}
                                        >
                                          <option value="pending">⏳ En cours de traitement</option>
                                          <option value="issued">🟢 Émis par le Consulat</option>
                                          <option value="rejected">🔴 Rejeté / Bloqué</option>
                                        </select>
                                      </div>
                                    </div>

                                    <div className="logistics-actions">
                                      <button
                                        type="button"
                                        className="action-btn btn-phone"
                                        style={{ width: 'auto', height: 'auto', padding: '8px 16px', borderRadius: '4px', display: 'flex', gap: '8px', fontSize: '0.82rem', fontWeight: 'bold' }}
                                        disabled={p.registrationStatus !== 'approved' || syncLoading[p.id]}
                                        onClick={() => handleManualSync(p.id)}
                                      >
                                        <RefreshCw size={14} className={syncLoading[p.id] ? 'spin' : ''} />
                                        <span>{p.nusukSyncStatus === 'synced' ? 'Ré-synchroniser Nusuk' : 'Synchroniser sur Nusuk'}</span>
                                      </button>

                                      <button
                                        type="submit"
                                        className="action-btn"
                                        style={{ width: 'auto', height: 'auto', padding: '8px 16px', borderRadius: '4px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', gap: '8px', fontSize: '0.82rem', fontWeight: 'bold' }}
                                      >
                                        <Check size={14} />
                                        <span>Enregistrer les infos de voyage</span>
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

export default PilgrimsTab;
