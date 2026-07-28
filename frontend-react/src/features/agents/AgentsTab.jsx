import React, { useState } from 'react';
import { Shield, UserPlus, Trash, Mail, Phone, Briefcase, Key, User } from 'lucide-react';

function AgentsTab({ admins, onCreateAdmin, onDeleteAdmin, currentAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Direction Générale');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !fullName || !email) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      await onCreateAdmin({
        username,
        password,
        fullName,
        email,
        phone,
        department
      });
      
      // Reset form
      setUsername('');
      setPassword('');
      setFullName('');
      setEmail('');
      setPhone('');
      setDepartment('Direction Générale');
    } catch (err) {
      setError(err.message || "Erreur de création de l'agent.");
    }
  };

  return (
    <div className="tab-pane fade-in">
      <div className="dashboard-grid animate-slide-up">
        
        {/* Left Side: Agents List */}
        <div className="panel-card" style={{ flex: 1.6 }}>
          <div className="panel-header">
            <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} style={{ color: 'var(--primary)' }} />
              Registre des Agents Sunu Hajj
            </h3>
            <span className="badge badge-primary">{admins.length} agents actifs</span>
          </div>

          <div className="table-responsive" style={{ marginTop: '20px' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom Complet</th>
                  <th>Identifiant</th>
                  <th>Département</th>
                  <th>Coordonnées</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((agent) => {
                  const isSelf = agent.id === currentAdmin.id || agent.username === currentAdmin.username;
                  const isMainAdmin = agent.id === 1 || agent.username === 'dgpadmin';

                  return (
                    <tr key={agent.id} className="table-row-hover">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {agent.avatar ? (
                            <img 
                              src={agent.avatar} 
                              alt="Avatar" 
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                            />
                          ) : (
                            <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>🇸🇳</div>
                          )}
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.9rem' }}>{agent.fullName}</strong>
                            {isSelf && <span className="badge badge-economique" style={{ fontSize: '0.7rem', padding: '2px 6px', marginTop: '2px', display: 'inline-block' }}>Vous-même</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>@{agent.username}</td>
                      <td>
                        <span className={`badge badge-type-${agent.department === 'Direction Générale' ? 'vip' : 'standard'}`} style={{ fontSize: '0.78rem' }}>
                          {agent.department}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                            <Mail size={12} /> {agent.email}
                          </span>
                          {agent.phone && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                              <Phone size={12} /> {agent.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          disabled={isSelf || isMainAdmin}
                          onClick={() => {
                            if (window.confirm(`Voulez-vous vraiment révoquer les accès de l'agent ${agent.fullName} ?`)) {
                              onDeleteAdmin(agent.id);
                            }
                          }}
                          className="action-btn-danger"
                          title={isSelf ? "Vous ne pouvez pas supprimer votre propre compte" : isMainAdmin ? "Impossible de supprimer l'administrateur principal" : "Révoquer cet agent"}
                          style={{
                            opacity: (isSelf || isMainAdmin) ? 0.4 : 1,
                            cursor: (isSelf || isMainAdmin) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <Trash size={14} />
                          <span>Révoquer</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Create Agent Form */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={18} style={{ color: 'var(--primary)' }} />
              Créer un Compte Agent Sunu Hajj
            </h3>
          </div>

          {error && (
            <div className="login-error-box fade-in" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '6px', fontSize: '0.85rem' }}>
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-form" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Nom et Prénom *</label>
              <div className="input-with-icon">
                <User size={16} className="input-field-icon" />
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  placeholder="Ex: Lieutenant Alassane Diallo"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Identifiant de connexion *</label>
              <div className="input-with-icon">
                <Shield size={16} className="input-field-icon" />
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  placeholder="Ex: alassane.diallo"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe provisoire *</label>
              <div className="input-with-icon">
                <Key size={16} className="input-field-icon" />
                <input 
                  type="password" 
                  className="form-control" 
                  required 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Adresse email officielle *</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-field-icon" />
                <input 
                  type="email" 
                  className="form-control" 
                  required 
                  placeholder="Ex: a.diallo@sunuhajj.sn"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Téléphone de l'agent</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-field-icon" />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: +221 77 123 45 67"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Affectation / Direction *</label>
              <div className="input-with-icon">
                <Briefcase size={16} className="input-field-icon" />
                <select 
                  className="form-control"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                >
                  <option value="Direction Générale">Direction Générale</option>
                  <option value="Commission Médicale">Commission Médicale</option>
                  <option value="Commission Logistique">Commission Logistique</option>
                  <option value="Commission Accréditation">Commission Accréditation</option>
                  <option value="Sécurité & Contrôle">Sécurité & Contrôle</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full-width" style={{ marginTop: '10px' }}>
              Enregistrer et Habiliter l'Agent
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default AgentsTab;
