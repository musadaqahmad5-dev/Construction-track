import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  RefreshCw, 
  X, 
  Zap, 
  AlertCircle,
  HelpCircle,
  Video
} from 'lucide-react';
import { ImagePreparation } from '../features/vision/imagePreparation';

interface WardrobeCameraCardProps {
  onImageSelected: (base64DataUrl: string, pureBase64: string, sourceFileName: string) => void;
  isProcessing: boolean;
}

export const WardrobeCameraCard: React.FC<WardrobeCameraCardProps> = ({
  onImageSelected,
  isProcessing
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Camera capture states
  const [cameraMode, setCameraMode] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Process selected file
  const processFile = async (file: File) => {
    setError(null);
    try {
      const prepared = await ImagePreparation.prepareImage(file);
      onImageSelected(prepared.base64, prepared.pureBase64, file.name);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to process image file. Try another format.");
    }
  };

  // Handle Drop Events
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle normal input
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  // Initialize camera
  const startCamera = async () => {
    setIsCameraStarting(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 800 } },
        audio: false
      });
      setCameraStream(stream);
      setCameraMode(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setError("Unable to access camera. Please double-check permissions or upload a file directly.");
      setCameraMode(false);
    } finally {
      setIsCameraStarting(false);
    }
  };

  // Take photo from video stream
  const capturePhoto = () => {
    if (!videoRef.current || !cameraStream) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 800;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Could not construct 2D context context.");
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const pureBase64 = dataUrl.split(',')[1];

      // Stop stream
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setCameraMode(false);

      onImageSelected(dataUrl, pureBase64, `Camera_Capture_${Date.now()}.jpg`);
    } catch (err: any) {
      console.error(err);
      setError("Webcam snapshot capturing error. Please select a file from disk instead.");
    }
  };

  const cancelCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraMode(false);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md max-w-xl mx-auto font-sans" id="wardrobe-camera-card-element">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
              <Camera className="text-blue-500" size={20} /> Intelligent Ingestion Engine
            </h3>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">Capture silhouette or upload file</p>
          </div>
          <span className="p-2 bg-blue-50 rounded-xl text-blue-600">
            <Zap size={16} className={isProcessing ? "animate-spin" : ""} />
          </span>
        </div>

        <AnimatePresence mode="wait">
          {cameraMode ? (
            /* ACTIVE CAMERA MODE CONTAINER */
            <motion.div 
              key="camera-preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="aspect-[4/5] bg-black rounded-2xl overflow-hidden relative border border-slate-900 shadow-lg">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                
                {/* Silhouette guides for better framing */}
                <div className="absolute inset-8 border border-white/30 border-dashed rounded-xl pointer-events-none flex flex-col items-center justify-center">
                  <div className="text-[10px] text-white/50 bg-black/40 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                    Align Hanger or Outline here
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-red-500/15 text-center flex items-center justify-center gap-1.5"
                >
                  <Video size={14} /> Snap Silhouette
                </button>
                <button
                  type="button"
                  onClick={cancelCamera}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer border border-slate-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            /* UPLOAD & DRAG STATE CONTAINER */
            <motion.div
              key="drag-upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`aspect-[4/3] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer relative overflow-hidden ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50/40' 
                    : 'border-slate-300 hover:border-blue-500 bg-slate-50/40 hover:bg-slate-50/80'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="space-y-3 pointer-events-none">
                  <div className="w-14 h-14 bg-white border border-slate-150 rounded-2xl shadow-sm flex items-center justify-center mx-auto text-slate-400">
                    <Upload size={22} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 tracking-tight">Drag and drop clothes image</p>
                    <p className="text-[10px] text-slate-400 font-light mt-1">Accepts PNG, JPG representing a neat flat-lay</p>
                  </div>
                  <span className="inline-block mt-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-800">
                    Browse Disk
                  </span>
                </div>
              </div>

              {/* Instant choice of camera setup */}
              <div className="flex gap-3 justify-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest自 pt-2">Or, setup via camera access if permissions allow:</span>
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={isCameraStarting}
                  className="py-2 px-4 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  {isCameraStarting ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" />
                      <span>Requesting...</span>
                    </>
                  ) : (
                    <>
                      <Camera size={11} />
                      <span>Initiate Camera Capture</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Display visual errors safely */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5"
          >
            <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-[11px] font-bold text-rose-900 leading-none">Extraction validation error</p>
              <p className="text-[10px] text-rose-700 font-light leading-relaxed mt-1">{error}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
