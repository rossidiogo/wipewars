import { Component, render, type ComponentChildren, type ComponentType } from 'preact';

/** Keeps one broken screen from locking the game: shows what failed and a way out. */
export class ErrorBoundary extends Component<{ children: ComponentChildren }, { error?: Error }> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const home = () => { this.setState({ error: undefined }); openScreen('home'); };
    return (
      <div class="panel soon">
        <div class="soont">Something broke</div>
        <div class="sub">{String(error.message)}</div>
        <button class="btn primary" onClick={home}>Back to home</button>
      </div>
    );
  }
}

/**
 * Hands a legacy screen over to Preact. The legacy router and any legacy code that redraws the
 * screen go through DRAW[id], so replacing that entry is the whole integration.
 * `mountId` is the element the legacy screen used to fill (its `.scroll` body).
 */
export function registerScreen(id: string, mountId: string, Screen: ComponentType): void {
  DRAW[id] = () => {
    const host = document.getElementById(mountId);
    if (!host) throw new Error(`Mount point missing: #${mountId}`);
    render(<ErrorBoundary><Screen /></ErrorBoundary>, host);
  };
}
