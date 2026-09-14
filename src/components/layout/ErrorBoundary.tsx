import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Something went wrong.' };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-[2rem] p-8 text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h1 className="text-xl font-extrabold text-slate-900">WanderWise hit a snag</h1>
          <p className="text-sm text-slate-600 mt-2">{this.state.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold"
          >
            Reload app
          </button>
        </div>
      </div>
    );
  }
}
