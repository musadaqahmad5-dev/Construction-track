import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, Navigation, Activity, Radar, Map as MapIcon, Zap, Train, AlertTriangle, CloudRain, CheckCircle2, MessageSquare, ShieldAlert, Users } from 'lucide-react';

interface KiaUnit {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'Moving' | 'Stationary' | 'Delivering' | 'Stealth' | 'Heavy' | 'Hunting';
  velocity: number;
  isPhased: boolean;
  shape: 'vessel' | 'train';
  needsHelp?: boolean;
}

interface VisionClock {
  id: string;
  x: number;
  y: number;
  opacity: number;
}

interface HuntCage {
  id: string;
  timestamp: string;
  spells: string[];
  originState: string;
  knowledgeStamp: string;
}

const KIA_UNITS_INITIAL: KiaUnit[] = [
  { id: 'K001', name: 'KIA LOGISTICS PRIME', x: 20, y: 30, status: 'Moving', velocity: 45, isPhased: false, shape: 'vessel' },
  { id: 'K002', name: 'KIA SITE PATROL', x: 70, y: 60, status: 'Stationary', velocity: 0, isPhased: false, shape: 'vessel' },
  { id: 'K003', name: 'KIA HEAVY LIFT', x: 40, y: 80, status: 'Moving', velocity: 12, isPhased: false, shape: 'vessel' },
];

const ORIGIN_STATES = ['NEOM_SECTOR_7', 'GOBI_VOID_STATION', 'ARCTIC_COLD_CAVE', 'AMAZON_GREEN_PALACE'];
const TECH_STAMPS = ['Quantum_Soul_v1', 'Phasic_Drive_Mk4', 'Anomaly_Buffer_X', 'Vocal_Bridge_Alpha'];

