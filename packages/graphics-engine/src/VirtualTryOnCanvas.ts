/**
 * EAOS Look Vision AI Fashion OS - WebGL Virtual Try-On Canvas Engine
 * Path: packages/graphics-engine/src/VirtualTryOnCanvas.ts
 * Subsystem: Three.js GPU Rendering Engine, Photorealistic Lighting & Memory Lifecycle Controller
 */

import * as THREE from 'three';

export interface CanvasConfig {
  targetElementId?: string;
  clearColor?: string | number;
  clearAlpha?: number;
  internalAntialias?: boolean;
  maxDevicePixelRatio?: number;
  enableShadows?: boolean;
  fov?: number;
  nearPlane?: number;
  farPlane?: number;
}

export interface RenderingMetrics {
  drawCalls: number;
  geometriesCount: number;
  texturesLoaded: number;
  trianglesCount: number;
  frameDeltaTime: number;
  fps: number;
  memoryGeometries: number;
  memoryTextures: number;
}

export class VirtualTryOnCanvas {
  private config: Required<CanvasConfig>;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private containerElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private animationFrameId: number | null = null;

  // Lighting references for disposal & dynamic tuning
  private ambientLight: THREE.AmbientLight | null = null;
  private hemisphereLight: THREE.HemisphereLight | null = null;
  private keySpotLight: THREE.SpotLight | null = null;
  private fillSpotLight: THREE.SpotLight | null = null;
  private rimDirectionalLight: THREE.DirectionalLight | null = null;

  // Performance and telemetry state
  private lastFrameTimestamp: number = 0;
  private currentFrameDelta: number = 0;
  private calculatedFps: number = 60;
  private frameCounter: number = 0;
  private fpsWindowTimestamp: number = 0;
  private isDisposed: boolean = false;
  private isMounted: boolean = false;

  constructor(config?: CanvasConfig) {
    this.config = {
      targetElementId: config?.targetElementId || '',
      clearColor: config?.clearColor ?? 0x06060c,
      clearAlpha: config?.clearAlpha ?? 1.0,
      internalAntialias: config?.internalAntialias ?? true,
      maxDevicePixelRatio: config?.maxDevicePixelRatio ?? 2.0,
      enableShadows: config?.enableShadows ?? true,
      fov: config?.fov ?? 45,
      nearPlane: config?.nearPlane ?? 0.1,
      farPlane: config?.farPlane ?? 1000
    };

    this.initializeCoreEngine();
  }

