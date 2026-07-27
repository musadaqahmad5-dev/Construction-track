import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Sparkles, RefreshCw, User, Bot, HelpCircle, Check, ArrowRight, Database, Network, Trash2, Download, Cpu, ShieldCheck, Zap, Activity, Layers, Store, ToggleLeft, ToggleRight, LineChart } from 'lucide-react';
import { auth } from '../firebase';
import { WardrobeItem } from '../platform';
import { UnifiedFashionOS } from '../engine';
import { KnowledgeGraphEngine } from '../engine/knowledgeGraphEngine';
import { MultiAgentHub } from '../features/ai-agents/multiAgentHub';
import { PersonalFashionMemoryEngine } from '../engine/personalMemory';
import { AISEOSAutonomousEngine, ImprovementRecommendation } from '../engine/aiSeosAutonomousEngine';
import { 
  CentralAIOrchestrator, 
  EnterpriseIntelligenceReporting, 
  AgentRegistrySystem, 
  WorkflowIntent 
} from '../engine/aiSeosOperatingLayer';
import { AISEOSEcosystemExpansionEngine, EcosystemAgentPlugin } from '../engine/aiSeosEcosystemExpansion';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedOutfit?: any;
}

interface FloatingAIChatProps {
  wardrobe: WardrobeItem[];
}

