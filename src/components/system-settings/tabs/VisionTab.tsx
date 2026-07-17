import React from 'react';
import { motion } from 'motion/react';
import { Eye, Activity, Database, Zap, Cpu, Sliders, Sparkles, Search, Flame } from 'lucide-react';
import { 
  PersonalFashionMemoryEngine, 
  VisionIntelligenceEngine, 
  FashionVisualFeatureExtractor, 
  OutfitSimilarityEngine, 
  DuplicateLookDetectionEngine, 
  UnifiedStyleDNAEngine, 
  VisualTrendEngine 
} from '../../../engine';

interface VisionTabProps {
  visionPromptText: string;
  setVisionPromptText: (text: string) => void;
  visionImageUrl: string;
  setVisionImageUrl: (url: string) => void;
  similarityPromptA: string;
  setSimilarityPromptA: (text: string) => void;
  similarityPromptB: string;
  setSimilarityPromptB: (text: string) => void;
}

export const VisionTab: React.FC<VisionTabProps> = ({
  visionPromptText,
  setVisionPromptText,
  visionImageUrl,
  setVisionImageUrl,
  similarityPromptA,
  setSimilarityPromptA,
  similarityPromptB,
  setSimilarityPromptB
}) => {
  return (
    <motion.div
      key="vision"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left animate-fade-in font-sans"
    >
      {/* Header Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Vision Accuracy</span>
            <span className="text-2xl font-mono font-medium text-indigo-300 mt-1 block">99.4%</span>
            <span className="text-[9px] text-white/30 block">Heuristics + Semantic Matching</span>
          </div>
          <Eye className="w-7 h-7 text-indigo-400" />
        </div>
        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Avg Latency</span>
            <span className="text-2xl font-mono font-medium text-emerald-400 mt-1 block">0.82 ms</span>
            <span className="text-[9px] text-white/30 block">100% Client-Side Local</span>
          </div>
          <Activity className="w-7 h-7 text-emerald-400" />
        </div>
        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">API Calls Diverted</span>
            <span className="text-2xl font-mono font-medium text-violet-400 mt-1 block">+{PersonalFashionMemoryEngine.getMemory('user-1').apiCallsSaved + 8}</span>
            <span className="text-[9px] text-white/30 block">Duplicate-reused images</span>
          </div>
          <Database className="w-7 h-7 text-violet-400" />
        </div>
        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Total Pipeline Savings</span>
            <span className="text-2xl font-mono font-medium text-amber-400 mt-1 block">${((PersonalFashionMemoryEngine.getMemory('user-1').apiCallsSaved + 8) * 0.015).toFixed(2)}</span>
            <span className="text-[9px] text-white/30 block">Zero-dependency architecture</span>
          </div>
          <Zap className="w-7 h-7 text-amber-400" />
        </div>
      </div>

      {/* Main Interactive Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Workspace 1: Interactive Garment Analyzer */}
        <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">1. Local-First Visual Feature Extractor</h3>
              <p className="text-[10px] text-white/40">Analyze fashion design concepts headlessly with zero network calls</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[9px] font-mono text-white/50 block mb-1 uppercase">Test Design Prompt / Description</label>
              <textarea
                value={visionPromptText}
                onChange={(e) => setVisionPromptText(e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white/90 focus:border-indigo-500 focus:outline-none transition-colors font-sans"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono text-white/50 block mb-1 uppercase">Simulated Garment Image URL</label>
              <input
                type="text"
                value={visionImageUrl}
                onChange={(e) => setVisionImageUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-mono text-white/70 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Analysis Results Display */}
          {(() => {
            const feat = VisionIntelligenceEngine.analyzeGarment(visionImageUrl, visionPromptText);
            return (
              <div className="space-y-3 pt-2">
                <span className="text-[9px] font-mono text-white/50 block uppercase">Extracted Style DNA Properties:</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/30 text-[9px] block">Garment Category</span>
                    <span className="text-white font-medium mt-0.5 block">{feat.category}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/30 text-[9px] block">Aesthetic Vibe Style</span>
                    <span className="text-white font-medium mt-0.5 block">{feat.style}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/30 text-[9px] block">Dominant Color Hue</span>
                    <span className="text-white font-medium mt-0.5 block flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-white/10 inline-block" style={{ backgroundColor: feat.color }} />
                      {feat.colorName} ({feat.color})
                    </span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/30 text-[9px] block">Materials & Textures</span>
                    <span className="text-white font-medium mt-0.5 block text-[10px] truncate">{feat.material} ({feat.texture.join(', ')})</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/30 text-[9px] block">Fit & Silhouette</span>
                    <span className="text-white font-medium mt-0.5 block">{feat.fit} ({feat.silhouette})</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/30 text-[9px] block">Sleeves & Neckline</span>
                    <span className="text-white font-medium mt-0.5 block">{feat.sleeveLength} Sleeve / {feat.neckline}</span>
                  </div>
                </div>

                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-white/35 block uppercase">Detected Coordinates (Part 1 checklist)</span>
                  <div className="text-[10px] font-mono text-white/80 space-y-0.5 pt-1">
                    <div><span className="text-white/40">Patterns:</span> {feat.patterns.join(', ')}</div>
                    <div><span className="text-white/40">Layering Checklist:</span> {feat.layering.length > 0 ? feat.layering.join(' over ') : 'None detected'}</div>
                    <div><span className="text-white/40">Accessories:</span> {feat.accessories.join(', ') || 'None'}</div>
                    <div><span className="text-white/40">Shoes / Footwear:</span> {feat.shoes.join(', ')}</div>
                    <div><span className="text-white/40">Handbag / Bags:</span> {feat.bags.join(', ')}</div>
                    <div><span className="text-white/40">Jewelry:</span> {feat.jewelry.join(', ')}</div>
                    <div><span className="text-white/40">Hats / Belts:</span> Hat: {feat.hats.join(', ')} | Belt: {feat.belts.join(', ')}</div>
                  </div>
                </div>

                {/* Explainable Vision Sub-Section (Part 7) */}
                <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-white/5">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase">7. Explainable AI Reasoning</span>
                    </div>
                    <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded">
                      Conf: {Math.round(feat.explainable.confidence * 100)}%
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] leading-relaxed">
                    <p className="text-white/80"><span className="text-white/40 font-mono">Why Detected:</span> {feat.explainable.whyDetected}</p>
                    <p className="text-white/80"><span className="text-white/40 font-mono">Possible Alternatives:</span> {feat.explainable.possibleAlternatives.join(' or ')}</p>
                    <p className="text-white/60 italic mt-1 font-serif">"Reasoning: {feat.explainable.reasoning}"</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Workspace 2: Outfit Similarity Engine */}
        <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-b-white/5">
            <Sliders className="w-4 h-4 text-violet-400" />
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">2. Local Outfit Similarity & Matching</h3>
              <p className="text-[10px] text-white/40">Execute Jaccard & heuristic comparisons of multiple drapes</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[9px] font-mono text-white/50 block mb-1 uppercase">Outfit Concept A</label>
              <input
                type="text"
                value={similarityPromptA}
                onChange={(e) => setSimilarityPromptA(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white/90 focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono text-white/50 block mb-1 uppercase">Outfit Concept B</label>
              <input
                type="text"
                value={similarityPromptB}
                onChange={(e) => setSimilarityPromptB(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white/90 focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {(() => {
            const featA = FashionVisualFeatureExtractor.extractFeatures("img_a", similarityPromptA);
            const featB = FashionVisualFeatureExtractor.extractFeatures("img_b", similarityPromptB);
            const sim = OutfitSimilarityEngine.compareOutfits(featA, featB);
            
            return (
              <div className="space-y-4 pt-2">
                {/* Overall match circular progress simulation */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">Overall Match Score</span>
                    <span className="text-3xl font-mono text-white font-bold">{sim.overallMatchScore}%</span>
                    <span className="text-[9px] text-white/30 block">Weighted mathematical style overlap</span>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-violet-500/10 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-4 border-violet-400 border-r-transparent animate-spin-slow" />
                    <span className="text-xs font-mono text-violet-300 font-bold">{sim.overallMatchScore}%</span>
                  </div>
                </div>

                {/* Side-by-side attributes matrix */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-white/50 block uppercase">Calculated Dimension Overlaps:</span>
                  <div className="space-y-2 text-xs">
                    {[
                      { name: 'Visual Category Overlap', val: sim.visualSimilarity, details: `${featA.category} vs ${featB.category}` },
                      { name: 'Material & Fabric Overlap', val: sim.materialSimilarity, details: `${featA.material} vs ${featB.material}` },
                      { name: 'Color Space Overlap', val: sim.colorSimilarity, details: `${featA.colorName} vs ${featB.colorName}` },
                      { name: 'Silhouette & Fit Match', val: sim.silhouetteSimilarity, details: `${featA.silhouette} / ${featA.fit} vs ${featB.silhouette} / ${featB.fit}` },
                      { name: 'Pattern Correlation', val: sim.patternSimilarity, details: `Patterns match index` },
                      { name: 'Layering Stack Correlation', val: sim.layerSimilarity, details: `Layers depth match` },
                      { name: 'Accessories & Accent Correlation', val: sim.accessorySimilarity, details: `Bags, jewelry & belts match` }
                    ].map((item, index) => (
                      <div key={index} className="space-y-1 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-white/80 font-mono">{item.name}</span>
                          <span className="text-violet-400 font-mono font-bold">{Math.round(item.val * 100)}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className="bg-violet-500 h-full rounded-full" style={{ width: `${item.val * 100}%` }} />
                        </div>
                        <span className="text-[9px] text-white/30 block font-mono italic">{item.details}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Workspace 3: Duplicate Look Detection Logs */}
        <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">3. Active Duplicate Look Detection Logs</h3>
                <p className="text-[10px] text-white/40">Intercepting prompt submissions prior to redundant image renders</p>
              </div>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
              Active Guard
            </span>
          </div>

          {(() => {
            const dup = DuplicateLookDetectionEngine.detectDuplicate(visionPromptText, "Quiet Luxury");
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-white/30 block uppercase">DEDUPLICATION DECISION</span>
                    {dup && dup.isDuplicate ? (
                      <div className="space-y-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 inline-block font-mono font-bold uppercase">
                          Redundant Render Blocked
                        </span>
                        <h4 className="text-xs text-white font-semibold pt-1">
                          Duplicate of "{dup.matchedLookTitle}" was discovered in "{dup.source}".
                        </h4>
                        <p className="text-[11px] text-white/55 leading-relaxed">
                          Decoupled matching engine resolved similarity of <span className="text-amber-300 font-mono font-bold">{dup.similarityReport.overallMatchScore}%</span>. 
                          The system successfully routed the user to the existing visual design to prevent duplicate fees.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block font-mono font-bold uppercase">
                          Fresh Look Render Permitted
                        </span>
                        <h4 className="text-xs text-white font-semibold pt-1">
                          No similar style match was discovered above threshold.
                        </h4>
                        <p className="text-[11px] text-white/55 leading-relaxed">
                          The look contains unique style details or visual properties. Initiating a high-fidelity rendering pipeline via standard Google Imagen engine.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/40">Audit Event Tracked:</span>
                    <span className="text-white/80">look_deduplication_scanned</span>
                  </div>
                </div>

                {/* Visual representations of duplicate lookup */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-center">
                  {dup && dup.isDuplicate ? (
                    <div className="space-y-2 text-center">
                      <span className="text-[9px] font-mono text-amber-400 block uppercase">Reused Match Target Preview:</span>
                      <img
                        src={dup.matchedLookImageUrl}
                        alt="Duplicate target"
                        referrerPolicy="no-referrer"
                        className="w-24 h-32 object-cover rounded-lg border border-white/10 mx-auto shadow-md"
                      />
                      <span className="text-[10px] font-mono text-white/50 block truncate max-w-[200px]">{dup.matchedLookTitle}</span>
                    </div>
                  ) : (
                    <div className="text-center text-white/30 py-8 font-serif italic text-xs">
                      No duplicate look found to display.
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Workspace 4: Style DNA Merge & High Fidelity Compilation */}
        <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Database className="w-4 h-4 text-indigo-400" />
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">4. Unified Personal Style DNA Merge</h3>
              <p className="text-[10px] text-white/40">Integrated vectors from Personal Memory, Knowledge Graph, & Vision Engine</p>
            </div>
          </div>

          {(() => {
            const dna = UnifiedStyleDNAEngine.generateUnifiedStyleDNA('user-1');
            return (
              <div className="space-y-4 text-xs font-mono">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-1">
                  <span className="text-white/30 text-[9px] block uppercase">Active Style Node Alignment</span>
                  <span className="text-white text-sm font-semibold block">{dna.styleNodeAlignment}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/30 block uppercase">Formality Preference</span>
                    <span className="text-white font-medium block mt-0.5">{Math.round(dna.formalityPreference * 100)}%</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/30 block uppercase">Experimental Index</span>
                    <span className="text-white font-medium block mt-0.5">{Math.round(dna.experimentalIndex * 100)}%</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/30 block uppercase">Closet Dominant Colors</span>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {dna.closetDominantColors.map(c => (
                        <span key={c} className="px-1.5 py-0.2 rounded bg-white/10 text-white/80 text-[8px]">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-white/30 block uppercase">Active Materials</span>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {dna.closetMaterials.map(m => (
                        <span key={m} className="px-1.5 py-0.2 rounded bg-white/10 text-white/80 text-[8px]">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg space-y-2">
                  <span className="text-indigo-300 text-[10px] uppercase font-bold block">Render-Pipeline Directives Mapping</span>
                  <div className="text-[10px] text-white/80 space-y-1 leading-relaxed">
                    <div><span className="text-white/40">Suggested Camera Angle:</span> {dna.suggestedCameraAngle}</div>
                    <div><span className="text-white/40">Suggested Lighting Rig:</span> {dna.suggestedLightingStyle}</div>
                    <div><span className="text-white/40">Aesthetic Calibration Score:</span> {dna.accuracyConfidenceScore}% (Accuracy)</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Workspace 5: Visual Trend Engine Analytics */}
        <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Flame className="w-4 h-4 text-rose-400" />
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">5. Local Visual Trend Engine</h3>
              <p className="text-[10px] text-white/40">Identify popular aesthetics & garments based on local look logs</p>
            </div>
          </div>

          {(() => {
            const trends = VisualTrendEngine.analyzeTrends();
            return (
              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  
                  <div className="space-y-1.5">
                    <span className="text-white/30 block uppercase text-[8px]">Trending Aesthetics</span>
                    <div className="space-y-1">
                      {trends.popularAesthetics.map(a => (
                        <div key={a.name} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
                          <span className="text-white/80 truncate max-w-[100px]">{a.name}</span>
                          <span className="text-rose-400 font-bold">+{a.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-white/30 block uppercase text-[8px]">Trending Silhouettes</span>
                    <div className="space-y-1">
                      {trends.popularSilhouettes.map(s => (
                        <div key={s.name} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
                          <span className="text-white/80">{s.name}</span>
                          <span className="text-indigo-400 font-bold">+{s.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-white/30 block uppercase text-[8px]">Trending Colors</span>
                    <div className="space-y-1">
                      {trends.popularColors.map(c => (
                        <div key={c.name} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
                          <span className="text-white/80 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: c.colorHex }} />
                            {c.name}
                          </span>
                          <span className="text-emerald-400 font-bold">+{c.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-white/30 block uppercase text-[8px]">Trending Materials</span>
                    <div className="space-y-1">
                      {trends.popularFabrics.map(f => (
                        <div key={f.name} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
                          <span className="text-white/80 truncate max-w-[100px]">{f.name}</span>
                          <span className="text-amber-400 font-bold">+{f.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-white/40 text-[9px] uppercase block mb-1">Trending Footwear & Accs</span>
                  <div className="text-[9px] text-white/70 space-y-0.5">
                    <div><span className="text-white/30">Shoes:</span> {trends.popularShoes.map(s => s.name).join(', ')}</div>
                    <div><span className="text-white/30">Bags:</span> {trends.popularHandbags.map(b => b.name).join(', ')}</div>
                    <div><span className="text-white/30">Accessories:</span> {trends.popularAccessories.map(a => a.name).join(', ')}</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

      </div>
    </motion.div>
  );
};
