import { Component } from 'react'
import { apps } from '../data/apps'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback" role="alert">
          <h1>Something went wrong.</h1>
          <p>The page failed to load, but you can still open the tools directly:</p>
          <ul>{apps.map((app) => <li key={app.id}>{app.status === 'coming-soon' ? <span>{app.name} (coming soon)</span> : <a href={app.href} target="_blank" rel="noopener noreferrer">Open {app.name}</a>}</li>)}</ul>
          <button type="button" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
