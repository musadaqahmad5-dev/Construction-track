/**
 * LOOK VISION v2.4 - Multi-User Reality Simulation Context
 * React Provider and Hook for switching active user personas in real-time preview mode.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DemoPersona, DemoPersonaId } from './personaSimulationTypes';
import { DEMO_PERSONAS, applyPersonaToLocalMemory, syncPersonaToFirestore } from './personaSimulationEngine';
import { useThemeIntelligence } from '../../engine/themeIntelligenceIntegration';
import { useARIAContext } from '../../aria/core/ARIAContext';
import { UserIdentityBootstrapEngine } from '../identity/UserIdentityBootstrapEngine';
import { AppOperatingMode, UserIdentityState } from '../identity/userIdentityTypes';

interface PersonaSimulationContextValue {
  activePersonaId: DemoPersonaId;
  activePersona: DemoPersona;
  allPersonas: DemoPersona[];
  setPersona: (personaId: DemoPersonaId) => Promise<void>;
  isSyncing: boolean;
  syncStatusMessage: string | null;
  operatingMode: AppOperatingMode;
  setOperatingMode: (mode: AppOperatingMode) => void;
  productionUserState: UserIdentityState | null;
}

const PersonaSimulationContext = createContext<PersonaSimulationContextValue | null>(null);

export interface PersonaSimulationProviderProps {
  children: React.ReactNode;
  initialPersonaId?: DemoPersonaId;
}

export const PersonaSimulationProvider: React.FC<PersonaSimulationProviderProps> = ({
  children,
  initialPersonaId = 'CYBER_FUTURISTIC'
}) => {
  const [operatingMode, setOperatingModeState] = useState<AppOperatingMode>(() => UserIdentityBootstrapEngine.getOperatingMode());
  const [productionUserState, setProductionUserState] = useState<UserIdentityState | null>(() => UserIdentityBootstrapEngine.getActiveUserState());

  const [activePersonaId, setActivePersonaId] = useState<DemoPersonaId>(() => {
    try {
      const stored = localStorage.getItem('active_persona_id') as DemoPersonaId;
      if (stored && (stored === 'LUXURY_MINIMALIST' || stored === 'CYBER_FUTURISTIC' || stored === 'NATURE_ORGANIC')) {
        return stored;
      }
    } catch (e) {
      // Ignored
    }
    return initialPersonaId;
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);

  // Access system providers safely
  const themeIntelligence = useThemeIntelligence();
  const ariaContext = useARIAContext();

  const allPersonas = useMemo(() => Object.values(DEMO_PERSONAS), []);

  const setOperatingMode = useCallback((mode: AppOperatingMode) => {
    UserIdentityBootstrapEngine.setOperatingMode(mode);
    setOperatingModeState(mode);
  }, []);

  // Listen to user identity ready events from UserIdentityBootstrapEngine
  useEffect(() => {
    const handleIdentityReady = (e: Event) => {
      const customEvent = e as CustomEvent<UserIdentityState>;
      if (customEvent.detail) {
        setProductionUserState(customEvent.detail);
      }
    };
    const handleModeChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode: AppOperatingMode }>;
      if (customEvent.detail?.mode) {
        setOperatingModeState(customEvent.detail.mode);
      }
    };
    window.addEventListener('lookvision_user_identity_ready', handleIdentityReady);
    window.addEventListener('lookvision_operating_mode_changed', handleModeChanged);
    return () => {
      window.removeEventListener('lookvision_user_identity_ready', handleIdentityReady);
      window.removeEventListener('lookvision_operating_mode_changed', handleModeChanged);
    };
  }, []);

  const activePersona = useMemo(() => {
    if (operatingMode === 'PRODUCTION_USER' && productionUserState) {
      return {
        id: 'CUSTOM' as DemoPersonaId,
        userId: productionUserState.identity.uid,
        name: productionUserState.identity.displayName,
        avatar: productionUserState.identity.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${productionUserState.identity.uid}`,
        roleTitle: 'Authenticated User (Production Identity)',
        bio: 'Real Production User Identity initialized via Firebase Auth & Firestore Bootstrap Engine.',
        styleDNA: productionUserState.styleDNA,
        themeProfile: productionUserState.themeProfile,
        ariaProfile: productionUserState.ariaProfile,
        wardrobePreset: []
      };
    }
    if (activePersonaId === 'CUSTOM') {
      return DEMO_PERSONAS.CYBER_FUTURISTIC;
    }
    return DEMO_PERSONAS[activePersonaId] || DEMO_PERSONAS.CYBER_FUTURISTIC;
  }, [operatingMode, productionUserState, activePersonaId]);

  const setPersona = useCallback(async (personaId: DemoPersonaId) => {
    if (personaId === 'CUSTOM') {
      setActivePersonaId('CUSTOM');
      return;
    }

    const targetPersona = DEMO_PERSONAS[personaId];
    if (!targetPersona) return;

    setIsSyncing(true);
    setSyncStatusMessage(`Adapting workspace shell to ${targetPersona.name}...`);

    try {
      // 1. Sync Style DNA & memory vectors
      applyPersonaToLocalMemory(targetPersona);

      // 2. Switch Theme Intelligence visual tokens & coat renderer
      if (themeIntelligence?.switchTheme) {
        await themeIntelligence.switchTheme(targetPersona.themeProfile.activeThemeName);
      }

      // 3. Adapt ARIA Context & reasoning mode
      if (ariaContext?.updateContext) {
        ariaContext.updateContext({
          userId: targetPersona.userId,
          currentWorkspace: targetPersona.ariaProfile.activeWorkspace,
          lastUpdated: new Date().toISOString()
        });
      }

      // 4. Update ARIA style DNA profile
      if (ariaContext?.updateStyleDNA) {
        await ariaContext.updateStyleDNA({
          identityName: targetPersona.name,
          metadata: {
            primaryVibe: targetPersona.styleDNA.primaryVibe,
            formalityPreference: targetPersona.styleDNA.formalityPreference,
            experimentalIndex: targetPersona.styleDNA.experimentalIndex,
            favColors: targetPersona.styleDNA.favColors,
            favGarmentTypes: targetPersona.styleDNA.favGarmentTypes
          }
        });
      }

      // 5. Fire background Firestore readiness sync
      const res = await syncPersonaToFirestore(targetPersona);
      setSyncStatusMessage(res.message);

      setActivePersonaId(personaId);

      // 6. Broadcast global event so AIStyleHub & sub-views immediately re-render wardrobe & recommendations
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lookvision_persona_changed', {
          detail: targetPersona
        }));
      }
    } catch (err: any) {
      console.error('[PersonaSimulationContext] Error changing persona:', err);
      setSyncStatusMessage(`Applied ${targetPersona.name} with local resilience.`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMessage(null), 3000);
    }
  }, [themeIntelligence, ariaContext]);

  // Initial sync on mount
  useEffect(() => {
    if (activePersonaId !== 'CUSTOM' && DEMO_PERSONAS[activePersonaId]) {
      const target = DEMO_PERSONAS[activePersonaId];
      applyPersonaToLocalMemory(target);
    }
  }, []);

  const value = useMemo(() => ({
    activePersonaId,
    activePersona,
    allPersonas,
    setPersona,
    isSyncing,
    syncStatusMessage,
    operatingMode,
    setOperatingMode,
    productionUserState
  }), [activePersonaId, activePersona, allPersonas, setPersona, isSyncing, syncStatusMessage, operatingMode, setOperatingMode, productionUserState]);

  return (
    <PersonaSimulationContext.Provider value={value}>
      {children}
    </PersonaSimulationContext.Provider>
  );
};

export const usePersonaSimulation = (): PersonaSimulationContextValue => {
  const ctx = useContext(PersonaSimulationContext);
  if (!ctx) {
    throw new Error('usePersonaSimulation must be used within a PersonaSimulationProvider');
  }
  return ctx;
};
