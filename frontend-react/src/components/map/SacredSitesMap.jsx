import React, { useState } from 'react';
import { MapPin, Navigation, Compass, AlertTriangle, ShieldCheck, PhoneCall, Hotel, Tent, Crosshair, ExternalLink, Check, ShieldAlert, Heart, Bus } from 'lucide-react';
import { MOCK_SACRED_LOCATIONS, sosService } from '../../services/sosService';
import { notificationService } from '../../services/notificationService';

function SacredSitesMap({ pilgrim = null, onTriggerSOS = null }) {
  const [selectedCity, setSelectedCity] = useState('Mina'); // 'Makkah' | 'Mina' | 'Arafat' | 'Madinah'
  const [activePin, setActivePin] = useState(MOCK_SACRED_LOCATIONS[2]); // Default Mina Tent
  const [filterType, setFilterType] = useState('all'); // 'all' | 'holy_site' | 'hotel' | 'tents' | 'medical'
  const [sosSending, setSosSending] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);

  const cityLocations = MOCK_SACRED_LOCATIONS.filter(loc => loc.city === selectedCity);
  const filteredLocations = cityLocations.filter(loc => filterType === 'all' || loc.type === filterType);

  const handleSelectLocation = (loc) => {
    setActivePin(loc);
  };

  const handleTriggerSOSInMap = () => {
    setSosSending(true);
    setTimeout(() => {
      const alertObj = sosService.triggerSOS({
        pilgrimId: pilgrim?.id || 1,
        pilgrimName: pilgrim?.fullName || 'Malick Ndiaye',
        passportNumber: pilgrim?.passportNumber || 'SN55555',
        phone: pilgrim?.phone || '+221 78 591 07 67',
        city: selectedCity,
        locationName: activePin?.name || `${selectedCity} - Secteur Pèlerin`,
        gpsCoords: activePin ? { lat: activePin.lat, lng: activePin.lng } : { lat: 21.4133, lng: 39.8933 }
      });

      // Dispatch SMS confirmation to pilgrim and relative
      notificationService.sendNotification({
        recipientName: pilgrim?.fullName || 'Pèlerin',
        recipientPhone: pilgrim?.phone || '+221 78 591 07 67',
        passportNumber: pilgrim?.passportNumber || 'SN55555',
        channel: 'whatsapp',
        type: 'medical',
        title: '🚨 SIGNAL SOS TRANSPOSÉ À LA DGP',
        message: `🚨 ALERTE SOS ACTIVÉE : La brigade médicale et l'équipe d'assistance DGP à ${selectedCity} ont reçu vos coordonnées GPS (${alertObj.locationName}). Une équipe est en route vers votre position. Gardez votre téléphone allumé.`,
        sender: 'DGP Brigade de Secours 🚨'
      });

      setSosSending(false);
      setSosSuccess(true);
      if (onTriggerSOS) onTriggerSOS(alertObj);

      setTimeout(() => setSosSuccess(false), 4000);
    }, 800);
  };

  return (
    <div className="sacred-map-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* City Switcher Banner */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '14px 20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
            <Compass size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#042F1A' }}>
              Carte Interactive & GPS des Lieux Saints
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Localisation en temps réel de votre hôtel, votre tente à Mina et des postes médicaux DGP
            </p>
          </div>
        </div>

        {/* City Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'Mina', label: '🎪 Mina (Tentes)', icon: '🎪' },
            { id: 'Makkah', label: '🕋 Makkah (Haram)', icon: '🕋' },
            { id: 'Arafat', label: '⛰️ Arafat (Mont)', icon: '⛰️' },
            { id: 'Madinah', label: '🕌 Madinah (Médine)', icon: '🕌' }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCity(c.id);
                const firstInCity = MOCK_SACRED_LOCATIONS.find(l => l.city === c.id);
                if (firstInCity) setActivePin(firstInCity);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: selectedCity === c.id ? '2px solid #042F1A' : '1px solid #cbd5e1',
                backgroundColor: selectedCity === c.id ? '#042F1A' : '#ffffff',
                color: selectedCity === c.id ? '#ffffff' : '#334155',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Visual Map Canvas + Location Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }} className="map-main-grid">
        
        {/* Interactive Vector Map Canvas */}
        <div 
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            position: 'relative',
            minHeight: '420px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #334155'
          }}
        >
          {/* Map Controls Header */}
          <div 
            style={{
              padding: '12px 18px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              zIndex: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '0.85rem', fontWeight: 700 }}>
              <MapPin size={16} color="#D4AF37" />
              <span>Secteur : {selectedCity} • Vue Carte Satellite HD</span>
            </div>

            {/* Type Filters */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setFilterType('all')}
                style={{ border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', fontWeight: 600, backgroundColor: filterType === 'all' ? '#D4AF37' : 'rgba(255,255,255,0.1)', color: filterType === 'all' ? '#042F1A' : '#ffffff', cursor: 'pointer' }}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterType('hotel')}
                style={{ border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', fontWeight: 600, backgroundColor: filterType === 'hotel' ? '#3b82f6' : 'rgba(255,255,255,0.1)', color: '#ffffff', cursor: 'pointer' }}
              >
                🏨 Hôtels
              </button>
              <button
                onClick={() => setFilterType('tents')}
                style={{ border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', fontWeight: 600, backgroundColor: filterType === 'tents' ? '#10b981' : 'rgba(255,255,255,0.1)', color: '#ffffff', cursor: 'pointer' }}
              >
                🎪 Tentes
              </button>
              <button
                onClick={() => setFilterType('medical')}
                style={{ border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', fontWeight: 600, backgroundColor: filterType === 'medical' ? '#ef4444' : 'rgba(255,255,255,0.1)', color: '#ffffff', cursor: 'pointer' }}
              >
                🏥 Santé DGP
              </button>
            </div>
          </div>

          {/* Canvas Graphic Vector Display */}
          <div 
            style={{
              flex: 1,
              position: 'relative',
              background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              overflow: 'hidden'
            }}
          >
            {/* Grid Pattern Overlay */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.15) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                opacity: 0.6
              }}
            />

            {/* Stylized Map Roads Lines */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: 0.35, pointerEvents: 'none' }}>
              <path d="M 50 100 Q 200 150 400 200 T 800 300" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6 6" fill="none" />
              <path d="M 100 350 Q 300 250 500 150 T 700 80" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
              <circle cx="500" cy="200" r="140" stroke="rgba(212,175,55,0.3)" strokeWidth="1" fill="none" />
            </svg>

            {/* Interactive Pins Floating */}
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-around', zIndex: 5 }}>
              {filteredLocations.map((loc, idx) => {
                const isSelected = activePin?.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '20px',
                        backgroundColor: isSelected ? '#D4AF37' : 'rgba(30, 41, 59, 0.9)',
                        color: isSelected ? '#042F1A' : '#ffffff',
                        border: isSelected ? '3px solid #ffffff' : '1px solid rgba(255,255,255,0.3)',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.7)' : '0 4px 12px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{loc.icon}</span>
                      <span>{loc.name.split('(')[0]}</span>
                    </div>

                    <div
                      style={{
                        width: '0',
                        height: '0',
                        borderLeft: '7px solid transparent',
                        borderRight: '7px solid transparent',
                        borderTop: `9px solid ${isSelected ? '#D4AF37' : 'rgba(30, 41, 59, 0.9)'}`
                      }}
                    />

                    {/* Pulse Dot */}
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#22c55e' : '#94a3b8',
                        boxShadow: isSelected ? '0 0 10px #22c55e' : 'none',
                        marginTop: '2px'
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Bottom Overlay Legend */}
            <div 
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: '10px',
                color: '#94a3b8',
                fontSize: '0.72rem',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span>🟢 GPS Actif (Précision 3m)</span>
              <span>🚌 Navettes DGP H24</span>
            </div>
          </div>

        </div>

        {/* Selected Location Info Card & Action Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Details Card */}
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>{activePin?.icon || '📍'}</span>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#D4AF37', letterSpacing: '0.5px' }}>
                  {activePin?.city} • {activePin?.type}
                </span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                  {activePin?.name}
                </h4>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.4, backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
              {activePin?.description}
            </p>

            <div style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Coordonnées GPS :</span>
                <strong style={{ fontFamily: 'monospace' }}>{activePin?.lat.toFixed(4)}, {activePin?.lng.toFixed(4)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Distance du Haram :</span>
                <strong>{selectedCity === 'Makkah' ? '500m (Navette 3 min)' : selectedCity === 'Mina' ? '5.2 km (Secteur Tentes)' : '18.4 km'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Assistance DGP :</span>
                <strong style={{ color: '#16a34a' }}>🟢 Permanente 24h/24</strong>
              </div>
            </div>

            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${activePin?.lat},${activePin?.lng}`, '_blank')}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ExternalLink size={15} /> Ouvrir dans Google Maps GPS
            </button>
          </div>

          {/* SOS Urgent Emergency Card */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 8px 24px rgba(185, 28, 28, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
                className="bell-shake"
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                  Alerte SOS Pèlerin Égaré
                </h4>
                <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                  Délégation Générale au Pèlerinage
                </span>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.78rem', opacity: 0.95, lineHeight: 1.35 }}>
              En cas de perte ou d'urgence médicale aux Lieux Saints, cliquez pour transmettre votre position GPS à la Brigade DGP.
            </p>

            {sosSuccess && (
              <div 
                style={{
                  backgroundColor: '#ffffff',
                  color: '#166534',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Check size={16} /> Signal SOS Reçu ! Brigade DGP dépêchée.
              </div>
            )}

            <button
              onClick={handleTriggerSOSInMap}
              disabled={sosSending}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#ffffff',
                color: '#b91c1c',
                fontWeight: 900,
                fontSize: '0.9rem',
                cursor: sosSending ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              {sosSending ? (
                'Transmission GPS...'
              ) : (
                <>
                  <ShieldAlert size={18} /> 🚨 DÉCLENCHER ALERTE SOS GPS
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SacredSitesMap;
