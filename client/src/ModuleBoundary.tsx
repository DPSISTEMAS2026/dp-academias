import { Component, type ReactNode } from 'react';

type Props = { name: string; children: ReactNode };
type State = { message: string | null };

export default class ModuleBoundary extends Component<Props, State> {
  state: State = { message: null };

  static getDerivedStateFromError(error: Error): State {
    return { message: error?.message || 'Error en el módulo' };
  }

  componentDidUpdate(prev: Props) {
    if (prev.name !== this.props.name && this.state.message) {
      this.setState({ message: null });
    }
  }

  render() {
    if (this.state.message) {
      return (
        <div style={{ padding: '1.5rem', border: '1px solid rgba(0,105,112,0.25)', borderRadius: 16, background: '#fff' }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#006970' }}>Este módulo tuvo un error. Los demás siguen disponibles.</p>
          <p style={{ margin: '0.4rem 0 0', fontSize: 13, color: '#64748b' }}>{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
