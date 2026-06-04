import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  Tag, 
  Palette, 
  Calendar, 
  AlertCircle, 
  ShieldCheck, 
  Flame, 
  Edit3, 
  Layers, 
  Sliders, 
  Clock 
} from 'lucide-react';
import { ClothingCategory } from '../types';
import { VisualGarmentAnalysis } from '../features/vision/visualSuggestion';

interface GarmentPreviewProps {
  analysis: VisualGarmentAnalysis;
  imageUrl?: string;
  onConfirm: (finalData: VisualGarmentAnalysis) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const GarmentPreview: React.FC<GarmentPreviewProps> = ({
  analysis,
  imageUrl,
  onConfirm,
  onCancel,
  isSaving
}) => {
  const [editedData, setEditedData] = useState<VisualGarmentAnalysis>({ ...analysis });
  const [isEditing, setIsEditing] = useState(false);

  const handleFieldChange = (field: keyof VisualGarmentAnalysis, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onConfirm(editedData);
  };

  const categories: ClothingCategory[] = ['Casual', 'Formal', 'Sportswear', 'Outerwear', 'Accessories'];
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter', 'All-Season'];
  const formalities = ['Casual', 'Semi-formal', 'Formal'];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl max-w-4xl mx-auto font-sans" id="garment-preview-visual">
      {/* Editorial Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex justify-between items-center">
        <div>
          <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider">
            <ShieldCheck size={12} /> Gemini Visual Extract Complete
          </span>
          <h3 className="text-xl font-serif font-black tracking-tight mt-2">Active Closet Verification</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest leading-none">Confidence index</p>
          <p className="text-2xl font-serif font-black text-indigo-400 mt-1">{Math.round((editedData.confidence || 0.85) * 100)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
        
        {/* Visual image display */}
        <div className="md:col-span-5 space-y-4">
          <div className="aspect-[4/5] bg-slate-50 border border-slate-150 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center relative">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Analyzed garment" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-center p-4">
                <Layers className="text-slate-300 mx-auto mb-2 animate-pulse" size={32} />
                <p className="text-xs text-slate-400">Image representation in transient cache only.</p>
              </div>
            )}
            
            {/* Visual crop border decoration */}
            <div className="absolute inset-4 border border-dashed border-white/20 pointer-events-none rounded-lg" />
          </div>
          
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider flex items-center gap-1">
              <Clock size={11} /> Temporal Data Protection
            </h4>
            <p className="text-[11px] text-slate-500 font-light leading-relaxed">
              To guarantee absolute data safety, raw photo binary states are never persisted on cloud-hosted disks. We extract key metadata descriptors and let the image flush.
            </p>
          </div>
        </div>

        {/* Extracted fields manager */}
        <div className="md:col-span-7 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
              <Sliders size={18} className="text-blue-500" /> Garment Parameters
            </h4>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 flex items-center gap-1 border border-blue-200 rounded-lg px-3 py-1 bg-blue-50/50 hover:bg-blue-50 transition-all cursor-pointer"
            >
              <Edit3 size={12} />
              <span>{isEditing ? "View Readout" : "Modify Details"}</span>
            </button>
          </div>

          {isEditing ? (
            /* INTERACTIVE EDITOR STATE */
            <div className="space-y-4 text-xs font-medium text-slate-700">
              <div className="space-y-1.5" id="field-group-name">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Garment Title</label>
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5" id="field-group-category">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Category Classification</label>
                  <select
                    value={editedData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-pointer focus:outline-none focus:border-blue-500"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5" id="field-group-season">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Season suitability</label>
                  <select
                    value={editedData.season}
                    onChange={(e) => handleFieldChange('season', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-pointer focus:outline-none focus:border-blue-500"
                  >
                    {seasons.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5" id="field-group-color-p">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Primary shade name</label>
                  <input
                    type="text"
                    value={editedData.primaryColor}
                    onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div className="space-y-1.5" id="field-group-color-s">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Secondary Shade</label>
                  <input
                    type="text"
                    value={editedData.secondaryColor}
                    onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5" id="field-group-material">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Material Makeup</label>
                  <input
                    type="text"
                    value={editedData.material}
                    onChange={(e) => handleFieldChange('material', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div className="space-y-1.5" id="field-group-formality">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Formality / Suitability</label>
                  <select
                    value={editedData.formality}
                    onChange={(e) => handleFieldChange('formality', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-pointer focus:outline-none focus:border-blue-500"
                  >
                    {formalities.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5" id="field-group-desc">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Description & Highlights</label>
                <textarea
                  value={editedData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-xs font-light resize-none"
                />
              </div>
            </div>
          ) : (
            /* ELEGANT SUMMARY DISPLAY STATE */
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between gap-1.5">
                <span className="text-[9px] font-mono uppercase font-bold text-slate-400 tracking-widest">Identified Name Suggestion</span>
                <p className="text-xl font-bold text-slate-900 tracking-tight">{editedData.name}</p>
                <p className="text-xs text-slate-500 font-light mt-1.5 leading-relaxed italic">"{editedData.description}"</p>
              </div>

              {/* Grid of properties metadata */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Closet category', val: editedData.category, icon: <Tag size={13} className="text-blue-500" /> },
                  { label: 'Season fit', val: editedData.season, icon: <Calendar size={13} className="text-amber-500" /> },
                  { label: 'Dominant shade', val: editedData.primaryColor, icon: <Palette size={13} className="text-rose-500" /> },
                  { label: 'Coordinating shade', val: editedData.secondaryColor || 'Neutral blend', icon: <Palette size={13} className="text-violet-500" /> },
                  { label: 'Material makeup', val: editedData.material || 'Knitted Blend', icon: <Layers size={13} className="text-emerald-500" /> },
                  { label: 'Formality level', val: editedData.formality || 'Casual fit', icon: <Flame size={13} className="text-orange-500" /> }
                ].map((p, idx) => (
                  <div key={idx} className="p-3.5 bg-[#FAFBFD] border border-slate-150 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100 shrink-0">
                      {p.icon}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block leading-none mb-1">{p.label}</span>
                      <span className="text-xs font-bold text-slate-800 tracking-tight">{p.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action trigger group */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving to Closet...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Approve & Save Piece</span>
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-250 text-slate-600 font-black rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer border border-slate-200"
            >
              Discard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
