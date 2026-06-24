import React, { useState } from 'react';
import { Plus, Trash2, Mail, Phone, MapPin, Star, ChevronDown, ChevronUp, FileText, CheckCircle2 } from 'lucide-react';

function AgenciesTab({ agencies, onAddAgency, onDeleteAgency }) {
  const [expandedAgencyId, setExpandedAgencyId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  
  // New Agency Form State
  const [newAgency, setNewAgency] = useState({
    name: '',
    price: '',
    type: 'standard',
    address: '',
    phone: '',
    email: '',
    desc_fr: '',
    desc_wo: '',
    desc_ar: '',
    featuresString: 'Vol direct, Hébergement proche, Assistance médicale, Guide spirituel'
  });

  const toggleExpand = (id) => {
    if (expandedAgencyId === id) {
      setExpandedAgencyId(null);
    } else {
      setExpandedAgencyId(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAgency(newAgency);
    // Reset form
    setNewAgency({
      name: '',
      price: '',
      type: 'standard',
      address: '',
      phone: '',
      email: '',
      desc_fr: '',
      desc_wo: '',
      desc_ar: '',
      featuresString: 'Vol direct, Hébergement proche, Assistance médicale, Guide spirituel'
    });
  };

  const filteredAgencies = filterType === 'all'
    ? agencies
    : agencies.filter(a => a.type === filterType);

  return (
    <div className="tab-pane fade-in">
      <div className="agencies-header-bar animate-slide-up">
        <div className="filter-controls">
          <span className="filter-label">Filtrer par forfait :</span>
          <div className="filter-buttons">
            <button className={`filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>Toutes</button>
            <button className={`filter-btn ${filterType === 'economique' ? 'active' : ''}`} onClick={() => setFilterType('economique')}>Économique</button>
            <button className={`filter-btn ${filterType === 'standard' ? 'active' : ''}`} onClick={() => setFilterType('standard')}>Standard</button>
            <button className={`filter-btn ${filterType === 'vip' ? 'active' : ''}`} onClick={() => setFilterType('vip')}>VIP / Confort</button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {/* Left Side: Agency list */}
        <div className="panel-card" style={{ flex: 1.6 }}>
          <div className="panel-header">
            <h3 className="panel-title">Annuaire des Agences Accréditées</h3>
            <span className="badge badge-primary">{filteredAgencies.length} agences agréées</span>
          </div>

          <div className="table-responsive">
            <table className="admin-table agencies-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>Agence</th>
                  <th>Forfait</th>
                  <th>Prix de départ</th>
                  <th>Contact</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgencies.map(agency => {
                  const isExpanded = expandedAgencyId === agency.id;
                  return (
                    <React.Fragment key={agency.id}>
                      <tr className={`table-row-hover ${isExpanded ? 'row-expanded-parent' : ''}`} onClick={() => toggleExpand(agency.id)} style={{ cursor: 'pointer' }}>
                        <td>
                          {isExpanded ? <ChevronUp size={16} className="expanded-arrow" /> : <ChevronDown size={16} />}
                        </td>
                        <td>
                          <div className="agency-cell-name">
                            <span className="agency-name-text">{agency.name}</span>
                            <div className="agency-rating">
                              <Star size={12} className="star-icon-filled" />
                              <span>{agency.rating || 4.5}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-type-${agency.type}`}>
                            {agency.type === 'vip' ? 'VIP' : agency.type === 'economique' ? 'Économique' : 'Standard'}
                          </span>
                        </td>
                        <td>
                          <strong className="agency-price-text">{(agency.price || 0).toLocaleString()} FCFA</strong>
                        </td>
                        <td>
                          <span className="agency-phone-text">{agency.phone || 'Non renseigné'}</span>
                        </td>
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            className="action-btn-danger"
                            onClick={() => onDeleteAgency(agency.id)}
                            title="Retirer l'accréditation"
                          >
                            <Trash2 size={14} />
                            <span>Retirer</span>
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="row-expanded-detail" onClick={(e) => e.stopPropagation()}>
                          <td colSpan="6">
                            <div className="agency-detail-content fade-in">
                              <div className="detail-grid">
                                <div className="detail-meta">
                                  <h4 className="detail-subtitle">Coordonnées</h4>
                                  <div className="meta-item">
                                    <MapPin size={14} className="meta-icon" />
                                    <span>{agency.address || 'Adresse non spécifiée'}</span>
                                  </div>
                                  {agency.phone && (
                                    <div className="meta-item">
                                      <Phone size={14} className="meta-icon" />
                                      <span>{agency.phone}</span>
                                    </div>
                                  )}
                                  {agency.email && (
                                    <div className="meta-item">
                                      <Mail size={14} className="meta-icon" />
                                      <span>{agency.email}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="detail-features">
                                  <h4 className="detail-subtitle">Services Inclus</h4>
                                  <ul className="features-list">
                                    {(agency.features || []).map((feat, index) => (
                                      <li key={index} className="feature-item">
                                        <CheckCircle2 size={14} className="feature-icon" />
                                        <span>{feat}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="detail-descriptions">
                                <h4 className="detail-subtitle">Présentations multilingues</h4>
                                <div className="lang-tabs-container">
                                  <div className="lang-desc-block">
                                    <span className="lang-badge">FR</span>
                                    <p className="lang-desc-text">{agency.desc_fr || 'Aucune description en Français.'}</p>
                                  </div>
                                  {agency.desc_wo && (
                                    <div className="lang-desc-block">
                                      <span className="lang-badge">WO</span>
                                      <p className="lang-desc-text">{agency.desc_wo}</p>
                                    </div>
                                  )}
                                  {agency.desc_ar && (
                                    <div className="lang-desc-block rtl">
                                      <span className="lang-badge">AR</span>
                                      <p className="lang-desc-text">{agency.desc_ar}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Form to add agency */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Accréditer une Agence</h3>
          </div>
          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-group">
              <label className="form-label">Nom officiel de l'agence</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="Ex: Sahel Hajj & Omra"
                value={newAgency.name}
                onChange={e => setNewAgency({ ...newAgency, name: e.target.value })}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Prix du forfait (FCFA)</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  placeholder="Ex: 4500000"
                  value={newAgency.price}
                  onChange={e => setNewAgency({ ...newAgency, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catégorie Forfait</label>
                <select
                  className="form-control"
                  value={newAgency.type}
                  onChange={e => setNewAgency({ ...newAgency, type: e.target.value })}
                >
                  <option value="economique">Économique</option>
                  <option value="standard">Standard</option>
                  <option value="vip">VIP / Confort</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: +221 33 824 00 00"
                  value={newAgency.phone}
                  onChange={e => setNewAgency({ ...newAgency, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Ex: contact@sahelhajj.sn"
                  value={newAgency.email}
                  onChange={e => setNewAgency({ ...newAgency, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Adresse physique</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex: Avenue Cheikh Anta Diop, Dakar"
                value={newAgency.address}
                onChange={e => setNewAgency({ ...newAgency, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Services inclus (séparés par des virgules)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Vol direct, Hôtel proche, Assistance médicale..."
                value={newAgency.featuresString}
                onChange={e => setNewAgency({ ...newAgency, featuresString: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description détaillée (Français)</label>
              <textarea
                className="form-control"
                style={{ minHeight: '60px' }}
                placeholder="Présentez l'offre de l'agence..."
                value={newAgency.desc_fr}
                onChange={e => setNewAgency({ ...newAgency, desc_fr: e.target.value })}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Traduction Wolof (Optionnelle)</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: '50px' }}
                  placeholder="Description en Wolof..."
                  value={newAgency.desc_wo}
                  onChange={e => setNewAgency({ ...newAgency, desc_wo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Traduction Arabe (Optionnelle)</label>
                <textarea
                  className="form-control rtl"
                  style={{ minHeight: '50px' }}
                  placeholder="الوصف باللغة العربية..."
                  value={newAgency.desc_ar}
                  onChange={e => setNewAgency({ ...newAgency, desc_ar: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full-width btn-icon-label">
              <Plus size={16} />
              <span>Enregistrer et accréditer l'agence</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgenciesTab;
