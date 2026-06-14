import { db, auth } from '../../firebase';

export interface CodeEvidence {
  systemLabel: string;
  isVerifiedReal: boolean;
  activeHandler: string;
  debugDump: any;
}

export class EvidenceCollector {
  /**
   * Evaluates active system properties programmatically.
   */
  static collectEvidence(): CodeEvidence[] {
    const list: CodeEvidence[] = [];

    // 1. Firebase Authentication
    list.push({
      systemLabel: 'Google Account Auth Ingress',
      isVerifiedReal: !!auth,
      activeHandler: auth ? 'firebase/auth::AuthInstance' : 'Mock/Offline',
      debugDump: { tenant: auth?.config?.authDomain || 'offline' }
    });

    // 2. Cloud Firestore Database
    list.push({
      systemLabel: 'Durable Cloud Persistence',
      isVerifiedReal: !!db,
      activeHandler: db ? 'firebase/firestore::FirestoreInstance' : 'Mock/Offline',
      debugDump: { databaseId: '(default)' }
    });

    // 3. Gemini API Key
    const hasGeminiKey = typeof process !== 'undefined' && !!process.env?.GEMINI_API_KEY;
    list.push({
      systemLabel: 'Server-Side Gemini LLM Core',
      isVerifiedReal: hasGeminiKey,
      activeHandler: hasGeminiKey ? 'process.env.GEMINI_API_KEY' : 'Offline Solver / fallback',
      debugDump: { keyPresent: hasGeminiKey }
    });

    // 4. File-system Camera Handle
    const hasMedia = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
    list.push({
      systemLabel: 'Ingestion Media Stream Capture',
      isVerifiedReal: hasMedia,
      activeHandler: hasMedia ? 'navigator.mediaDevices.getUserMedia' : 'File Fallback Only',
      debugDump: { browserSupport: hasMedia }
    });

    return list;
  }
}