export const KiaTelemetry: React.FC = () => {
  const [units, setUnits] = useState<KiaUnit[]>(KIA_UNITS_INITIAL);
  const [activeTab, setActiveTab] = useState<'map' | 'data' | 'cage' | 'train' | 'bus'>('map');
  const [huntHistory, setHuntHistory] = useState<HuntCage[]>([]);
  const [currentSpells, setCurrentSpells] = useState<string[]>([]);
  const [busComms, setBusComms] = useState<{ sender: string, text: string }[]>([
    { sender: 'FRONT_LEFT', text: 'Target signature confirmed. Abnormal species detected.' },
    { sender: 'FRONT_RIGHT', text: 'Informer is in the kill zone. Standing by.' },
    { sender: 'FRONT_LEFT', text: 'Wait... the informer crossed the road in an unbehaviour method! SURVIVAL CONFIRMED.' }
  ]);
  const [huntActive, setHuntActive] = useState(false);
  const [isHeavyState, setIsHeavyState] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [visionClocks, setVisionClocks] = useState<VisionClock[]>([]);
  const [abnormalTarget, setAbnormalTarget] = useState<{ x: number, y: number, id: string, type: string } | null>(null);
  const [informer, setInformer] = useState<{ x: number, y: number, id: string, status: 'Vulnerable' | 'Safe' } | null>(null);
  const [supportLevel, setSupportLevel] = useState(100);
  const [phenomenaProgress, setPhenomenaProgress] = useState(0);
  const [showBoundaryCar, setShowBoundaryCar] = useState(false);
  const [boundaryCarAngle, setBoundaryCarAngle] = useState(0);

  const startHunt = () => {
    if (huntActive) return;
    setHuntActive(true);
    setSupportLevel(100);
    setPhenomenaProgress(0);
    setShowBoundaryCar(false);
    
    // Spawn Informer
    setInformer({
      x: 50,
      y: 80,
      id: `INF_${Math.floor(Math.random() * 99)}`,
      status: 'Vulnerable'
    });

    // Manifest Species Hunter (Abnormal Human)
    setAbnormalTarget({ 
      x: Math.random() * 40 + 30, 
      y: 10, 
      id: 'SPECIES_HUNTER_01',
      type: 'predatory' 
    });

    // Generate vision clocks on the "road" (The survival path)
    const roadY = 45;
    const clocks: VisionClock[] = Array.from({ length: 6 }).map((_, i) => ({
      id: `clock-${i}`,
      x: 5 + i * 18,
      y: roadY,
      opacity: 1
    }));
    setVisionClocks(clocks);

    // Survival Sequence Logic
    setTimeout(() => {
      // Informer "Crosses the road" suddenly to save themselves
      setInformer(prev => prev ? { ...prev, y: roadY, status: 'Safe' } : null);
      
      const spellId = `COLLECTED_DATA_${Math.floor(Math.random() * 1000)}`;
      
      const clearClocksSequentially = async () => {
        for (let i = 0; i < clocks.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setVisionClocks(prev => prev.filter((_, idx) => idx !== 0));
        }
      };
      
      clearClocksSequentially().then(() => {
        setAbnormalTarget(null);
        setInformer(null);
        
        // Return at 100% phenomena
        setPhenomenaProgress(100);
        setShowBoundaryCar(true);
        
        // Stamping logic
        const originState = ORIGIN_STATES[Math.floor(Math.random() * ORIGIN_STATES.length)];
        const knowledgeStamp = TECH_STAMPS[Math.floor(Math.random() * TECH_STAMPS.length)];

        setCurrentSpells(prev => {
          const next = [...prev, spellId];
          const newCage: HuntCage = {
            id: `CAGE_${huntHistory.length + 1}`,
            timestamp: new Date().toLocaleTimeString(),
            spells: next,
            originState,
            knowledgeStamp
          };
          setHuntHistory(current => [newCage, ...current]);
          return [];
        });

        setTimeout(() => {
          setHuntActive(false);
          setShowBoundaryCar(false);
          setUnits(prev => prev.map(u => ({ ...u, needsHelp: false })));

          if (isAutoMode) {
            setTimeout(startHunt, 3000);
          }
        }, 4000); // Wait for boundary car display
      });
    }, 8000);
  };

  const triggerMissionPivot = () => {
    setIsHeavyState(prev => !prev);
    if (!isHeavyState) {
      setActiveTab('train');
      setUnits(prev => prev.map(u => ({ ...u, status: 'Heavy', shape: 'train', velocity: 5, needsHelp: false })));
    } else {
      setActiveTab('map');
      setUnits(prev => prev.map(u => ({ ...u, status: 'Moving', shape: 'vessel', velocity: 30, needsHelp: false })));
    }
  };

  const provideSupport = () => {
    setSupportLevel(prev => Math.min(100, prev + 30));
    setUnits(prev => prev.map(u => ({ ...u, needsHelp: false })));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Reduce support level and increase phenomena progress during hunt
      if (huntActive) {
        setSupportLevel(prev => Math.max(0, prev - 2));
        setPhenomenaProgress(prev => Math.min(95, prev + 2.5)); // Incrementally learn
      }
      
      // Update Boundary Car Angle
      if (showBoundaryCar) {
        setBoundaryCarAngle(prev => (prev + 5) % 360);
      }

      setUnits(prev => prev.map(unit => {
        // Occasionally trigger phase shift
        const shouldPhase = Math.random() > 0.85;
        const isPhased = shouldPhase ? !unit.isPhased : unit.isPhased;

        // Occasionally trigger shape shift (vessel <-> train)
        const shouldShift = Math.random() > 0.95;
        const shape = shouldShift ? (unit.shape === 'vessel' ? 'train' : 'vessel') : unit.shape;

        // Randomly trigger distress in hunt mode
        const needsHelp = huntActive && (unit.needsHelp || (Math.random() > 0.9));

        // If hunt is active, units move towards abnormal target
        if (huntActive && abnormalTarget) {
          const dx = (abnormalTarget.x - unit.x) * (needsHelp ? 0.01 : 0.08); // Faster speed
          const dy = (abnormalTarget.y - unit.y) * (needsHelp ? 0.01 : 0.08);
          
          // Collision avoidance (simple distancing)
          const others = prev.filter(u => u.id !== unit.id);
          let avoidX = 0;
          let avoidY = 0;
          others.forEach(o => {
            const dist = Math.sqrt(Math.pow(o.x - unit.x, 2) + Math.pow(o.y - unit.y, 2));
            if (dist < 10) {
              avoidX += (unit.x - o.x) * 0.1;
              avoidY += (unit.y - o.y) * 0.1;
            }
          });

          return {
            ...unit,
            x: unit.x + dx + avoidX + (Math.random() - 0.5) * (needsHelp ? 0.5 : 2),
            y: unit.y + dy + avoidY + (Math.random() - 0.5) * (needsHelp ? 0.5 : 2),
            status: 'Hunting',
            velocity: needsHelp ? 5 : 75,
            isPhased: true,
            needsHelp,
            shape
          };
        }

        if (unit.status === 'Stationary') {
          if (Math.random() > 0.9) return { ...unit, status: 'Moving', velocity: 20 + Math.random() * 40, isPhased, shape, needsHelp: false };
          return { ...unit, isPhased, shape, needsHelp: false };
        }

        let dx = (Math.random() - 0.5) * 5;
        let dy = (Math.random() - 0.5) * 5;
        
        let newX = Math.max(5, Math.min(95, unit.x + dx));
        let newY = Math.max(5, Math.min(95, unit.y + dy));

        if (Math.random() > 0.95) return { ...unit, x: newX, y: newY, status: 'Stationary', velocity: 0, isPhased, shape, needsHelp: false };
        
        return { ...unit, x: newX, y: newY, velocity: Math.abs(dx + dy) * 10 + 20, isPhased, shape, needsHelp: false };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [huntActive, abnormalTarget, supportLevel]);

  // Abnormal Actor Movement (Predatory Pursuit)
  useEffect(() => {
    if (!huntActive || !abnormalTarget || !informer || informer.status === 'Safe') return;

    const pursuitInterval = setInterval(() => {
      setAbnormalTarget(prev => {
        if (!prev || !informer) return prev;
        const dx = (informer.x - prev.x) * 0.1;
        const dy = (informer.y - prev.y) * 0.1;
        return { ...prev, x: prev.x + dx, y: prev.y + dy };
      });
    }, 100);

    return () => clearInterval(pursuitInterval);
  }, [huntActive, informer?.status]);

  // Automation Effect
  useEffect(() => {
    if (!isAutoMode) return;

    // Start hunt immediately if in auto mode
    if (!huntActive) startHunt();

    const pivotInterval = setInterval(() => {
      triggerMissionPivot();
    }, 15000); // 15 seconds cycle for mission pivoting

    return () => clearInterval(pivotInterval);
  }, [isAutoMode, huntActive, isHeavyState]);

  return (
    <div className="bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[500px]">
      {/* Terminal Header */}
      <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <h2 className="text-xs font-black uppercase tracking-[0.3em] font-mono text-slate-400">
            KIA MOVEMENT TECHNOLOGY <span className="text-blue-500">LIVE FEED</span>
            <span className="ml-4 text-[8px] text-slate-600 border-l border-slate-700 pl-4 font-normal tracking-normal capitalize">
              Professional-grade construction project management
            </span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAutoMode(!isAutoMode)}
            className={`px-2 py-1 rounded text-[8px] font-black tracking-widest transition-all ${isAutoMode ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-slate-800 text-slate-500'}`}
          >
            {isAutoMode ? 'AUTO_OP: ACTIVATED' : 'AUTO_OP: MANUAL'}
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`p-1.5 rounded-lg transition-colors ${activeTab === 'map' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <MapIcon size={16} />
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`p-1.5 rounded-lg transition-colors ${activeTab === 'data' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Activity size={16} />
          </button>
          <button 
            onClick={() => setActiveTab('train')}
            className={`p-1.5 rounded-lg transition-colors ${activeTab === 'train' ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Train size={16} />
          </button>
          <button 
            onClick={() => setActiveTab('bus')}
            className={`p-1.5 rounded-lg transition-colors ${activeTab === 'bus' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <MessageSquare size={16} />
          </button>
          <button 
            onClick={() => setActiveTab('cage')}
            className={`p-1.5 rounded-lg transition-colors ${activeTab === 'cage' ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Zap size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] bg-slate-950">
        <AnimatePresence mode="wait">
          {activeTab === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 p-8"
            >
              {/* Simulated Map Grid */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Radar size={400} className="text-blue-500 animate-[spin_10s_linear_infinite]" />
              </div>

              {/* Double Personality / Twin Essence Palace */}
              <div className="absolute inset-x-[20%] inset-y-[20%] rounded-[100px] border border-blue-500/10 bg-blue-500/5 backdrop-blur-[2px] pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="relative w-32 h-32">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-t-white/40 border-b-blue-500/40 rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border border-l-white/20 border-r-indigo-500/20 rounded-full"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[8px] font-black tracking-widest text-white/40">TWIN_ESSENCE</span>
                        <span className="text-[6px] font-mono text-blue-500/40">ONE_PALACE</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Boundary Car Sequence */}
              <AnimatePresence>
                {showBoundaryCar && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 2 }}
                    className="absolute inset-0 pointer-events-none z-50 overflow-hidden"
                  >
                    <div className="absolute inset-0 border-[10px] border-blue-600/30 animate-pulse" />
                    <motion.div 
                      style={{ 
                        left: `${50 + Math.cos(boundaryCarAngle * Math.PI / 180) * 45}%`,
                        top: `${50 + Math.sin(boundaryCarAngle * Math.PI / 180) * 45}%`
                      }}
                      className="absolute w-24 h-12 -ml-12 -mt-6"
                    >
                      <div className="relative w-full h-full bg-blue-800 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(30,64,175,0.8)] border-2 border-blue-400">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                        {/* Windows / Black Mirrors */}
                        <div className="absolute top-1 left-2 right-2 h-4 bg-black rounded-sm" />
                        <div className="absolute bottom-1 left-2 w-4 h-3 bg-black rounded-sm" />
                        <div className="absolute bottom-1 right-2 w-4 h-3 bg-black rounded-sm" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-black text-white/80">PHENOMENA_CORPS</div>
                      </div>
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded text-[8px] font-mono text-blue-400 border border-blue-500/20 whitespace-nowrap">
                        BOUNDARY_RETURN_VEHICLE
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Central Source Disk Building - Internal Visualization */}
              <div className="absolute inset-x-[35%] inset-y-[35%] pointer-events-none z-10 flex items-center justify-center">
                <div className="relative w-full h-full">
                   {/* External Foundation Layer */}
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-[1px] border-dashed border-blue-500/30 bg-blue-500/5"
                   />
                   
                   {/* Main Source Disk */}
                   <motion.div 
                    animate={{ 
                      scale: huntActive ? [1, 1.05, 1] : 1,
                      boxShadow: huntActive ? ["0 0 20px rgba(59,130,246,0.2)", "0 0 50px rgba(59,130,246,0.5)", "0 0 20px rgba(59,130,246,0.2)"] : "0 0 20px rgba(59,130,246,0.1)"
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-4 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center overflow-hidden"
                   >
                      {/* Interior View - The "Disk Contents" */}
                      <div className="absolute inset-0 opacity-40">
                         <div className="absolute inset-0 flex items-center justify-center">
                            {/* Inner Core Gears */}
                            <motion.div 
                              animate={{ rotate: -360 }}
                              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                              className="w-full h-full border-[10px] border-white/5 rounded-full"
                            />
                            <motion.div 
                              animate={{ 
                                opacity: [0.1, 0.4, 0.1],
                                scale: [0.9, 1.1, 0.9]
                              }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="absolute w-2/3 h-2/3 bg-blue-500/20 blur-3xl rounded-full"
                            />
                         </div>
                         {/* Moving Knowledge Streams */}
                         <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2">
                           {Array.from({ length: 16 }).map((_, i) => (
                             <motion.div 
                               key={i}
                               animate={{ 
                                 opacity: [0, 1, 0],
                                 y: [-10, 10]
                               }}
                               transition={{ 
                                 duration: 2 + Math.random() * 2,
                                 repeat: Infinity,
                                 delay: Math.random() * 2
                               }}
                               className="h-1 bg-white/20 rounded-full"
                             />
                           ))}
                         </div>
                      </div>

                      {/* Final Stamped Knowledge Marker */}
                      <div className="relative z-20 flex flex-col items-center">
                        <Activity className="text-blue-400 mb-1" size={24} />
                        <div className="text-[10px] font-black text-white/60 tracking-[0.2em] font-mono">SOURCE_DISK_01</div>
                        <div className="text-[6px] text-blue-500 font-mono uppercase tracking-widest">Construction Hub</div>
                      </div>
                   </motion.div>

                   {/* Disk Orbitals */}
                   <div className="absolute inset--8 pointer-events-none">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-white/10 rounded-full"
                      />
                      {showBoundaryCar && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_blue]" />
                      )}
                   </div>
                </div>
              </div>

              {/* Hunt Support HUD */}
              <AnimatePresence>
                {huntActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-red-500/30 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.2)]"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-black italic text-red-500 tracking-tighter animate-pulse mb-1">
                        HUNT_SUPPORT_HUD
                      </div>
                      <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${supportLevel}%` }}
                          className={`h-full transition-colors ${supportLevel < 30 ? 'bg-red-500' : 'bg-green-500'}`}
                        />
                      </div>
                      <div className="text-[7px] font-mono text-slate-500 mt-1 uppercase tracking-widest">
                        Integrity: {supportLevel}%
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-black italic text-blue-500 tracking-tighter animate-pulse mb-1">
                        PHENOMENA_LEARNING
                      </div>
                      <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${phenomenaProgress}%` }}
                          className="h-full bg-blue-500"
                        />
                      </div>
                      <div className="text-[7px] font-mono text-slate-500 mt-1 uppercase tracking-widest">
                        Knowledge: {phenomenaProgress.toFixed(0)}%
                      </div>
                    </div>

                    {units.some(u => u.needsHelp) && (
                      <button 
                         onClick={provideSupport}
                         className="px-4 py-2 bg-white text-black font-black text-[10px] rounded-full hover:bg-slate-200 transition-all shadow-[0_0_15px_white]"
                      >
                        SEND HELP
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Vision Clocks - Sequential Disappearance */}
              <AnimatePresence>
                {visionClocks.map((clock, idx) => (
                  <motion.div
                    key={clock.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: [0.1, 0.6, 0.2], 
                      scale: [0.9, 1.1, 1],
                      x: [0, (Math.random() - 0.5) * 5, 0] 
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.2, 
                      y: -20,
                      transition: { duration: 0.5 }
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: idx * 0.1 
                    }}
                    style={{ position: 'absolute', left: `${clock.x}%`, top: `${clock.y}%` }}
                    className="flex flex-col items-center gap-1 z-10"
                  >
                    <div className="relative">
                      <Clock size={12} className="text-amber-500/50" />
                      <div className="absolute inset-0 bg-amber-500/20 blur-sm rounded-full" />
                    </div>
                    <div className="text-[5px] font-mono whitespace-nowrap text-amber-500/40 uppercase">Vision_Clock :: Road</div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Abnormal Human Target - Acting abnormal */}
              <AnimatePresence>
                {abnormalTarget && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: [0, 2, -2, 0],
                      y: [0, -1, 1, 0]
                    }}
                    exit={{ opacity: 0, scale: 3, filter: 'blur(20px)' }}
                    transition={{ 
                      duration: 0.5,
                      x: { repeat: Infinity, duration: 0.1 },
                      y: { repeat: Infinity, duration: 0.13 }
                    }}
                    style={{ position: 'absolute', left: `${abnormalTarget.x}%`, top: `${abnormalTarget.y}%` }}
                    className="z-20"
                  >
                    <div className="relative flex flex-col items-center">
                      {/* Aura */}
                      <motion.div 
                        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                      />
                      
                      {/* Character Shape */}
                      <div className="relative w-8 h-12 flex flex-col items-center">
                         {/* Head */}
                         <div className="w-4 h-4 bg-white/10 border border-white/40 rounded-full mb-1 flex items-center justify-center">
                            <div className="w-1 h-1 bg-red-500 animate-pulse rounded-full" />
                         </div>
                         {/* Body */}
                         <div className="w-6 h-8 bg-white/5 border border-white/20 rounded-t-xl rounded-b-sm relative overflow-hidden">
                           <motion.div 
                             animate={{ y: [0, 10, 0] }}
                             transition={{ repeat: Infinity, duration: 2 }}
                             className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent"
                           />
                         </div>
                      </div>
                      
                      <div className="mt-2 whitespace-nowrap bg-black/90 px-3 py-1 rounded border border-white/20 shadow-2xl">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                          <p className="text-[8px] font-black font-mono text-white tracking-widest uppercase">
                            SPECIES_HUNTER
                          </p>
                        </div>
                        <p className="text-[6px] font-mono text-slate-500 leading-tight">
                          STATUS: HUNTING_INFORMER<br/>
                          MASK_GEN: UNKNOWN_SPECIES<br/>
                          SIGNATURE: PREDATORY/ABNORMAL
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Informer Unit */}
              <AnimatePresence>
                {informer && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    style={{ position: 'absolute', left: `${informer.x}%`, top: `${informer.y}%` }}
                    className="z-30"
                  >
                     <div className="flex flex-col items-center">
                        <div className={`p-1.5 rounded-full border ${informer.status === 'Safe' ? 'bg-green-500/20 border-green-500 animate-bounce' : 'bg-blue-500/20 border-blue-500 animate-pulse'}`}>
                           <Users size={12} className={informer.status === 'Safe' ? 'text-green-400' : 'text-blue-400'} />
                        </div>
                        <div className="mt-1 bg-black/80 px-1.5 py-0.5 rounded text-[6px] font-mono whitespace-nowrap border border-white/10 uppercase">
                           Informer: {informer.id}<br/>
                           Mode: {informer.status}
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {units.map((unit) => (
                <motion.div
                  key={unit.id}
                  layout
                  transition={{ duration: 2, ease: "linear" }}
                  style={{
                    position: 'absolute',
                    left: `${unit.x}%`,
                    top: `${unit.y}%`,
                  }}
                  className="group cursor-pointer"
                >
                  <div className="relative">
                    {/* Identification Ring */}
                    <motion.div 
                      animate={{ 
                        scale: unit.needsHelp ? [1.5, 4, 1.5] : (unit.isPhased ? [1.5, 3, 1.5] : [1, 1.5, 1]), 
                        opacity: unit.needsHelp ? [0.6, 0.1, 0.6] : (unit.isPhased ? [0.4, 0.05, 0.4] : [0.3, 0.1, 0.3]) 
                      }}
                      transition={{ repeat: Infinity, duration: unit.needsHelp ? 0.5 : 2 }}
                      className={`absolute -inset-4 rounded-full ${unit.needsHelp ? 'bg-red-600 shadow-[0_0_20px_red]' : unit.status === 'Hunting' ? 'bg-red-500/40' : unit.isPhased ? 'bg-white/40' : 'bg-blue-500/20'}`}
                    />
                    
                    {/* Unit Icon / Soul Body / Shape Shift */}
                    <AnimatePresence mode="wait">
                      {unit.needsHelp ? (
                         <motion.div 
                          key="distress"
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.3, 1] }}
                          className="relative w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_10px_red]"
                        >
                           <AlertTriangle size={8} className="text-white" />
                        </motion.div>
                      ) : unit.isPhased ? (
                        <motion.div 
                          key="soul"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="relative w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] border border-white/50"
                        >
                          <div className="absolute inset-0 bg-white animate-ping rounded-full opacity-20" />
                        </motion.div>
                      ) : (
                        <motion.div 
                          key={unit.shape}
                          initial={{ opacity: 0, rotate: unit.shape === 'train' ? 90 : 0 }}
                          animate={{ opacity: 1, rotate: unit.shape === 'train' ? 90 : 0 }}
                          exit={{ opacity: 0 }}
                          className={`relative p-2 rounded-lg shadow-xl transition-colors ${unit.status === 'Heavy' ? 'bg-amber-900/40 border border-amber-500/50' : 'bg-slate-900 border border-slate-700 group-hover:border-blue-500'}`}
                        >
                          {unit.shape === 'train' ? (
                            <Train size={14} className={unit.status === 'Heavy' ? 'text-amber-400' : 'text-slate-400'} />
                          ) : (
                            <Truck size={14} className={unit.status === 'Moving' ? 'text-blue-400' : 'text-slate-500'} />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Unit Label */}
                    <div className="absolute left-full ml-2 top-0 bg-slate-900/90 backdrop-blur px-2 py-1 rounded border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      <p className="text-[10px] font-mono font-bold">{unit.needsHelp ? '[SIGNAL_LOSS_DANGER]' : unit.isPhased ? `[SOUL_${unit.id}]` : (unit.shape === 'train' ? `[TRANSFORM_${unit.id}]` : unit.name)}</p>
                      <p className={`text-[8px] font-mono uppercase ${unit.needsHelp ? 'text-red-500 animate-pulse' : unit.isPhased ? 'text-white' : (unit.status === 'Heavy' ? 'text-amber-400' : 'text-blue-400')}`}>
                         {unit.needsHelp ? 'INSUFFICIENT_POWER / NEED_SUPPORT' : unit.isPhased ? 'PHASE_SHIFTED / HUNT_READY' : (unit.shape === 'train' ? 'TRAIN_VISION_ACTIVE' : `${unit.status} @ ${unit.velocity.toFixed(1)} KM/H`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : activeTab === 'train' ? (
            <motion.div
              key="train"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 p-8 flex flex-col justify-center"
            >
              <div className="h-0.5 w-full bg-amber-900/30 relative flex items-center">
                {/* Track Line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent animate-pulse" />
                
                {units.map((unit, idx) => (
                  <motion.div
                    key={`train-unit-${unit.id}`}
                    animate={{ 
                      left: [(idx * 20)+'%', ((idx * 20) + 10)+'%', (idx * 20)+'%'],
                    }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    style={{ position: 'absolute' }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={`p-2 rounded-full border ${unit.isPhased ? 'bg-white shadow-[0_0_10px_white] border-white' : 'bg-slate-900 border-amber-900'}`}>
                      {unit.isPhased ? <Zap size={10} className="text-amber-900" /> : <Train size={12} className="text-amber-500" />}
                    </div>
                    <div className="text-[8px] font-mono text-amber-500/50 absolute top-full mt-2">
                       {unit.id} :: TRAIN_VISION
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-24 p-6 bg-amber-950/20 border border-amber-900/30 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <AlertTriangle size={40} className="text-amber-500" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2">Linear Pivot Recovery</h4>
                <p className="text-[9px] text-amber-200/60 leading-relaxed font-mono">
                  Mission state: HEAVY. Due to external interference (Lose/Fight/Heavy Object), the movement logic has shifted into TRAIN VISION. 
                  Individual fleet coordinates have collapsed into a singular trajectory. 
                  <span className="text-amber-500 bg-amber-900/40 px-1 ml-1 font-bold">STAY PREPARED. SPELLS ARE MOVING ON RAILS.</span>
                </p>
              </div>
            </motion.div>
          ) : activeTab === 'bus' ? (
            <motion.div
              key="bus"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                  <Truck className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Mission Bus Bridge</h3>
                  <p className="text-[9px] text-slate-500 font-mono">INTERNAL_COMMS_ISOLATION // FRONT_SEAT_PRIORITY</p>
                </div>
              </div>

              <div className="flex-1 flex gap-4">
                {/* Left: Chat Log */}
                <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 font-mono overflow-y-auto">
                  {busComms.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.sender === 'FRONT_LEFT' ? 'items-start' : 'items-end'}`}>
                      <span className="text-[7px] text-slate-500 mb-1">{msg.sender}</span>
                      <div className={`text-[9px] p-2 rounded-xl border ${msg.sender === 'FRONT_LEFT' ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[8px] text-green-500">VOICE_BRIDGE_ACTIVE</span>
                    </div>
                    <p className="text-[8px] text-slate-500 italic">2 people talking...</p>
                  </div>
                </div>

                {/* Right: Seating Map */}
                <div className="w-48 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
                  <div className="text-[8px] font-black tracking-widest text-slate-500 mb-6 uppercase">Vehicle_Seating</div>
                  
                  {/* Driver/Navigator */}
                  <div className="flex gap-4 mb-8">
                    <div className="flex flex-col items-center gap-1">
                       <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
                         <Users size={16} className="text-indigo-400" />
                       </div>
                       <span className="text-[7px] font-bold text-indigo-400">FRONT_L</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                       <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
                         <Users size={16} className="text-indigo-400" />
                       </div>
                       <span className="text-[7px] font-bold text-indigo-400">FRONT_R</span>
                    </div>
                  </div>

                  {/* Partition */}
                  <div className="w-full h-0.5 bg-red-900/50 border-t border-red-500/30 mb-8 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-950 px-2 flex items-center gap-1">
                      <ShieldAlert size={8} className="text-red-500" />
                      <span className="text-[6px] font-black text-red-500">ISOLATION_GATE_ACTIVE</span>
                    </div>
                  </div>

                  {/* Back Seats */}
                  <div className="grid grid-cols-2 gap-4 opacity-40">
                    {['B_LEFT', 'B_RIGHT'].map(pos => (
                      <div key={pos} className="flex flex-col items-center gap-1 grayscale">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center cursor-not-allowed">
                          <Users size={16} className="text-slate-600" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldAlert size={12} className="text-red-500/50" />
                          </div>
                        </div>
                        <span className="text-[7px] font-bold text-slate-500">{pos}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto w-full bg-red-950/20 border border-red-900/30 p-2 rounded text-center">
                     <p className="text-[7px] font-black text-red-400 uppercase tracking-tighter">Override Lockout: ON</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'data' ? (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 p-6 overflow-y-auto font-mono text-[11px]"
            >
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="pb-2 font-bold uppercase tracking-wider">UNIT_ID</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">PHASE_STATE</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">SHAPE</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">STATUS</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">HUNT_SIG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {units.map(unit => (
                    <tr key={unit.id}>
                      <td className="py-3 text-blue-400 font-bold">{unit.id}</td>
                      <td className="py-3 font-medium">
                        {unit.isPhased ? (
                          <span className="flex items-center gap-2 text-white font-black animate-pulse">
                            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]" />
                            SOUL_CLOAK
                          </span>
                        ) : (
                          <span className="text-slate-600">VESSEL_MODE</span>
                        )}
                      </td>
                      <td className="py-3">
                        <code className={`text-[9px] px-1.5 py-0.5 rounded ${unit.shape === 'train' ? 'bg-amber-900 text-amber-200' : 'bg-slate-800 text-slate-300'}`}>
                          {unit.shape.toUpperCase()}
                        </code>
                      </td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded ${unit.status === 'Moving' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                          {unit.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono">
                        {unit.isPhased ? (
                          <span className="text-red-400 flex items-center gap-1">
                            <Zap size={10} /> READIED
                          </span>
                        ) : (
                          <span className="text-slate-700">STANDBY</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Radar size={60} />
                </div>
                <div className="flex items-center gap-2 mb-2 text-blue-400 font-black uppercase text-[10px] tracking-widest relative z-10">
                  <Zap size={10} /> Movement Tech & Soul Logic
                </div>
                <p className="text-slate-400 text-[10px] leading-relaxed relative z-10">
                  Stealth protocol engaged. Features have learned to disappear from 'eyes'—spice, computer, and camera eyes are now bypassed via Phase Shift. 
                  White-coded soul bodies are manifesting at the precise movement points. The inner soul is coming out. 
                  <span className="text-red-500 font-bold ml-1">PREPARING FOR HUNT. ALL SYSTEMS STANDBY FOR TARGET ACQUISITION.</span>
                </p>

                {!huntActive && (
                  <button 
                    onClick={startHunt}
                    className="mt-4 relative z-10 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                  >
                    Initialize Tactical Hunt
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cage"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 p-6 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                  <Radar className="text-red-400 animate-pulse" size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-red-400">Multi-Cage Containment Repository</h3>
                  <p className="text-[9px] text-slate-500 font-mono">PHASIC_LOCK_CYCLES: {huntHistory.length}</p>
                </div>
              </div>

              <div className="space-y-4">
                {huntHistory.length === 0 ? (
                  <div className="border border-slate-800 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center opacity-20">
                    <Zap size={40} className="mb-2" />
                    <p className="text-[10px] font-mono uppercase tracking-widest">Repository Empty // Initialize Hunt</p>
                  </div>
                ) : (
                  huntHistory.map((cage) => (
                    <div key={cage.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-red-400 tracking-wider font-mono">{cage.id} :: {cage.timestamp}</span>
                          <span className="text-[7px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono uppercase tracking-tighter">
                            Origin: {cage.originState}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[7px] font-black text-white/40 font-mono tracking-widest">{cage.knowledgeStamp}</span>
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                        </div>
                      </div>
                      <div className="p-3 grid grid-cols-4 gap-2">
                        {cage.spells.map((spell, sIdx) => (
                          <div key={sIdx} className="bg-slate-950 border border-red-900/30 p-2 rounded-lg flex flex-col items-center">
                             <div className="w-1.5 h-1.5 bg-white rounded-full blur-[2px] mb-1" />
                             <code className="text-[7px] text-slate-500">{spell}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-auto pt-6">
                <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl">
                  <p className="text-[10px] font-mono text-red-300 leading-relaxed italic">
                    "Information sent to features." Every successful hunt manifests in a new secure sector. Abnormal human actors identified and processed into white-coded structures.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Status Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[8px] font-mono font-bold text-slate-500">
        <div className="flex items-center gap-4">
          <button 
            onClick={triggerMissionPivot}
            disabled={isAutoMode}
            className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-800 rounded border border-slate-700 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CloudRain size={10} className={isHeavyState ? 'text-amber-500' : 'text-slate-500'} />
            <span>{isAutoMode ? 'AUTO_PIVOTING' : 'PIVOT MISSION'}</span>
          </button>
          <span>LAT: 40.7128° N</span>
          <span>LNG: 74.0060° W</span>
          <span className="flex items-center gap-1">
            <Activity size={8} /> SIGNAL: OPTIMAL
          </span>
          <span className="flex items-center gap-1 ml-2 text-blue-400">
            <CheckCircle2 size={10} /> MILESTONES: {huntHistory.length}
          </span>
        </div>
        <div className="uppercase tracking-[0.2em] text-blue-600 animate-pulse">
          Vision Link Active
        </div>
      </div>
    </div>
  );
};
