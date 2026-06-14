import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Cpu, 
  Settings, 
  Sliders, 
  Activity, 
  ToggleLeft, 
  ToggleRight, 
  Terminal, 
  AlertTriangle, 
  ShieldAlert, 
  Save, 
  RotateCcw, 
  FileText, 
  ChevronRight, 
  Play, 
  Check, 
  X, 
  Trash2, 
  Loader2,
  Workflow,
  Sparkles,
  Database
} from 'lucide-react';

import { WardrobeItem } from '../types';

// Registry imports
import { CapabilityRegistry } from '../platform/capabilityRegistry';
import { ModuleInfo } from '../platform/moduleManifest';
import { DependencyResolver, ResolutionError } from '../platform/dependencyResolver';
import { RuntimeGuard } from '../platform/runtimeGuard';

// Extension imports
import { ExtensionLoader } from '../extensions/extensionLoader';
import { ExtensionManifest, ExtensionSandbox } from '../extensions/extensionSandbox';
import { ExtensionEvents } from '../extensions/extensionEvents';

// Command/Event imports
import { EventStore, PlatformEvent } from '../platform/command/eventStore';
import { ActionQueue, QueueAction } from '../platform/command/actionQueue';
import { CommandBus } from '../platform/command/commandBus';

// Governance imports
import { PolicyEngine, AuditLog } from '../governance/policyEngine';
import { RiskEvaluator } from '../governance/riskEvaluator';
import { ApprovalFlow, ExecutiveApproval } from '../governance/approvalFlow';

// Reliability imports
import { SnapshotManager, PlatformSnapshot } from '../reliability/snapshotManager';
import { HealthMonitor, DiagnosticsStatus } from '../reliability/healthMonitor';
import { RecoveryCoordinator } from '../reliability/recoveryCoordinator';

interface PlatformControlCenterProps {
  wardrobe: WardrobeItem[];
  currentVibe: string;
  onSetVibe: (vibe: any) => void;
}

