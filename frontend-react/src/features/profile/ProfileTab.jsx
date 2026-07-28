import React, { useState } from 'react';
import { User, Mail, ShieldAlert, Phone, Camera, Save, Key, AlertCircle } from 'lucide-react';

function ProfileTab({ adminUser, onUpdateProfile }) {
  const [fullName, setFullName] = useState(adminUser.fullName || '');
  const [email, setEmail] = useState(adminUser.email || '');
  const [department, setDepartment] = useState(adminUser.department || '');
  const [phone, setPhone] = useState(adminUser.phone || '');
  const [avatar, setAvatar] = useState(adminUser.avatar || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (password && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        id: adminUser.id,
        fullName,
        email,
        department,
        phone,
        avatar
      };

      if (password) {
        updateData.password = password;
      }

      await onUpdateProfile(updateData);
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || "Impossible de mettre à jour le profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-card animate-slide-up" style={{ width: '100%', padding: '30px' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.5rem' }}>
            <User size={24} style={{ color: 'var(--primary)' }} />
            Mon Profil Administrateur Sunu Hajj
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Gérez vos informations professionnelles et vos paramètres de connexion de sécurité.
          </p>
        </div>
        <span style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '16px', backgroundColor: 'rgba(56,161,105,0.12)', color: '#276749', border: '1px solid #C6F6D5', fontWeight: 800 }}>
          🛡️ Compte Administrateur Validé (DGP)
        </span>
      </div>

      {error && (
        <div className="login-error-box fade-in" style={{ marginBottom: '20px' }}>
          <AlertCircle size={16} className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="login-error-box fade-in" style={{ backgroundColor: 'var(--accent-green-light)', borderColor: 'var(--accent-green)', color: 'var(--accent-green)', marginBottom: '20px' }}>
          <Save size={16} style={{ marginRight: '8px' }} />
          <span>Profil mis à jour avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Avatar Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', backgroundColor: 'var(--bg)', padding: '20px', borderRadius: 'var(--radius)' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'} 
              alt="Avatar" 
              style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--secondary)' }} 
            />
            <div style={{ 
              position: 'absolute', 
              bottom: '0', 
              right: '0', 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '2px solid var(--surface)'
            }}>
              <Camera size={14} />
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Lien de la photo de profil (URL)</span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Saisissez l'URL d'une image en ligne"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
            />
          </div>
        </div>

        {/* Profile Form Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="form-label">Identifiant de sécurité</label>
            <input 
              type="text" 
              className="form-control" 
              disabled 
              value={adminUser.username} 
              style={{ backgroundColor: 'var(--bg)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>L'identifiant de connexion ne peut pas être modifié.</span>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="form-label">Nom complet</label>
            <div className="input-with-icon">
              <User size={16} className="input-field-icon" />
              <input 
                type="text" 
                className="form-control" 
                required
                value={fullName} 
                onChange={e => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="form-label">Adresse Email</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-field-icon" />
              <input 
                type="email" 
                className="form-control" 
                required
                value={email} 
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="form-label">Département Sunu Hajj</label>
            <div className="input-with-icon">
              <ShieldAlert size={16} className="input-field-icon" />
              <input 
                type="text" 
                className="form-control" 
                value={department} 
                onChange={e => setDepartment(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
            <label className="form-label">Numéro de téléphone</label>
            <div className="input-with-icon">
              <Phone size={16} className="input-field-icon" />
              <input 
                type="text" 
                className="form-control" 
                value={phone} 
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Change password section */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '10px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Key size={16} style={{ color: 'var(--secondary)' }} />
            Changer mon mot de passe (Facultatif)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="form-label">Nouveau mot de passe</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Laisser vide pour ne pas modifier"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="form-label">Confirmer le nouveau mot de passe</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Laisser vide pour ne pas modifier"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
          >
            <Save size={16} />
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default ProfileTab;
