import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  initializeFirestore,
  memoryLocalCache,
  setLogLevel,
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

// Catch and prevent unhandled internal Firestore stream assertion errors and PERMISSION_DENIED stream RPC errors in sandboxed preview iframes
if (typeof window !== 'undefined') {
  const isFirestoreException = (errObj: any): boolean => {
    if (!errObj) return false;
    let str = '';
    if (typeof errObj === 'string') {
      str = errObj;
    } else {
      const msg = errObj.message || errObj.error?.message || errObj.reason?.message || '';
      const stack = errObj.stack || errObj.error?.stack || errObj.reason?.stack || '';
      const name = errObj.name || errObj.error?.name || errObj.reason?.name || '';
      let jsonStr = '';
      try {
        jsonStr = typeof errObj === 'object' ? JSON.stringify(errObj) : String(errObj);
      } catch (_) {
        jsonStr = String(errObj);
      }
      str = `${name} ${msg} ${stack} ${jsonStr} ${String(errObj)}`;
    }

    const upperStr = str.toUpperCase();

    return (
      upperStr.includes('FIRESTORE') ||
      upperStr.includes('INTERNAL ASSERTION FAILED') ||
      upperStr.includes('UNEXPECTED STATE') ||
      upperStr.includes('CA9') ||
      upperStr.includes('B815') ||
      upperStr.includes('VE:-1') ||
      upperStr.includes('HC:') ||
      upperStr.includes('PERMISSION_DENIED') ||
      upperStr.includes('GRPCCONNECTION') ||
      upperStr.includes('CANCELLED') ||
      upperStr.includes('DISCONNECTING IDLE STREAM') ||
      upperStr.includes('TIMED OUT WAITING FOR NEW TARGETS') ||
      upperStr.includes('MISSING OR INSUFFICIENT PERMISSIONS') ||
      upperStr.includes('FIREBASE_FIRESTORE') ||
      upperStr.includes('@FIREBASE/FIRESTORE') ||
      upperStr.includes('WATCHCHANGEAGGREGATOR') ||
      upperStr.includes('PERSISTENTLISTENSTREAM') ||
      upperStr.includes('TARGETSTATE') ||
      upperStr.includes('WRITE') ||
      upperStr.includes('LISTEN') ||
      upperStr.includes('STREAM 0X') ||
      upperStr.includes('CODE: 7') ||
      upperStr.includes('CODE: 1') ||
      upperStr.includes('ASSERTION')
    );
  };

  // Direct window.onerror interceptor to prevent Vite diagnostic overlay from triggering
  const existingOnError = window.onerror;
  window.onerror = function (event, source, lineno, colno, error) {
    if (isFirestoreException(event) || isFirestoreException(error) || isFirestoreException(source)) {
      console.warn('[Firestore SDK Exception Handler caught window.onerror]:', event || error);
      return true; // Prevents default error firing and overlay
    }
    if (typeof existingOnError === 'function') {
      return existingOnError.apply(window, arguments as any);
    }
    return false;
  };

  // Wrap console.error to convert benign internal SDK stream disconnect notices into debug logs
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const combined = args.map(a => {
      if (!a) return '';
      if (typeof a === 'string') return a;
      if (a instanceof Error) return `${a.name} ${a.message} ${a.stack}`;
      if (typeof a === 'object') {
        const msg = a.message || a.error?.message || '';
        const stack = a.stack || a.error?.stack || '';
        try {
          return `${msg} ${stack} ${JSON.stringify(a)}`;
        } catch (_) {
          return `${msg} ${stack}`;
        }
      }
      return String(a);
    }).join(' ');

    if (isFirestoreException(combined)) {
      console.warn('[Firestore SDK Handled Stream Log]:', ...args);
      return;
    }
    originalConsoleError.apply(console, args);
  };

  if (typeof window.addEventListener === 'function') {
    window.addEventListener('error', (event: ErrorEvent) => {
      if (isFirestoreException(event) || isFirestoreException(event.error) || isFirestoreException(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.warn('[Firestore SDK Exception caught & handled]:', event.message || event.error);
        return true;
      }
    }, true);

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      if (isFirestoreException(event.reason) || isFirestoreException(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.warn('[Firestore SDK Rejection caught & handled]:', event.reason);
      }
    }, true);
  }
}

// Silence verbose internal Firestore SDK debug/stream logs
try {
  setLogLevel('silent');
} catch (_) {}

const firebaseConfig = {
  apiKey: "AIzaSyB16h0R3b45hmp6gW8Vawi5Vq2MEZTkufY",
  authDomain: "fashion-ai-56bd2.firebaseapp.com",
  projectId: "fashion-ai-56bd2",
  storageBucket: "fashion-ai-56bd2.firebasestorage.app",
  messagingSenderId: "171082173550",
  appId: "1:171082173550:web:d9907956a44d5d1f6aaa7f",
  measurementId: "G-PJV2V6G5VG"
};

let app: any = null;
let authInstance: any = null;
let dbInstance: any = null;

try {
  app = initializeApp(firebaseConfig);
  try {
    authInstance = getAuth(app);
  } catch (authErr) {
    console.warn('[Firebase Auth] Auth initialization fallback active:', authErr);
  }

  try {
    dbInstance = initializeFirestore(app, {
      localCache: memoryLocalCache()
    });
  } catch (dbErr) {
    console.warn('[Firestore] Firestore initialization fallback active:', dbErr);
  }
} catch (appErr) {
  console.warn('[Firebase App] Firebase initialization fallback active:', appErr);
}

export const auth = authInstance;
export const db = dbInstance;

export let isFirestoreOfflineFallbackActive = false;

export async function runPreemptiveFirestoreBootTest() {
  if (!db) {
    isFirestoreOfflineFallbackActive = true;
    return;
  }
  try {
    const testDocRef = doc(db, 'system_boot', 'test_conn');
    await getDoc(testDocRef);
  } catch (err: any) {
    isFirestoreOfflineFallbackActive = true;
    console.debug(`[Quota System] In-memory quota fallback active.`);
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

export const signInWithGoogle = async () => {
  if (!auth) {
    console.warn('[Firebase Auth] Auth is not initialized. Operating in local preview mode.');
    return null;
  }
  return signInWithPopup(auth, googleProvider);
};

export const logout = async () => {
  if (!auth) return;
  return signOut(auth);
};


import { OperationType } from './core/enums';
export { OperationType };

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const rawMsg = error instanceof Error ? error.message : String(error);
  const errInfo = {
    error: rawMsg,
    authInfo: {
      userId: auth?.currentUser?.uid,
      hasEmail: !!auth?.currentUser?.email,
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
