import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ProductIntelligenceReport, 
  UserJourneyStep, 
  FeatureReadinessMetric, 
  MissingUXDetection 
} from '../../../engine';
import {
  ProductIdentity,
  EnterpriseProductSDK,
  ProductManifestRegistry,
  ProductRevenueTracker,
  SharedResourceAllocator,
  ProductUsageStatisticsEngine,
  ProductStateManager
} from '../../../product';


interface ProductTabProps {
  productReport: ProductIntelligenceReport;
  selectedJourney: UserJourneyStep | null;
  setSelectedJourney: (journey: UserJourneyStep | null) => void;
  selectedFeature: FeatureReadinessMetric | null;
  setSelectedFeature: (feat: FeatureReadinessMetric | null) => void;
  selectedMissingUX: MissingUXDetection | null;
  setSelectedMissingUX: (pattern: MissingUXDetection | null) => void;
  isAnalyzingProduct: boolean;
  handleRunProductAnalysis: () => void;
  handleResolveUXPattern: (id: string) => void;
}

export const ProductTab: React.FC<ProductTabProps> = ({
  productReport,
  selectedJourney,
  setSelectedJourney,
  selectedFeature,
  setSelectedFeature,
  selectedMissingUX,
  setSelectedMissingUX,
  isAnalyzingProduct,
  handleRunProductAnalysis,
  handleResolveUXPattern
}) => {
  return (
    <motion.div
      key="product"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left font-sans text-zinc-100"
    >
      {/* PRODUCT READINESS HERO BANNER */}
      <div className="bg-[#06060c] border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              Product Intelligence: 
              <span className="text-emerald-400 font-bold">JOURNEY AUDIT & UX VALIDATION</span>
            </span>
          </div>
          <h3 className="text-xl font-serif font-light text-white tracking-tight">
            Product Quality & E2E Journey Monitor
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Inspects high-fidelity customer flows, evaluates core feature adoption rates, and measures fashion intelligence index across connected systems.
          </p>
        </div>

        {/* AUDIT ACTION */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunProductAnalysis}
            disabled={isAnalyzingProduct}
            className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/15 font-mono text-[9px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl cursor-pointer transition-all font-bold"
          >
            {isAnalyzingProduct ? '[ Performing Product Scan... ]' : '[ Run Full Product Audit ]'}
          </button>
          <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="text-right">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Product Score</span>
              <span className="text-xl font-light font-mono text-emerald-400">{productReport.metrics.overallProductReadiness}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT QUALITY METRICS SCORES */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { name: 'Feature Completion', score: productReport.metrics.featureCompletionScore, color: 'bg-indigo-500', label: 'Feature Readiness' },
          { name: 'User Experience Score', score: productReport.metrics.userExperienceScore, color: 'bg-violet-500', label: 'UX Analysis' },
          { name: 'Recommendation Quality', score: productReport.metrics.recommendationQualityScore, color: 'bg-teal-500', label: 'Recommendation Quality' },
          { name: 'Fashion Intelligence Index', score: productReport.metrics.fashionIntelligenceScore, color: 'bg-amber-500', label: 'Fashion Intelligence' },
          { name: 'Overall Product Readiness', score: productReport.metrics.overallProductReadiness, color: 'bg-emerald-500', label: 'Product Readiness' },
        ].map((m, idx) => (
          <div key={idx} className="bg-black/45 border border-white/5 p-4 rounded-xl space-y-2 flex flex-col justify-between">
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider block truncate">{m.label}</span>
            <div className="space-y-1">
              <span className="text-lg font-mono text-white font-light">{m.score}%</span>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.score}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TWO COLUMN PANEL: JOURNEYS MAP & FEATURES ADOPTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: User Journeys Map (span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* USER JOURNEY ANALYSIS MAP */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4">
            <div className="pb-2 border-b border-white/5 flex justify-between items-center text-left">
              <div>
                <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">End-to-End User Journeys</span>
                <h4 className="text-sm font-bold text-white tracking-tight">Active Screen Flows & Navigation Mapping</h4>
              </div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Interactive Trace Map</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
              {productReport.journeys.map((step) => (
                <div
                  key={step.name}
                  onClick={() => setSelectedJourney(selectedJourney?.name === step.name ? null : step)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    selectedJourney?.name === step.name
                      ? 'bg-emerald-500/10 border-emerald-500/35'
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center flex-wrap gap-2 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${step.status === 'Optimized' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span className="text-[12px] font-bold text-zinc-100">{step.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono">
                      <span className="text-zinc-500">[{step.latencyMs}ms]</span>
                      <span className="bg-emerald-950/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/10 font-bold uppercase">
                        {step.status}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-[10.5px] text-zinc-400 leading-relaxed font-sans line-clamp-1 text-left">
                    {step.remarks}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 text-left">
                    {step.participatingEngines.map(eng => (
                      <span key={eng} className="text-[7.5px] font-mono text-indigo-300 bg-indigo-950/20 border border-indigo-500/10 px-1.5 py-0.5 rounded">
                        @{eng}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* JOURNEY DETAIL TRACE INSPECTOR */}
          {selectedJourney && (
            <div className="bg-black/50 border border-emerald-500/20 p-5 rounded-3xl space-y-4 text-left animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="text-left">
                  <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Flow Engine Trace</span>
                  <h4 className="text-sm font-bold text-white tracking-tight">{selectedJourney.name} Verification</h4>
                </div>
                <button 
                  onClick={() => setSelectedJourney(null)}
                  className="text-[9px] font-mono text-zinc-500 hover:text-white"
                >
                  [ Close Trace ]
                </button>
              </div>

              <div className="bg-black/90 p-4 rounded-xl border border-white/5 space-y-4 font-mono text-[10px]">
                <div className="grid grid-cols-2 gap-4 text-zinc-400">
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase">Journey Status:</span>
                    <span className="text-emerald-400 font-bold">{selectedJourney.status}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase">Completion Index:</span>
                    <span className="text-zinc-200">{selectedJourney.completionPercent}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase">Average Latency:</span>
                    <span className="text-zinc-200">{selectedJourney.latencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase">UX Health:</span>
                    <span className="text-emerald-400">EXCELLENT</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.03] text-left">
                  <span className="text-zinc-500 text-[8px] block uppercase mb-1 text-left">Detailed Remarks:</span>
                  <p className="text-zinc-300 font-sans text-[10.5px] leading-relaxed text-left">
                    {selectedJourney.remarks}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.03] text-left">
                  <span className="text-zinc-500 text-[8px] block uppercase mb-1 text-left">Participating Operational Engines:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1 text-left">
                    {selectedJourney.participatingEngines.map(eng => (
                      <span key={eng} className="text-[8px] font-mono text-indigo-300 bg-indigo-950/35 border border-indigo-500/15 px-2 py-0.5 rounded">
                        @{eng}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Feature Adoption & Missing UX (span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* FEATURE READINESS & ADOPTION */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="pb-2 border-b border-white/5 text-left">
              <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Intelligence Adoption Tracker</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Feature Readiness & Adoption Metrics</h4>
            </div>

            <div className="space-y-3">
              {productReport.features.map((feat) => (
                <div
                  key={feat.featureName}
                  onClick={() => setSelectedFeature(selectedFeature?.featureName === feat.featureName ? null : feat)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    selectedFeature?.featureName === feat.featureName
                      ? 'bg-indigo-500/10 border-indigo-500/35'
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-[11px] font-bold text-zinc-100">{feat.featureName}</span>
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10 uppercase font-bold">
                      {feat.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-[9.5px] font-mono text-zinc-400">
                    <div>
                      <span className="text-zinc-600 text-[8px] block uppercase">Readiness</span>
                      <span className="text-white font-medium">{feat.readinessScore}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 text-[8px] block uppercase">Adoption Rate</span>
                      <span className="text-emerald-300 font-medium">{feat.adoptionRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MISSING USER EXPERIENCE FLUSHING CENTER */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
            <div className="pb-2 border-b border-white/5 text-left">
              <span className="text-[8.5px] font-mono text-violet-400 font-bold uppercase tracking-wider block">Adaptive Optimization</span>
              <h4 className="text-sm font-bold text-white tracking-tight">Missing UX Pattern Detection</h4>
            </div>

            {productReport.missingUXPatterns.length === 0 ? (
              <div className="p-6 text-center bg-black/10 rounded-2xl border border-white/[0.02] space-y-2 text-left">
                <span className="text-2xl block">✓</span>
                <p className="text-xs text-emerald-400 font-mono">UX Architecture 100% Consistent.</p>
                <p className="text-[10px] text-zinc-500">All user-facing workflows pass alignment rules.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {productReport.missingUXPatterns.map((ptn) => (
                  <div
                    key={ptn.id}
                    onClick={() => setSelectedMissingUX(selectedMissingUX?.id === ptn.id ? null : ptn)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      selectedMissingUX?.id === ptn.id
                        ? 'bg-violet-500/10 border-violet-500/35'
                        : 'bg-black/20 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 text-left">
                        <span className="text-[11px] font-bold text-zinc-100 block">{ptn.journey} Gap</span>
                        <p className="text-[9.5px] text-zinc-400 leading-relaxed font-sans line-clamp-1 text-left">
                          {ptn.description}
                        </p>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                        ptn.severity === 'High' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/10' :
                        ptn.severity === 'Medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/10' :
                        'bg-sky-500/15 text-sky-400 border border-sky-500/10'
                      }`}>
                        {ptn.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DETAILED UX PATTERN REPAIR WINDOW */}
          {selectedMissingUX && (
            <div className="bg-black/50 border border-violet-500/20 p-5 rounded-3xl space-y-4 text-left animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="text-left">
                  <span className="text-[8.5px] font-mono text-violet-400 font-bold uppercase tracking-wider block">Intelligent UX Alignment</span>
                  <h4 className="text-sm font-bold text-white tracking-tight">Gap ID: #{selectedMissingUX.id}</h4>
                </div>
                <button 
                  onClick={() => setSelectedMissingUX(null)}
                  className="text-[9px] font-mono text-zinc-500 hover:text-white"
                >
                  [ Close Inspector ]
                </button>
              </div>

              <div className="bg-black/90 p-4 rounded-xl border border-white/5 space-y-3 font-mono text-[10px]">
                <div className="grid grid-cols-2 gap-4 text-zinc-400">
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase text-left">Journey Area:</span>
                    <span className="text-zinc-200 font-bold text-left">{selectedMissingUX.journey}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase text-left">Threat Severity:</span>
                    <span className="text-amber-400 font-bold text-left">{selectedMissingUX.severity}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.03] space-y-2 text-left">
                  <div>
                    <span className="text-zinc-600 block text-[8px] uppercase text-left">Pattern Gaps:</span>
                    <p className="text-zinc-300 font-sans text-[10.5px] leading-relaxed text-left">{selectedMissingUX.description}</p>
                  </div>
                  <div className="mt-2 text-left">
                    <span className="text-zinc-600 block text-[8px] uppercase text-left">Dynamic Self-Heal Solution:</span>
                    <p className="text-violet-300 italic font-sans text-[10.5px] text-left">{selectedMissingUX.suggestedRepair}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.03] flex justify-end">
                  <button
                    onClick={() => handleResolveUXPattern(selectedMissingUX.id)}
                    className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/15 font-mono text-[9px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl cursor-pointer transition-all font-bold"
                  >
                    [ Apply Dynamic UX Healing ]
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ENTERPRISE INDEPENDENT PRODUCT ISOLATION API */}
      <EnterpriseSDKSection />
    </motion.div>
  );
};

// ============================================================================
// AUXILIARY DASHBOARD FOR INDEPENDENT AI BUSINESS MODULES
// ============================================================================

const EnterpriseSDKSection: React.FC = () => {
  const [selectedSdkProd, setSelectedSdkProd] = useState<ProductIdentity>(ProductIdentity.FACE_AI);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [targetReceiver, setTargetReceiver] = useState<ProductIdentity>(ProductIdentity.AI_CREATIONS);
  const [messageType, setMessageType] = useState<string>('SYNC_COORDINATES');
  const [messagePayload, setMessagePayload] = useState<string>('{"x": 182, "y": 420, "pose": "T_POSE"}');
  const [simulatedAmt, setSimulatedAmt] = useState<number>(149);
  const [simulatedItem, setSimulatedItem] = useState<string>('Premium 3D Fitting Subscription');
  const [sandboxNewKey, setSandboxNewKey] = useState('');
  const [sandboxNewVal, setSandboxNewVal] = useState('');

  useEffect(() => {
    // Populate some default isolated sandbox state for visuals
    if (!EnterpriseProductSDK.API.state.get(ProductIdentity.FACE_AI, 'bodyShape')) {
      EnterpriseProductSDK.API.state.set(ProductIdentity.FACE_AI, 'bodyShape', 'Athletic Hourglass');
      EnterpriseProductSDK.API.state.set(ProductIdentity.FACE_AI, 'heightCm', 178);
      EnterpriseProductSDK.API.state.set(ProductIdentity.FACE_AI, 'avatarDrapeIndex', 0.94);
    }
    if (!EnterpriseProductSDK.API.state.get(ProductIdentity.AI_CREATIONS, 'activePromptPreset')) {
      EnterpriseProductSDK.API.state.set(ProductIdentity.AI_CREATIONS, 'activePromptPreset', 'Hyper-real 8K Editorial Synth');
      EnterpriseProductSDK.API.state.set(ProductIdentity.AI_CREATIONS, 'draperySteps', 50);
    }
    if (!EnterpriseProductSDK.API.state.get(ProductIdentity.COMMUNITY, 'activeChallengeTopic')) {
      EnterpriseProductSDK.API.state.set(ProductIdentity.COMMUNITY, 'activeChallengeTopic', 'Sartorial Cyberpunk Challenge');
      EnterpriseProductSDK.API.state.set(ProductIdentity.COMMUNITY, 'reputationScoreBonus', 250);
    }
    if (!EnterpriseProductSDK.API.state.get(ProductIdentity.MARKETPLACE, 'feeRate')) {
      EnterpriseProductSDK.API.state.set(ProductIdentity.MARKETPLACE, 'feeRate', '15% platform share');
      EnterpriseProductSDK.API.state.set(ProductIdentity.MARKETPLACE, 'allowedDigitalDownloads', true);
    }
    // Record first dummy sale to initialize revenue graphs
    if (ProductRevenueTracker.getTransactions().length === 0) {
      ProductRevenueTracker.recordSale(ProductIdentity.MARKETPLACE, 'user-39', 79, 'Sartorial LUTs Pack');
      ProductRevenueTracker.recordSale(ProductIdentity.AI_CREATIONS, 'user-12', 49, 'Custom AI Runway Render');
    }
    setRefreshCounter(prev => prev + 1);
  }, []);

  const handleSimulateRequest = () => {
    // Verify throttling / allocate requests
    const allowed = EnterpriseProductSDK.API.resources.checkAndConsume(selectedSdkProd);
    if (allowed) {
      // Simulate real-time API latency
      EnterpriseProductSDK.API.state.set(selectedSdkProd, '_last_operation_latency', `${Math.floor(Math.random() * 200 + 40)}ms`);
      EnterpriseProductSDK.API.state.set(selectedSdkProd, '_total_requests_processed', (EnterpriseProductSDK.API.state.get(selectedSdkProd, '_total_requests_processed') || 0) + 1);
      setRefreshCounter(prev => prev + 1);
    }
  };

  const handleRecordSale = () => {
    EnterpriseProductSDK.API.revenue.recordSale(selectedSdkProd, 'user-test', simulatedAmt, simulatedItem);
    setRefreshCounter(prev => prev + 1);
  };

  const handleAddSandboxValue = () => {
    if (sandboxNewKey && sandboxNewVal) {
      EnterpriseProductSDK.API.state.set(selectedSdkProd, sandboxNewKey, sandboxNewVal);
      setSandboxNewKey('');
      setSandboxNewVal('');
      setRefreshCounter(prev => prev + 1);
    }
  };

  const handleSendXMsg = () => {
    let parsedPayload = messagePayload;
    try {
      parsedPayload = JSON.parse(messagePayload);
    } catch {
      // Raw string is fine
    }
    EnterpriseProductSDK.API.communication.send(selectedSdkProd, targetReceiver, messageType, parsedPayload);
    setRefreshCounter(prev => prev + 1);
  };

  const manifest = ProductManifestRegistry.getManifest(selectedSdkProd);
  const sandbox = ProductStateManager.getSandbox(selectedSdkProd);
  const resourceAlloc = SharedResourceAllocator.getAllocations().find(a => a.productId === selectedSdkProd);
  const stats = ProductUsageStatisticsEngine.getUsageSummary(selectedSdkProd);
  const transactions = ProductRevenueTracker.getTransactions(selectedSdkProd);
  const inbox = EnterpriseProductSDK.API.communication.getInbox(selectedSdkProd);
  const allFlags = EnterpriseProductSDK.API.featureFlags.getAll(selectedSdkProd);

  const productNames: Record<ProductIdentity, string> = {
    [ProductIdentity.FACE_AI]: 'Face AI (Product 1)',
    [ProductIdentity.AI_CREATIONS]: 'AI Creations (Product 2)',
    [ProductIdentity.COMMUNITY]: 'Community (Product 3)',
    [ProductIdentity.MARKETPLACE]: 'Marketplace (Product 4)',
    [ProductIdentity.HOME_GENERATE]: 'Home Runway'
  };

  return (
    <div className="bg-[#06060c] border border-white/5 p-6 rounded-3xl mt-8 space-y-6 text-left">
      {/* HEADER SECTION */}
      <div className="pb-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest block">
            Enterprise Product Architecture SDK
          </span>
          <h4 className="text-lg font-serif font-light text-white tracking-tight">
            Independent AI Business Module API Control
          </h4>
          <p className="text-xs text-zinc-400 max-w-2xl mt-1">
            Every product below functions as an isolated corporate micro-system with proprietary feature-flags, billing ledger, sandbox storage, and local extensions, while leveraging shared infrastructure (Knowledge Graph, Memories) only through secure API layers.
          </p>
        </div>

        {/* REVENUE OVERVIEW */}
        <div className="bg-black/50 border border-white/5 px-4 py-3 rounded-2xl flex items-center gap-6">
          <div>
            <span className="text-[8px] font-mono text-zinc-500 uppercase block">Global Marketplace Sales</span>
            <span className="text-lg font-mono text-emerald-400 font-medium">${ProductRevenueTracker.getTotalRevenue()}</span>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div>
            <span className="text-[8px] font-mono text-zinc-500 uppercase block">Platform Commission</span>
            <span className="text-lg font-mono text-indigo-300 font-medium">${ProductRevenueTracker.getPlatformCommissions()}</span>
          </div>
        </div>
      </div>

      {/* ISOLATED PRODUCT SWITCHER */}
      <div className="flex flex-wrap gap-2">
        {Object.values(ProductIdentity).map((id) => {
          const isSelected = selectedSdkProd === id;
          return (
            <button
              key={id}
              onClick={() => {
                setSelectedSdkProd(id);
                // Cycle target receiver to avoid sending to self
                if (id === targetReceiver) {
                  setTargetReceiver(id === ProductIdentity.FACE_AI ? ProductIdentity.AI_CREATIONS : ProductIdentity.FACE_AI);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all uppercase cursor-pointer border ${
                isSelected
                  ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/40 font-bold shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                  : 'bg-black/40 text-zinc-500 border-white/5 hover:text-zinc-300'
              }`}
            >
              {productNames[id] || id}
            </button>
          );
        })}
      </div>

      {/* CORE ANALYSIS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPARTMENT: Manifest, capabilities, and Feature Flags */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* MANIFEST SECTION */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8.5px] font-mono text-zinc-500 block uppercase">Product Manifest</span>
                <h5 className="text-sm font-semibold text-white">{manifest.name}</h5>
              </div>
              <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-500/10 font-bold">
                v{manifest.version}
              </span>
            </div>

            <div className="space-y-3 font-mono text-[10px] text-zinc-400">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/[0.02]">
                <div>
                  <span className="text-zinc-600 text-[8px] block uppercase">Build Key</span>
                  <span className="text-zinc-300">#B{manifest.buildNumber}</span>
                </div>
                <div>
                  <span className="text-zinc-600 text-[8px] block uppercase">Lead Division</span>
                  <span className="text-zinc-300 block truncate">{manifest.author}</span>
                </div>
              </div>

              {/* CORE CAPABILITIES */}
              <div>
                <span className="text-zinc-600 text-[8px] block uppercase mb-1.5">Registered Capabilities</span>
                <div className="flex flex-wrap gap-1">
                  {manifest.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="text-[7.5px] font-mono bg-violet-950/30 text-violet-300 border border-violet-500/15 px-2 py-0.5 rounded"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* ENGINE INJECTION DEPENDENCIES */}
              <div>
                <span className="text-zinc-600 text-[8px] block uppercase mb-1.5">Injected Shared Services</span>
                <div className="flex flex-wrap gap-1">
                  {manifest.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="text-[7.5px] font-mono bg-black text-indigo-300 border border-white/5 px-2 py-0.5 rounded"
                    >
                      @{dep}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE FLAGS TONING PANEL */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4">
            <div>
              <span className="text-[8.5px] font-mono text-emerald-400 font-bold block uppercase">Product Feature Flags</span>
              <h5 className="text-xs font-sans text-zinc-400">Control active business pipelines</h5>
            </div>

            <div className="space-y-2.5">
              {Object.entries(allFlags).map(([flag, isEnabled]) => (
                <div key={flag} className="flex justify-between items-center bg-black/30 px-3 py-2 rounded-xl border border-white/[0.03]">
                  <span className="font-mono text-[10px] text-zinc-300">{flag}</span>
                  <button
                    onClick={() => {
                      EnterpriseProductSDK.API.featureFlags.set(selectedSdkProd, flag, !isEnabled);
                      setRefreshCounter(prev => prev + 1);
                    }}
                    className={`px-2.5 py-1 rounded text-[8.5px] font-mono uppercase font-bold cursor-pointer transition-all border ${
                      isEnabled
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
                        : 'bg-zinc-800/40 text-zinc-500 border-zinc-700/20'
                    }`}
                  >
                    {isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MIDDLE COMPARTMENT: Sandbox isolated key/value state & Telemetry allocations */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* ISOLATED PRODUCT SANDBOX */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5 text-left">
              <div>
                <span className="text-[8.5px] font-mono text-zinc-500 block uppercase">Product Private Sandbox</span>
                <h5 className="text-sm font-semibold text-white">State Variable Registry</h5>
              </div>
              <span className="text-[8px] font-mono text-violet-400">Strictly Isolated</span>
            </div>

            {/* Sandbox State Rows */}
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar">
              {Array.from(sandbox.entries()).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center bg-black/30 p-2 rounded-lg text-[9.5px] font-mono border border-white/[0.02]">
                  <span className="text-zinc-500">{key}:</span>
                  <span className="text-zinc-200 font-bold truncate max-w-[150px]" title={String(val)}>
                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                  </span>
                </div>
              ))}
              {sandbox.size === 0 && (
                <div className="text-center py-4 text-zinc-600 text-[10px] font-mono">Sandbox Storage Empty</div>
              )}
            </div>

            {/* Add sandbox key-value tool */}
            <div className="pt-2 border-t border-white/[0.02] space-y-2">
              <span className="text-zinc-600 text-[8px] font-mono uppercase block">Add Private State Object</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. skinTone)"
                  value={sandboxNewKey}
                  onChange={(e) => setSandboxNewKey(e.target.value)}
                  className="bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-white outline-none focus:border-indigo-500/50"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Warm)"
                  value={sandboxNewVal}
                  onChange={(e) => setSandboxNewVal(e.target.value)}
                  className="bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-white outline-none focus:border-indigo-500/50"
                />
              </div>
              <button
                onClick={handleAddSandboxValue}
                className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer font-bold"
              >
                [ Push to Isolated Sandbox ]
              </button>
            </div>
          </div>

          {/* RESOURCE QUOTAS & USAGE STATISTICS */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4">
            <div>
              <span className="text-[8.5px] font-mono text-amber-500 font-bold block uppercase">Quota & Resource Allocation</span>
              <h5 className="text-xs font-sans text-zinc-400">Guaranteed cluster resource limits</h5>
            </div>

            <div className="space-y-3 font-mono text-[10px] text-zinc-400">
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] text-zinc-500 uppercase">
                  <span>API Requests Daily Limit</span>
                  <span className="text-zinc-300">{resourceAlloc?.currentUsageRequests} / {resourceAlloc?.maxDailyRequests}</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(((resourceAlloc?.currentUsageRequests || 0) / (resourceAlloc?.maxDailyRequests || 100)) * 100, 100)}%` }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/[0.02]">
                <div>
                  <span className="text-zinc-600 text-[8px] block uppercase">Dedicated RAM</span>
                  <span className="text-zinc-200 font-bold">{resourceAlloc?.maxMemoryMb} MB</span>
                </div>
                <div>
                  <span className="text-zinc-600 text-[8px] block uppercase">CPU Thread Limit</span>
                  <span className="text-zinc-200 font-bold">{resourceAlloc?.allocatedThreads} Core VM</span>
                </div>
                <div>
                  <span className="text-zinc-600 text-[8px] block uppercase">Total API Requests</span>
                  <span className="text-zinc-200 font-bold">{stats.apiCallsCount} calls</span>
                </div>
                <div>
                  <span className="text-zinc-600 text-[8px] block uppercase">CPU Hours Burned</span>
                  <span className="text-zinc-200 font-bold font-mono text-[9px]">{stats.cpuHoursSum.toFixed(4)} hrs</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.02]">
                <button
                  onClick={handleSimulateRequest}
                  className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 py-2 rounded-lg text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer font-mono"
                >
                  [ Call API Operation: Use 1 Quota ]
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COMPARTMENT: Revenue ledger, cross-product message router */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* FINANCIAL LEDGER */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5 text-left">
              <div>
                <span className="text-[8.5px] font-mono text-emerald-400 font-bold block uppercase">Product Revenue & Commerce</span>
                <h5 className="text-sm font-semibold text-white">Billing Ledger</h5>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 font-medium">${ProductRevenueTracker.getTotalRevenue(selectedSdkProd)}</span>
            </div>

            {/* Simulated transaction inputs */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Price USD"
                  value={simulatedAmt || ''}
                  onChange={(e) => setSimulatedAmt(Number(e.target.value))}
                  className="bg-black/60 border border-white/10 px-2.5 py-1 text-[10px] font-mono text-white outline-none focus:border-indigo-500/50"
                />
                <input
                  type="text"
                  placeholder="Item Name"
                  value={simulatedItem}
                  onChange={(e) => setSimulatedItem(e.target.value)}
                  className="bg-black/60 border border-white/10 px-2.5 py-1 text-[10px] font-mono text-white outline-none focus:border-indigo-500/50"
                />
              </div>
              <button
                onClick={handleRecordSale}
                className="w-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/15 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer font-bold"
              >
                [ Record Isolated Sale ]
              </button>
            </div>

            {/* Transactions stream */}
            <div className="pt-2 border-t border-white/[0.02] space-y-1.5 max-h-[110px] overflow-y-auto custom-scrollbar">
              {transactions.slice().reverse().map((tx) => (
                <div key={tx.transactionId} className="flex justify-between items-center bg-black/30 p-1.5 rounded text-[9px] font-mono border border-white/[0.01]">
                  <div className="space-y-0.5 text-left">
                    <span className="text-zinc-400 block max-w-[130px] truncate">{tx.itemDescription}</span>
                    <span className="text-zinc-600 block text-[7px]">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">+${tx.amountUsd}</span>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-4 text-zinc-600 text-[10px] font-mono">No Sales Recorded</div>
              )}
            </div>
          </div>

          {/* CROSS-PRODUCT MESSAGE ROUTER */}
          <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4">
            <div>
              <span className="text-[8.5px] font-mono text-indigo-400 font-bold block uppercase">Cross-Product Routing Bus</span>
              <h5 className="text-xs font-sans text-zinc-400">Direct decoupled secure communication</h5>
            </div>

            {/* Message composer */}
            <div className="space-y-2 text-zinc-400 font-mono text-[10px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-zinc-600 text-[8px] uppercase block mb-1">To Business</span>
                  <select
                    value={targetReceiver}
                    onChange={(e) => setTargetReceiver(e.target.value as ProductIdentity)}
                    className="w-full bg-black/60 border border-white/10 px-2 py-1 rounded text-[10px] text-white focus:border-indigo-500/50"
                  >
                    {Object.values(ProductIdentity)
                      .filter(id => id !== selectedSdkProd)
                      .map(id => (
                        <option key={id} value={id}>{productNames[id] || id}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <span className="text-zinc-600 text-[8px] uppercase block mb-1">Type</span>
                  <input
                    type="text"
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 px-2 py-1 rounded text-[10px] text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <span className="text-zinc-600 text-[8px] uppercase block mb-1">Payload JSON</span>
                <input
                  type="text"
                  value={messagePayload}
                  onChange={(e) => setMessagePayload(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 px-2.5 py-1.5 rounded text-[10px] text-white outline-none focus:border-indigo-500/50"
                />
              </div>

              <button
                onClick={handleSendXMsg}
                className="w-full bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/15 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer font-sans"
              >
                Send Secure API Message
              </button>
            </div>

            {/* Inbox for current product */}
            <div className="pt-2 border-t border-white/[0.02]">
              <span className="text-zinc-500 text-[8px] font-mono uppercase block mb-1.5">Product Inbox</span>
              <div className="space-y-1.5 max-h-[110px] overflow-y-auto custom-scrollbar">
                {inbox.slice().reverse().map((msg, i) => (
                  <div key={i} className="bg-indigo-950/20 border border-indigo-500/15 p-2 rounded-lg text-[9.5px] font-mono text-left">
                    <div className="flex justify-between items-center text-zinc-500 text-[8px] mb-1">
                      <span>FROM: {productNames[msg.sender] || msg.sender}</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-indigo-200 font-bold mb-0.5">{msg.messageType}</div>
                    <pre className="text-[8.5px] text-zinc-400 bg-black/30 p-1 rounded overflow-x-auto truncate">
                      {typeof msg.payload === 'object' ? JSON.stringify(msg.payload) : msg.payload}
                    </pre>
                  </div>
                ))}
                {inbox.length === 0 && (
                  <div className="text-center py-2 text-zinc-600 text-[10px] font-mono">Inbox Empty</div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

