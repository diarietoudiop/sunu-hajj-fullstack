import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, PhoneCall, MapPin, X, Check, Activity, Clock, ShieldCheck, UserCheck } from 'lucide-react';
import { sosService } from '../../services/sosService';
import { notificationService } from '../../services/notificationService';

function SOSAlertModal({ isOpen, onClose, pilgrim = null }) {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'sent'
  const [activeAlert, setActiveAlert] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirmSOS = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const alertObj = sosService.triggerSOS({
        pilgrimId: pilgrim?.id || 1,
        pilgrimName: pilgrim?.fullName || 'Malick Ndiaye',
        passportNumber: pilgrim?.passportNumber || 'SN55555',
        phone: pilgrim?.phone || '+221 78 591 07 67',
        city: 'Mina',
        locationName: 'Secteur Sénégal - Mina Campement Zone 42',
        gpsCoords: { lat: 21.4133, lng: 39.8933 }
      });

      // Dispatch urgent SMS notification to pilgrim & emergency contact
      notificationService.sendNotification({
        recipientName: pilgrim?.fullName || 'Pèlerin',
        recipientPhone: pilgrim?.phone || '+221 78 591 07 67',
        passportNumber: pilgrim?.passportNumber || 'SN55555',
        channel: 'whatsapp',
        type: 'medical',
        title: '🚨 ALERTE URGENTE - BRIGADE DGP DÉPÊCHÉE',
        message: `🚨 SIGNAL SOS REÇU : La Brigade de Secours de la Délégation Générale (DGP) a géolocalisé votre position au niveau de ${alertObj.locationName}. L'équipe médicale du Dr. Babacar Ndiaye est en route vers vous. Téléphone Assistance : +966 800 123 456.`,
        sender: 'Poste Médical Officiel DGP'
      });

      setActiveAlert(alertObj);
      setIsProcessing(false);
      setStep('sent');
    }, 1000);
  };

  const handleCloseModal = () => {
    setStep('confirm');
    setActiveAlert(null);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '520px',
          maxWidth: '95vw',
          boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.4)',
          overflow: 'hidden',
          animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Modal Header */}
        <div 
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
              className="bell-shake"
            >
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>
                {step === 'confirm' ? '🚨 Confirmation d\'Alerte SOS' : '✅ Brigade DGP Dépêchée !'}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', opacity: 0.9 }}>
                Assistance d'urgence médicale & secours Pèlerins Sénégal
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {step === 'confirm' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div 
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1.5px solid #fecaca',
                  borderRadius: '14px',
                  padding: '16px',
                  color: '#991b1b',
                  fontSize: '0.88rem',
                  lineHeight: 1.45
                }}
              >
                <strong>⚠️ Vous vous sentez égaré(e) ou malade ?</strong>
                <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', color: '#7f1d1d' }}>
                  En confirmant l'alerte, vos coordonnées GPS précises ainsi que la fiche de votre passeport (<strong>{pilgrim?.passportNumber || 'SN55555'}</strong>) seront instantanément transmises aux secours de la Délégation Générale (DGP) et au Dr. Babacar Ndiaye.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Pèlerin :</span>
                  <strong>{pilgrim?.fullName || 'Malick Ndiaye'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Téléphone :</span>
                  <strong>{pilgrim?.phone || '+221 78 591 07 67'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Position estimée :</span>
                  <strong style={{ color: '#dc2626' }}>Mina - Secteur Tentes Sénégal</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSOS}
                  disabled={isProcessing}
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: isProcessing ? 'wait' : 'pointer',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
                  }}
                >
                  {isProcessing ? 'Transmission GPS...' : '🚨 CONFIRMER L\'ALERTE SOS'}
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: ALERT SENT & LIVE ASSISTANCE */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center' }}>
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
                }}
              >
                <Check size={36} />
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                  Position transmise aux Secours DGP
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.4 }}>
                  Une équipe médicale et un agent de la Délégation Générale sont en route vers votre secteur. Ne vous déplacez pas.
                </p>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: '14px', textAlign: 'left', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 800 }}>
                  <ShieldCheck size={18} /> Statut d'assistance :
                </div>
                <div>• Brigade affectée : <strong>Équipe Médicale N° 3 (Dr. Babacar Ndiaye)</strong></div>
                <div>• Temps estimé d'arrivée : <strong>4 à 7 minutes</strong></div>
                <div>• SMS de confirmation envoyé au pèlerin et à son proche.</div>
              </div>

              {/* Emergency Hotline Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <a
                  href="tel:+966800123456"
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <PhoneCall size={15} color="#D4AF37" /> Urgence Saoudite
                </a>

                <a
                  href="tel:+221338241234"
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#042F1A',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <PhoneCall size={15} color="#22c55e" /> Hotline DGP Sénégal
                </a>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Fermer et retourner au tableau de bord
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SOSAlertModal;
