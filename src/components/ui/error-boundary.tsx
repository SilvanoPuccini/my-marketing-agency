import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '40vh', padding: 32,
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>
              Algo salió mal
            </h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 13, margin: '0 0 20px', lineHeight: 1.5 }}>
              {this.state.error?.message || 'Error inesperado en la aplicación.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              style={{
                padding: '8px 16px', fontSize: 13, fontWeight: 500,
                color: '#fff', borderRadius: 'var(--r-2)',
                border: '1px solid var(--violet-400)', background: 'var(--violet-500)',
                cursor: 'pointer',
              }}
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
