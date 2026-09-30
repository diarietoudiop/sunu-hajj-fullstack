import React, { useState } from 'react';
import { Send, Smartphone, MessageSquare, X, Check, User, Phone, FileText, Sparkles } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

const PRESET_TEMPLATES = [
  {
    id: 'medical_apt',
    title: '✅ Aptitude Médicale Validée',
    channel: 'whatsapp',
    type: 'medical',
    text: (name) => `🇸🇳 Sunu Hajj : Félicitations ${name} ! Votre visite médicale d'aptitude au Hajj 2026 a été validée par la Commission Médicale. Vous êtes déclaré APTE au voyage.`
  },
  {
    id: 'visa_issued',
    title: '🕋 Visa Nusuk Émis',
    channel: 'sms',
    type: 'visa',
    text: (name) => `🕋 Sunu Hajj : ${name}, votre Visa Nusuk officiel a été émis avec succès par la Délégation Générale. Connectez-vous à votre espace pèlerin pour télécharger votre badge.`
  },
  {
    id: 'flight_assigned',
    title: '✈️ Confirmation de Vol',
    channel: 'whatsapp',
    type: 'flight',
    text: (name) => `✈️ Sunu Hajj : Cher(e) ${name}, votre vol Air Sénégal N° HC-2026-DKR pour Djeddah est confirmé pour le 15 Juin 2026. Présence requise à l'aéroport DSS à 22h00.`
  },
  {
    id: 'hotel_assigned',
    title: '🏨 Attribution Hôtel & Chambre',
    channel: 'sms',
    type: 'hotel',
    text: (name) => `🏨 Sunu Hajj : ${name}, votre hébergement est confirmé à l'Hôtel Abraj Al Bait Royal (Makkah) en Chambre 704 Lit N° 2.`
  },
  {
    id: 'payment_reminder',
    title: '💳 Rappel Finalisation Dossier',
    channel: 'whatsapp',
    type: 'info',
    text: (name) => `🇸🇳 Sunu Hajj : Cher(e) ${name}, merci d'effectuer la validation finale de vos pièces justificatives auprès de votre agence agréée avant la date limite.`
  }
];

function SendNotificationModal({ isOpen, onClose, targetPilgrim = null }) {
  const [channel, setChannel] = useState('whatsapp');
  const [recipientName, setRecipientName] = useState(targetPilgrim?.fullName || 'Malick Ndiaye');
  const [recipientPhone, setRecipientPhone] = useState(targetPilgrim?.phone || '+221 78 591 07 67');
  const [passportNumber, setPassportNumber] = useState(targetPilgrim?.passportNumber || 'SN55555');
  const [message, setMessage] = useState(
    `🇸🇳 Sunu Hajj : Cher(e) ${targetPilgrim?.fullName || 'Pèlerin'}, votre dossier Hajj 2026 a été mis à jour.`
  );
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleApplyTemplate = (tpl) => {
    setSelectedTemplate(tpl.id);
    setChannel(tpl.channel);
    setMessage(tpl.text(recipientName || 'Pèlerin'));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !recipientPhone.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      notificationService.sendNotification({
        recipientName,
        recipientPhone,
        passportNumber,
        channel,
        type: PRESET_TEMPLATES.find(t => t.id === selectedTemplate)?.type || 'info',
        title: channel === 'whatsapp' ? 'Message WhatsApp Sunu Hajj' : 'SMS Officiel Sunu Hajj',
        message: message.trim(),
        sender: 'DGP & Commission Hajj'
      });

      setIsSending(false);
      setSuccessToast(true);

      setTimeout(() => {
        setSuccessToast(false);
        onClose();
      }, 1400);
    }, 600);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
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
          borderRadius: '20px',
          width: '540px',
          maxWidth: '95vw',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Modal Header */}
        <div 
          style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #042F1A 0%, #065F35 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D4AF37'
              }}
            >
              <Send size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                Envoyer une Notification (SMS / WhatsApp)
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', opacity: 0.85 }}>
                Diffusion en direct au pèlerin via le réseau GSM / WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} style={{ padding: '24px' }}>
          
          {/* Channel Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Canal de transmission :
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: channel === 'whatsapp' ? '2px solid #25D366' : '1px solid #cbd5e1',
                  backgroundColor: channel === 'whatsapp' ? '#f0fdf4' : '#ffffff',
                  color: channel === 'whatsapp' ? '#166534' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <MessageSquare size={18} style={{ color: '#25D366' }} /> WhatsApp Instantané
              </button>

              <button
                type="button"
                onClick={() => setChannel('sms')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: channel === 'sms' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  backgroundColor: channel === 'sms' ? '#eff6ff' : '#ffffff',
                  color: channel === 'sms' ? '#1e40af' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Smartphone size={18} style={{ color: '#2563eb' }} /> SMS Direct GSM
              </button>
            </div>
          </div>

          {/* Quick Templates */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={14} style={{ color: '#D4AF37' }} />
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                Modèles de messages prédéfinis :
              </label>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {PRESET_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: selectedTemplate === tpl.id ? '1px solid #042F1A' : '1px solid #e2e8f0',
                    backgroundColor: selectedTemplate === tpl.id ? '#042F1A' : '#f8fafc',
                    color: selectedTemplate === tpl.id ? '#ffffff' : '#334155',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tpl.title}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Nom du Pèlerin :
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 32px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Téléphone (Sénégal/Inter) :
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 32px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
              Contenu du message ({channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}) :
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                lineHeight: 1.4,
                fontFamily: 'inherit',
                backgroundColor: '#fafafa'
              }}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
              <span>Expéditeur : Commission Nationale DGP</span>
              <span>{message.length} caractères</span>
            </div>
          </div>

          {/* Toast feedback */}
          {successToast && (
            <div 
              style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                border: '1px solid #86efac'
              }}
            >
              <Check size={18} /> Notification transmise avec succès au pèlerin !
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSending}
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: channel === 'whatsapp' ? '#25D366' : '#042F1A',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: isSending ? 'wait' : 'pointer',
                boxShadow: '0 4px 12px rgba(4, 47, 26, 0.25)'
              }}
            >
              {isSending ? (
                'Transmission en cours...'
              ) : (
                <>
                  <Send size={16} /> Envoyer via {channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default SendNotificationModal;
