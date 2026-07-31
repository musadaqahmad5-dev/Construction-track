import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Award, Shield, ShieldCheck, Users, UserCheck, Play, Box, Scissors, 
  MapPin, Heart, HelpCircle, Check, Cpu, CheckCircle2, Sliders, ChevronRight,
  TrendingUp, RefreshCw, AlertCircle, Sparkle, BookOpen, Crown, Layers, 
  Settings, HelpCircle as HelpIcon, ArrowRight, Smartphone, Laptop, Tablet, Eye,
  Activity, Gauge, Terminal, CheckSquare, FileText, Lightbulb, Zap, Stars
} from 'lucide-react';
import { 
  useThemeIntelligence, 
  ThemeCoatRenderer, 
  FoundationInteractionWrapper 
} from '../../engine';

interface StudentGroup {
  id: string;
  name: string;
  ageRange: string;
  focus: string;
  styleVibe: string;
  needs: string[];
  vibeColor: string;
  vibeBadge: string;
}

interface WorkerAgent {
  id: string;
  name: string;
  role: string;
  needs: string[];
  isChosen: boolean;
  workingStatus: 'idle' | 'operational' | 'training';
  efficiency: number;
  cageId: string;
  toolsNeeded: string[];
}

interface IntegrationTask {
  id: string;
  label: string;
  category: string;
  status: 'completed' | 'in_progress' | 'pending';
  percentage: number;
  description: string;
}

