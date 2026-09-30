import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, MapPin, Phone, User, Clock, ChevronRight } from 'lucide-react';
import { sosService } from '../../services/sosService';

function SOSAdminWidget({ onSelectPilgrim = null }) {
  const [alerts, setAlerts] = useState([]);

  const loadAlerts = () => {
    setAlerts(sosService.getAlerts());
  };

  useEffect(() => {
    loadAlerts();

    const handleUpdate = () => loadAlerts();
    window.addEventListener('sunuhajj_sos_update', handleUpdate);
    window.addEventListener('sunuhajj_live_sos_triggered', handleUpdate);

    return () => {
      window.removeEventListener('sunuhajj_sos_update', handleUpdate);
      window.removeEventListener('sunuhajj_live_sos_triggered', handleUpdate);
    };
  }, []);

  const activeAlerts = alerts.filter(a => a.status === 'active' || a.status === 'assigned');
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  const handleResolve = (id, e) => {
    e.stopPropagation();
    sosService.resolveAlert(id);
  };

  return (
    <div 
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        border: activeAlerts.length > 0 ? '2px solid #ef4444' : '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: activeAlerts.length > 0 ? '#fee2e2' : '#f0fdf4',
              color: activeAlerts.length > 0 ? '#dc2626' : '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className={activeAlerts.length > 0 ? 'bell-shake' : ''}
          >
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Poste de Contrôle SOS & Pèlerins Égarés
            </h4>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Géolocalisation d'Urgence • DGP Sénégal
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 8px', borderRadius: '12px', backgroundColor: activeAlerts.length > 0 ? '#ef4444' : '#64748b', color: '#ffffff' }}>
            {activeAlerts.length} en cours
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '4px 8px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569' }}>
            {resolvedCount} secourus
          </span>
        </div>
      </div>

      {/* Alert List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
        {alerts.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
            Aucun signalement d'urgence pour le moment.
          </div>
        ) : (
          alerts.map(a => (
            <div
              key={a.id}
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                border: a.status === 'active' ? '1.5px solid #fca5a5' : a.status === 'assigned' ? '1.5px solid #fde68a' : '1px solid #e2e8f0',
                backgroundColor: a.status === 'active' ? '#fef2f2' : a.status === 'assigned' ? '#fffbeb' : '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <MapPin size={18} style={{ color: a.status === 'resolved' ? '#16a34a' : '#dc2626', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{a.pilgrimName}</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({a.passportNumber})</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    📍 {a.locationName} ({a.city})
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                    Équipe : {a.assignedTeam}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {a.status !== 'resolved' ? (
                  <button
                    onClick={(e) => handleResolve(a.id, e)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle size={13} /> Marquer Secouru
                  </button>
                ) : (
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a' }}>
                    🟢 Traité
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SOSAdminWidget;
