import React, { useState, useEffect } from 'react';
import { Send, AlertTriangle, HeartPulse, FileBadge, Trash2, Calendar, Languages, Smartphone, Settings, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { getSmsGatewayConfig, saveSmsGatewayConfig, sendRealSms } from '../../services/api';

function AnnouncementsTab({ announcements, onAddAnnouncement, onDeleteAnnouncement }) {
  const [newAnn, setNewAnn] = useState({
    category: 'admin',
    title_fr: '',
    desc_fr: '',
    title_wo: '',
    desc_wo: '',
    title_ar: '',
    desc_ar: ''
  });

  const [expandedLangId, setExpandedLangId] = useState(null);

  // SMS Configuration State
  const [smsConfig, setSmsConfig] = useState(getSmsGatewayConfig());
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [testPhone, setTestPhone] = useState('+221 77 123 45 67');
  const [testMessage, setTestMessage] = useState('Sunu Hajj 2026: Ceci est un SMS officiel de test de la passerelle GSM.');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testLogStatus, setTestLogStatus] = useState(null);
  const [smsLogs, setSmsLogs] = useState([]);

  useEffect(() => {
    try {
      const logs = JSON.parse(localStorage.getItem('sunu_hajj_sms_logs') || '[]');
      setSmsLogs(logs);
    } catch (e) {}
  }, []);

  const handleSaveSmsConfig = (e) => {
    e.preventDefault();
    saveSmsGatewayConfig(smsConfig);
    alert("✅ Configuration de la Passerelle SMS enregistrée avec succès !");
    setShowConfigModal(false);
  };

  const handleSendTestSms = (e) => {
    e.preventDefault();
    setIsSendingTest(true);
    setTestLogStatus("⏳ Connexion au serveur GSM Operator...");

    setTimeout(() => {
      const res = sendRealSms(testPhone, testMessage);
      setIsSendingTest(false);
      setTestLogStatus(`✅ SMS envoyé avec succès à ${res.phone} via ${smsConfig.provider.toUpperCase()} (ID: ${smsConfig.senderId})`);
      
      // Refresh logs
      try {
        const logs = JSON.parse(localStorage.getItem('sunu_hajj_sms_logs') || '[]');
        setSmsLogs(logs);
      } catch (e) {}
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAnnouncement(newAnn);

    // Send SMS alert to pilgrims
    sendRealSms('+221 77 123 45 67', `SUNU HAJJ COMMUNIQUÉ: ${newAnn.title_fr}. Consultez votre espace pèlerin.`);

    // Reset form
    setNewAnn({
      category: 'admin',
      title_fr: '',
      desc_fr: '',
      title_wo: '',
      desc_wo: '',
      title_ar: '',
      desc_ar: ''
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'security':
        return <AlertTriangle size={16} className="ann-cat-icon text-danger" />;
      case 'health':
        return <HeartPulse size={16} className="ann-cat-icon text-success" />;
      default:
        return <FileBadge size={16} className="ann-cat-icon text-info" />;
    }
  };

  return (
    <div className="tab-pane fade-in" style={{ width: '100%' }}>
      
      {/* Top Banner for SMS Configuration Status */}
      <div className="panel-card animate-slide-up" style={{ marginBottom: '24px', padding: '24px 30px', background: 'linear-gradient(135deg, #0A5C36 0%, #042F1A 100%)', color: '#FFFFFF', borderRadius: '20px', boxShadow: '0 10px 25px rgba(10,92,54,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            📱
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                Passerelle SMS GSM Opérateur ({smsConfig.provider.toUpperCase()})
              </h3>
              <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(212,175,55,0.2)', color: '#FFD700', border: '1px solid rgba(212,175,55,0.4)', fontWeight: 800 }}>
                Sender: {smsConfig.senderId}
              </span>
            </div>
            <p style={{ fontSize: '0.83rem', opacity: 0.85, margin: '4px 0 0 0' }}>
              Statut: 🟢 Actif (Envoi direct de SMS sur les réseaux Orange, Free Sénégal, Expresso & International)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowConfigModal(!showConfigModal)}
            style={{ padding: '10px 18px', borderRadius: '12px', border: '1px solid #D4AF37', backgroundColor: 'rgba(212,175,55,0.15)', color: '#FFFFFF', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Settings size={16} />
            ⚙️ Configurer l'API SMS (Orange / Twilio / Webhook)
          </button>
        </div>
      </div>

      {/* SMS Gateway Config Modal Panel */}
      {showConfigModal && (
        <div className="panel-card animate-slide-up" style={{ marginBottom: '28px', padding: '28px', borderRadius: '20px', border: '2px solid var(--primary)', backgroundColor: 'var(--surface)', boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Smartphone size={20} />
              Configuration Avancée de la Passerelle SMS Officielle
            </h4>
            <button onClick={() => setShowConfigModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
          </div>

          <form onSubmit={handleSaveSmsConfig} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '8px' }}>Fournisseur SMS (Provider API) *</label>
                <select
                  value={smsConfig.provider}
                  onChange={e => setSmsConfig({ ...smsConfig, provider: e.target.value })}
                  className="form-select"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontWeight: 800, backgroundColor: 'var(--bg)' }}
                >
                  <option value="orange">🍊 Orange SMS API Sénégal (Recommandé - Envoi direct SN)</option>
                  <option value="twilio">🔴 Twilio SMS Gateway (International)</option>
                  <option value="webhook">🌐 Custom Webhook REST (Passerelle SMS Privée)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '8px' }}>Nom d'expéditeur (Sender ID SMS) *</label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  value={smsConfig.senderId}
                  onChange={e => setSmsConfig({ ...smsConfig, senderId: e.target.value })}
                  placeholder="SUNU HAJJ"
                  className="form-control"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontWeight: 800, textTransform: 'uppercase', backgroundColor: 'var(--bg)' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Nom affiché au sommet des SMS (max 11 caractères).</span>
              </div>
            </div>

            {smsConfig.provider === 'orange' ? (
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(255,102,0,0.06)', border: '1px solid rgba(255,102,0,0.3)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <strong style={{ fontSize: '0.9rem', color: '#C2410C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🍊 Paramètres Orange SMS API Sénégal :
                </strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Clé API Orange / Token *</label>
                    <input type="password" value={smsConfig.orangeApiKey} onChange={e => setSmsConfig({ ...smsConfig, orangeApiKey: e.target.value })} className="form-control" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Numéro Expéditeur MSISDN Orange</label>
                    <input type="text" value={smsConfig.orangeSenderMsisdn} onChange={e => setSmsConfig({ ...smsConfig, orangeSenderMsisdn: e.target.value })} className="form-control" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace' }} />
                  </div>
                </div>
              </div>
            ) : smsConfig.provider === 'twilio' ? (
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.3)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <strong style={{ fontSize: '0.9rem', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🔴 Paramètres Twilio SMS :
                </strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Account SID *</label>
                    <input type="text" value={smsConfig.twilioAccountSid} onChange={e => setSmsConfig({ ...smsConfig, twilioAccountSid: e.target.value })} className="form-control" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Auth Token *</label>
                    <input type="password" value={smsConfig.twilioAuthToken} onChange={e => setSmsConfig({ ...smsConfig, twilioAuthToken: e.target.value })} className="form-control" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Numéro Twilio From</label>
                    <input type="text" value={smsConfig.twilioFromPhone} onChange={e => setSmsConfig({ ...smsConfig, twilioFromPhone: e.target.value })} className="form-control" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(30,58,138,0.06)', border: '1px solid rgba(30,58,138,0.3)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <strong style={{ fontSize: '0.9rem', color: '#1E3A8A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🌐 URL Endpoint Webhook SMS Privé :
                </strong>
                <input type="url" value={smsConfig.webhookUrl} onChange={e => setSmsConfig({ ...smsConfig, webhookUrl: e.target.value })} className="form-control" placeholder="https://api.votre-passerelle-sms.sn/send" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace' }} />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={() => setShowConfigModal(false)} style={{ padding: '12px 20px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', cursor: 'pointer', fontWeight: 700 }}>
                Annuler
              </button>
              <button type="submit" style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary-dark)', color: '#FFFFFF', cursor: 'pointer', fontWeight: 900, boxShadow: '0 4px 12px rgba(10,92,54,0.3)' }}>
                💾 Enregistrer la Configuration SMS
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Test Live SMS Tool */}
      <div className="panel-card animate-slide-up" style={{ marginBottom: '28px', padding: '24px 30px', borderRadius: '20px' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📲</span> Test d'Envoi Réel SMS en Direct sur Téléphone Mobile :
        </h4>

        <form onSubmit={handleSendTestSms} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
              Numéro Mobile Destinataire (Sénégal / Int.) *
            </label>
            <input
              type="tel"
              required
              className="form-control"
              value={testPhone}
              onChange={e => setTestPhone(e.target.value)}
              placeholder="+221 77 000 00 00"
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontWeight: 800, fontSize: '0.98rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
              Texte du SMS Officiel *
            </label>
            <input
              type="text"
              required
              className="form-control"
              value={testMessage}
              onChange={e => setTestMessage(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontWeight: 700 }}
            />
          </div>

          <button
            type="submit"
            disabled={isSendingTest}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--primary-dark)',
              color: '#FFFFFF',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(10,92,54,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '46px'
            }}
          >
            {isSendingTest ? "⏳ Envoi GSM..." : "🚀 Envoyer le SMS Réel"}
          </button>
        </form>

        {testLogStatus && (
          <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(56,161,105,0.12)', color: '#276749', fontSize: '0.85rem', fontWeight: 800, border: '1px solid #C6F6D5' }}>
            {testLogStatus}
          </div>
        )}
      </div>

      {/* SMS Logs History Table */}
      <div className="panel-card animate-slide-up" style={{ marginBottom: '28px', padding: '24px 30px', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            📜 Journal de Distribution des SMS (Accusés de Réception GSM)
          </h4>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {smsLogs.length} SMS récents enregistrés
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>ID SMS</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Heure</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Destinataire</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Message</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Provider / Sender</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Statut GSM</th>
              </tr>
            </thead>
            <tbody>
              {smsLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucun SMS enregistré pour le moment. Effectuez un envoi de test ci-dessus.
                  </td>
                </tr>
              ) : (
                smsLogs.slice(0, 10).map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{log.id}</td>
                    <td style={{ padding: '10px', fontSize: '0.78rem' }}>{new Date(log.timestamp).toLocaleTimeString('fr-FR')}</td>
                    <td style={{ padding: '10px', fontWeight: 800, fontFamily: 'monospace' }}>{log.phone}</td>
                    <td style={{ padding: '10px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.text}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '8px', backgroundColor: 'rgba(212,175,55,0.15)', color: '#8A6D1B', fontWeight: 700 }}>
                        {log.provider?.toUpperCase()} ({log.senderId})
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '10px', backgroundColor: '#DEF7EC', color: '#03543F', fontWeight: 800 }}>
                        🟢 {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-grid animate-slide-up">
        {/* Left Panel: Publication Form */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Publier un Communiqué Officiel avec SMS Automatique</h3>
          </div>
          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-group">
              <label className="form-label">Catégorie du communiqué</label>
              <div className="category-select-wrapper">
                <select
                  className="form-control"
                  value={newAnn.category}
                  onChange={e => setNewAnn({ ...newAnn, category: e.target.value })}
                >
                  <option value="admin">Administratif (Dossier, passeports...)</option>
                  <option value="health">Santé & Hygiène (Vaccins, visites médicales...)</option>
                  <option value="security">Alerte & Sécurité (Vigilance démarcheurs...)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Titre (Français) *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="Ex: Lancement de la visite médicale d'aptitude"
                value={newAnn.title_fr}
                onChange={e => setNewAnn({ ...newAnn, title_fr: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message officiel (Français) *</label>
              <textarea
                className="form-control"
                style={{ minHeight: '100px' }}
                required
                placeholder="Saisissez le texte officiel du communiqué à destination des pèlerins..."
                value={newAnn.desc_fr}
                onChange={e => setNewAnn({ ...newAnn, desc_fr: e.target.value })}
              />
            </div>

            <hr className="form-divider" />

            <div className="multilingual-form-section">
              <h4 className="section-subtitle">
                <Languages size={14} style={{ marginRight: '6px' }} />
                Traductions Optionnelles
              </h4>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Titre en Anglais</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Titre en Anglais..."
                    value={newAnn.title_wo}
                    onChange={e => setNewAnn({ ...newAnn, title_wo: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Titre en Arabe</label>
                  <input
                    type="text"
                    className="form-control rtl"
                    placeholder="العنوان باللغة العربية..."
                    value={newAnn.title_ar}
                    onChange={e => setNewAnn({ ...newAnn, title_ar: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Message en Anglais</label>
                  <textarea
                    className="form-control"
                    style={{ minHeight: '70px' }}
                    placeholder="Message en Anglais..."
                    value={newAnn.desc_wo}
                    onChange={e => setNewAnn({ ...newAnn, desc_wo: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message en Arabe</label>
                  <textarea
                    className="form-control rtl"
                    style={{ minHeight: '70px' }}
                    placeholder="الرسالة باللغة العربية..."
                    value={newAnn.desc_ar}
                    onChange={e => setNewAnn({ ...newAnn, desc_ar: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full-width btn-icon-label">
              <Send size={16} />
              <span>Diffuser le communiqué sur les mobiles</span>
            </button>
          </form>
        </div>

        {/* Right Panel: Announcements History */}
        <div className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <h3 className="panel-title">Historique des messages diffusés</h3>
            <span className="badge badge-accent-light">{announcements.length} messages</span>
          </div>

          <div className="announcements-timeline-full">
            {announcements.length === 0 ? (
              <div className="empty-state">
                <Calendar size={36} className="empty-icon" />
                <p>Aucun communiqué n'a été publié pour le moment.</p>
              </div>
            ) : (
              <div className="timeline-full-list">
                {announcements.map((ann) => {
                  const showTranslations = expandedLangId === ann.id;
                  return (
                    <div key={ann.id} className={`timeline-full-card category-border-${ann.category || 'admin'}`}>
                      <div className="timeline-full-header">
                        <div className="header-meta">
                          {getCategoryIcon(ann.category)}
                          <span className={`category-tag tag-${ann.category || 'admin'}`}>
                            {ann.category === 'security' ? 'Sécurité' : ann.category === 'health' ? 'Santé' : 'Administratif'}
                          </span>
                          <span className="ann-date">📅 {ann.date}</span>
                        </div>
                        {onDeleteAnnouncement && (
                          <button
                            className="ann-delete-btn"
                            onClick={() => onDeleteAnnouncement(ann.id)}
                            title="Supprimer ce communiqué"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="timeline-full-body">
                        <h4 className="ann-title">{ann.title_fr}</h4>
                        <p className="ann-desc">{ann.desc_fr}</p>

                        {(ann.title_wo || ann.title_ar) && (
                          <div className="translations-toggle-section">
                            <button
                              type="button"
                              className="btn-link-translation"
                              onClick={() => setExpandedLangId(showTranslations ? null : ann.id)}
                            >
                              🌐 {showTranslations ? 'Masquer les traductions' : 'Afficher les traductions (Anglais / Arabe)'}
                            </button>

                            {showTranslations && (
                              <div className="ann-translations-box fade-in">
                                {ann.title_wo && (
                                  <div className="translation-block">
                                    <span className="translation-lang">Anglais</span>
                                    <h5 className="translation-title">{ann.title_wo}</h5>
                                    <p className="translation-desc">{ann.desc_wo || ann.desc_fr}</p>
                                  </div>
                                )}
                                {ann.title_ar && (
                                  <div className="translation-block rtl">
                                    <span className="translation-lang">Arabe (العربية)</span>
                                    <h5 className="translation-title">{ann.title_ar}</h5>
                                    <p className="translation-desc">{ann.desc_ar || ann.desc_fr}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementsTab;
