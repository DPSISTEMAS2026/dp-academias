import { Component, StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startTelemetry } from './telemetry.ts'

startTelemetry()

class RootCrashBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null }

  static getDerivedStateFromError(error: Error) {
    return { error: error?.message || String(error) }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily: 'Outfit, system-ui, sans-serif', padding: '2rem', color: '#161616' }}>
          <h1 style={{ fontSize: '1.2rem' }}>La demo se detuvo</h1>
          <p style={{ color: '#64748b' }}>{this.state.error}</p>
          <button
            type="button"
            onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }}
            style={{ marginTop: '1rem', background: '#006970', color: '#fff', border: 0, borderRadius: 10, padding: '0.7rem 1rem', fontWeight: 800, cursor: 'pointer' }}
          >
            Volver al inicio
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootCrashBoundary>
      <App />
    </RootCrashBoundary>
  </StrictMode>,
)
