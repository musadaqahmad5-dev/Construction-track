import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ChevronRight, 
  Sliders, 
  HelpCircle,
  TrendingUp,
  Activity,
  Heart,
  FileSpreadsheet
} from 'lucide-react';
import { WardrobeItem, ClothingCategory } from '../types';
import { WardrobeCameraCard } from './WardrobeCameraCard';
import { GarmentPreview } from './GarmentPreview';
import { VisualSuggestion, VisualGarmentAnalysis } from '../features/vision/visualSuggestion';

interface VisualAnalysisPanelProps {
  wardrobe: WardrobeItem[];
  onAddGarment: (
    title: string, 
    description: string, 
    category: ClothingCategory, 
    extraOptions?: {
      season?: WardrobeItem['season'];
      primaryColor?: string;
      secondaryColor?: string;
    }
  ) => Promise<void>;
}

type IngestionStep = 'upload' | 'analyzing' | 'preview' | 'completed';

export const VisualAnalysisPanel: React.FC<VisualAnalysisPanelProps> = ({ 
  wardrobe, 
  onAddGarment 
}) => {
  const [currentStep, setCurrentStep] = useState<IngestionStep>('upload');
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | undefined>(undefined);
  const [selectedImagePureBase64, setSelectedImagePureBase64] = useState<string | undefined>(undefined);
  const [sourceFileName, setSourceFileName] = useState<string>('');
  const [visualResult, setVisualResult] = useState<VisualGarmentAnalysis | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // 1. Calculate AI Closet Readiness %
  // Formula: Percentage of garments equipped with complete season, primaryColor, and secondaryColor descriptors
  const totalCount = wardrobe.length;
  const completeDescriptorCount = wardrobe.filter(item => 
    item.season && item.primaryColor && item.secondaryColor
  ).length;
  
  const aiReadinessPercent = totalCount > 0 
    ? Math.round((completeDescriptorCount / totalCount) * 100) 
    : 100;

  // 2. Identify Closet Structural Gaps & Style Inadequacies
  const getClosetGaps = () => {
    const gaps: string[] = [];
    const categoriesList: ClothingCategory[] = ['Casual', 'Formal', 'Sportswear', 'Outerwear', 'Accessories'];
    
    // Check missing categories
    categoriesList.forEach(cat => {
      const catCount = wardrobe.filter(item => item.category === cat).length;
      if (catCount === 0) {
        gaps.push(`No clothing coordinates registered under '${cat}' classification.`);
      } else if (catCount === 1) {
        gaps.push(`Low coordination versatility with only one clothing asset in '${cat}'.`);
      }
    });

    // Check season coverage
    const seasonsList = ['Spring', 'Summer', 'Autumn', 'Winter'];
    seasonsList.forEach(sea => {
      const seaCount = wardrobe.filter(item => item.season === sea).length;
      if (seaCount === 0) {
        gaps.push(`No structural garments designated for '${sea}' temperatures.`);
      }
    });

    // Color variety suggestions
    const neutralCount = wardrobe.filter(item => 
      ['Pitch Black', 'Minimalist White', 'Oatmeal Beige'].includes(item.primaryColor || '')
    ).length;
    if (neutralCount < 2 && totalCount > 0) {
      gaps.push("Incomplete core neutral anchors. Integrate black, white, or beige layers.");
    }

    if (gaps.length === 0) {
      return ["Your digital wardrobe is fully harmonized across seasons, categories, and core neutral anchors!"];
    }

    return gaps.slice(0, 4); // Limit to top 4 insights
  };

  const detectedGaps = getClosetGaps();

  // Executed when base64 image represents clean selection
  const handleImageSelected = async (base64Url: string, pureBase64: string, fileName: string) => {
    setSelectedImageBase64(base64Url);
    setSelectedImagePureBase64(pureBase64);
    setSourceFileName(fileName);
    setCurrentStep('analyzing');

    try {
      // Trigger visually intelligent analysis
      const result = await VisualSuggestion.analyzeGarment(base64Url, pureBase64, fileName);
      setVisualResult(result);
      setCurrentStep('preview');
    } catch (err) {
      console.error(err);
      setCurrentStep('upload');
    }
  };

  // User approved and tweaked result
  const handleConfirmSave = async (finalData: VisualGarmentAnalysis) => {
    setIsSaving(true);
    try {
      // Add garment metadata into cloud db (Store metadata only, raw uploads flushed for safety)
      await onAddGarment(
        finalData.name,
        finalData.description,
        finalData.category,
        {
          season: finalData.season,
          primaryColor: finalData.primaryColor,
          secondaryColor: finalData.secondaryColor
        }
      );

      setSuccessInfo(`Successfully logged "${finalData.name}" as a ${finalData.category} asset.`);
      setCurrentStep('completed');
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setVisualResult(null);
    setSelectedImageBase64(undefined);
    setSelectedImagePureBase64(undefined);
    setCurrentStep('upload');
  };

  const handleStartNew = () => {
    setVisualResult(null);
    setSelectedImageBase64(undefined);
    setSelectedImagePureBase64(undefined);
    setSuccessInfo(null);
    setCurrentStep('upload');
  };

  return (
    <div className="space-y-8 font-sans" id="visual-wardrobe-intel-viewport">
      {/* Visual Header */}
      <div>
        <h2 className="text-2xl font-serif font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BrainCircuit className="text-blue-500 animate-pulse" size={24} /> Visual Wardrobe Intelligence
        </h2>
        <p className="text-xs text-slate-500 font-light mt-1">
          Perform digital fabric scanning and metadata mapping directly using Gemini 3.5 Flash multi-modal layers.
        </p>
      </div>

      {/* METRIC ROW: AI READINESS & STYLE GAPS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="visual-intel-dashboard">
        
        {/* Gauge card */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
              <TrendingUp size={16} className="text-blue-500" /> AI Style Readiness
            </h3>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">Parameters integration ratio</p>
          </div>

          <div className="py-6 flex flex-col items-center">
            {/* Visual concentric dial representation */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="stroke-blue-600"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={326.7}
                  initial={{ strokeDashoffset: 326.7 }}
                  animate={{ strokeDashoffset: 326.7 - (326.7 * aiReadinessPercent) / 100 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-3xl font-serif font-black text-slate-900">{aiReadinessPercent}%</span>
                <span className="text-[8px] uppercase tracking-widest text-slate-400 font-mono font-bold mt-1">Readiness</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-light leading-relaxed text-center">
            {aiReadinessPercent === 100 
              ? "Flawless wardrobe descriptive metadata. All assets mapped successfully for targeted recommendation audits."
              : "Some items are missing color, season or coordination tags. Perform more visual scans to maximize recommendation quality."
            }
          </p>
        </div>

        {/* Style spots gaps checker */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-amber-500" /> Detected Style Gaps
            </h3>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">Fashion density voids mapped</p>
          </div>

          <div className="my-4 space-y-2.5">
            {detectedGaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="text-xs text-slate-600 font-light leading-relaxed">{gap}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400">
            <HelpCircle size={12} />
            <span>Under performance matches, Gemini looks at density gaps to optimize styling lookbooks.</span>
          </div>
        </div>

      </div>

      {/* CORE INGESTION WORKFLOW CONTROLLER */}
      <div className="py-6 border-t border-slate-200" id="visual-ingestion-scaffolding">
        <AnimatePresence mode="wait">
          
          {currentStep === 'upload' && (
            <motion.div
              key="uploader-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center max-w-xl mx-auto space-y-3 mb-6">
                <h3 className="text-xl font-bold font-serif text-slate-900">Scan New Apparel</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Avoid typing tedious description lines manually. Snap a clear photo of your garment or drag image file from folder. The model extracts material, hues, and season weights instantly.
                </p>
              </div>

              <WardrobeCameraCard 
                onImageSelected={handleImageSelected}
                isProcessing={false}
              />
            </motion.div>
          )}

          {currentStep === 'analyzing' && (
            <motion.div
              key="analyzer-loading-step"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="relative w-20 h-20 flex items-center justify-center">
                {/* Visual ripple effect spinner loops */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" />
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl flex items-center justify-center">
                  <BrainCircuit className="text-white animate-pulse" size={28} />
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h4 className="font-serif font-black text-slate-900 text-lg">Querying Gemini Visual Node</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed animate-pulse">
                  Extracting fabric texture index, color code mappings, structural silhouette, and suitability guidelines...
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 'preview' && visualResult && (
            <motion.div
              key="preview-approval-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6 flex items-center gap-2 justify-center text-xs font-mono font-bold uppercase text-slate-400">
                <span>Upload</span> <ChevronRight size={12} />
                <span>Extracting</span> <ChevronRight size={12} />
                <span className="text-blue-600 animate-pulse">Approval Preview</span> <ChevronRight size={12} />
                <span>Save</span>
              </div>

              <GarmentPreview 
                analysis={visualResult}
                imageUrl={selectedImageBase64}
                onConfirm={handleConfirmSave}
                onCancel={handleCancel}
                isSaving={isSaving}
              />
            </motion.div>
          )}

          {currentStep === 'completed' && (
            <motion.div
              key="success-conclusion-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 bg-emerald-50/50 border border-emerald-100 rounded-3xl text-center max-w-xl mx-auto p-8 space-y-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif font-black text-slate-900 text-xl">Sartorial Integration Complete</h3>
                <p className="text-xs text-emerald-800 leading-relaxed font-light">
                  {successInfo || "A new high harmony garment descriptor has successfully logged into your wardrobe files."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartNew}
                className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md"
              >
                Scan Another Garment
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
