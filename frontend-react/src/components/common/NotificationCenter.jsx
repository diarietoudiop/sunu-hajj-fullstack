import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Trash2, MessageSquare, Smartphone, CheckCircle, AlertTriangle, ShieldCheck, Plane, Building, Send, X } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

function NotificationCenter({ userPhone, userPassport, isPilgrimView = false, onOpenSendModal = null }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'sms' | 'whatsapp'
  const dropdownRef = useRef(null);

  const loadNotifs = () => {
    const list = notificationService.getNotifications();
    // Filter if pilgrim view
    if (isPilgrimView && (userPhone || userPassport)) {
      const filtered = list.filter(n => 
        (userPhone && n.recipientPhone && n.recipientPhone.replace(/\s+/g, '') === userPhone.replace(/\s+/g, '')) ||
        (userPassport && n.passportNumber && n.passportNumber.toUpperCase() === userPassport.toUpperCase())
      );
      setNotifications(filtered);
    } else {
      setNotifications(list);
    }
  };

  useEffect(() => {
    loadNotifs();

    const handleUpdate = () => loadNotifs();
    window.addEventListener('sunuhajj_notification_update', handleUpdate);
    window.addEventListener('sunuhajj_live_sms_received', handleUpdate);

    return () => {
      window.removeEventListener('sunuhajj_notification_update', handleUpdate);
      window.removeEventListener('sunuhajj_live_sms_received', handleUpdate);
    };
  }, [userPhone, userPassport, isPilgrimView]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'sms') return n.channel === 'sms';
    if (activeFilter === 'whatsapp') return n.channel === 'whatsapp';
    return true;
  });

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    notificationService.markAsRead(id);
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    notificationService.deleteNotification(id);
  };

  const getTypeIcon = (type, channel) => {
    if (channel === 'whatsapp') return <MessageSquare size={16} className="notif-channel-icon whatsapp" />;
    switch (type) {
      case 'medical': return <ShieldCheck size={16} className="notif-type-icon medical" />;
      case 'visa': return <CheckCircle size={16} className="notif-type-icon visa" />;
      case 'flight': return <Plane size={16} className="notif-type-icon flight" />;
      case 'hotel': return <Building size={16} className="notif-type-icon hotel" />;
      default: return <Smartphone size={16} className="notif-type-icon sms" />;
    }
  };

  return (
    <div className="notif-center-wrapper" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className={`notif-bell-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Centre de Notifications SMS & WhatsApp"
        aria-label="Notifications"
        style={{
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-color, #1e293b)',
          transition: 'all 0.2s ease',
          boxShadow: unreadCount > 0 ? '0 0 12px rgba(212, 175, 55, 0.4)' : 'none'
        }}
      >
        <Bell size={19} className={unreadCount > 0 ? 'bell-shake' : ''} />
        {unreadCount > 0 && (
          <span 
            className="notif-badge-pill"
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              borderRadius: '10px',
              padding: '2px 6px',
              minWidth: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)',
              border: '2px solid #ffffff'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="notif-dropdown-panel"
          style={{
            position: 'absolute',
            top: '46px',
            right: '0',
            width: '380px',
            maxWidth: '92vw',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.06)',
            zIndex: 9999,
            overflow: 'hidden',
            animation: 'fadeInDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div 
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #042F1A 0%, #064e2b 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} style={{ color: '#D4AF37' }} />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.2px' }}>
                Notifications SMS & WhatsApp
              </h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {onOpenSendModal && (
                <button
                  onClick={() => { setIsOpen(false); onOpenSendModal(); }}
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#042F1A',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Envoyer un nouveau SMS / WhatsApp"
                >
                  <Send size={12} /> SMS
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8 }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div 
            style={{
              display: 'flex',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              overflowX: 'auto'
            }}
          >
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                border: 'none',
                borderRadius: '12px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: activeFilter === 'all' ? 700 : 500,
                backgroundColor: activeFilter === 'all' ? '#042F1A' : 'transparent',
                color: activeFilter === 'all' ? '#ffffff' : '#64748b',
                cursor: 'pointer'
              }}
            >
              Tous ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              style={{
                border: 'none',
                borderRadius: '12px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: activeFilter === 'unread' ? 700 : 500,
                backgroundColor: activeFilter === 'unread' ? '#ef4444' : 'transparent',
                color: activeFilter === 'unread' ? '#ffffff' : '#64748b',
                cursor: 'pointer'
              }}
            >
              Non lus ({unreadCount})
            </button>
            <button
              onClick={() => setActiveFilter('whatsapp')}
              style={{
                border: 'none',
                borderRadius: '12px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: activeFilter === 'whatsapp' ? 700 : 500,
                backgroundColor: activeFilter === 'whatsapp' ? '#25D366' : 'transparent',
                color: activeFilter === 'whatsapp' ? '#ffffff' : '#64748b',
                cursor: 'pointer'
              }}
            >
              WhatsApp
            </button>
            <button
              onClick={() => setActiveFilter('sms')}
              style={{
                border: 'none',
                borderRadius: '12px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: activeFilter === 'sms' ? 700 : 500,
                backgroundColor: activeFilter === 'sms' ? '#2563eb' : 'transparent',
                color: activeFilter === 'sms' ? '#ffffff' : '#64748b',
                cursor: 'pointer'
              }}
            >
              SMS
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Tout lire
              </button>
            )}
          </div>

          {/* Notification List */}
          <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '0' }}>
            {filteredNotifs.length === 0 ? (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94a3b8' }}>
                <Bell size={32} style={{ margin: '0 auto 8px auto', opacity: 0.4 }} />
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Aucune notification pour le moment.</p>
              </div>
            ) : (
              filteredNotifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && notificationService.markAsRead(notif.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: notif.read ? '#ffffff' : '#f0fdf4',
                    display: 'flex',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    position: 'relative'
                  }}
                  className="notif-item-row"
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: notif.channel === 'whatsapp' ? '#dcfce7' : '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: notif.channel === 'whatsapp' ? '#16a34a' : '#2563eb'
                    }}
                  >
                    {getTypeIcon(notif.type, notif.channel)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                        {notif.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 6px 0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.35 }}>
                      {notif.message}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b' }}>
                      <span>
                        {notif.channel === 'whatsapp' ? '💬 WhatsApp' : '📱 SMS Direct'} • À: {notif.recipientName} ({notif.recipientPhone})
                      </span>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        {!notif.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                            title="Marquer comme lu"
                            style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', padding: 0 }}
                          >
                            <CheckCheck size={14} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(notif.id, e)}
                          title="Supprimer"
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {!notif.read && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#16a34a'
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div 
            style={{
              padding: '10px 16px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#64748b'
            }}
          >
            Sénégal Sunu Hajj • Service Officiel SMS & WhatsApp
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