  /**
   * Evaluates WebGL capability and instantiates Scene, Camera, and Renderer safely
   */
  private initializeCoreEngine(): void {
    try {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(this.config.clearColor);

      const aspect = typeof window !== 'undefined' && window.innerWidth && window.innerHeight
        ? window.innerWidth / window.innerHeight
        : 1.0;

      this.camera = new THREE.PerspectiveCamera(
        this.config.fov,
        aspect,
        this.config.nearPlane,
        this.config.farPlane
      );
      this.camera.position.set(0, 1.4, 3.2);
      this.camera.lookAt(0, 1.0, 0);

      // Check if WebGL context can be created
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        console.warn('[VIRTUAL TRY-ON CANVAS] WebGL not supported on client environment.');
        return;
      }

      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: this.config.internalAntialias,
        alpha: this.config.clearAlpha < 1.0,
        powerPreference: 'high-performance',
        precision: 'highp',
        stencil: false,
        depth: true
      });

      this.renderer.setClearColor(this.config.clearColor, this.config.clearAlpha);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.08;
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;

      if (this.config.enableShadows) {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }

      const pixelRatio = typeof window !== 'undefined'
        ? Math.min(window.devicePixelRatio || 1.0, this.config.maxDevicePixelRatio)
        : 1.0;
      this.renderer.setPixelRatio(pixelRatio);

      this.setupLightingRig();

      if (this.config.targetElementId) {
        this.mountScene(this.config.targetElementId);
      }
    } catch (err: unknown) {
      console.error(
        '[VIRTUAL TRY-ON CANVAS] Failed to initialize WebGL graphics context:',
        err instanceof Error ? err.message : String(err)
      );
    }
  }

  /**
   * Configures a photorealistic atelier studio lighting rig with optimized soft shadows
   */
  private setupLightingRig(): void {
    if (!this.scene) return;

    // 1. Soft Ambient Fill
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(this.ambientLight);

    // 2. High-Fidelity Hemisphere Sky/Ground Balance
    this.hemisphereLight = new THREE.HemisphereLight(0xe0e7ff, 0x0f172a, 0.6);
    this.hemisphereLight.position.set(0, 20, 0);
    this.scene.add(this.hemisphereLight);

    // 3. Primary Key Studio Spotlight (Top-Front Right)
    this.keySpotLight = new THREE.SpotLight(0xfffaf0, 3.2);
    this.keySpotLight.position.set(3.5, 4.5, 3.0);
    this.keySpotLight.target.position.set(0, 1.0, 0);
    this.keySpotLight.angle = Math.PI / 4.2;
    this.keySpotLight.penumbra = 0.65;
    this.keySpotLight.decay = 2.0;
    this.keySpotLight.distance = 25.0;

    if (this.config.enableShadows) {
      this.keySpotLight.castShadow = true;
      this.keySpotLight.shadow.mapSize.width = 2048;
      this.keySpotLight.shadow.mapSize.height = 2048;
      this.keySpotLight.shadow.camera.near = 0.5;
      this.keySpotLight.shadow.camera.far = 15;
      this.keySpotLight.shadow.bias = -0.0001;
      this.keySpotLight.shadow.radius = 2.5;
    }

    this.scene.add(this.keySpotLight);
    this.scene.add(this.keySpotLight.target);

    // 4. Secondary Fill Spotlight (Front Left)
    this.fillSpotLight = new THREE.SpotLight(0xdbeafe, 1.8);
    this.fillSpotLight.position.set(-3.0, 3.2, 2.5);
    this.fillSpotLight.target.position.set(0, 1.0, 0);
    this.fillSpotLight.angle = Math.PI / 3.8;
    this.fillSpotLight.penumbra = 0.8;
    this.fillSpotLight.decay = 2.0;
    this.fillSpotLight.distance = 20.0;

    if (this.config.enableShadows) {
      this.fillSpotLight.castShadow = true;
      this.fillSpotLight.shadow.mapSize.width = 1024;
      this.fillSpotLight.shadow.mapSize.height = 1024;
      this.fillSpotLight.shadow.bias = -0.0002;
    }

    this.scene.add(this.fillSpotLight);
    this.scene.add(this.fillSpotLight.target);

    // 5. Rim / Silhouette Accent Directional Light (Back Left)
    this.rimDirectionalLight = new THREE.DirectionalLight(0x818cf8, 1.4);
    this.rimDirectionalLight.position.set(-2.5, 3.5, -3.0);
    this.scene.add(this.rimDirectionalLight);
  }

  /**
   * Initializes non-leaking container resize observation and viewport resizing
   */
  private attachResizeObserver(): void {
    if (!this.containerElement || typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      if (this.isDisposed || !entries || entries.length === 0) return;

      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.handleResize(width, height);
        }
      }
    });

    this.resizeObserver.observe(this.containerElement);
  }

  /**
   * Updates camera aspect ratios and renderer size smoothly without canvas flickering
   */
  private handleResize(width: number, height: number): void {
    if (!this.renderer || !this.camera || width <= 0 || height <= 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
  }

  /**
   * Core render loop with telemetry delta computation
   */
  private renderLoop = (timestamp: number): void => {
    if (this.isDisposed || !this.renderer || !this.scene || !this.camera) {
      return;
    }

    // Compute Delta Time
    if (this.lastFrameTimestamp > 0) {
      this.currentFrameDelta = (timestamp - this.lastFrameTimestamp) / 1000;
    } else {
      this.currentFrameDelta = 1 / 60;
    }
    this.lastFrameTimestamp = timestamp;

    // Compute Rolling FPS
    this.frameCounter++;
    if (timestamp - this.fpsWindowTimestamp >= 1000) {
      this.calculatedFps = Math.round((this.frameCounter * 1000) / (timestamp - this.fpsWindowTimestamp));
      this.frameCounter = 0;
      this.fpsWindowTimestamp = timestamp;
    }

    // Execute Frame Render
    this.renderer.render(this.scene, this.camera);

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.renderLoop);
  };

  /**
   * Mounts the WebGL canvas to the target DOM container and starts the animation loop
   */
  public mountScene(containerId: string): void {
    if (this.isDisposed) {
      console.warn('[VIRTUAL TRY-ON CANVAS] Cannot mount disposed canvas instance.');
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`[VIRTUAL TRY-ON CANVAS] Container element #${containerId} not found in DOM.`);
      return;
    }

    this.containerElement = container;

    if (this.renderer) {
      const canvas = this.renderer.domElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.outline = 'none';

      // Clear container and append canvas
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(canvas);

      const rect = container.getBoundingClientRect();
      const initialWidth = rect.width || container.clientWidth || 800;
      const initialHeight = rect.height || container.clientHeight || 600;
      this.handleResize(initialWidth, initialHeight);

      this.attachResizeObserver();

      if (!this.isMounted) {
        this.isMounted = true;
        this.lastFrameTimestamp = performance.now();
        this.fpsWindowTimestamp = performance.now();
        this.animationFrameId = requestAnimationFrame(this.renderLoop);
      }
    }
  }

  /**
   * Gathers real-time WebGL pipeline telemetry and memory diagnostics
   */
  public getSystemTelemetry(): RenderingMetrics {
    if (!this.renderer) {
      return {
        drawCalls: 0,
        geometriesCount: 0,
        texturesLoaded: 0,
        trianglesCount: 0,
        frameDeltaTime: 0,
        fps: 0,
        memoryGeometries: 0,
        memoryTextures: 0
      };
    }

    const renderInfo = this.renderer.info.render;
    const memoryInfo = this.renderer.info.memory;

    return {
      drawCalls: renderInfo.calls,
      geometriesCount: memoryInfo.geometries,
      texturesLoaded: memoryInfo.textures,
      trianglesCount: renderInfo.triangles,
      frameDeltaTime: Number(this.currentFrameDelta.toFixed(4)),
      fps: this.calculatedFps,
      memoryGeometries: memoryInfo.geometries,
      memoryTextures: memoryInfo.textures
    };
  }

  /**
   * Access the underlying Three.js Scene for adding garment meshes or mannequins
   */
  public getScene(): THREE.Scene | null {
    return this.scene;
  }

  /**
   * Access the underlying PerspectiveCamera
   */
  public getCamera(): THREE.PerspectiveCamera | null {
    return this.camera;
  }

  /**
   * Access the active WebGLRenderer
   */
  public getRenderer(): THREE.WebGLRenderer | null {
    return this.renderer;
  }

  /**
   * Completely disposes of all textures, geometries, materials, shader programs,
   * event listeners, and WebGL context bindings to prevent browser memory leaks.
   */
  public destroyScene(): void {
    if (this.isDisposed) return;
    this.isDisposed = true;
    this.isMounted = false;

    // 1. Cancel active animation frame
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // 2. Disconnect and unbind ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // 3. Traverse and dispose scene hierarchy
    if (this.scene) {
      this.scene.traverse((object: THREE.Object3D) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;

          if (mesh.geometry) {
            mesh.geometry.dispose();
          }

          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat: THREE.Material) => this.disposeMaterial(mat));
            } else {
              this.disposeMaterial(mesh.material);
            }
          }
        }
      });

      this.scene.clear();
      this.scene = null;
    }

    // 4. Dispose lights
    if (this.keySpotLight?.shadow?.map) {
      this.keySpotLight.shadow.map.dispose();
    }
    if (this.fillSpotLight?.shadow?.map) {
      this.fillSpotLight.shadow.map.dispose();
    }
    this.ambientLight = null;
    this.hemisphereLight = null;
    this.keySpotLight = null;
    this.fillSpotLight = null;
    this.rimDirectionalLight = null;

    // 5. Dispose WebGLRenderer and detach DOM elements
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();

      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }

    this.containerElement = null;
    this.camera = null;
  }

  /**
   * Safely disposes individual material and its bound texture maps
   */
  private disposeMaterial(material: THREE.Material): void {
    if (!material) return;

    const standardMat = material as THREE.MeshStandardMaterial;

    const textureKeys: Array<keyof THREE.MeshStandardMaterial> = [
      'map',
      'roughnessMap',
      'metalnessMap',
      'normalMap',
      'bumpMap',
      'displacementMap',
      'aoMap',
      'emissiveMap',
      'alphaMap',
      'envMap'
    ];

    for (const key of textureKeys) {
      const tex = standardMat[key];
      if (tex && typeof (tex as THREE.Texture).dispose === 'function') {
        (tex as THREE.Texture).dispose();
      }
    }

    material.dispose();
  }
}
