import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Sunu Hajj React Error Caught:", error, errorInfo);
  }

  handleReset = () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin + '/?reset=' + Date.now();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#F8FAFC',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '40px 32px',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🇸🇦</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#042F1A', marginBottom: '12px' }}>
              Sunu Hajj 2026
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '16px' }}>
              Une mise à jour a été effectuée. Cliquez ci-dessous pour réinitialiser la mémoire du navigateur :
            </p>
            {this.state.error && (
              <div style={{ color: '#DC2626', fontSize: '0.78rem', fontFamily: 'monospace', backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '8px', marginBottom: '20px', overflowX: 'auto', textAlign: 'left', border: '1px solid #FCA5A5' }}>
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#0A5C36',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(10,92,54,0.3)'
              }}
            >
              🔄 Réinitialiser & Ouvrir la plateforme
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
