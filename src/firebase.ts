import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  getDocs, 
  serverTimestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB16h0R3b45hmp6gW8Vawi5Vq2MEZTkufY",
  authDomain: "fashion-ai-56bd2.firebaseapp.com",
  projectId: "fashion-ai-56bd2",
  storageBucket: "fashion-ai-56bd2.firebasestorage.app",
  messagingSenderId: "171082173550",
  appId: "1:171082173550:web:d9907956a44d5d1f6aaa7f",
  measurementId: "G-PJV2V6G5VG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Safely detect if LocalStorage and IndexedDB persistence are fully supported in this environment (e.g. within sandboxed iframes)
const isPersistenceSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__firebase_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return !!window.indexedDB;
  } catch (e) {
    return false;
  }
};

// Initialize Firestore with robust multi-tab offline persistence if supported, falling back cleanly to memory-only cache
export const db = initializeFirestore(app, isPersistenceSupported() ? {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
} : {});

export let isFirestoreOfflineFallbackActive = false;

export async function runPreemptiveFirestoreBootTest() {
  try {
    const testDocRef = doc(db, 'system_boot', 'test_conn');
    await getDoc(testDocRef);
  } catch (err: any) {
    isFirestoreOfflineFallbackActive = true;
    console.warn(`[Quota System] Preemptive Firestore boot-test status: Offline/Fallback mode active. (Detail: ${err?.message || err})`);
    try {
      localStorage.setItem('firestore_offline_fallback_active', 'true');
    } catch (_) {}
  }
}

// Run the boot-test immediately
runPreemptiveFirestoreBootTest();

import { ErrorRegistry } from './features/reliability/errorRegistry';

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

import { OperationType } from './core/enums';
export { OperationType };

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const rawMsg = error instanceof Error ? error.message : String(error);
  const errInfo = {
    error: rawMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      hasEmail: !!auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));

  try {
    ErrorRegistry.registerError(
      `FIRESTORE_${operationType.toUpperCase()}`,
      `Path: ${path || 'unknown'}. Error: ${rawMsg}`,
      'critical',
      'Database',
      false
    );
  } catch (e) {
    console.error('Failed to log to ErrorRegistry:', e);
  }

  throw new Error(JSON.stringify(errInfo));
}
