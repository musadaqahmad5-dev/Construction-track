/**
 * ARIA v3.0 Prediction Storage Adapter
 * Product: LOOK VISION v2.4
 * 
 * Manages Firestore persistence and offline local caching for ARIA Simulations and Trend Forecasts.
 * Paths:
 * - User Predictions: users/{uid}/aria/predictions/{predictionId}
 * - Global Trends: global/aria/trendForecasts/{forecastId}
 * - Offline Cache: aria_prediction_cache_v3.0
 */

import { SimulationScenario, TrendForecast } from './PredictiveTypes';
import { db, isFirestoreOfflineFallbackActive } from '../../firebase';
import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';

const LOCAL_PREDICTION_CACHE_KEY = 'aria_prediction_cache_v3.0';

export class PredictionStorage {
  private static instance: PredictionStorage;

  private constructor() {}

  public static getInstance(): PredictionStorage {
    if (!PredictionStorage.instance) {
      PredictionStorage.instance = new PredictionStorage();
    }
    return PredictionStorage.instance;
  }

  public getLocalSimulations(): SimulationScenario[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_PREDICTION_CACHE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[PredictionStorage] Error reading local simulation cache:', err);
    }
    return [];
  }

  public setLocalSimulations(simulations: SimulationScenario[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_PREDICTION_CACHE_KEY, JSON.stringify(simulations.slice(0, 50)));
      }
    } catch (err) {
      console.warn('[PredictionStorage] Error saving local simulation cache:', err);
    }
  }

  public async saveSimulation(userId: string, scenario: SimulationScenario): Promise<void> {
    const local = this.getLocalSimulations();
    local.unshift(scenario);
    this.setLocalSimulations(local);

    if (isFirestoreOfflineFallbackActive || !db || !userId) return;

    try {
      const userRef = doc(db, 'users', userId, 'aria', 'predictions', scenario.scenarioId);
      await setDoc(userRef, {
        ...scenario,
        savedAt: serverTimestamp()
      }, { merge: true });

      // Save trend forecasts globally
      if (scenario.trendForecasts && scenario.trendForecasts.length > 0) {
        for (const tf of scenario.trendForecasts) {
          const globalRef = doc(db, 'global', 'aria', 'trendForecasts', tf.forecastId);
          await setDoc(globalRef, {
            ...tf,
            updatedAt: serverTimestamp()
          }, { merge: true }).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('[PredictionStorage] Firestore sync skipped:', err);
    }
  }

  public async fetchSimulations(userId: string): Promise<SimulationScenario[]> {
    const local = this.getLocalSimulations();
    if (isFirestoreOfflineFallbackActive || !db || !userId) return local;

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'predictions');
      const snap = await getDocs(colRef);
      const fetched: SimulationScenario[] = [];

      snap.forEach((d) => {
        fetched.push(d.data() as SimulationScenario);
      });

      if (fetched.length > 0) {
        fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.setLocalSimulations(fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[PredictionStorage] Firestore fetch fallback:', err);
    }

    return local;
  }
}

export const predictionStorage = PredictionStorage.getInstance();
