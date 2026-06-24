import React, { useState } from 'react';
import { Search, Check, X, ShieldAlert, HeartPulse, UserCheck, UserX, ChevronDown, ChevronUp, MapPin, Phone, Mail, FileText, Calendar, Activity, Download } from 'lucide-react';

function PilgrimsTab({ pilgrims, agencies, onUpdateStatus, onUpdateMedical }) {
  const [expandedPilgrimId, setExpandedPilgrimId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [medicalFilter, setMedicalFilter] = useState('all');
  const [agencyFilter, setAgencyFilter] = useState('all');

  const toggleExpand = (id) => {
    if (expandedPilgrimId === id) {
      setExpandedPilgrimId(null);
    } else {
      setExpandedPilgrimId(id);
    }
  };

  const getAgencyName = (agencyId) => {
    if (!agencyId) return 'Non sélectionnée';
    const agency = agencies.find(a => a.id === agencyId);
    return agency ? agency.name : 'Inconnue';
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
        matchesAgency = p.selectedAgencyId === parseInt(agencyFilter);
      }
    }

    return matchesSearch && matchesStatus && matchesMedical && matchesAgency;
  });

  const handleExportCSV = () => {
    if (filteredPilgrims.length === 0) {
      alert("Aucun pèlerin à exporter.");
      return;
    }

    const headers = ["Nom complet", "Passeport", "Téléphone", "E-mail", "Agence", "Aptitude Médicale", "Validation Inscription", "Date Inscription"];
    
    const rows = filteredPilgrims.map(p => [
      p.fullName,
      p.passportNumber,
      p.phone,
      p.email,
      getAgencyName(p.selectedAgencyId),
      p.medicalStatus === 'apte' ? 'Apte' : p.medicalStatus === 'inapte' ? 'Inapte' : 'En attente',
      p.registrationStatus === 'approved' ? 'Approuvé' : p.registrationStatus === 'rejected' ? 'Rejeté' : 'En attente',
      p.registrationDate
    ]);

    // Format fields with double quotes
    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(r => r.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Add BOM for Excel UTF-8 recognition
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

      {/* Pilgrims List */}
      <div className="panel-card animate-slide-up" style={{ animationDelay: '0.1s', marginTop: '20px' }}>
        <div className="panel-header">
          <h3 className="panel-title">Registre Officiel des Demandes d'Inscription</h3>
          <span className="badge badge-primary">{filteredPilgrims.length} pèlerins trouvés</span>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Pèlerin</th>
                <th>Passeport</th>
                <th>Agence Sélectionnée</th>
                <th>Aptitude Médicale</th>
                <th>Validation Inscription</th>
                <th style={{ textAlign: 'right', width: '220px' }}>Décisions Administratives</th>
              </tr>
            </thead>
            <tbody>
              {filteredPilgrims.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="empty-state">
                      <FileText size={36} className="empty-icon" />
                      <p>Aucun dossier de pèlerin ne correspond à vos critères.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPilgrims.map(p => {
                  const isExpanded = expandedPilgrimId === p.id;
                  return (
                    <React.Fragment key={p.id}>
                      <tr className={`table-row-hover ${isExpanded ? 'row-expanded-parent' : ''}`} onClick={() => toggleExpand(p.id)} style={{ cursor: 'pointer' }}>
                        <td>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </td>
                        <td>
                          <div className="pelerin-identity">
                            <span className="pelerin-name">{p.fullName}</span>
                            <span className="pelerin-email" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.email || 'Pas d\'e-mail'}</span>
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{p.passportNumber}</strong>
                        </td>
                        <td>
                          <span className={`badge ${p.selectedAgencyId ? 'badge-info' : 'badge-accent-light'}`}>
                            {getAgencyName(p.selectedAgencyId)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-type-${p.medicalStatus === 'apte' ? 'economique' : p.medicalStatus === 'inapte' ? 'danger' : 'standard'}`}>
                            {p.medicalStatus === 'apte' ? '🟢 Apte' : p.medicalStatus === 'inapte' ? '🔴 Inapte' : '🟡 En attente'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-type-${p.registrationStatus === 'approved' ? 'economique' : p.registrationStatus === 'rejected' ? 'danger' : 'standard'}`}>
                            {p.registrationStatus === 'approved' ? 'Approuvé' : p.registrationStatus === 'rejected' ? 'Rejeté' : 'En attente'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            {p.registrationStatus !== 'approved' && (
                              <button
                                className="action-btn btn-phone"
                                style={{ width: 'auto', height: 'auto', padding: '6px 10px', borderRadius: '4px', display: 'flex', gap: '4px', fontSize: '0.78rem', fontWeight: 700 }}
                                onClick={() => onUpdateStatus(p.id, 'approved')}
                                title="Valider l'inscription"
                              >
                                <Check size={14} style={{ color: 'var(--accent-green)' }} /> Valider
                              </button>
                            )}
                            {p.registrationStatus !== 'rejected' && (
                              <button
                                className="action-btn-danger"
                                style={{ padding: '6px 10px', fontSize: '0.78rem', fontWeight: 700, gap: '4px' }}
                                onClick={() => onUpdateStatus(p.id, 'rejected')}
                                title="Refuser le dossier"
                              >
                                <X size={14} /> Refuser
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="row-expanded-detail" onClick={e => e.stopPropagation()}>
                          <td colSpan="7">
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
                                </div>

                                {/* Medical Aptitude Administration */}
                                <div className="detail-meta">
                                  <h4 className="detail-subtitle">Contrôle Médical DGP</h4>
                                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Décision d'Aptitude Médicale :</label>
                                  <select
                                    className="form-control"
                                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                    value={p.medicalStatus}
                                    onChange={e => onUpdateMedical(p.id, e.target.value)}
                                  >
                                    <option value="pending">🟡 En attente d'examen</option>
                                    <option value="apte">🟢 Déclaré APTE au Hajj</option>
                                    <option value="inapte">🔴 Déclaré INAPTE / Contre-indiqué</option>
                                  </select>
                                  <div style={{ marginTop: '10px', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    <ShieldAlert size={12} />
                                    <span>L'aptitude médicale conditionne le visa Hajj officiel.</span>
                                  </div>
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
      </div>
    </div>
  );
}

export default PilgrimsTab;
