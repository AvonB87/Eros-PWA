import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message ?? 'Prišlo je do nepričakovane napake.'
    }
  }

  componentDidCatch(error, info) {
    console.error('Neobdelana napaka:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="container py-5">
          <div className="alert alert-danger shadow-sm">
            <h1 className="h4">Aplikacije ni bilo mogoče zagnati</h1>
            <p className="mb-3">{this.state.message}</p>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              Ponovno naloži
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
