import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, 
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

// Initialize Firestore on the project's standard database
export const db = getFirestore(app);

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
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Temporary Startup Firestore Write Verification Test
async function runStartupWriteTest() {
  try {
    const testDocRef = doc(db, 'test', 'write-test-doc');
    console.log('[Firebase Write Test] Initiating write of "Fashion AI Firebase Connected" to collection: test, document: write-test-doc...');
    await setDoc(testDocRef, {
      message: "Fashion AI Firebase Connected",
      testedAt: new Date().toISOString()
    });
    console.log('[Firebase Write Test] Write completed successfully. Now verifying read back...');
    
    const snap = await getDoc(testDocRef);
    if (snap.exists() && snap.data()?.message === "Fashion AI Firebase Connected") {
      console.log('[Firebase Write Test] Verification SUCCESS! Document retrieved successfully from Firestore:', snap.data());
    } else {
      console.error('[Firebase Write Test] Verification FAILED! Retrieved document was invalid or missing.');
    }
  } catch (error) {
    console.error('[Firebase Write Test] Critical error during write/read verification:', error);
  }
}

// Execute the test immediately at startup
runStartupWriteTest();
