import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

function Alert({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert-box alert-${type}`}>
      <div className="alert-content">
        {type === 'success' ? (
          <CheckCircle size={18} className="alert-icon" />
        ) : (
          <AlertCircle size={18} className="alert-icon" />
        )}
        <span className="alert-message">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="alert-close-btn" aria-label="Fermer l'alerte">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default Alert;
