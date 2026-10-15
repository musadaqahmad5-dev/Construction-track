import React, { useState, useRef } from "react";
import { Camera, UploadCloud, RefreshCw, CheckCircle, Tag, Layers, Droplet } from "lucide-react";

export const VirtualWardrobeGrid: React.FC<{ userId: string }> = ({ userId }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [extractedMeta, setExtractedMeta] = useState<any | null>(null);
  const [isCommitted, setIsCommitted] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setExtractedMeta(null);
      setIsCommitted(false);
    };
    reader.readAsDataURL(file);
  };

  const executeAiVisionAnalysis = async () => {
    if (!imagePreview) return;
    try {
      setParsing(true);
      const base64Clean = imagePreview.split(",")[1];
      
      const token = localStorage.getItem("look_vision_token");
      const response = await fetch("/api/v1/ai/vision-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          assetId: `asset_${Date.now()}`,
          imageBase64: base64Clean,
          mimeType: "image/png"
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setExtractedMeta(data.visionResult.features);
      } else {
        throw new Error(data.message || "Upstream vision parsing rejected.");
      }
    } catch (err) {
      console.error("[VISION PORTAL FAILED]", err);
    } finally {
      setParsing(false);
    }
  };

  const commitToCloudCloset = async () => {
    if (!extractedMeta || !imagePreview) return;
    try {
      setParsing(true);
      // Directly commits the analyzed metadata schema shape into the Firestore 'wardrobe' collection
      const token = localStorage.getItem("look_vision_token");
      const res = await fetch("/api/v1/wardrobe/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          category: extractedMeta.garmentCategory,
          colorHex: extractedMeta.primaryPalette[0] || "#1A1A1A",
          material: extractedMeta.textileTexture,
          silhouette: extractedMeta.detectedSilhouette,
          imageUrl: imagePreview
        })
      });

      if (res.ok) {
        setIsCommitted(true);
        setImagePreview(null);
        setExtractedMeta(null);
      }
    } catch (err) {
      console.error("[CLOSET PROMOTION FAILED]", err);
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="bg-[#FBFBFA] p-8 font-sans text-[#1C1B1A]">
      <div className="max-w-3xl mx-auto border border-black/5 bg-white p-8">
        <h3 className="text-2xl font-serif font-bold mb-2">Closet Ingestion Matrix</h3>
        <p className="text-sm text-[#575551] mb-6">Visual scan, taxonomy tags extraction, and backend database ledger alignment.</p>

        {isCommitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Item successfully committed to persistent cloud wardrobe storage channels.
          </div>
        )}

        {!imagePreview && !extractedMeta && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
              dragActive ? "border-[#4F46E5] bg-[#F5F4F0]" : "border-black/10 hover:border-black/20"
            }`}
          >
            <UploadCloud className="w-10 h-10 mx-auto text-[#878580] mb-4" />
            <p className="text-sm font-medium">Drag garment photography here, or click to browse tracks</p>
            <p className="text-xs text-[#878580] mt-1 font-mono">Supports PNG, JPEG, WebP assets</p>
            <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} className="hidden" accept="image/*" />
          </div>
        )}

        {imagePreview && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="border border-black/5 p-2 bg-[#F5F4F0]">
              <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover aspect-[3/4]" />
              {!extractedMeta && (
                <button
                  onClick={executeAiVisionAnalysis}
                  disabled={parsing}
                  className="w-full mt-4 bg-[#1C1B1A] text-white py-3 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                  {parsing ? "Parsing Microstructures..." : "Execute AI Vision Parsing"}
                </button>
              )}
            </div>

            {extractedMeta && (
              <div className="space-y-6">
                <div className="border-b border-black/5 pb-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#878580]">Extracted Taxonomy Parameters</h4>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm"><Layers className="w-4 h-4 text-[#4F46E5]" /> <span className="font-mono text-xs">Category:</span> <span className="font-semibold uppercase">{extractedMeta.garmentCategory}</span></div>
                    <div className="flex items-center gap-3 text-sm"><Tag className="w-4 h-4 text-[#4F46E5]" /> <span className="font-mono text-xs">Silhouette:</span> <span className="font-semibold">{extractedMeta.detectedSilhouette}</span></div>
                    <div className="flex items-center gap-3 text-sm"><Droplet className="w-4 h-4 text-[#4F46E5]" /> <span className="font-mono text-xs">Texture:</span> <span className="font-semibold">{extractedMeta.textileTexture}</span></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="w-6 h-6 border border-black/10" style={{ backgroundColor: extractedMeta.primaryPalette[0] }} title="Primary Hex" />
                  <div className="w-6 h-6 border border-black/10" style={{ backgroundColor: extractedMeta.primaryPalette[1] }} title="Secondary Hex" />
                  <span className="text-xs font-mono text-[#878580] pt-1">Dominant Shading Nodes Identified</span>
                </div>

                <button
                  onClick={commitToCloudCloset}
                  disabled={parsing}
                  className="w-full bg-[#16A34A] text-white py-3 text-xs font-mono uppercase tracking-widest hover:bg-green-700 transition-colors"
                >
                  Commit to Closet
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