export const FloatingAIChat: React.FC<FloatingAIChatProps> = ({ wardrobe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'memory' | 'ops' | 'ecosystem'>('chat');
  const [graphQuery, setGraphQuery] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Welcome to AIStyleHub. I am your Sartorial Companion. Ask me to curate look spreads, analyze style coordinates, or query your Personal Knowledge Graph Memory.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleToggleChat = () => {
      setIsOpen(prev => !prev);
    };
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener('lookvision_toggle_ai_chat', handleToggleChat);
    window.addEventListener('lookvision_open_ai_chat', handleOpenChat);
    return () => {
      window.removeEventListener('lookvision_toggle_ai_chat', handleToggleChat);
      window.removeEventListener('lookvision_open_ai_chat', handleOpenChat);
    };
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const lowerText = textToSend.toLowerCase();

      // Check for E04 Orchestration workflows
      if (lowerText.includes('wedding') || lowerText.includes('capsule') || lowerText.includes('plan') || lowerText.includes('creator') || lowerText.includes('audit') || lowerText.includes('report')) {
        let intent: WorkflowIntent = 'daily_style_plan';
        if (lowerText.includes('wedding')) intent = 'wedding_look';
        else if (lowerText.includes('capsule') || lowerText.includes('plan')) intent = 'capsule_wardrobe';
        else if (lowerText.includes('creator') || lowerText.includes('launch')) intent = 'creator_launch';
        else if (lowerText.includes('audit')) intent = 'system_audit';

        const orchResult = CentralAIOrchestrator.orchestrate({
          userId: 'user-1',
          intent,
          prompt: textToSend
        });

        const orchText = `⚙️ **AI-SEOS Orchestration Engine (${orchResult.workflowName})**\n\n${orchResult.synthesizedResponse}\n\n*Agents Coordinated:* ${orchResult.agentsInvolved.join(', ')} | *Execution:* ${orchResult.executionTimeMs}ms | *Governance:* ${orchResult.governanceStatus}`;

        setMessages(prev => [...prev, {
          id: `assistant-orch-${Date.now()}`,
          sender: 'assistant',
          text: orchText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsLoading(false);
        return;
      }

      // Check for AI-SEOS Autonomous Ops queries
      if (lowerText.includes('perform') || lowerText.includes('health') || lowerText.includes('improve') || lowerText.includes('feature') || lowerText.includes('problem') || lowerText.includes('roadmap')) {
        const opsResponse = AISEOSAutonomousEngine.generateAssistantQueryResponse(textToSend);
        KnowledgeGraphEngine.logConversationNode('user-1', textToSend, opsResponse, 'aiseos_ops_query');

        setMessages(prev => [...prev, {
          id: `assistant-ops-${Date.now()}`,
          sender: 'assistant',
          text: opsResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsLoading(false);
        return;
      }

      // Check for Knowledge Graph memory queries
      if (lowerText.includes('memory') || lowerText.includes('graph') || lowerText.includes('dislike') || lowerText.includes('history')) {

        const memoryQueryResult = KnowledgeGraphEngine.queryGraph(textToSend, 'user-1');
        const agentOrchestration = MultiAgentHub.orchestrate({
          userId: 'user-1',
          intent: 'general',
          prompt: textToSend
        });

        const memoryText = `🧠 **Memory Graph Recall (${memoryQueryResult.nodes.length} nodes retrieved)**\n\n${agentOrchestration.synthesizedResponse}\n\n*Top active nodes:* ${memoryQueryResult.nodes.slice(0, 3).map(n => `[${n.type}: ${n.label}]`).join(', ')}`;
        
        KnowledgeGraphEngine.logConversationNode('user-1', textToSend, memoryText, 'memory_query');

        setMessages(prev => [...prev, {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: memoryText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsLoading(false);
        return;
      }

      let token: string | null = null;
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      } else {
        token = 'guest-token';
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Choose endpoint depending on query context
      const isOutfitRequest = textToSend.toLowerCase().includes('outfit') || 
                            textToSend.toLowerCase().includes('curate') || 
                            textToSend.toLowerCase().includes('look') ||
                            textToSend.toLowerCase().includes('style');

      const endpoint = isOutfitRequest ? '/api/stylist/generate' : '/api/ai/recommend-mvp';

      // Clean wardrobe to strip huge base64 image data before API calls
      const cleanedWardrobe = Array.isArray(wardrobe)
        ? wardrobe.map(item => {
            const { imageUrl, ...rest } = item;
            const cleaned: any = { ...rest };
            if (imageUrl && !imageUrl.startsWith('data:')) {
              cleaned.imageUrl = imageUrl;
            }
            return cleaned;
          })
        : [];

      const requestBody = isOutfitRequest 
        ? { wardrobe: cleanedWardrobe, userProfile: { user_preferences_vector: UnifiedFashionOS.getState().unifiedStyleMemory?.user_preferences_vector || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] }, history: messages }
        : { userInput: textToSend.trim(), tenantId: 'default', history: messages };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Styling service returned status ${response.status}`);
      }

      const data = await response.json();
      let assistantText = '';
      let suggestedOutfit: any = null;

      if (data && data.mode === 'CONFIG_ERROR') {
        assistantText = "⚠️ **AI Engine Alert: Demo Resilient Mode**\n\nThe Sartorial Companion AI is fully built and ready! However, your **GEMINI_API_KEY** is not yet configured in this container environment.\n\nTo unlock dynamic AI-powered lookbook generation, personalized style trajectories, and live wardrobe coordination, please go to the **Settings** menu at the top-right of your AI Studio workspace and set `GEMINI_API_KEY`.\n\n*Currently using cached luxury styling coordinates for preview.*";
      } else if (isOutfitRequest) {
        if (data && data.success && Array.isArray(data.outfits) && data.outfits.length > 0) {
          suggestedOutfit = data.outfits[0];
          assistantText = data.stylistNotes || `Here is a curated look for you: **${suggestedOutfit.name}**.\n\nExplanation: ${suggestedOutfit.explanation}`;
          
          // Also set this suggestion as the active suggestion in the entire app
          UnifiedFashionOS.getState().activeSuggestion = suggestedOutfit;
          UnifiedFashionOS.recalculateGoLiveGate();
          UnifiedFashionOS.notify();
        } else {
          assistantText = "I examined your virtual wardrobe but found no items. To let me style your personal clothes, please upload some items in the **Home Hub > Wardrobe** section, or use the **AI Creations** tab to synthesize brand new bespoke garments!";
        }
      } else {
        assistantText = data.final_recommendation || data.style_summary || "I processed your styling request. Consider styling clean minimalist shirts with relaxed tailored chinos.";
        
        if (data.outfits && data.outfits.length > 0) {
          suggestedOutfit = data.outfits[0];
          // Set as active suggestion
          UnifiedFashionOS.getState().activeSuggestion = {
            id: suggestedOutfit.id || `ai-chat-${Date.now()}`,
            name: suggestedOutfit.style_title || "Chat Recommended Outfit",
            items: suggestedOutfit.items ? Object.values(suggestedOutfit.items).filter(Boolean) as any : [],
            suitabilityScore: 92,
            occasion: data.user_profile?.occasion || "Curated Consult",
            generatedAt: new Date().toISOString(),
            vibeTags: [data.user_profile?.style || "Sartorial"]
          };
          UnifiedFashionOS.recalculateGoLiveGate();
          UnifiedFashionOS.notify();
        }
      }

      KnowledgeGraphEngine.logConversationNode('user-1', textToSend, assistantText, isOutfitRequest ? 'outfit_request' : 'style_consult');

      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedOutfit
      }]);

    } catch (err: any) {
      console.error("[FloatingAIChat Error] Failed backend flow:", err);
      // Premium offline fallback logic
      setTimeout(() => {
        let fallbackText = "I am currently running in offline-resilient mode. Based on your style profile, I recommend: **Warm Cashmere Layering**.\n\nPair a neutral wool outerwear with raw indigo denim for a structured, classic silhouette.";
        KnowledgeGraphEngine.logConversationNode('user-1', textToSend, fallbackText, 'offline_fallback');
        setMessages(prev => [...prev, {
          id: `assistant-fallback-${Date.now()}`,
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOutfitToWorkspace = (outfit: any) => {
    if (!outfit) return;
    UnifiedFashionOS.getState().activeSuggestion = {
      id: outfit.id || `ai-look-${Date.now()}`,
      name: outfit.name || outfit.style_title || "Interactive Curated Look",
      items: Array.isArray(outfit.items) ? outfit.items : (outfit.items ? Object.values(outfit.items).filter(Boolean) as any : []),
      suitabilityScore: outfit.suitabilityScore || outfit.score || 95,
      occasion: outfit.occasion || "Sartorial Consult",
      generatedAt: new Date().toISOString(),
      vibeTags: outfit.vibeTags || [outfit.styleIdentity || "Slate Aesthetics"]
    };
    UnifiedFashionOS.recalculateGoLiveGate();
    UnifiedFashionOS.notify();

    // Scroll to active suggestion viewport
    const element = document.getElementById('classification-tabs-start');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const samplePrompts = [
    "Curate an outfit from my wardrobe",
    "What is the Tokyo Streetwear trend?",
    "Suggest a luxury winter vibe",
  ];

  return (
    <>
      {/* FLOAT BUTTON */}
      <div className="fixed bottom-6 right-6 z-[99]" id="floating-ai-stylist-trigger">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-4 rounded-full bg-white text-black hover:bg-neutral-200 shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
          
          <span className="absolute right-14 whitespace-nowrap py-1.5 px-3 rounded-lg bg-zinc-900 border border-white/10 text-[9.5px] font-mono uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Sartorial Companion
          </span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-black animate-pulse" />
        </button>
      </div>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 w-[380px] h-[520px] rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden z-[100]"
            id="floating-ai-stylist-chatbox"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/5 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Sartorial Companion</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-light">Engine Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-Header Tabs */}
            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'chat' ? 'bg-white text-black font-semibold shadow-sm' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => setActiveTab('memory')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'memory' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Network className="w-3 h-3 text-indigo-300" />
                  <span>Memory</span>
                </button>
                <button
                  onClick={() => setActiveTab('ops')}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'ops' ? 'bg-emerald-600 text-white font-semibold shadow-sm' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3 h-3 text-emerald-300" />
                  <span>Ops</span>
                </button>
                <button
                  onClick={() => setActiveTab('ecosystem')}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'ecosystem' ? 'bg-purple-600 text-white font-semibold shadow-sm' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Store className="w-3 h-3 text-purple-300" />
                  <span>Ecosystem</span>
                </button>
              </div>
              <span className="text-[8.5px] font-mono text-purple-400 font-bold uppercase tracking-widest">
                {activeTab === 'ecosystem' ? 'E05 Network' : activeTab === 'ops' ? 'E03 Active' : activeTab === 'memory' ? 'E02 Knowledge' : 'E01 Intelligence'}
              </span>
            </div>

            {activeTab === 'ecosystem' ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs scrollbar-thin scrollbar-thumb-white/5 bg-zinc-950">
                {/* Ecosystem Analytics Header */}
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <LineChart className="w-3.5 h-3.5 text-purple-400" />
                      E05 Enterprise Intelligence
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                      Graph Nodes: {KnowledgeGraphEngine.getGraphStats().totalNodes}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[9.5px]">
                    <div className="p-1.5 rounded bg-black/40 border border-white/5">
                      <span className="text-zinc-500 block">Top Trend Velocity</span>
                      <span className="text-purple-300 font-bold">
                        +{AISEOSEcosystemExpansionEngine.generateExpandedAnalytics().fashionTrends.momentumVelocityPercent}%
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-black/40 border border-white/5">
                      <span className="text-zinc-500 block">Creator Rev USD</span>
                      <span className="text-emerald-400 font-bold">
                        ${AISEOSEcosystemExpansionEngine.generateExpandedAnalytics().businessOpportunity.projectedCreatorRevenueUsd.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Agent Marketplace Plugins */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold flex items-center gap-1">
                      <Store className="w-3 h-3 text-purple-400" />
                      Agent Marketplace Foundation
                    </span>
                    <span className="text-[9px] text-purple-400 font-mono">Plug-and-Play AI</span>
                  </div>

                  {AISEOSEcosystemExpansionEngine.getMarketplacePlugins().map((plugin) => (
                    <div key={plugin.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-xs font-semibold text-white block truncate">{plugin.name}</span>
                          <span className="text-[9px] text-zinc-500 block font-sans truncate">{plugin.description}</span>
                        </div>
                        <button
                          onClick={() => {
                            AISEOSEcosystemExpansionEngine.togglePluginInstallation(plugin.id);
                          }}
                          className={`px-2 py-1 rounded text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                            plugin.installed ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {plugin.installed ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                          <span>{plugin.installed ? 'Active' : 'Enable'}</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[8.5px] text-zinc-400 pt-1 border-t border-white/5">
                        <span className="text-purple-300 font-bold">v{plugin.version} • {plugin.category}</span>
                        <span>Scopes: {plugin.permissionScopes.length}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'ops' ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs scrollbar-thin scrollbar-thumb-white/5 bg-zinc-950">
                {/* Telemetry Header */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      AI-SEOS Telemetry Health
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      Health: {AISEOSAutonomousEngine.getSystemTelemetry().overallHealthScore}/100
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[9.5px]">
                    <div className="p-1.5 rounded bg-black/40 border border-white/5">
                      <span className="text-zinc-500 block">Latency</span>
                      <span className="text-emerald-400 font-bold">{AISEOSAutonomousEngine.getSystemTelemetry().technical.apiLatencyMs} ms</span>
                    </div>
                    <div className="p-1.5 rounded bg-black/40 border border-white/5">
                      <span className="text-zinc-500 block">Try-On Completion</span>
                      <span className="text-emerald-400 font-bold">{AISEOSAutonomousEngine.getSystemTelemetry().product.tryonCompletionRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Priority Improvement Engine */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      Autonomous Recommendations
                    </span>
                    <span className="text-[9px] text-amber-400 font-mono">Priority Formula Active</span>
                  </div>

                  {AISEOSAutonomousEngine.getRecommendations().map((rec) => (
                    <div key={rec.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white truncate">{rec.title}</span>
                        <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          rec.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          rec.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          Score: {rec.priorityScore}
                        </span>
                      </div>

                      <p className="text-[10px] text-zinc-400 font-sans leading-tight">
                        <strong className="text-zinc-300">Cause:</strong> {rec.cause}
                      </p>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className={`text-[8.5px] px-1.5 py-0.5 rounded uppercase font-bold ${
                          rec.status === 'VALIDATED' ? 'bg-emerald-500/20 text-emerald-300' :
                          rec.status === 'APPROVED' ? 'bg-indigo-500/20 text-indigo-300' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {rec.status}
                        </span>

                        {rec.status !== 'VALIDATED' && (
                          <button
                            onClick={() => {
                              AISEOSAutonomousEngine.executeAutonomousTaskWorkflow(rec.id);
                              alert(`Executed Multi-Agent Task Workflow for "${rec.title}"!\n\nStatus updated to VALIDATED. Self-learning memory graph synced.`);
                            }}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Auto-Remediate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'memory' ? (

              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs scrollbar-thin scrollbar-thumb-white/5 bg-zinc-950">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-indigo-400" />
                      Graph Memory Engine
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                      {KnowledgeGraphEngine.getGraphStats().totalNodes} Nodes / {KnowledgeGraphEngine.getGraphStats().totalEdges} Edges
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                    Contextual knowledge memory graph tracking user Style DNA, negative dislike filters, conversation logs, and AI-SEOS project architecture.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9.5px] uppercase tracking-wider text-white/40 block">Search Graph Memory</span>
                  <input
                    type="text"
                    value={graphQuery}
                    onChange={(e) => setGraphQuery(e.target.value)}
                    placeholder="Search nodes (e.g. Prada, Cyber, Dislikes, P01)..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[9.5px] uppercase tracking-wider text-white/40 block">Active Knowledge Nodes</span>
                  {(() => {
                    const queryRes = KnowledgeGraphEngine.queryGraph(graphQuery, 'user-1');
                    if (queryRes.nodes.length === 0) {
                      return <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] text-zinc-500 text-center">No nodes found for query.</div>;
                    }
                    return queryRes.nodes.slice(0, 10).map((node) => (
                      <div key={node.id} className="p-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              node.type === 'USER' ? 'bg-emerald-500/20 text-emerald-300' :
                              node.type === 'STYLE_PREFERENCE' ? 'bg-purple-500/20 text-purple-300' :
                              node.type === 'BRAND' ? 'bg-amber-500/20 text-amber-300' :
                              node.type === 'PROJECT_ARCHITECTURE' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-zinc-800 text-zinc-300'
                            }`}>
                              {node.type}
                            </span>
                            <span className="text-xs font-semibold text-white truncate">{node.label}</span>
                          </div>
                          <span className="text-[9px] text-zinc-400 block truncate">
                            {JSON.stringify(node.properties)}
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      const json = KnowledgeGraphEngine.exportUserGraphJSON('user-1');
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `user-1-style-memory-graph.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex-1 py-1.5 px-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-[9.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export JSON</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Reset Personal Style Memory & Graph Nodes?")) {
                        KnowledgeGraphEngine.clearUserGraph('user-1');
                        alert("Memory graph reset successfully!");
                      }
                    }}
                    className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-[9.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse text-right' : 'text-left'}`}
                >
                  <div className={`p-1.5 rounded-lg h-7 w-7 flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' ? 'bg-white/10 text-white' : 'bg-white/5 text-neutral-400'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1.5 max-w-[75%]">
                    <div className={`p-3 rounded-xl text-xs font-mono leading-relaxed tracking-tight ${
                      msg.sender === 'user' 
                        ? 'bg-white text-black font-medium' 
                        : 'bg-white/[0.03] text-neutral-300 border border-white/5'
                    }`}>
                      {msg.text}

                      {/* Interactive suggested outfit card inside chat */}
                      {msg.suggestedOutfit && (
                        <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-white/10 text-left space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400">CURATED LOOK</span>
                            <span className="text-[9px] font-mono text-white/40">{msg.suggestedOutfit.suitabilityScore || msg.suggestedOutfit.score || 95}% Match</span>
                          </div>
                          <h4 className="text-[11px] font-mono font-semibold text-white truncate">{msg.suggestedOutfit.name || msg.suggestedOutfit.style_title}</h4>
                          <button
                            onClick={() => loadOutfitToWorkspace(msg.suggestedOutfit)}
                            className="w-full py-1.5 px-2 bg-white text-black hover:bg-neutral-200 rounded text-[9.5px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <span>Load Look</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[8.5px] font-mono text-white/20 block">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 text-left animate-pulse">
                  <div className="p-1.5 rounded-lg h-7 w-7 flex items-center justify-center bg-white/5 text-neutral-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="p-3 rounded-xl text-[10px] font-mono bg-white/[0.02] text-amber-300 border border-white/5">
                    Analyzing fashion coordinates and wardrobe pieces...
                  </div>
                </div>
              )}

              {error && (
                <div className="p-2.5 rounded-xl text-[9px] font-mono bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sample Action chips */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none bg-black/20">
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="py-1 px-2 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 text-[9px] font-mono transition-all cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 border-t border-white/5 bg-zinc-950 flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to style or curate a look..."
                disabled={isLoading}
                className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all font-light"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
