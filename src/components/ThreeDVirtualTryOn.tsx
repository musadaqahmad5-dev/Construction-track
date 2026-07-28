import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AlertTriangle, Loader2, Upload, RefreshCw, Sparkles, Layers } from 'lucide-react';
import { applyAiMeshTransformation, AiMeshPayload } from '../../applyAiMeshTransformation';

import { auth } from '../firebase';

export interface ThreeDVirtualTryOnProps {
  clothingItemId?: string;
  defaultUserImage?: string;
  onSessionComplete?: (aiData: AiMeshPayload) => void;
}

export const ThreeDVirtualTryOn: React.FC<ThreeDVirtualTryOnProps> = ({
  clothingItemId = 'garment-001',
  defaultUserImage = '',
  onSessionComplete,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mannequinRef = useRef<THREE.Mesh | null>(null);
  const garmentRef = useRef<THREE.Mesh | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [aiData, setAiData] = useState<AiMeshPayload | null>(null);
  const [userImage, setUserImage] = useState<string>(defaultUserImage);
  const [activeGarmentId, setActiveGarmentId] = useState<string>(clothingItemId);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x818cf8, 0.6);
    backLight.position.set(-2, 2, -2);
    scene.add(backLight);

    const mannequinGeo = new THREE.CylinderGeometry(0.25, 0.2, 1.5, 32);
    const mannequinMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.7,
      metalness: 0.1,
    });
    const mannequinMesh = new THREE.Mesh(mannequinGeo, mannequinMat);
    mannequinMesh.position.set(0, 0, 0);
    scene.add(mannequinMesh);
    mannequinRef.current = mannequinMesh;

    const garmentGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.8, 32);
    const garmentMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.5,
      metalness: 0.2,
    });
    const garmentMesh = new THREE.Mesh(garmentGeo, garmentMat);
    garmentMesh.position.set(0, 0.25, 0);
    scene.add(garmentMesh);
    garmentRef.current = garmentMesh;

    let angle = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      angle += 0.005;
      if (mannequinMesh) mannequinMesh.rotation.y = angle;
      if (garmentMesh) garmentMesh.rotation.y = angle;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      if (controlsRef.current && typeof controlsRef.current.dispose === 'function') {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((object: THREE.Object3D) => {
          if ((object as THREE.Mesh).geometry) {
            (object as THREE.Mesh).geometry.dispose();
          }

          if ((object as THREE.Mesh).material) {
            const rawMaterial = (object as THREE.Mesh).material;
            const materials: THREE.Material[] = Array.isArray(rawMaterial)
              ? rawMaterial
              : [rawMaterial];

            materials.forEach((mat: THREE.Material) => {
              if (!mat) return;

              const textureKeys: (keyof THREE.Material | string)[] = [
                'map',
                'normalMap',
                'roughnessMap',
                'metalnessMap',
                'aoMap',
                'emissiveMap',
                'alphaMap',
                'bumpMap',
                'displacementMap',
                'envMap',
                'lightMap',
                'specularMap',
                'clearcoatMap',
                'clearcoatNormalMap',
                'clearcoatRoughnessMap',
                'iridescenceMap',
                'sheenColorMap',
                'sheenRoughnessMap',
                'transmissionMap',
                'thicknessMap',
              ];

              textureKeys.forEach((key) => {
                const texture = (mat as any)[key];
                if (texture && typeof texture === 'object' && typeof texture.dispose === 'function') {
                  texture.dispose();
                }
              });

              mat.dispose();
            });
          }
        });

        while (sceneRef.current.children.length > 0) {
          sceneRef.current.remove(sceneRef.current.children[0]);
        }
      }

      if (rendererRef.current) {
        const domElement = rendererRef.current.domElement;
        rendererRef.current.dispose();
        if (typeof (rendererRef.current as any).forceContextLoss === 'function') {
          (rendererRef.current as any).forceContextLoss();
        }

        if (domElement && domElement.parentNode) {
          domElement.parentNode.removeChild(domElement);
        }
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      mannequinRef.current = null;
      garmentRef.current = null;
    };
  }, []);

  const fetchAiTryOnMetrics = async (
    filePayload: string,
    clothingId: string
  ): Promise<AiMeshPayload> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (auth?.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } catch (_) {
        headers['Authorization'] = 'Bearer guest-token';
      }
    } else {
      headers['Authorization'] = 'Bearer guest-token';
    }

    const response = await fetch('/api/tryon/process-mesh', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userImage: filePayload,
        clothingItemId: clothingId,
        userId: auth?.currentUser?.uid || 'guest-sartorialist-user-100'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return (await response.json()) as AiMeshPayload;
  };

  const handleStartTryOn = async (overrideImage?: string, overrideItemId?: string) => {
    const imageToUse = overrideImage || userImage;
    const itemToUse = overrideItemId || activeGarmentId;

    if (!imageToUse) {
      setApiError('Please select or upload a user image to begin AI Try-On.');
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const responseData = await fetchAiTryOnMetrics(imageToUse, itemToUse);
      setAiData(responseData);

      if (mannequinRef.current && garmentRef.current) {
        applyAiMeshTransformation(
          mannequinRef.current,
          garmentRef.current,
          responseData
        );
      }

      if (onSessionComplete) {
        onSessionComplete(responseData);
      }
    } catch (err: any) {
      setApiError(err instanceof Error ? err.message : 'Unable to process AI Try-On');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setUserImage(base64);
        handleStartTryOn(base64, activeGarmentId);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-slate-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="flex items-center justify-between z-10 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            3D WebGL Virtual Try-On Studio
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            Gemini 2.5 Mesh Engine
          </span>
        </div>
      </div>

      <div ref={containerRef} className="relative flex-1 w-full min-h-[380px] my-2 rounded-xl bg-slate-900/50 border border-white/5 overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-xs font-mono text-zinc-300 font-semibold tracking-wide">
              Analyzing Multi-Modal Payload & Transforming 3D Mesh...
            </p>
          </div>
        )}

        {apiError && (
          <div className="absolute inset-0 z-30 bg-slate-950 border border-red-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Unable to process AI Try-On
              </h4>
              <p className="text-xs text-red-300/80 font-sans max-w-sm">
                {apiError}
              </p>
            </div>
            <button
              onClick={() => {
                setApiError(null);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-red-900/20"
            >
              Retry Upload
            </button>
          </div>
        )}
      </div>

      <div className="z-10 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="cursor-pointer px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => handleStartTryOn()}
            disabled={isLoading}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-white/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Process AI Mesh</span>
          </button>
        </div>

        {aiData && (
          <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-400">
            <span className="flex items-center gap-1">
              Color: <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/20" style={{ backgroundColor: aiData.primaryColorHex }} />
            </span>
            <span>Texture: <strong className="text-indigo-300">{aiData.materialTextureType}</strong></span>
            <span>Scale: <strong className="text-zinc-200">[{aiData.recommendedScale.join(', ')}]</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDVirtualTryOn;
