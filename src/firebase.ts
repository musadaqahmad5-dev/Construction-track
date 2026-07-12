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

// Initialize Firestore with robust multi-tab offline persistence
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

import { ErrorRegistry } from './features/reliability/errorRegistry';

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

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
