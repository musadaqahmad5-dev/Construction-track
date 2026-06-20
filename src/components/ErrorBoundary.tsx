import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Silent recovery in progress...", error, errorInfo);
    // Recover silently: clear corrupted local elements and reload after 3 seconds
    setTimeout(() => {
      try {
        localStorage.clear();
        window.location.reload();
      } catch (e) {}
    }, 3000);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white/50 flex items-center justify-center select-none font-serif italic text-sm">
          "Still here."
        </div>
      );
    }

    return this.props.children;
  }
}
