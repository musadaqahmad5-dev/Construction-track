/**
 * LOOK VISION v2.4 - Enterprise Admin Layout Shell
 * Design Language: Moon Pearl Glow, Deep Slate Canvas, Glass Panels
 */

import React, { useState } from 'react';
import { AdminNavigation, AdminTab } from './AdminNavigation';
import { AdminOverview } from './AdminOverview';
import { UsersAdminModule } from './modules/UsersAdminModule';
import { ARIAControlAdminModule } from './modules/ARIAControlAdminModule';
import { ThemeIntelligenceAdminModule } from './modules/ThemeIntelligenceAdminModule';
import { CivilizationMemoryAdminModule } from './modules/CivilizationMemoryAdminModule';
import { SystemOpsAdminModule } from './modules/SystemOpsAdminModule';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Activity, Terminal, ArrowLeft, RefreshCw, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  onExitAdmin: () => void;
  initialTab?: AdminTab;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onExitAdmin,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const { user, userRole, refreshClaims, isSuperAdmin } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleQuickRefresh = async () => {
    setIsRefreshing(true);
    await refreshClaims(true);
    setIsRefreshing(false);
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UsersAdminModule />;
      case 'aria_control':
        return <ARIAControlAdminModule />;
      case 'theme_intelligence':
        return <ThemeIntelligenceAdminModule />;
      case 'civilization_memory':
        return <CivilizationMemoryAdminModule />;
      case 'system_ops':
        return <SystemOpsAdminModule />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#05050a] text-zinc-100 font-sans relative selection:bg-indigo-500/30 selection:text-white">
      {/* Ambient Pearl & Slate Glow Accents */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Left Navigation Sidebar */}
      <AdminNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onExitAdmin={onExitAdmin}
      />

      {/* Main Administrative Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/5 bg-[#07070c]/60 backdrop-blur-xl px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Enterprise Workspace
              </span>
            </div>
            <span className="text-zinc-600 font-mono text-xs">/</span>
            <span className="text-xs font-mono text-indigo-300 uppercase font-semibold">
              {activeTab.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Telemetry Pills */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5 text-zinc-400">
                Node: <code className="text-zinc-200">production</code>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5 text-zinc-400">
                Port: <code className="text-zinc-200">3000</code>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Firestore Rules Active
              </span>
            </div>

            {/* Admin User Info Pill */}
            <div className="flex items-center gap-2 border-l border-white/5 pl-4">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-mono font-bold text-white block">
                  {user?.displayName || 'Admin Sartorialist'}
                </span>
                <span className="text-[9px] font-mono text-indigo-300 uppercase block">
                  Role: {userRole}
                </span>
              </div>
              <button
                onClick={handleQuickRefresh}
                title="Refresh Firebase Token Claims"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer border border-white/5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport Pane */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {renderActiveModule()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
