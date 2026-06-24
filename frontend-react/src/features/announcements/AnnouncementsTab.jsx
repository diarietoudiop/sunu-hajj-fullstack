import React, { useState } from 'react';
import { Send, AlertTriangle, HeartPulse, FileBadge, Trash2, Calendar, Languages } from 'lucide-react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAnnouncement(newAnn);
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
    <div className="tab-pane fade-in">
      <div className="dashboard-grid animate-slide-up">
        {/* Left Panel: Publication Form */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Publier un Communiqué Officiel</h3>
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
                  <label className="form-label">Titre en Wolof</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Titre en Wolof..."
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
                  <label className="form-label">Message en Wolof</label>
                  <textarea
                    className="form-control"
                    style={{ minHeight: '70px' }}
                    placeholder="Message en Wolof..."
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
                              🌐 {showTranslations ? 'Masquer les traductions' : 'Afficher les traductions (Wolof / Arabe)'}
                            </button>

                            {showTranslations && (
                              <div className="ann-translations-box fade-in">
                                {ann.title_wo && (
                                  <div className="translation-block">
                                    <span className="translation-lang">Wolof</span>
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