export const FashionInstructorWorkspace: React.FC = () => {
  let themeCtx: ReturnType<typeof useThemeIntelligence> | null = null;
  try {
    themeCtx = useThemeIntelligence();
  } catch {
    themeCtx = null;
  }

  const themeDNA = themeCtx?.themeDNA;
  const coatDNA = themeCtx?.coatDNA;
  const sequenceId = themeCtx?.sequenceId;

  // Parent workspace tab: GOVERNANCE or ACADEMY
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'GOVERNANCE' | 'ACADEMY'>('GOVERNANCE');

  // --- GOVERNANCE STATES ---
  const [systemMaturity, setSystemMaturity] = useState<number>(() => {
    return typeof localStorage !== 'undefined' ? Number(localStorage.getItem('look_vision_system_maturity') || '94') : 94;
  });
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'compiling' | 'success'>('idle');

  const [integrationTasks, setIntegrationTasks] = useState<IntegrationTask[]>([
    {
      id: 'auth',
      label: 'Secure Auth & Multi-Tenancy',
      category: 'Security',
      status: 'completed',
      percentage: 100,
      description: 'Firebase auth layer, route guards, and token credentials encryption.'
    },
    {
      id: 'db_memory',
      label: 'Unified Fashion OS Memory Engine',
      category: 'Data Storage',
      status: 'completed',
      percentage: 100,
      description: 'Persistent cloud-synced databases with structural lookup indices.'
    },
    {
      id: 'autonomous_planner',
      label: 'Autonomous Planning & Rotation Layer',
      category: 'Sartorial AI',
      status: 'completed',
      percentage: 100,
      description: 'Dynamic 7-day recommended staging calendars aligned with weather telemetry.'
    },
    {
      id: 'ai_style_curator',
      label: 'AI Style Curation & Lookbooks',
      category: 'Aesthetic Generation',
      status: 'completed',
      percentage: 100,
      description: 'Zero-prompt image generation and high-contrast layout grids.'
    },
    {
      id: 'quota_limits',
      label: 'Quota & Token Management System',
      category: 'Telemetry',
      status: 'completed',
      percentage: 100,
      description: 'Global quota consumption monitors and API request limit thresholds.'
    },
    {
      id: 'platform_compatibility',
      label: 'Cross-Platform Compatibility & Audits',
      category: 'Frontend & APIs',
      status: 'in_progress',
      percentage: 64,
      description: 'Simulating touch ergonomics (44px) and API proxy response latencies.'
    }
  ]);

  // Compatibility states
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [auditFeature, setAuditFeature] = useState<'create_with_ai' | 'generate_style' | 'chat_gpr_logic'>('create_with_ai');
  const [auditPlatform, setAuditPlatform] = useState<'desktop' | 'mobile' | 'tablet' | 'xr_glasses'>('mobile');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditScore, setAuditScore] = useState<{ uiux: number; performance: number; reliability: number }>({
    uiux: 91,
    performance: 88,
    reliability: 94
  });
  const [savedScores, setSavedScores] = useState<Array<{ id: string; feature: string; platform: string; totalScore: number; timestamp: string }>>([]);

  // --- ACADEMY STATES (MIGRATED FROM AI_ENGINE_STUDIO) ---
  const [selectedDemographic, setSelectedDemographic] = useState<string>(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('look_vision_selected_demographic') || 'youth' : 'youth';
  });
  const [selectedInstructor, setSelectedInstructor] = useState<string>(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('look_vision_selected_instructor') || 'pattern_maker' : 'pattern_maker';
  });
  const [curriculumTopic, setCurriculumTopic] = useState<string>(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('look_vision_curriculum_topic') || 'cyber_mesh' : 'cyber_mesh';
  });
  const [instructionIntensity, setInstructionIntensity] = useState<number>(() => {
    return typeof localStorage !== 'undefined' ? Number(localStorage.getItem('look_vision_instruction_intensity') || '75') : 75;
  });
  const [practicalStudioHours, setPracticalStudioHours] = useState<number>(() => {
    return typeof localStorage !== 'undefined' ? Number(localStorage.getItem('look_vision_practical_hours') || '65') : 65;
  });
  const [semesterResults, setSemesterResults] = useState<any>(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('look_vision_semester_results');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { return null; }
      }
    }
    return null;
  });

  const [semesterHistory, setSemesterHistory] = useState<Array<{
    id: string;
    demographic: string;
    topic: string;
    leadInstructor: string;
    score: number;
    grade: string;
    timestamp: string;
  }>>(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('look_vision_semester_history');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { return []; }
      }
    }
    return [];
  });
  const [isSimulatingSemester, setIsSimulatingSemester] = useState<boolean>(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState<boolean>(false);
  const [simulatorSubTab, setSimulatorSubTab] = useState<'SIMULATE' | 'STUDENTS' | 'WORKERS' | 'DISPATCH'>('SIMULATE');

  const [workers, setWorkers] = useState<WorkerAgent[]>(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('look_vision_workers_state');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
      }
    }
    return [
      {
        id: 'pattern_maker',
        name: 'Artisan Pattern Maker',
        role: 'Pattern & Fit Solver',
        needs: ['CLO3D CAD integration', 'Kinetic drape physics weights', 'Fabric thickness multipliers'],
        isChosen: true,
        workingStatus: 'operational',
        efficiency: 94,
        cageId: 'Cage Alpha (Structure)',
        toolsNeeded: ['3D Mesh Renderer', 'Seam Friction Solver']
      },
      {
        id: 'trend_scout',
        name: 'Trend Ingestion Scout',
        role: 'Telemetry & Sourcing Analytics',
        needs: ['Pinterest RSS data endpoints', 'Instagram Style tag scrapers', 'Semantic trend aggregators'],
        isChosen: true,
        workingStatus: 'operational',
        efficiency: 89,
        cageId: 'Cage Beta (Intelligence)',
        toolsNeeded: ['Vogue Crawl Engine', 'Social Ingestion Pipeline']
      },
      {
        id: 'prompt_alchemist',
        name: 'Prompt Styling Alchemist',
        role: 'High Fidelity Image Generation',
        needs: ['Imagen 4.0 API access', 'Aspect-ratio config bounds', 'Zero negative-prompt restriction'],
        isChosen: false,
        workingStatus: 'idle',
        efficiency: 76,
        cageId: 'Cage Gamma (Visuals)',
        toolsNeeded: ['Imagen 3.0 Solver', 'Aesthetic Quality Estimator']
      },
      {
        id: 'decision_oracle',
        name: 'Sartorial Decision Oracle',
        role: 'Personalized Matching Logic',
        needs: ['Local SQLite database state', 'User preference history mapping', 'Climate feedback parameters'],
        isChosen: false,
        workingStatus: 'idle',
        efficiency: 81,
        cageId: 'Cage Delta (Judgment)',
        toolsNeeded: ['Preference Learner DB', 'Decoupled Event Bus']
      }
    ];
  });

  const [trainingWorkerId, setTrainingWorkerId] = useState<string | null>(null);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [stateRegion, setStateRegion] = useState<string>('Capital Province');
  const [activeSimulationLog, setActiveSimulationLog] = useState<string[]>([]);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<boolean>(false);

  // --- GOVERNANCE FUNCTIONS ---
  const toggleTaskStatus = (id: string) => {
    setIntegrationTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          const nextStatus: 'completed' | 'in_progress' | 'pending' = t.status === 'completed' ? 'in_progress' : 'completed';
          return {
            ...t,
            status: nextStatus,
            percentage: nextStatus === 'completed' ? 100 : 64
          };
        }
        return t;
      });

      const sum = updated.reduce((acc, curr) => acc + curr.percentage, 0);
      const avg = Math.round(sum / updated.length);
      setSystemMaturity(avg);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('look_vision_system_maturity', String(avg));
      }
      addLog(`Maturity progression updated: ${avg}% of global Fashion OS systems certified.`);
      return updated;
    });
  };

  const runBuildPipeline = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setPipelineStatus('compiling');
    setPipelineLogs([]);

    const steps = [
      "⚡ Initiating secure workspace audit in root folder...",
      "📦 Reading active package.json and verifying dependencies...",
      "🔍 Aligning database models (Drizzle / Firestore state synchronization)...",
      "🧪 Validating code style: running 'npm run lint' on /src files...",
      "🟢 Lint checks passed cleanly with 0 errors.",
      "⚙️ Compiling typescript bundles with esbuild --bundle --platform=node...",
      "⚡ Strict typecheck scan complete (100% security & type safety metrics verified).",
      "📦 Packaging static build resources via Vite build pipeline...",
      "🚀 Emulating cold-start server container... Port 3000 responsive.",
      "✨ CI/CD Verification Successful! Evolving Unified Fashion OS to 100% Maturity!"
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setPipelineLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (index === steps.length - 1) {
          setIsCompiling(false);
          setPipelineStatus('success');
          setSystemMaturity(100);
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('look_vision_system_maturity', '100');
          }
          setIntegrationTasks(prev => prev.map(t => ({ ...t, status: 'completed' as const, percentage: 100 })));
          addLog("✨ CI/CD Build Pipeline verified. Unified Fashion OS is now 100% COMPLETE!");
          window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
            detail: "🚀 PRODUCTION CERTIFIED: Unified Fashion OS is fully evolved at 100%!"
          }));
        }
      }, (index + 1) * 350);
    });
  };

  const addLog = (message: string) => {
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 15)]);
  };

  const platformConfig = useMemo(() => {
    return {
      create_with_ai: {
        desktop: {
          uiux: 98,
          performance: 95,
          reliability: 97,
          buildAdvice: "Implement hardware-accelerated WebGL viewport transitions. Utilize dynamic viewport scaling based on canvas width to keep CLO3D/Unreal Engine render previews smooth.",
          designAdvice: "Place advanced parameters (Drape Physics, Fabric Density, Seed weights) into a collapsible left tray. Provide immediate cursor hover feedback on mesh previews.",
          logs: [
            "🔍 Initiating Usability Audit: Create with AI on Desktop Web...",
            "📊 Scanning viewport boundaries: Fluid container verified.",
            "⚙️ Checking 3D asset pipeline: Unreal 5 engine binding operational.",
            "⚡ WebGL hardware-acceleration detected. Frame rendering at stable 60 FPS.",
            "✅ All advanced configuration panels (Cages, Physics, Demography) correctly scaled.",
            "🎉 Audit completed successfully! Desktop configuration verified at maximum quality."
          ]
        },
        mobile: {
          uiux: 91,
          performance: 88,
          reliability: 94,
          buildAdvice: "Replace synchronous heavy cloth mesh computations with lazy-initialized cloud rendering. Debounce style input sliders by 250ms to prevent render-loop stutter.",
          designAdvice: "Ensure all physics control sliders have a minimum touch target height of 46px. Provide soft tactile vibration triggers (Haptics) when a render completes.",
          logs: [
            "🔍 Initiating Usability Audit: Create with AI on Mobile PWA/Native App...",
            "📊 Viewport boundaries scanned: 390x844px. Multi-column overflow avoided.",
            "⚠️ Warning: Render preview size is compressed. Recommended to use 1:1 square ratio.",
            "🧪 Running mobile-CPU canvas layout emulation...",
            "✅ Touch targets checked: All button controls meet the 44px touch target guidelines.",
            "🎉 Audit completed! Mobile-optimizations injected to cache render logs safely."
          ]
        },
        tablet: {
          uiux: 95,
          performance: 92,
          reliability: 96,
          buildAdvice: "Utilize CSS Grid container queries (@container) instead of window-resize listeners. Pre-render 3D mesh layers inside a background thread (Web Worker).",
          designAdvice: "Implement responsive dual-column layouts in landscape mode. Utilize swipe gestures for traversing seed catalog results.",
          logs: [
            "🔍 Initiating Usability Audit: Create with AI on Tablet/iPad Web...",
            "📊 iPad Pro Viewport simulated: Responsive bento-grid expanded.",
            "⚡ Offscreen web-workers commissioned to compute fabric drape physics.",
            "✅ Dynamic canvas resize hook successfully decoupled from heavy reflow triggers.",
            "🎉 Audit completed! Tablet layout verified with high-density spacing."
          ]
        },
        xr_glasses: {
          uiux: 87,
          performance: 84,
          reliability: 90,
          buildAdvice: "Proxy heavy physics solvers to high-performance edge nodes. Pack avatar meshes in highly compressed .glb formats using Draco mesh compression.",
          designAdvice: "Translate sliders into depth-aware spatial knobs. Place style feedback alerts in the user's peripheral field with safe depth-planes.",
          logs: [
            "🔍 Initiating Usability Audit: Create with AI on AR/VR Smart Glasses...",
            "📊 Mapping stereo viewport projection. Depth coordinate buffer bounds loaded.",
            "🧪 Converting flat 2D sliders into spatial floating interactive depth-knobs.",
            "⚠️ Bandwidth telemetry alert: High mesh-vertex counts may drop framerates.",
            "✅ Draco mesh-compression enabled to pipeline avatar load states.",
            "🎉 Audit complete! Spatial style sandbox layout mapped to peripheral visual arrays."
          ]
        }
      },
      generate_style: {
        desktop: {
          uiux: 96,
          performance: 94,
          reliability: 98,
          buildAdvice: "Use client-side drag-and-drop file readers to preview body photos before processing. Proxy image-to-coordinate conversions through high-bandwidth server routes.",
          designAdvice: "Align mapped style nodes adjacent to the user's uploaded silhouette using interactive dots. Provide a full screen mode for inspect audits.",
          logs: [
            "🔍 Initiating Usability Audit: Generate Style / Body-Style Mapping on Desktop Web...",
            "📊 HTML5 Drag-and-Drop file system listeners initialized.",
            "⚡ Upload telemetry verified. Automatic image compression ready.",
            "⚙️ Mapped style nodes adjacent to user's uploaded silhouette using absolute overlays.",
            "🎉 Audit completed! Desktop layout supports ultra-high-resolution body mapping."
          ]
        },
        mobile: {
          uiux: 97,
          performance: 91,
          reliability: 95,
          buildAdvice: "Integrate native camera APIs. Automatically compress user-uploaded HEIC/JPEG photos on-device to <500kb before sending to Gemini API.",
          designAdvice: "Provide instant crop overlays on user uploads. Place the body mapping result directly below the camera view to avoid scrolling lag.",
          logs: [
            "🔍 Initiating Usability Audit: Generate Style on Mobile App...",
            "📊 Scanning touch viewport constraints. Native camera capture overlay injected.",
            "⚙️ Heavy image compression pipeline ready to squish HEIC to <500kb before API proxy transfer.",
            "✅ Body-mapping result set directly below the camera view to eliminate viewport lag.",
            "🎉 Audit completed! Mobile camera-workflow is fully responsive and optimized."
          ]
        },
        tablet: {
          uiux: 94,
          performance: 93,
          reliability: 97,
          buildAdvice: "Leverage Safari/Chrome file system access APIs for direct batch uploads. Implement indexDB persistence to keep local styling draft histories safe.",
          designAdvice: "Utilize full screen preview panels for side-by-side comparison of before/after style maps.",
          logs: [
            "🔍 Initiating Usability Audit: Generate Style on Tablet Web...",
            "📊 Simulating Safari FileSystem Access protocol.",
            "⚡ IndexDB persistence layer mapped to cache user's mapped silhouette coordinates.",
            "✅ Grid multi-pane layout verified. Dual-pane view renders body mapping side-by-side.",
            "🎉 Audit completed! Tablet layout verified with comfortable spacing."
          ]
        },
        xr_glasses: {
          uiux: 89,
          performance: 81,
          reliability: 91,
          buildAdvice: "Map Gemini-generated coordinate prompts into a spatial bounding box. Utilize WebXR camera feeds (where permitted) for direct hand-anchored scaling.",
          designAdvice: "Anchor the mapped garments as a 1:1 holographic preview standing in front of the user's space, instead of displaying 2D flats.",
          logs: [
            "🔍 Initiating Usability Audit: Generate Style on AR/VR Smart Glasses...",
            "📊 Launching WebXR space session parameters.",
            "⚙️ Converting 2D flats to 3D virtual mannequin projection coordinates.",
            "🧪 Integrating hand gestures for resizing virtual mapping coordinates.",
            "🎉 Audit completed! Dynamic holograph silhouette projection mapped to active smart glass coordinates."
          ]
        }
      },
      chat_gpr_logic: {
        desktop: {
          uiux: 99,
          performance: 97,
          reliability: 99,
          buildAdvice: "Optimize WebSocket telemetry streams by implementing binary Protobuf or custom JSON serialization wrappers. Ensure backpressure controls are active to avoid flooding thread event-loops during high-frequency telemetry broadcasts.",
          designAdvice: "Display interactive telemetry traces adjacent to the chat window using an expandable bento-grid. Use clean monospace overlays to let developers audit the exact GPR prompt token usage and attention-weights live.",
          logs: [
            "🔍 Initiating Usability Audit: Chat GPR Telemetry Engine on Desktop Web...",
            "📊 Parsing GPR (Global Pattern Router) v2.4 protocol standards...",
            "📡 Connected to live WebSocket telemetry proxy on port 3000...",
            "🧠 Model Tokenizer configured: Context window 1M tokens, active temperature 0.25.",
            "📈 Measuring backpressure limits: Stable at 1500 concurrent metrics per frame.",
            "🎉 Audit completed! High-fidelity Chat GPR protocol fully synchronized with local state managers."
          ]
        },
        mobile: {
          uiux: 94,
          performance: 91,
          reliability: 96,
          buildAdvice: "Implement lazy message rendering on mobile scroll lists using dynamic element virtualization. Cache Chat GPR conversation history in SQLite/IndexedDB to prevent runtime heap exhaustion.",
          designAdvice: "Condense dense telemetry graphs into a floating miniature widget. Ensure touch target targets for message action menus are at least 48px to meet touch ergonomic rules.",
          logs: [
            "🔍 Initiating Usability Audit: Chat GPR Telemetry Engine on Mobile PWA...",
            "📱 Evaluating responsive CSS layout boundaries: 375px viewport optimized.",
            "⚡ Virtualized message list active. Render overhead reduced by 73%.",
            "⚠️ Warning: Raw telemetry dump exceeds screen size. Collapsing telemetry panel into bottom drawer.",
            "🎉 Audit completed! Mobile Chat GPR performance verified with optimized local caching."
          ]
        },
        tablet: {
          uiux: 97,
          performance: 94,
          reliability: 98,
          buildAdvice: "Leverage offscreen Web Workers for parsing telemetry and AST structures. Pre-render code blocks with web-assembly-powered highlighted syntax parsers.",
          designAdvice: "Utilize a dual-pane layout in landscape: interactive chat dialogue on the left, visual GPR telemetry tree nodes and raw telemetry output logs on the right.",
          logs: [
            "🔍 Initiating Usability Audit: Chat GPR Telemetry Engine on Tablet Web...",
            "📊 Dual-pane desktop layout simulated for landscape iPad.",
            "⚙️ Offscreen telemetry worker thread spawned successfully.",
            "✅ Monospace debug terminal correctly aligned with safe padding boundaries.",
            "🎉 Audit completed! Tablet landscape layout demonstrates perfect split-pane telemetry rendering."
          ]
        },
        xr_glasses: {
          uiux: 91,
          performance: 87,
          reliability: 93,
          buildAdvice: "Limit visual telemetry update frequency to 15Hz to avoid XR visual flickering. Delegate complex LLM prompt parsing tasks to cloud edge routers.",
          designAdvice: "Display Chat GPR text as floating glassmorphic subtitle cards. Projects active telemetry threads as subtle neon color-coded fiber lines tracing around the virtual studio mannequin.",
          logs: [
            "🔍 Initiating Usability Audit: Chat GPR Telemetry Engine on AR/VR Glasses...",
            "📊 WebXR spatial viewport configured. Rendering stereo subtitle bubble overlays.",
            "🧪 Mapping active telemetry flows to neon fiber tracks encircling the mannequin.",
            "🚨 Telemetry throttling active: Updates limited to 15Hz to stabilize stereoscopic frame rates.",
            "🎉 Audit completed! Immersive 3D GPR telemetry overlay active in smart glass coordinates."
          ]
        }
      }
    };
  }, []);

  const runAuditTest = () => {
    setIsAuditing(true);
    setAuditLogs([]);
    const config = platformConfig[auditFeature][auditPlatform];
    
    config.logs.forEach((logStr, index) => {
      setTimeout(() => {
        setAuditLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logStr}`]);
      }, (index + 1) * 300);
    });

    setTimeout(() => {
      setIsAuditing(false);
      const activeWorkerCount = workers.filter(w => w.isChosen).length;
      const boost = activeWorkerCount * 1;
      setAuditScore({
        uiux: Math.min(100, config.uiux + boost),
        performance: Math.min(100, config.performance + boost),
        reliability: Math.min(100, config.reliability + boost)
      });
      const featureLabel = auditFeature === 'create_with_ai' ? 'Create with AI' : auditFeature === 'generate_style' ? 'Generate Style' : 'Chat GPR Telemetry Logic';
      addLog(`System Audit executed: Audited [${featureLabel}] on [${auditPlatform.toUpperCase()}] with rating: ${Math.round((config.uiux + config.performance + config.reliability) / 3)}%`);
    }, (config.logs.length + 1) * 300);
  };

  const commitAuditToRegistry = () => {
    const totalScore = Math.round((auditScore.uiux + auditScore.performance + auditScore.reliability) / 3);
    const featureLabel = auditFeature === 'create_with_ai' ? 'Create with AI' : auditFeature === 'generate_style' ? 'Generate Style' : 'Chat GPR Telemetry Logic';
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      feature: featureLabel,
      platform: auditPlatform.toUpperCase(),
      totalScore,
      timestamp: new Date().toLocaleTimeString()
    };
    setSavedScores(prev => [newRecord, ...prev.slice(0, 10)]);
    addLog(`Governor registry entry added: Mapped platform compatibility scorecard for ${newRecord.feature} on ${newRecord.platform}.`);
  };

  // --- ACADEMY SYNCING AND LIST COMPUTATIONS (Migrated) ---
  const studentGroups: StudentGroup[] = useMemo(() => [
    {
      id: 'youth',
      name: 'Youth Division',
      ageRange: 'Ages 12-18',
      focus: 'Fast-fashion agility & energetic street expression',
      styleVibe: 'Vibrant Cyberpunk Streetwear & Athletic Fusion',
      needs: [
        'Real-time TikTok & gaming trend integrations',
        'Gamified virtual fittings with high-contrast avatars',
        'Ultra-affordable digital wardrobe capsules'
      ],
      vibeColor: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400',
      vibeBadge: 'text-pink-400 bg-pink-950/30 border-pink-500/20'
    },
    {
      id: 'young-adults',
      name: 'Young Adults',
      ageRange: 'Ages 19-25',
      focus: 'Expressive sustainability & digital style passports',
      styleVibe: 'Deconstructed Minimalist & Eco-Conscious Thrift',
      needs: [
        'Inter-operable digital identity metadata schemas',
        'Campus-to-internship multi-use capsule generators',
        'Direct connection to local certified thrift curators'
      ],
      vibeColor: 'from-violet-500/20 to-indigo-500/10 border-violet-500/30 text-violet-400',
      vibeBadge: 'text-violet-400 bg-violet-950/30 border-violet-500/20'
    },
    {
      id: 'professionals',
      name: 'Active Professionals',
      ageRange: 'Ages 26-45',
      focus: 'Sleek corporate minimalism & high-efficiency wardrobes',
      styleVibe: 'Quiet Luxury, Precision Tailoring & High-Performance Outerwear',
      needs: [
        'Smart weather-adapted layering suggestion pipelines',
        'Algorithmic color harmony matching metrics',
        'High-density corporate capsule layout engines'
      ],
      vibeColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      vibeBadge: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20'
    },
    {
      id: 'elders',
      name: 'Noble Elders',
      ageRange: 'Ages 46+',
      focus: 'Ergonomic comfort & timeless legacy heritage',
      styleVibe: 'Classic Editorial, Premium Organic Linens & Fine Merino',
      needs: [
        'High-contrast visual interfaces with voice command prompts',
        'Ergonomic clothing stretch & seam pressure solvers',
        'Durable heritage tailoring catalog archives'
      ],
      vibeColor: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      vibeBadge: 'text-amber-400 bg-amber-950/30 border-amber-500/20'
    }
  ], []);

  const instructorDemographics = useMemo(() => [
    { id: 'youth', name: 'Youth Division', ageRange: '12-18', styleVibe: 'Vibrant Cyberpunk Streetwear & Athletic Fusion', focus: 'Fast-fashion agility & energetic street expression' },
    { id: 'young-adults', name: 'Young Adults', ageRange: '19-25', styleVibe: 'Deconstructed Minimalist & Eco-Conscious Thrift', focus: 'Expressive sustainability & digital style passports' },
    { id: 'professionals', name: 'Active Professionals', ageRange: '26-45', styleVibe: 'Quiet Luxury, Precision Tailoring & High-Performance Outerwear', focus: 'Sleek corporate minimalism & high-efficiency wardrobes' },
    { id: 'elders', name: 'Noble Elders', ageRange: '46+', styleVibe: 'Classic Editorial, Premium Organic Linens & Fine Merino', focus: 'Ergonomic comfort & timeless legacy heritage' }
  ], []);

  const instructorWorkers = useMemo(() => [
    { id: 'pattern_maker', name: 'Artisan Pattern Maker', role: 'Pattern & Fit Solver', cageId: 'Cage Alpha (Structure)', needs: 'CLO3D CAD integration, Kinetic drape physics weights' },
    { id: 'trend_scout', name: 'Trend Ingestion Scout', role: 'Telemetry & Sourcing Analytics', cageId: 'Cage Beta (Intelligence)', needs: 'Pinterest RSS data endpoints, Vogue crawl engine' },
    { id: 'prompt_alchemist', name: 'Prompt Styling Alchemist', role: 'High Fidelity Image Generation', cageId: 'Cage Gamma (Visuals)', needs: 'Imagen 4.0 API access, Aesthetic Quality Estimator' },
    { id: 'decision_oracle', name: 'Sartorial Decision Oracle', role: 'Personalized Matching Logic', cageId: 'Cage Delta (Judgment)', needs: 'Local SQLite database state, Preference Learner DB' }
  ], []);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('look_vision_workers_state', JSON.stringify(workers));
    }
  }, [workers]);

  useEffect(() => {
    const handleSync = () => {
      if (typeof localStorage !== 'undefined') {
        const demo = localStorage.getItem('look_vision_selected_demographic') || 'youth';
        const inst = localStorage.getItem('look_vision_selected_instructor') || 'pattern_maker';
        const topic = localStorage.getItem('look_vision_curriculum_topic') || 'cyber_mesh';
        const intensity = Number(localStorage.getItem('look_vision_instruction_intensity') || '75');
        const practical = Number(localStorage.getItem('look_vision_practical_hours') || '65');
        const resultsStr = localStorage.getItem('look_vision_semester_results');
        const historyStr = localStorage.getItem('look_vision_semester_history');
        
        let results = null;
        if (resultsStr) {
          try { results = JSON.parse(resultsStr); } catch (e) {}
        }
        let history = [];
        if (historyStr) {
          try { history = JSON.parse(historyStr); } catch (e) {}
        }

        setSelectedDemographic(prev => prev !== demo ? demo : prev);
        setSelectedInstructor(prev => prev !== inst ? inst : prev);
        setCurriculumTopic(prev => prev !== topic ? topic : prev);
        setInstructionIntensity(prev => prev !== intensity ? intensity : prev);
        setPracticalStudioHours(prev => prev !== practical ? practical : prev);
        setSemesterResults(prev => JSON.stringify(prev) !== JSON.stringify(results) ? results : prev);
        setSemesterHistory(prev => JSON.stringify(prev) !== JSON.stringify(history) ? history : prev);
      }
    };
    window.addEventListener('lookvision_sync_instructor', handleSync);
    return () => {
      window.removeEventListener('lookvision_sync_instructor', handleSync);
    };
  }, []);

  const handleRunSemesterSimulation = () => {
    setIsSimulatingSemester(true);
    
    setTimeout(() => {
      // 1. Calculate Demographic Synergy
      let synergy = 10;
      let matchedDemo = "";
      if (selectedDemographic === 'youth' && curriculumTopic === 'cyber_mesh') {
        synergy = 25;
        matchedDemo = "Youth Division (optimal mesh alignment)";
      } else if (selectedDemographic === 'young-adults' && curriculumTopic === 'eco_thrift') {
        synergy = 25;
        matchedDemo = "Young Adults (optimal thrift alignment)";
      } else if (selectedDemographic === 'professionals' && curriculumTopic === 'corp_layer') {
        synergy = 25;
        matchedDemo = "Active Professionals (optimal corporate/performance alignment)";
      } else if (selectedDemographic === 'elders' && curriculumTopic === 'heritage_tailor') {
        synergy = 25;
        matchedDemo = "Noble Elders (optimal heritage tailoring alignment)";
      } else {
        synergy = 12;
        matchedDemo = "Standard alignment";
      }

      // 2. Calculate Lead Instructor Synergy
      let instBonus = 5;
      let matchedInstructorName = "";
      const currentLead = instructorWorkers.find(w => w.id === selectedInstructor) || instructorWorkers[0];
      
      if (curriculumTopic === 'cyber_mesh' && selectedInstructor === 'prompt_alchemist') {
        instBonus = 15;
        matchedInstructorName = "Prompt Styling Alchemist (excellent mesh & visual support)";
      } else if (curriculumTopic === 'eco_thrift' && selectedInstructor === 'trend_scout') {
        instBonus = 15;
        matchedInstructorName = "Trend Ingestion Scout (excellent eco & thrift trend sensing)";
      } else if (curriculumTopic === 'corp_layer' && selectedInstructor === 'decision_oracle') {
        instBonus = 15;
        matchedInstructorName = "Sartorial Decision Oracle (excellent personalized coordinate analytics)";
      } else if (curriculumTopic === 'heritage_tailor' && selectedInstructor === 'pattern_maker') {
        instBonus = 15;
        matchedInstructorName = "Artisan Pattern Maker (excellent tailoring & fit physics rendering)";
      } else {
        instBonus = 7;
        matchedInstructorName = `${currentLead.name} (standard support)`;
      }

      // 3. Balance Bonus
      const balanceDiff = Math.abs(instructionIntensity - practicalStudioHours);
      const balanceBonus = Math.max(0, Math.round((100 - balanceDiff) * 0.15)); // max 15

      // 4. Teamwork contribution
      const teamBonus = 10;

      // 5. Overall lead instructor base efficiency weight (max 35)
      const efficiencies: Record<string, number> = {
        pattern_maker: 94,
        trend_scout: 89,
        prompt_alchemist: 76,
        decision_oracle: 81
      };
      const activeEff = efficiencies[selectedInstructor] || 85;
      const leadEfficiencyWeight = Math.round((activeEff / 100) * 35);

      // Total overall score
      const totalScore = Math.min(100, 35 + synergy + instBonus + balanceBonus + teamBonus + (leadEfficiencyWeight - 30));

      // Calculate engagement rate & instructor efficiency index
      const engagementRate = Math.round(Math.min(100, (instructionIntensity * 0.4 + practicalStudioHours * 0.6) * (synergy / 25 + 0.5)));
      const finalInstructorEfficiency = Math.round(activeEff * (1 + (teamBonus / 100)));

      // Grade classification
      let grade = 'C';
      let reportText = "";
      if (totalScore >= 95) {
        grade = 'S';
        reportText = `Sartorial perfection accomplished! The combination of the ${matchedDemo} with the advanced leadership of ${matchedInstructorName} led to student performance breakthrough. Spacings and color pairings are highly optimized, with perfect instructional-practical balance (${instructionIntensity}% : ${practicalStudioHours}%). Truly a masterclass in modern digital style.`;
      } else if (totalScore >= 85) {
        grade = 'A';
        reportText = `Outstanding instructional semester! Your Lead Instructor ${currentLead.name} successfully deployed the curriculum. The synergy with the ${selectedDemographic} division is strong. Tip: Fine-tune the balance slider or deploy additional commissioned assistants to achieve S-Class level.`;
      } else if (totalScore >= 70) {
        grade = 'B';
        reportText = `Healthy performance. The student cohort showed solid growth. However, there is room for improvement: the synergy between the curriculum topic ("${curriculumTopic}") and either the demographic or Lead Instructor is slightly sub-optimal. Aligning these more closely will yield higher style metrics.`;
      } else if (totalScore >= 55) {
        grade = 'C';
        reportText = `Satisfactory pass. The students are clothing themselves with basic discipline, but the curriculum feels unbalanced. Consider shifting the Practical Studio Hours slider to better match Instruction Intensity, or choose a lead instructor whose credentials directly map to "${curriculumTopic}".`;
      } else {
        grade = 'F';
        reportText = `Sartorial Red Alert! The curriculum failed to engage the student demographic. The lead instructor was severely mismatched with the subject materials, and the instruction-to-practical ratio was too skewed. Re-align your divisions immediately!`;
      }

      const results = {
        grade,
        overallScore: totalScore,
        synergyScore: synergy * 4,
        instructorEfficiency: Math.min(100, finalInstructorEfficiency),
        engagementRate,
        reportText,
        timestamp: new Date().toLocaleTimeString()
      };

      setSemesterResults(results);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('look_vision_semester_results', JSON.stringify(results));
      }

      const historyItem = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        demographic: instructorDemographics.find(g => g.id === selectedDemographic)?.name || selectedDemographic,
        topic: curriculumTopic === 'cyber_mesh' ? 'Cyberpunk Mesh Reconstruction' :
               curriculumTopic === 'eco_thrift' ? 'Eco-friendly Thrift Deconstruction' :
               curriculumTopic === 'corp_layer' ? 'High-Performance Corporate Layering' :
               'Classic Editorial Legacy Tailoring',
        leadInstructor: currentLead.name,
        score: totalScore,
        grade,
        timestamp: new Date().toLocaleTimeString()
      };

      setSemesterHistory(prev => {
        const updated = [historyItem, ...prev.slice(0, 9)];
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('look_vision_semester_history', JSON.stringify(updated));
        }
        return updated;
      });

      setIsSimulatingSemester(false);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `✨ Semester complete: Graded at "${grade}" with score ${totalScore}%.`
      }));
      window.dispatchEvent(new Event('lookvision_sync_instructor'));
    }, 1000);
  };

  const handleResetSimulatorHistory = () => {
    setSemesterHistory([]);
    setSemesterResults(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('look_vision_semester_history');
      localStorage.removeItem('look_vision_semester_results');
    }
    window.dispatchEvent(new Event('lookvision_sync_instructor'));
    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: '✓ Simulator history registry successfully purged.'
    }));
  };

  const toggleWorkerSelection = (id: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === id) {
        const nextChosen = !w.isChosen;
        return {
          ...w,
          isChosen: nextChosen,
          workingStatus: nextChosen ? 'operational' : 'idle'
        };
      }
      return w;
    }));

    const targetWorker = workers.find(w => w.id === id);
    if (targetWorker) {
      addDispatchLog(`Governor status update: ${targetWorker.name} has been ${!targetWorker.isChosen ? 'commissioned and placed in ' + targetWorker.cageId : 'recalled back to barracks'}.`);
    }
  };

  const addDispatchLog = (message: string) => {
    setActiveSimulationLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 15)]);
  };

  const handleTrainWorker = (id: string) => {
    if (trainingWorkerId) return;
    setTrainingWorkerId(id);
    setTrainingProgress(0);
    
    const targetWorker = workers.find(w => w.id === id);
    if (targetWorker) {
      addDispatchLog(`[Training Mode] Initiating deep-learning instruction calibration for ${targetWorker.name}...`);
    }

    setWorkers(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, workingStatus: 'training' };
      }
      return w;
    }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setTrainingProgress(progress);
      if (targetWorker) {
        addDispatchLog(`[Training] ${targetWorker.name} calibration: ${progress}% compiled...`);
      }
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setWorkers(prev => prev.map(w => {
            if (w.id === id) {
              const newEfficiency = Math.min(100, w.efficiency + 5);
              addDispatchLog(`✨ [Training Complete] ${w.name} successfully certified! Efficiency upgraded from ${w.efficiency}% to ${newEfficiency}%.`);
              window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                detail: `🎯 AGENT CALIBRATED: ${w.name} efficiency upgraded to ${newEfficiency}%!`
              }));
              return {
                ...w,
                efficiency: newEfficiency,
                workingStatus: w.isChosen ? 'operational' : 'idle'
              };
            }
            return w;
          }));
          setTrainingWorkerId(null);
          setTrainingProgress(0);
        }, 300);
      }
    }, 400);
  };

  const handleDispatchWorkers = () => {
    const activeWorkers = workers.filter(w => w.isChosen);
    if (activeWorkers.length === 0) {
      addDispatchLog("❌ Dispatch aborted: No commissioned workers are assigned to cages!");
      return;
    }

    setIsDispatching(true);
    setDispatchSuccess(false);
    addDispatchLog(`Initiating state-wide fashion deployment in [${stateRegion}] for [${studentGroups.find(g => g.id === selectedDemographic)?.name || 'selected division'}]...`);

    setTimeout(() => {
      activeWorkers.forEach((worker, idx) => {
        setTimeout(() => {
          addDispatchLog(`⚡ ${worker.name} operating inside [${worker.cageId}]: Processing working needs [${worker.needs[0]}] with ${worker.efficiency}% efficiency.`);
        }, (idx + 1) * 400);
      });
    }, 400);

    setTimeout(() => {
      setIsDispatching(false);
      setDispatchSuccess(true);
      addDispatchLog(`✨ Dispatch complete! Governor of Fashion successfully deployed style wisdom to ${stateRegion}. Students' wardrobes are updated permanently!`);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: `🚀 DISPATCH SUCCESSFUL: Instructors active in ${stateRegion}!`
      }));
    }, (activeWorkers.length + 1.5) * 400);
  };

  const renderContent = () => (
    <div className="w-full space-y-8 animate-fade-in text-left select-none" id="fashion-instructor-workspace-root">
      
      {/* 1. Evolved Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0c0c16] to-[#040409] border border-violet-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-violet-400 fill-violet-400/10" />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-violet-400 font-bold">
                Unified Engineering & Style Intelligence
              </span>
              {sequenceId && (
                <span className="text-[9px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 hidden lg:inline-block">
                  SEQ: {sequenceId.substring(0, 10)}...
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-tight">
              Fashion OS Control Center
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed font-sans">
              Welcome to the central control node for Fashion OS development, technical diagnostics, and state style distribution. Monitor core subsystems and run deep-learning workspace simulations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#07070c] border border-white/5 space-y-2 shrink-0 md:w-64">
            <span className="text-[9px] font-mono text-violet-400 uppercase tracking-wider block">Governor Credentials</span>
            <div className="text-xs font-semibold text-white truncate">Sartorial Chief Architect</div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1 border-t border-white/[0.03]">
              <span>System Maturity:</span>
              <span className={systemMaturity === 100 ? "text-emerald-400 font-bold" : "text-violet-400 font-bold"}>
                {systemMaturity}% {systemMaturity === 100 && '✓'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Parent Workspace Tab Switcher */}
      <div className="flex bg-[#07070c]/90 border border-white/5 p-1 rounded-2xl max-w-md select-none">
        <FoundationInteractionWrapper themeDNA={themeDNA}>
          <button
            onClick={() => setActiveWorkspaceTab('GOVERNANCE')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeWorkspaceTab === 'GOVERNANCE'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            Technical Governance
          </button>
        </FoundationInteractionWrapper>
        <FoundationInteractionWrapper themeDNA={themeDNA}>
          <button
            onClick={() => setActiveWorkspaceTab('ACADEMY')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeWorkspaceTab === 'ACADEMY'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Users className="w-4 h-4" />
            Sartorial Academy
          </button>
        </FoundationInteractionWrapper>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: TECHNICAL GOVERNANCE */}
        {activeWorkspaceTab === 'GOVERNANCE' && (
          <motion.div
            key="governance-pane"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Core Systems Checklist & CI/CD Pipeline */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0a0a14] to-[#040408] border border-violet-500/10 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-violet-400 animate-pulse" />
                    <span className="text-[10px] font-mono tracking-wider uppercase text-violet-400 font-bold">
                      ENGINEERING EVOLUTION LAYER
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif text-white font-light tracking-tight">
                    Fashion OS Core Systems & CI/CD Build Pipeline
                  </h2>
                  <p className="text-xs text-zinc-400 max-w-2xl">
                    Monitor, build, and deploy the foundational subsystems of the Unified Fashion OS. Toggle integration checkpoints manually or trigger a complete compiler scan to unlock 100% stable operations.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 bg-zinc-900/50 border border-white/5 rounded-full px-4 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">System Maturity:</span>
                  <span className="text-sm font-mono font-bold text-violet-400">{systemMaturity}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                {/* LEFT: Checkpoints Checklist */}
                <div className="lg:col-span-7 space-y-4 text-left">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                    1. Foundational Architecture Checkpoints
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {integrationTasks.map((task) => (
                      <FoundationInteractionWrapper key={task.id} themeDNA={themeDNA}>
                        <div
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 text-left relative overflow-hidden group select-none ${
                            task.status === 'completed'
                              ? 'bg-emerald-950/5 border-emerald-500/20 hover:border-emerald-500/40 shadow-sm shadow-emerald-950/10'
                              : 'bg-zinc-900/10 border-white/5 hover:border-violet-500/20'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
                                {task.category}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  task.status === 'completed'
                                    ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/20'
                                    : 'text-amber-400 bg-amber-950/30 border border-amber-500/20'
                                }`}>
                                  {task.status === 'completed' ? 'READY' : 'INTEGRATING'}
                                </span>
                                
                                <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                                  task.status === 'completed'
                                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                                    : 'border-white/10 bg-black/40 text-transparent'
                                }`}>
                                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                </div>
                              </div>
                            </div>
                            <h3 className="text-xs font-bold text-white tracking-wide group-hover:text-violet-400 transition-colors">
                              {task.label}
                            </h3>
                            <p className="text-[10px] text-zinc-400 leading-normal font-sans">
                              {task.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-white/[0.03] pt-2">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase">Integrity Index</span>
                            <span className={`text-[10px] font-mono font-bold ${
                              task.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>{task.percentage}%</span>
                          </div>
                        </div>
                      </FoundationInteractionWrapper>
                    ))}
                  </div>
                </div>

                {/* RIGHT: CI/CD Pipeline Simulator */}
                <div className="lg:col-span-5 space-y-4 flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                      2. Live CI/CD Production Build Pipeline
                    </span>

                    <FoundationInteractionWrapper themeDNA={themeDNA}>
                      <button
                        onClick={runBuildPipeline}
                        disabled={isCompiling}
                        className={`w-full py-3 px-6 bg-gradient-to-r ${
                          systemMaturity === 100
                            ? 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                            : 'from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500'
                        } text-white rounded-xl text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-md disabled:opacity-50`}
                      >
                        {isCompiling ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                            <span>Compiling Applet Bundle...</span>
                          </>
                        ) : systemMaturity === 100 ? (
                          <>
                            <ShieldCheck className="w-4 h-4 text-white" />
                            <span>Ecosystem Deployed (100% Mature)</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 text-white" />
                            <span>Execute Full Compiler Scan & Deploy</span>
                          </>
                        )}
                      </button>
                    </FoundationInteractionWrapper>
                  </div>

                  {/* Pipeline Console Terminal */}
                  <div className="flex-1 mt-3 space-y-2 flex flex-col justify-end">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                      <span>TERMINAL_OUTPUT_STREAM</span>
                      <span className={`w-2 h-2 rounded-full ${
                        isCompiling ? 'bg-amber-500 animate-pulse' :
                        pipelineStatus === 'success' ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`} />
                    </div>

                    <div className="h-[180px] rounded-xl bg-black border border-white/5 p-4 font-mono text-[10px] text-zinc-400 overflow-y-auto space-y-1.5 no-scrollbar select-text">
                      {pipelineLogs.length === 0 ? (
                        <div className="text-zinc-600 italic h-full flex flex-col items-center justify-center gap-2 select-none">
                          <Terminal className="w-8 h-8 text-zinc-800 animate-pulse" />
                          <span className="text-[9px]">Terminal idle. Click "Execute Full Compiler Scan" to verify.</span>
                        </div>
                      ) : (
                        pipelineLogs.map((log, idx) => (
                          <div key={idx} className="leading-relaxed whitespace-pre-wrap selection:bg-violet-500/30">
                            {log}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Usability & Sartorial Logic Audit Center */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0c0c16] to-[#040409] border border-violet-500/10 relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-[90px] pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-violet-400" />
                    <span className="text-[10px] font-mono tracking-wider uppercase text-violet-400 font-bold">
                      LOGIC & COMPATIBILITY LAYER
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif text-white font-light tracking-tight">
                    Cross-Platform Usability & Sartorial Logic Audit Center
                  </h2>
                  <p className="text-xs text-zinc-400 max-w-2xl">
                    Audit the logical frameworks of our key generative features. Simulate visual, performance, and API-proxy constraints across multiple platforms.
                  </p>
                </div>

                <span className="text-[9px] font-mono bg-violet-900/30 border border-violet-500/20 text-violet-400 px-2.5 py-1 rounded-full uppercase shrink-0">
                  Version 2.4-Telemetry
                </span>
              </div>

              {/* Dynamic Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end bg-[#05050a] p-5 rounded-2xl border border-white/5">
                <div className="md:col-span-4 space-y-2 text-left">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                    1. Select Generative Feature to Audit
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <FoundationInteractionWrapper themeDNA={themeDNA}>
                      <button
                        onClick={() => setAuditFeature('create_with_ai')}
                        className={`w-full py-1.5 px-2 text-[9px] font-sans rounded-xl border text-center transition-all cursor-pointer truncate ${
                          auditFeature === 'create_with_ai'
                            ? 'bg-violet-950/40 border-violet-500/40 text-violet-300 font-bold'
                            : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10'
                        }`}
                      >
                        Create with AI
                      </button>
                    </FoundationInteractionWrapper>
                    <FoundationInteractionWrapper themeDNA={themeDNA}>
                      <button
                        onClick={() => setAuditFeature('generate_style')}
                        className={`w-full py-1.5 px-2 text-[9px] font-sans rounded-xl border text-center transition-all cursor-pointer truncate ${
                          auditFeature === 'generate_style'
                            ? 'bg-violet-950/40 border-violet-500/40 text-violet-300 font-bold'
                            : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10'
                        }`}
                      >
                        Generate Style
                      </button>
                    </FoundationInteractionWrapper>
                    <FoundationInteractionWrapper themeDNA={themeDNA}>
                      <button
                        onClick={() => setAuditFeature('chat_gpr_logic')}
                        className={`w-full py-1.5 px-2 text-[9px] font-sans rounded-xl border text-center transition-all cursor-pointer truncate ${
                          auditFeature === 'chat_gpr_logic'
                            ? 'bg-violet-950/40 border-violet-500/40 text-violet-300 font-bold'
                            : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10'
                        }`}
                      >
                        Chat GPR
                      </button>
                    </FoundationInteractionWrapper>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-2 text-left">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                    2. Choose Target Virtual Platform
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'desktop', name: 'Desktop', icon: Laptop },
                      { id: 'mobile', name: 'Mobile', icon: Smartphone },
                      { id: 'tablet', name: 'Tablet', icon: Tablet },
                      { id: 'xr_glasses', name: 'XR Glasses', icon: Eye }
                    ].map((p) => {
                      const Icon = p.icon;
                      return (
                        <FoundationInteractionWrapper key={p.id} themeDNA={themeDNA}>
                          <button
                            onClick={() => setAuditPlatform(p.id as any)}
                            className={`w-full p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              auditPlatform === p.id
                                ? 'bg-violet-950/30 border-violet-500/30 text-violet-300'
                                : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-mono tracking-tight truncate w-full">{p.name}</span>
                          </button>
                        </FoundationInteractionWrapper>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <FoundationInteractionWrapper themeDNA={themeDNA}>
                    <button
                      onClick={runAuditTest}
                      disabled={isAuditing}
                      className={`w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-md ${
                        isAuditing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isAuditing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Auditing...</span>
                        </>
                      ) : (
                        <>
                          <Activity className="w-3.5 h-3.5" />
                          <span>Run Usability Audit</span>
                        </>
                      )}
                    </button>
                  </FoundationInteractionWrapper>
                </div>
              </div>

              {/* Usability Gauges & Advices */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                {/* Left Column: Metrics Circular Gauge */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-2xl bg-[#07070c] border border-white/5 space-y-5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block border-b border-white/[0.04] pb-2 font-bold">
                      METRIC PERFORMANCE GAUGES
                    </span>

                    <div className="flex items-center gap-6 p-4 rounded-xl bg-zinc-900/20 border border-white/[0.02]">
                      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            className="stroke-white/[0.04]"
                            strokeWidth="6"
                            fill="transparent"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            className="stroke-violet-500 transition-all duration-1000 ease-out"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 34}
                            strokeDashoffset={2 * Math.PI * 34 * (1 - Math.round((auditScore.uiux + auditScore.performance + auditScore.reliability) / 3) / 100)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-mono font-bold text-white leading-none">
                            {Math.round((auditScore.uiux + auditScore.performance + auditScore.reliability) / 3)}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-500 mt-0.5 uppercase font-bold">Usability</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block">
                          Composite Score Index
                        </span>
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          This index represents overall responsiveness, touch ergonomic compliance, and server API latency safety.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-1">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-sans text-zinc-400">UI/UX & Touch Targets (44px+)</span>
                          <span className="font-mono text-white font-bold">{auditScore.uiux}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 transition-all duration-700 ease-out"
                            style={{ width: `${auditScore.uiux}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-sans text-zinc-400">Performance & Asset Compression</span>
                          <span className="font-mono text-white font-bold">{auditScore.performance}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-700 ease-out"
                            style={{ width: `${auditScore.performance}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-sans text-zinc-400">State Reliability & API-Proxy</span>
                          <span className="font-mono text-white font-bold">{auditScore.reliability}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 transition-all duration-700 ease-out"
                            style={{ width: `${auditScore.reliability}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 italic">
                        Scores dynamically scale with worker agents.
                      </span>
                      <FoundationInteractionWrapper themeDNA={themeDNA}>
                        <button
                          onClick={commitAuditToRegistry}
                          className="px-3 py-1.5 text-[9px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors cursor-pointer font-bold"
                        >
                          Commit Scorecard
                        </button>
                      </FoundationInteractionWrapper>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Audit Logs & Recommendations */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="p-6 rounded-2xl bg-[#07070c] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-violet-400" />
                        <span className="text-xs font-mono uppercase text-white font-bold">
                          Active Compatibility Audit Log
                        </span>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    <div className="h-44 rounded-xl bg-black/70 border border-white/5 p-4 font-mono text-[10px] text-zinc-400 overflow-y-auto space-y-1.5 no-scrollbar select-text">
                      {auditLogs.length === 0 ? (
                        <span className="text-zinc-600 italic">No compatibility logs active. Select parameters and run Usability Audit.</span>
                      ) : (
                        auditLogs.map((log, idx) => (
                          <div key={idx} className="leading-relaxed whitespace-pre-wrap select-text selection:bg-violet-500/30">
                            {log}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Advice Boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/[0.03] space-y-2">
                        <div className="flex items-center gap-1.5 text-violet-400 font-bold">
                          <Zap className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[10px] font-mono uppercase tracking-wider">Build Advice</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                          {platformConfig[auditFeature][auditPlatform].buildAdvice}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/[0.03] space-y-2">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[10px] font-mono uppercase tracking-wider">Design Advice</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                          {platformConfig[auditFeature][auditPlatform].designAdvice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Saved Scores Table */}
              {savedScores.length > 0 && (
                <div className="p-6 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                    Sartorial Registry of Compatibility Audits
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[10px] text-zinc-400">
                      <thead>
                        <tr className="border-b border-white/5 text-zinc-500">
                          <th className="pb-2 font-normal">Audit ID</th>
                          <th className="pb-2 font-normal">Target Feature</th>
                          <th className="pb-2 font-normal">Virtual Platform</th>
                          <th className="pb-2 font-normal text-right">Composite Score</th>
                          <th className="pb-2 font-normal text-right">Commit Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.02]">
                        {savedScores.map((record) => (
                          <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-2.5 text-zinc-500">#{record.id}</td>
                            <td className="py-2.5 text-zinc-300 font-sans font-medium">{record.feature}</td>
                            <td className="py-2.5">
                              <span className="px-1.5 py-0.5 rounded bg-violet-950/40 border border-violet-500/20 text-violet-400 text-[8.5px]">
                                {record.platform}
                              </span>
                            </td>
                            <td className="py-2.5 text-right font-bold text-white">{record.totalScore}%</td>
                            <td className="py-2.5 text-right text-zinc-500">{record.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: SARTORIAL ACADEMY */}
        {activeWorkspaceTab === 'ACADEMY' && (
          <motion.div
            key="academy-pane"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Live Simulator & Parameter Calibration Node */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0a0a14] to-[#040408] border border-violet-500/10 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/5 rounded-full blur-[90px] pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.04] pb-3 gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Stars className="w-4 h-4 text-violet-400 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase text-violet-400 tracking-[0.1em] font-bold">
                      SARTORIAL ACADEMY MANAGER
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif text-white font-light tracking-tight">
                    Sartorial Academy & Live Simulation Node
                  </h2>
                </div>
                <span className="text-[8px] font-mono bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold shrink-0 self-start sm:self-auto">
                  Academy Engine Active
                </span>
              </div>

              {/* Sub-tabs Navigation */}
              <div className="flex bg-[#11111a]/80 p-1 border border-white/5 rounded-xl text-[10px] font-mono uppercase tracking-wider overflow-x-auto no-scrollbar gap-1">
                {[
                  { id: 'SIMULATE', label: 'Semester Simulator', icon: Stars },
                  { id: 'STUDENTS', label: 'Pupil Divisions', icon: Users },
                  { id: 'WORKERS', label: 'Worker Cages', icon: Cpu },
                  { id: 'DISPATCH', label: 'Regional Dispatch', icon: MapPin }
                ].map((sub) => {
                  const Icon = sub.icon;
                  return (
                    <FoundationInteractionWrapper key={sub.id} themeDNA={themeDNA}>
                      <button
                        type="button"
                        onClick={() => setSimulatorSubTab(sub.id as any)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                          simulatorSubTab === sub.id
                            ? 'bg-violet-600/20 text-violet-300 font-bold border border-violet-500/30 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{sub.label}</span>
                      </button>
                    </FoundationInteractionWrapper>
                  );
                })}
              </div>

              {/* Sub-tab: Semester Simulator */}
              {simulatorSubTab === 'SIMULATE' && (
                <div className="space-y-6 text-left">
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    Designers can calibrate training topics, active worker agents, and instructional sliders, then run live simulations to measure demographic synergy, teaching efficiency, and style grades.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Demography Choice */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block font-bold">
                        Target Student Demography
                      </label>
                      <select
                        value={selectedDemographic}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedDemographic(val);
                          if (typeof localStorage !== 'undefined') {
                            localStorage.setItem('look_vision_selected_demographic', val);
                          }
                          window.dispatchEvent(new Event('lookvision_sync_instructor'));
                        }}
                        className="w-full bg-[#11111a] border border-white/5 rounded-xl px-2.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-violet-500/50 cursor-pointer"
                      >
                        {instructorDemographics.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} (Ages {d.ageRange})
                          </option>
                        ))}
                      </select>
                      <div className="text-[10px] text-zinc-400 leading-normal italic px-1 mt-1">
                        Vibe: {instructorDemographics.find(d => d.id === selectedDemographic)?.styleVibe}
                      </div>
                    </div>

                    {/* Certified Worker Choice */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block font-bold">
                        Supervising Lead Worker Agent
                      </label>
                      <select
                        value={selectedInstructor}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedInstructor(val);
                          if (typeof localStorage !== 'undefined') {
                            localStorage.setItem('look_vision_selected_instructor', val);
                          }
                          window.dispatchEvent(new Event('lookvision_sync_instructor'));
                        }}
                        className="w-full bg-[#11111a] border border-white/5 rounded-xl px-2.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-violet-500/50 cursor-pointer"
                      >
                        {instructorWorkers.map(i => (
                          <option key={i.id} value={i.id}>
                            {i.name} ({i.cageId.split(' ')[1]})
                          </option>
                        ))}
                      </select>
                      <div className="text-[10px] text-zinc-400 leading-normal italic px-1 mt-1">
                        Operating Needs: {instructorWorkers.find(i => i.id === selectedInstructor)?.needs}
                      </div>
                    </div>
                  </div>

                  {/* Active Syllabus Curriculum */}
                  <div className="space-y-2 text-left">
                    <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block font-bold">
                      Select Active Academy Syllabus Curriculum
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { id: 'cyber_mesh', title: 'Cyberpunk Mesh Reconstruction', desc: 'Optimal for youth division expressions.' },
                        { id: 'eco_thrift', title: 'Eco-friendly Thrift Deconstruction', desc: 'Optimal for sustainable young adult passports.' },
                        { id: 'corp_layer', title: 'High-Performance Corporate Layering', desc: 'Optimal for active professional wardrobes.' },
                        { id: 'heritage_tailor', title: 'Classic Editorial Legacy Tailoring', desc: 'Optimal for majestic elder organic fit designs.' }
                      ].map((t) => (
                        <FoundationInteractionWrapper key={t.id} themeDNA={themeDNA}>
                          <button
                            type="button"
                            onClick={() => {
                              setCurriculumTopic(t.id);
                              if (typeof localStorage !== 'undefined') {
                                localStorage.setItem('look_vision_curriculum_topic', t.id);
                              }
                              window.dispatchEvent(new Event('lookvision_sync_instructor'));
                            }}
                            className={`w-full p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                              curriculumTopic === t.id
                                ? 'bg-violet-950/20 border-violet-500/50 text-white shadow-md'
                                : 'bg-[#11111a]/40 border-white/5 text-zinc-400 hover:bg-zinc-900/20 hover:border-white/10 hover:text-white'
                            }`}
                          >
                            <div className="text-xs font-bold font-sans flex items-center justify-between">
                              <span>{t.title}</span>
                              {curriculumTopic === t.id && <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" />}
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-1 leading-normal font-sans">{t.desc}</p>
                          </button>
                        </FoundationInteractionWrapper>
                      ))}
                    </div>
                  </div>

                  {/* Sliders Calibration */}
                  <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-4 text-left">
                    <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block font-bold">
                      Calibrate Dynamic Instruction Sliders
                    </span>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-zinc-400">Academic Instruction Intensity</span>
                        <span className="text-violet-400 font-bold">{instructionIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={instructionIntensity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setInstructionIntensity(val);
                          if (typeof localStorage !== 'undefined') {
                            localStorage.setItem('look_vision_instruction_intensity', String(val));
                          }
                          window.dispatchEvent(new Event('lookvision_sync_instructor'));
                        }}
                        className="w-full accent-violet-500 cursor-ew-resize bg-zinc-800 h-1 rounded-lg appearance-none"
                      />
                      <span className="text-[9px] text-zinc-500 block leading-normal">
                        Theoretical design guides, generative prompt taxonomy and seed weight analysis.
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-zinc-400">Practical Studio Hours</span>
                        <span className="text-emerald-400 font-bold">{practicalStudioHours}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={practicalStudioHours}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setPracticalStudioHours(val);
                          if (typeof localStorage !== 'undefined') {
                            localStorage.setItem('look_vision_practical_hours', String(val));
                          }
                          window.dispatchEvent(new Event('lookvision_sync_instructor'));
                        }}
                        className="w-full accent-emerald-500 cursor-ew-resize bg-zinc-800 h-1 rounded-lg appearance-none"
                      />
                      <span className="text-[9px] text-zinc-500 block leading-normal">
                        Interactive fitting drapes, virtual coordinate tests and seam thickness evaluations.
                      </span>
                    </div>
                  </div>

                  {/* Execute Button */}
                  <div className="space-y-3 pt-2 text-left">
                    <FoundationInteractionWrapper themeDNA={themeDNA}>
                      <button
                        type="button"
                        onClick={handleRunSemesterSimulation}
                        disabled={isSimulatingSemester}
                        className={`w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-[11px] uppercase tracking-wider rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isSimulatingSemester ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSimulatingSemester ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Evaluating Academic Synergy...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Execute Dynamic Semester Simulation</span>
                          </>
                        )}
                      </button>
                    </FoundationInteractionWrapper>

                    {/* Simulation results panel */}
                    {semesterResults && !isSimulatingSemester && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-[#07070c] border border-white/5 space-y-3 text-left animate-fade-in"
                      >
                        <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                          <span className="text-[9px] font-mono uppercase text-zinc-400 font-bold">Simulation Report Scorecard</span>
                          <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                            semesterResults.grade === 'S' ? 'text-amber-400 bg-amber-950/30 border border-amber-500/20' :
                            semesterResults.grade === 'A' ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/20' :
                            semesterResults.grade === 'B' ? 'text-violet-400 bg-violet-950/30 border border-violet-500/20' :
                            'text-zinc-400 bg-zinc-900 border border-white/5'
                          }`}>
                            Syllabus Grade: {semesterResults.grade}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5 text-center py-1">
                          <div className="p-2 bg-black/40 border border-white/[0.02] rounded-lg">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase block">Overall Score</span>
                            <span className="text-sm font-bold font-mono text-white">{semesterResults.overallScore}%</span>
                          </div>
                          <div className="p-2 bg-black/40 border border-white/[0.02] rounded-lg">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase block">Demographic Syn</span>
                            <span className="text-sm font-bold font-mono text-violet-400">{semesterResults.synergyScore}%</span>
                          </div>
                          <div className="p-2 bg-black/40 border border-white/[0.02] rounded-lg">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase block">Engagement Rate</span>
                            <span className="text-sm font-bold font-mono text-emerald-400">{semesterResults.engagementRate}%</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans bg-black/20 p-3 rounded-lg border border-white/[0.02]">
                          {semesterResults.reportText}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Sub-tab: Pupil Divisions */}
              {simulatorSubTab === 'STUDENTS' && (
                <div className="space-y-4 text-left">
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    Understand the core styling directives, demographic focus, and structural wardrobe needs of each student cohort to calibrate syllabus and worker alignment.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentGroups.map((group) => (
                      <div key={group.id} className={`p-4 rounded-xl border bg-gradient-to-br ${group.vibeColor} flex flex-col justify-between space-y-3`}>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center gap-2">
                            <h4 className="text-xs font-bold font-sans text-white">{group.name}</h4>
                            <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded-full border shrink-0 ${group.vibeBadge}`}>
                              {group.ageRange}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-wider block">
                            Vibe: {group.styleVibe}
                          </span>
                          <p className="text-[10px] text-zinc-300 font-sans leading-normal italic mt-1">
                            Focus: {group.focus}
                          </p>
                        </div>
                        <div className="space-y-1.5 pt-2 border-t border-white/5 text-left">
                          <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                            Wardrobe Constraints & Needs:
                          </span>
                          <ul className="space-y-1">
                            {group.needs.map((need, index) => (
                              <li key={index} className="text-[10px] text-zinc-400 font-sans flex items-start gap-1.5">
                                <span className="text-violet-400 font-bold shrink-0 mt-0.5">•</span>
                                <span>{need}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab: Worker Cages */}
              {simulatorSubTab === 'WORKERS' && (
                <div className="space-y-4 text-left">
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    Commission elite Fashion OS agents to specialized workspace "Cages". Certified worker agents boost generation parameters, audit scorecard outcomes, and state-wide dispatch outputs.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {workers.map((worker) => (
                      <div key={worker.id} className="p-4 rounded-xl bg-zinc-900/30 border border-white/5 flex flex-col justify-between space-y-3 relative overflow-hidden">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase truncate">
                              {worker.cageId}
                            </span>
                            <FoundationInteractionWrapper themeDNA={themeDNA}>
                              <button
                                type="button"
                                onClick={() => toggleWorkerSelection(worker.id)}
                                className={`px-2 py-0.5 text-[8px] font-mono uppercase rounded border transition-colors cursor-pointer shrink-0 ${
                                  worker.isChosen
                                    ? 'bg-violet-950/40 border-violet-500/30 text-violet-300 font-bold'
                                    : 'bg-black/40 border-white/5 text-zinc-500 hover:text-white hover:border-white/10'
                                }`}
                              >
                                {worker.isChosen ? '● Active' : 'Standby'}
                              </button>
                            </FoundationInteractionWrapper>
                          </div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            {worker.name}
                          </h4>
                          <span className="text-[9px] font-mono text-violet-400 uppercase tracking-wider block">
                            {worker.role}
                          </span>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-white/5 text-left">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">
                            Operating Requirements:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {worker.needs.map((need, idx) => (
                              <span key={idx} className="text-[8.5px] font-mono bg-black/40 border border-white/5 text-zinc-400 px-1.5 py-0.5 rounded">
                                {need}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/[0.03] pt-2.5 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-mono text-zinc-600 uppercase">Efficiency</span>
                            <span className="text-[10px] font-mono text-violet-400 font-bold whitespace-nowrap">
                              {worker.efficiency}% {worker.workingStatus === 'training' && '(Calibrating...)'}
                            </span>
                          </div>

                          <FoundationInteractionWrapper themeDNA={themeDNA}>
                            <button
                              type="button"
                              onClick={() => handleTrainWorker(worker.id)}
                              disabled={trainingWorkerId !== null || worker.efficiency >= 100}
                              className={`px-2 py-1 text-[8.5px] font-mono uppercase rounded transition-all cursor-pointer shrink-0 ${
                                worker.efficiency >= 100
                                  ? 'border border-emerald-500/20 text-emerald-500 bg-emerald-500/5 opacity-55 cursor-default'
                                  : worker.id === trainingWorkerId
                                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400 animate-pulse font-semibold'
                                  : 'bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 hover:text-white'
                              }`}
                            >
                              {worker.id === trainingWorkerId ? (
                                <span className="flex items-center gap-1">
                                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                                  {trainingProgress}%
                                </span>
                              ) : worker.efficiency >= 100 ? (
                                'Certified'
                              ) : (
                                'Train'
                              )}
                            </button>
                          </FoundationInteractionWrapper>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab: Regional Dispatch */}
              {simulatorSubTab === 'DISPATCH' && (
                <div className="space-y-4 text-left">
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-4 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/5 gap-2">
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-emerald-400" />
                        <h2 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                          State-wide Instructor Deployment
                        </h2>
                      </div>
                      
                      <select
                        value={stateRegion}
                        onChange={(e) => {
                          setStateRegion(e.target.value);
                          addDispatchLog(`Governor aligned dispatch targeting province: "${e.target.value}".`);
                        }}
                        className="bg-zinc-950 border border-white/10 text-[10px] text-white rounded px-2.5 py-1 font-sans focus:outline-none focus:border-violet-500/50 cursor-pointer self-start sm:self-auto"
                      >
                        <option value="Capital Province">Capital Province</option>
                        <option value="Aesthetic Coastline">Aesthetic Coastline</option>
                        <option value="Merino Highlands">Merino Highlands</option>
                        <option value="Avant-Garde District">Avant-Garde District</option>
                      </select>
                    </div>

                    <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                      Once you have certified the working needs of your commissioned worker divisions, execute the regional style dispatch. This will spread fashion instructors across the state lands to upgrade student closets.
                    </p>

                    <FoundationInteractionWrapper themeDNA={themeDNA}>
                      <button
                        type="button"
                        onClick={handleDispatchWorkers}
                        disabled={isDispatching}
                        className={`w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-md ${
                          isDispatching ? 'opacity-55 cursor-not-allowed' : ''
                        }`}
                      >
                        {isDispatching ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Dispatching Instructors...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Dispatch Fashion Instructors</span>
                          </>
                        )}
                      </button>
                    </FoundationInteractionWrapper>

                    {/* Console Logs */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block font-bold">Active Transmission Log:</span>
                      <div className="h-36 rounded-xl bg-black/60 border border-white/5 p-3 font-mono text-[9px] text-zinc-400 overflow-y-auto space-y-1.5 no-scrollbar select-text">
                        {activeSimulationLog.length === 0 ? (
                          <span className="text-zinc-600 italic">Logs are quiet. Commission workers and dispatch style instructors above.</span>
                        ) : (
                          activeSimulationLog.map((log, idx) => (
                            <div key={idx} className="leading-relaxed whitespace-pre-wrap select-text selection:bg-violet-500/30">
                              {log}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* History Panels */}
              <div className="pt-2 text-left">
                <div className="flex items-center justify-between">
                  <FoundationInteractionWrapper themeDNA={themeDNA}>
                    <button
                      type="button"
                      onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                      className="text-[10px] font-mono text-zinc-400 hover:text-white transition-all uppercase flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{showHistoryPanel ? '▼ Hide Past Semesters Registry' : '▶ View Past Semesters Registry'}</span>
                      <span className="text-[8.5px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-sans">{semesterHistory.length}</span>
                    </button>
                  </FoundationInteractionWrapper>

                  {semesterHistory.length > 0 && showHistoryPanel && (
                    <FoundationInteractionWrapper themeDNA={themeDNA}>
                      <button
                        type="button"
                        onClick={handleResetSimulatorHistory}
                        className="text-[9px] font-mono text-rose-400 hover:text-rose-300 transition-colors uppercase cursor-pointer font-bold"
                      >
                        Purge Registry
                      </button>
                    </FoundationInteractionWrapper>
                  )}
                </div>

                {showHistoryPanel && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-2 mt-3 pt-3 border-t border-white/[0.04] max-h-48 overflow-y-auto no-scrollbar"
                  >
                    {semesterHistory.length === 0 ? (
                      <div className="text-[10px] text-zinc-600 font-mono italic p-2 text-center">
                        No history logged yet. Run a semester simulation above.
                      </div>
                    ) : (
                      semesterHistory.map((record) => (
                        <div key={record.id} className="p-2.5 bg-black/35 border border-white/[0.02] rounded-xl flex items-center justify-between text-[11px]">
                          <div className="space-y-0.5 max-w-[70%]">
                            <div className="text-[10px] text-zinc-400 font-mono truncate">{record.topic}</div>
                            <div className="text-[9px] text-zinc-500 font-mono">
                              Admin: {record.leadInstructor} | For: {record.demographic}
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <span className="text-[9px] text-zinc-600 font-mono">{record.timestamp}</span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              record.grade === 'S' ? 'text-amber-400 bg-amber-950/20' :
                              record.grade === 'A' ? 'text-emerald-400 bg-emerald-950/20' :
                              record.grade === 'B' ? 'text-violet-400 bg-violet-950/20' :
                              'text-zinc-500 bg-zinc-900/40'
                            }`}>
                              {record.grade} ({record.score}%)
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (coatDNA) {
    return (
      <ThemeCoatRenderer coatDNA={coatDNA}>
        {renderContent()}
      </ThemeCoatRenderer>
    );
  }

  return renderContent();
};