export const PlatformControlCenter: React.FC<PlatformControlCenterProps> = ({ wardrobe, currentVibe, onSetVibe }) => {
  // Modules and extensions lists
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [extensions, setExtensions] = useState<ExtensionManifest[]>([]);
  const [dependencyErrors, setDependencyErrors] = useState<ResolutionError[]>([]);
  
  // Commands, Events and Queue
  const [recentEvents, setRecentEvents] = useState<PlatformEvent[]>([]);
  const [actionQueue, setActionQueue] = useState<QueueAction[]>([]);
  const [approvals, setApprovals] = useState<ExecutiveApproval[]>([]);

  // Diagnostics and Risk
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<{ score: number; level: string; breakdown: string[] }>({
    score: 0,
    level: 'Low',
    breakdown: []
  });
  const [diagnostics, setDiagnostics] = useState<DiagnosticsStatus>({
    uptimePercentage: 100,
    memoryOk: true,
    activeDegradation: false,
    errorsFound: []
  });

  // Snapshot list
  const [snapshots, setSnapshots] = useState<PlatformSnapshot[]>([]);

  // Modals & form input states
  const [newExtName, setNewExtName] = useState('');
  const [newExtCategory, setNewExtCategory] = useState<'stylist' | 'scoring' | 'lookbook' | 'planner'>('stylist');
  const [viewingEventDetail, setViewingEventDetail] = useState<PlatformEvent | null>(null);

  // Initial loading
  useEffect(() => {
    // Register sample commands if not done yet
    CommandBus.registerHandler('TOGGLE_MODULE', (payload: { id: string }) => {
      const updated = CapabilityRegistry.toggleModule(payload.id);
      return { success: true, data: { id: payload.id, enabled: updated.find(x => x.id === payload.id)?.enabled } };
    });

    CommandBus.registerHandler('PROPOSE_OUTFIT', (payload: { items: string[] }) => {
      return { success: true, data: { items: payload.items, proposedAt: new Date().toISOString() } };
    });

    refreshAllData();
  }, [wardrobe]);

  const refreshAllData = () => {
    const loadedModules = CapabilityRegistry.loadRegistry();
    const loadedExtensions = ExtensionLoader.getExtensions();
    
    setModules(loadedModules);
    setExtensions(loadedExtensions);

    const depErrors = DependencyResolver.validateDependencies(loadedModules);
    setDependencyErrors(depErrors);

    setRecentEvents(EventStore.getEvents().slice(-14).reverse());
    setActionQueue(ActionQueue.getQueue());
    setApprovals(ApprovalFlow.getApprovals());

    setAuditLogs(PolicyEngine.runStaticAudit(loadedExtensions));
    setRiskAssessment(RiskEvaluator.evaluatePlatformRisk(wardrobe, loadedExtensions.length));
    setDiagnostics(HealthMonitor.runDiagnostics(depErrors));

    setSnapshots(SnapshotManager.getSnapshots());
  };

  // Module toggle
  const handleToggleModule = (id: string) => {
    CommandBus.dispatch({ type: 'TOGGLE_MODULE', payload: { id } });
    refreshAllData();
  };

  // Extension actions
  const handleToggleExtension = (id: string) => {
    ExtensionLoader.toggleExtension(id);
    EventStore.commit('EXTENSION_TOGGLED', 'extensions', { id });
    refreshAllData();
    ExtensionEvents.emit('onScoringBiasChanged', { extensionId: id });
  };

  const handleCreateExtension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtName.trim()) return;

    const id = `ext-${Date.now().toString(36)}`;
    const newExt: ExtensionManifest = {
      id,
      name: newExtName,
      category: newExtCategory,
      author: 'Independent Creator Lab',
      enabled: true
    };

    // Governance: log request
    ApprovalFlow.requestApproval('Extension Activation', `Manual installation of plugin "${newExtName}".`);
    ExtensionLoader.installExtension(newExt);
    EventStore.commit('EXTENSION_INSTALLED', 'extensions', newExt);
    
    setNewExtName('');
    refreshAllData();
    alert(`Success: Extension "${newExtName}" has been loaded inside the secure sandboxed runtime.`);
  };

  // Queue actions with human approvals
  const handleApproveQueueAction = (actionId: string) => {
    ActionQueue.approveAndExecute(actionId);
    EventStore.commit('QUEUE_ACTION_EXECUTED', 'command-bus', { actionId });
    refreshAllData();
  };

  const handleRejectQueueAction = (actionId: string) => {
    ActionQueue.rejectAction(actionId);
    EventStore.commit('QUEUE_ACTION_REJECTED', 'command-bus', { actionId });
    refreshAllData();
  };

  const handleClearQueue = () => {
    ActionQueue.clearQueue();
    refreshAllData();
  };

  // Governance approvals
  const handleApproveGov = (id: string) => {
    ApprovalFlow.approve(id);
    refreshAllData();
  };

  const handleRejectGov = (id: string) => {
    ApprovalFlow.reject(id);
    refreshAllData();
  };

  // Snapshot operations
  const handleCreateSnapshot = () => {
    const snap = SnapshotManager.captureSnapshot(wardrobe, currentVibe);
    EventStore.commit('SNAPSHOT_CREATED', 'reliability', snap);
    refreshAllData();
    alert(`Reliability State Saved: Captured snapshot "${snap.id}" containing ${wardrobe.length} clothing items.`);
  };

  const handleTriggerRollback = (snapId: string) => {
    const res = RecoveryCoordinator.rollbackToSnapshot(
      snapId,
      (restoredWardrobe) => {
        // Since we are simulating offline capability fallback rollbacks, let's reflect this in an alert and clear events logs
        alert(`Reliability Restore Command Succeeded! All local indices rolled back to snap version: ${snapId}.`);
      },
      (restoredVibe) => {
        onSetVibe(restoredVibe);
      }
    );

    if (res.success) {
      EventStore.commit('SYSTEM_ROLLBACK_SUCCEEDED', 'reliability', { snapId });
      refreshAllData();
    } else {
      alert(`Rollback failed: ${res.error}`);
    }
  };

  const handleDeleteSnapshot = (id: string) => {
    SnapshotManager.deleteSnapshot(id);
    refreshAllData();
  };

  return (
    <div className="space-y-8 bg-slate-50 p-6 rounded-3xl border border-slate-200 text-slate-800">
      
      {/* 1. Header Hero with Control Room branding */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-md text-[10px] font-mono uppercase tracking-wider text-indigo-300">
              <Cpu size={12} className="animate-spin text-indigo-400" /> Platform Control Plane
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
              Intelligence OS Control Center
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl font-light">
              Audit the capability graph, sandbox independent extensions, replay styling command histories, track safety rules, and perform system rollbacks in the reliability center.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={refreshAllData}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition-all shadow-md text-white cursor-pointer"
            >
              Sync Dashboard Sensors
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top-level status indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Activity size={18} />
          </div>
          <div>
            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">Platform Uptime</span>
            <strong className="text-sm text-slate-800">{diagnostics.uptimePercentage}% Nominal</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-3 bg-red-50 text-red-500 rounded-lg">
            <ShieldAlert size={18} />
          </div>
          <div>
            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">Dynamic Risk Score</span>
            <strong className="text-sm text-slate-800">{riskAssessment.score}/100 ({riskAssessment.level})</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Database size={18} />
          </div>
          <div>
            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">Logged events</span>
            <strong className="text-sm text-slate-800">{recentEvents.length} Committed</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Sliders size={18} />
          </div>
          <div>
            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">Enabled Modules</span>
            <strong className="text-sm text-slate-800">
              {modules.filter(m => m.enabled).length} of {modules.length}
            </strong>
          </div>
        </div>
      </div>

      {/* 3. Outer grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Double Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CORE REVOLVING CAPABILITY REGISTRY PANEL */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Cpu size={16} className="text-indigo-600" /> Platform Capability Registry
                </h3>
                <p className="text-[10px] text-slate-400">Directly activate or disable functional system modules</p>
              </div>
              {dependencyErrors.length > 0 && (
                <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded">
                  {dependencyErrors.length} Dependency Warnings
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map(mod => (
                <div 
                  key={mod.id} 
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    mod.enabled 
                      ? 'border-indigo-100 bg-indigo-50/10' 
                      : 'border-slate-150 bg-slate-50/50 opacity-75'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <strong className="text-[12px] font-bold text-slate-850">{mod.name}</strong>
                      <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                        v{mod.version}
                      </span>
                    </div>
                    <p className="text-[10.5px] font-light text-slate-500 leading-relaxed">{mod.description}</p>
                    
                    {/* Display dependencies */}
                    {mod.dependencies.length > 0 && (
                      <div className="flex gap-1.5 pt-1 items-center">
                        <span className="text-[8px] font-mono uppercase text-slate-400">Requires:</span>
                        {mod.dependencies.map(dep => (
                          <span key={dep} className="text-[8px] font-mono bg-slate-100 px-1 py-0.2 rounded text-slate-500 border border-slate-150">
                            {dep}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-150/40 mt-3">
                    <div className="flex gap-1">
                      {mod.permissions.map(perm => (
                        <span key={perm} className="text-[8px] bg-indigo-50 text-indigo-600 border border-indigo-100 rounded px-1.5 py-0.2 font-mono">
                          {perm}
                        </span>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => handleToggleModule(mod.id)}
                      className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                        mod.enabled 
                          ? 'bg-slate-900 border-slate-900 text-white hover:bg-slate-850' 
                          : 'bg-white border-slate-250 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {mod.enabled ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Display dependency graph errors */}
            {dependencyErrors.map((err, i) => (
              <div key={i} className="p-3 bg-rose-50 border border-rose-150 text-[10px] text-rose-700 rounded-lg flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <div>
                  <strong>Dependency Resolution Failure:</strong> Module <code>{err.moduleId}</code> requires deactivated base package <code>{err.missingDependency}</code>. Re-activate the package to clear resolution warnings.
                </div>
              </div>
            ))}
          </div>

          {/* EXTENSION RUNTIME & SANDBOX PANEL */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Workflow size={16} className="text-indigo-600" /> Extensible Runtime Sandbox
              </h3>
              <p className="text-[10px] text-slate-400">Install and sandboxed-run custom design scoring or styling plugins</p>
            </div>

            {/* Form to mock register extensions */}
            <form onSubmit={handleCreateExtension} className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Extension Name</label>
                <input 
                  type="text" 
                  value={newExtName}
                  onChange={e => setNewExtName(e.target.value)}
                  placeholder="e.g. brutalist-synth-grade"
                  className="w-full text-xs font-medium border border-slate-200 bg-white rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Category Hook</label>
                <select
                  value={newExtCategory}
                  onChange={e => setNewExtCategory(e.target.value as any)}
                  className="w-full text-xs font-medium border border-slate-200 bg-white rounded-xl p-2.5 cursor-pointer outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="lookbook">Lookbook Color Graders</option>
                  <option value="scoring">Scoring Bias Evaluators</option>
                  <option value="stylist">Stylist Recommendations</option>
                  <option value="planner">Adventure Planners</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Hot Install Module
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {extensions.map(ext => (
                <div key={ext.id} className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/30 flex justify-between items-center text-[11px]">
                  <div className="space-y-0.5">
                    <strong className="text-slate-800">{ext.name}</strong>
                    <span className="block text-[8px] font-mono text-slate-400 uppercase">
                      By {ext.author} • hook: <code className="text-indigo-600">{ext.category}</code>
                    </span>
                    {ext.permissionRequired && (
                      <span className="inline-block text-[7.5px] font-mono font-bold bg-amber-50 text-amber-600 border border-amber-200 px-1 rounded">
                        Requires permission: {ext.permissionRequired}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleExtension(ext.id)}
                    className={`py-1 px-2 text-[9px] font-mono uppercase font-black transition-all border rounded-md cursor-pointer ${
                      ext.enabled 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-600' 
                        : 'bg-white border-slate-250 text-slate-400'
                    }`}
                  >
                    {ext.enabled ? 'Sandboxed ON' : 'Deactivated'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AUDIT LOGS, HISTORICAL EVENT STREAM & COMMAND REPLAY */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Terminal size={16} className="text-indigo-600" /> Platform Command & Event Log History
                </h3>
                <p className="text-[10px] text-slate-400">Audit execution replays and logged platform operations</p>
              </div>
              <button 
                onClick={() => {
                  EventStore.clearStore();
                  refreshAllData();
                }}
                className="text-[9px] font-bold text-red-500 hover:underline"
              >
                Clear Store Logs
              </button>
            </div>

            <div className="bg-slate-900 text-slate-350 p-4 rounded-xl font-mono text-[10px] max-h-72 overflow-y-auto space-y-2 select-text scrollbar-thin">
              {recentEvents.length === 0 ? (
                <div className="p-4 text-center text-slate-500">[Event Log Empty] Run capabilities to populate traces.</div>
              ) : (
                recentEvents.map(evt => (
                  <div key={evt.id} className="border-b border-slate-800 pb-1.5 flex justify-between gap-4">
                    <div>
                      <span className="text-indigo-400">[{new Date(evt.timestamp).toLocaleTimeString()}]</span>
                      <strong className="text-white ml-2">[{evt.eventType}]</strong>
                      <span className="text-slate-500 ml-2">aggregateId: {evt.aggregateId}</span>
                    </div>
                    <button 
                      onClick={() => setViewingEventDetail(evt)}
                      className="text-indigo-300 hover:underline block text-[9.5px]"
                    >
                      Inspect Data
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Event Detail Modal overlay */}
            <AnimatePresence>
              {viewingEventDetail && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-slate-800 text-slate-100 p-4 rounded-xl space-y-2 text-[10px] font-mono border border-slate-700"
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-indigo-300">Payload Detail for Event: {viewingEventDetail.id}</strong>
                    <button 
                      onClick={() => setViewingEventDetail(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      [Hide]
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-slate-300 p-3 rounded overflow-x-auto max-h-48 scrollbar-thin">
                    {JSON.stringify(viewingEventDetail.data, null, 2)}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          
          {/* RISK & POLICY COMPLIANCE REPORT */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <ShieldAlert size={16} className="text-red-500 animate-pulse" /> Rigorous Policy Compliance
            </h3>

            {/* Audit Logs */}
            <div className="space-y-3">
              {auditLogs.map(log => (
                <div key={log.ruleId} className="flex gap-2.5 items-start">
                  {log.passed ? (
                    <span className="text-emerald-500 bg-emerald-50 p-1 rounded font-bold text-xs shrink-0 font-mono">✓</span>
                  ) : (
                    <span className="text-red-500 bg-rose-50 p-1 rounded font-bold text-xs shrink-0 font-mono">✗</span>
                  )}
                  <div className="space-y-0.5">
                    <strong className="text-[11px] text-slate-800 block leading-tight">{log.ruleName}</strong>
                    <span className="text-[9.5px] font-light text-slate-500 block leading-tight">{log.message}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk Breakdown */}
            <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 mt-2 space-y-2">
              <span className="block text-[10px] font-mono uppercase text-slate-500">Continuous Risk Assessment</span>
              <ul className="list-disc list-inside space-y-1.5 text-[10px] text-slate-650 leading-relaxed pl-1">
                {riskAssessment.breakdown.map((item, idx) => (
                  <li key={idx} className="font-light">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ACTIVE EXECUTIVE SYSTEM APPROVALS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Activity size={16} className="text-indigo-600" /> Executive Approvals Flow
            </h3>

            <div className="space-y-3">
              {approvals.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">Zero manual system requests pending override counters.</p>
              ) : (
                approvals.map(app => (
                  <div key={app.id} className="border border-slate-150 p-3 rounded-xl bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-[10px] text-slate-800 font-mono font-bold uppercase">{app.scope}</strong>
                      <span className={`text-[8.5px] font-bold uppercase font-mono px-1.5 rounded ${
                        app.decision === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        app.decision === 'rejected' ? 'bg-rose-50 text-rose-600' :
                        'bg-slate-150 text-slate-500'
                      }`}>
                        {app.decision}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-light leading-snug">{app.details}</p>
                    
                    {app.decision === 'pending' && (
                      <div className="flex justify-end gap-1 pt-1">
                        <button 
                          onClick={() => handleApproveGov(app.id)}
                          className="text-[8px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded cursor-pointer"
                        >
                          Overrule & Approve
                        </button>
                        <button 
                          onClick={() => handleRejectGov(app.id)}
                          className="text-[8px] bg-slate-150 text-slate-500 font-bold px-2 py-0.5 rounded cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RELIABILITY SNAPSHOTS & RECOVERY ROLLBACKS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Save size={16} className="text-indigo-600" /> Reliability Snapshots
              </h3>
              <button 
                onClick={handleCreateSnapshot}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-xs cursor-pointer flex items-center gap-1"
              >
                Snap Closet
              </button>
            </div>

            <p className="text-[10px] text-slate-500 font-light leading-relaxed">
              Create local offline databases fallbacks. Instantly trigger a complete system restore back to previous versions in case of anomalies.
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {snapshots.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 border border-dashed text-slate-400 text-[10px] rounded-lg">
                  No backups logged yet. Click Snap Closet to back up available coordinates.
                </div>
              ) : (
                snapshots.map(snap => (
                  <div key={snap.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2 hover:border-indigo-200 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-[9.5px] font-mono text-indigo-650 font-bold">Snap ID: {snap.id.replace('snap-', '')}</span>
                      <button 
                        onClick={() => handleDeleteSnapshot(snap.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-light">Count: {snap.wardrobeLength} Items ({snap.vibeSetting})</span>
                      <button
                        onClick={() => handleTriggerRollback(snap.id)}
                        className="flex items-center gap-1 bg-white border border-indigo-200 text-indigo-600 text-[8.5px] font-bold px-1.5 py-0.5 rounded shadow-xxs cursor-pointer hover:bg-indigo-50"
                      >
                        <RotateCcw size={10} /> Rollback
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* INTERNAL REPORTS COMPLIANCE DIRECTORY */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <FileText size={16} className="text-slate-700" /> Platform Compliance Reports
            </h3>
            <div className="space-y-2 text-[10.5px]">
              {[
                { name: 'CONTROL_PLANE_REPORT.md', desc: 'Control Plane architecture metrics' },
                { name: 'EXTENSION_REPORT.md', desc: 'Secure Sandbox integrations' },
                { name: 'GOVERNANCE_REPORT.md', desc: 'Static Compliance Rules' },
                { name: 'RELIABILITY_REPORT.md', desc: 'Snapshot Recovery coordinates' },
                { name: 'CAPABILITY_MAP.md', desc: 'Dynamic package dependencies topology' }
              ].map(rep => (
                <div key={rep.name} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-150 transition-colors">
                  <div>
                    <strong className="block text-slate-800 font-mono text-[10px]">{rep.name}</strong>
                    <span className="block text-[8.5px] font-light text-slate-400 leading-none mt-0.5">{rep.desc}</span>
                  </div>
                  <ChevronRight size={12} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
