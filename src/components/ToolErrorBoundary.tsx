import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, RotateCcw, ShieldAlert } from 'lucide-react';
import { ToolItem } from '../data/categoriesAndTools';

interface ToolErrorBoundaryProps {
  children: ReactNode;
  tool?: ToolItem | null;
  onReset?: () => void;
  onGoHome?: () => void;
  fallback?: ReactNode;
  isAppRoot?: boolean;
}

interface ToolErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ToolErrorBoundary extends Component<ToolErrorBoundaryProps, ToolErrorBoundaryState> {
  constructor(props: ToolErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
    this.handleReload = this.handleReload.bind(this);
    this.handleGoHome = this.handleGoHome.bind(this);
  }

  public static getDerivedStateFromError(error: Error): Partial<ToolErrorBoundaryState> {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[ToolErrorBoundary] Handled runtime error gracefully:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleReload() {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  public handleGoHome() {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onGoHome) {
      this.props.onGoHome();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.props.isAppRoot) {
        return (
          <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
            <div className="max-w-xl w-full p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">
                    QuickCalc Engine Active Recovery
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Self-healing session recovery initialized
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
                {this.state.error?.message || 'A safe application boundary recovery event was triggered.'}
              </div>

              <div className="flex items-center gap-3 flex-wrap pt-2">
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Resume Engine</span>
                </button>
                <button
                  type="button"
                  onClick={this.handleGoHome}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Home className="w-4 h-4 text-cyan-400" />
                  <span>Go to Homepage</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-mono text-xs transition-colors cursor-pointer"
                >
                  Hard Refresh
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/30 text-slate-100 shadow-2xl space-y-5 my-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                Tool Engine Self-Healing Mode
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {this.props.tool ? `Active Tool: ${this.props.tool.name}` : 'Calculation Session'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-200/90 leading-relaxed overflow-x-auto">
            {this.state.error?.message || 'Calculation parameter safely reset to standard precision defaults.'}
          </div>

          <div className="flex items-center gap-3 flex-wrap pt-1">
            <button
              type="button"
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset & Reload Engine</span>
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span>Explore All Tools</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ToolErrorBoundary;
