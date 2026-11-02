import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) { console.error('[INDUSTRIA]', error, info) }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <main className="mx-auto max-w-2xl px-6 py-40">
        <h1 className="display scene-title text-white">Un problème est survenu.</h1>
        <p className="mt-4 text-steel-300">Rechargez la page. Si le problème persiste, revenez à l’accueil.</p>
        <a className="btn-volt mt-8" href="/">Retour à l’accueil</a>
      </main>
    )
  }
}
