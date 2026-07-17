import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, History, Trash2, HelpCircle } from 'lucide-react';
import { SnapshotManager } from '../reliability/snapshotManager';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  snapshotsAvailable: number;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    snapshotsAvailable: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Handled uncaught UI thread exception:", error, errorInfo);
    
    let snapshotCount = 0;
    try {
      snapshotCount = SnapshotManager.getSnapshots().length;
    } catch (e) {
      console.warn("[ErrorBoundary] Failed to query recovery snapshots:", e);
    }

    this.setState({
      error,
      errorInfo,
      snapshotsAvailable: snapshotCount
    });
  }

  private handleSoftRefresh = () => {
    try {
      window.location.reload();
    } catch (e) {
      window.location.href = window.location.pathname;
    }
  };

  private handleRollbackToLatestSnapshot = () => {
    try {
      const snaps = SnapshotManager.getSnapshots();
      if (snaps && snaps.length > 0) {
        const latest = snaps[0];
        // Overwrite the wardrobe items with latest snapshot data
        localStorage.setItem('local_wardrobe_items', JSON.stringify(latest.wardrobeData));
        if (latest.vibeSetting) {
          localStorage.setItem('fashion_vibe_setting', latest.vibeSetting);
        }
        console.log("[ErrorBoundary] Rollback successful, performing hot-reload...");
        window.location.reload();
      } else {
        alert("No valid recovery snapshots found in local history.");
      }
    } catch (err) {
      console.error("[ErrorBoundary] Rollback exception:", err);
      alert("Failed to restore snapshot. Please try a standard factory reset.");
    }
  };

  private handleFactoryReset = () => {
    if (confirm("Are you sure you want to flush all styling history and clear current local storage? This cannot be undone.")) {
      try {
        localStorage.clear();
        window.location.reload();
      } catch (e) {
        window.location.reload();
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "Unidentified React execution thread collision.";
      
      return (
        <div className="min-h-screen bg-[#05050a] text-zinc-300 flex items-center justify-center p-6 selection:bg-violet-500/30">
          <div className="w-full max-w-lg bg-[#07070c]/90 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Background Accent glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header section */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-[9px] font-mono text-rose-400 font-bold uppercase tracking-widest block">System Coherence Interrupt</span>
                <h2 className="text-lg font-serif font-light text-white tracking-tight">Silent Recovery Backplane</h2>
              </div>
            </div>

            {/* Error detail card */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider text-left">Fault diagnostics:</span>
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-40 custom-scrollbar text-left">
                {errorMessage}
              </div>
            </div>

            {/* Interactive actions */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider text-left">Actionable Recovery plans:</span>
              
              <div className="grid grid-cols-1 gap-2.5">
                {/* 1. Soft Refresh */}
                <button
                  onClick={this.handleSoftRefresh}
                  className="w-full p-3.5 bg-white text-black hover:bg-zinc-200 rounded-xl font-mono text-[10px] uppercase tracking-[0.15em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Perform Soft Refresh
                </button>

                {/* 2. Rollback to Snapshot */}
                {this.state.snapshotsAvailable > 0 ? (
                  <button
                    onClick={this.handleRollbackToLatestSnapshot}
                    className="w-full p-3.5 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl font-mono text-[10px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                    Restore last high-integrity snapshot
                  </button>
                ) : (
                  <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-600" />
                    No automated snapshots available
                  </div>
                )}

                {/* 3. Factory Reset */}
                <button
                  onClick={this.handleFactoryReset}
                  className="w-full p-3.5 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 border border-rose-500/10 hover:border-rose-500/25 rounded-xl font-mono text-[10px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Factory Reset (Flush Caches)
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-[10px] text-zinc-500 font-serif italic text-center pt-2 border-t border-white/5 leading-relaxed">
              "We preserve your personal style. Your data is protected."
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
