import React, { useState, useEffect } from 'react';
import { MessageSquare, Smartphone, X, CheckCheck, Wifi, Battery, Signal, ChevronRight, User } from 'lucide-react';

function PhoneNotificationToast() {
  const [activeNotif, setActiveNotif] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleSmsReceived = (e) => {
      const notif = e.detail;
      if (notif) {
        setActiveNotif(notif);
        setIsExpanded(false);

        // Auto dismiss after 10s if not clicked
        const timer = setTimeout(() => {
          setActiveNotif(null);
        }, 10000);

        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('sunuhajj_live_sms_received', handleSmsReceived);
    return () => window.removeEventListener('sunuhajj_live_sms_received', handleSmsReceived);
  }, []);

  if (!activeNotif) return null;

  const isWhatsApp = activeNotif.channel === 'whatsapp';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999999,
        animation: 'slideUpBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      {!isExpanded ? (
        /* Compact Floating Toast Preview */
        <div
          onClick={() => setIsExpanded(true)}
          style={{
            backgroundColor: isWhatsApp ? '#075E54' : '#1e293b',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            width: '350px',
            maxWidth: '90vw'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: isWhatsApp ? '#25D366' : '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
            }}
          >
            {isWhatsApp ? <MessageSquare size={22} color="#ffffff" /> : <Smartphone size={22} color="#ffffff" />}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: isWhatsApp ? '#25D366' : '#60a5fa' }}>
                {isWhatsApp ? '💬 WhatsApp reçu' : '📱 SMS reçu (GSM)'}
              </span>
              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>À l'instant</span>
            </div>

            <h5 style={{ margin: '0 0 2px 0', fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeNotif.recipientName} ({activeNotif.recipientPhone})
            </h5>

            <p style={{ margin: 0, fontSize: '0.76rem', opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeNotif.message}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setActiveNotif(null); }}
            style={{ background: 'none', border: 'none', color: '#ffffff', opacity: 0.6, cursor: 'pointer', padding: '2px' }}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        /* Full Smartphone Mockup View */
        <div
          style={{
            width: '320px',
            height: '480px',
            backgroundColor: '#000000',
            borderRadius: '40px',
            padding: '12px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 4px #334155',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Phone Speaker & Camera Bar */}
          <div style={{ height: '20px', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: '80px', height: '14px', backgroundColor: '#1e293b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0f172a', marginRight: '8px' }} />
              <div style={{ width: '30px', height: '4px', backgroundColor: '#0f172a', borderRadius: '2px' }} />
            </div>
          </div>

          {/* Status Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 14px 6px 14px', color: '#ffffff', fontSize: '0.65rem', fontWeight: 600 }}>
            <span>09:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Signal size={10} />
              <Wifi size={10} />
              <Battery size={12} />
            </div>
          </div>

          {/* Phone Screen Header */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: isWhatsApp ? '#075E54' : '#1e293b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} />
              </div>
              <div>
                <h6 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>
                  {activeNotif.sender || 'Sunu Hajj Official'}
                </h6>
                <span style={{ fontSize: '0.6rem', color: isWhatsApp ? '#25D366' : '#93c5fd' }}>
                  {isWhatsApp ? 'WhatsApp Officiel • En ligne' : 'SMS Sénégal (Orange/Free/Expresso)'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Message Area Background */}
          <div
            style={{
              flex: 1,
              backgroundColor: isWhatsApp ? '#efeae2' : '#f1f5f9',
              padding: '14px 10px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}
          >
            <div style={{ textAlign: 'center', margin: '0 0 12px 0' }}>
              <span style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: '8px', fontSize: '0.62rem', color: '#64748b' }}>
                Aujourd'hui
              </span>
            </div>

            {/* Message Bubble */}
            <div
              style={{
                alignSelf: 'flex-start',
                maxWidth: '85%',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                padding: '10px 12px',
                borderRadius: '0px 14px 14px 14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                fontSize: '0.78rem',
                lineHeight: 1.4,
                position: 'relative'
              }}
            >
              <p style={{ margin: '0 0 6px 0', fontWeight: 500 }}>
                {activeNotif.message}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.62rem', color: '#94a3b8' }}>
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isWhatsApp && <CheckCheck size={12} color="#34d399" />}
              </div>
            </div>
          </div>

          {/* Phone Bottom Home Bar */}
          <div style={{ padding: '8px 0 2px 0', backgroundColor: '#000000', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100px', height: '4px', backgroundColor: '#ffffff', borderRadius: '2px', opacity: 0.7 }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PhoneNotificationToast;
