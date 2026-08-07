/**
 * ARIA v2.5 Civilization Knowledge Storage Adapter
 * Product: LOOK VISION v2.4
 * 
 * Manages Firestore persistence and offline local caching for Global Civilization Knowledge Nodes,
 * Knowledge Relationships, and User Personal Connections.
 * 
 * Paths:
 * - Global Nodes: global/civilization/nodes/{nodeId}
 * - Global Relationships: global/civilization/relationships/{relationshipId}
 * - Personal Connections: users/{uid}/aria/personalConnections/{connectionId}
 */

import {
  KnowledgeNode,
  KnowledgeRelationship,
  PersonalKnowledgeConnection
} from './CivilizationMemoryTypes';
import { db, isFirestoreOfflineFallbackActive } from '../../firebase';
import { doc, setDoc, getDoc, getDocs, collection, deleteDoc, serverTimestamp } from 'firebase/firestore';

const LOCAL_GLOBAL_NODES_KEY = 'aria_civ_global_nodes_v2.5';
const LOCAL_GLOBAL_RELS_KEY = 'aria_civ_global_rels_v2.5';
const LOCAL_PERSONAL_CONNS_KEY = 'aria_civ_pconns_v2.5';

export class CivilizationKnowledgeStorage {
  private static instance: CivilizationKnowledgeStorage;

  private constructor() {}

  public static getInstance(): CivilizationKnowledgeStorage {
    if (!CivilizationKnowledgeStorage.instance) {
      CivilizationKnowledgeStorage.instance = new CivilizationKnowledgeStorage();
    }
    return CivilizationKnowledgeStorage.instance;
  }

  // --- LOCAL OFFLINE CACHE METHODS ---

  public getLocalNodes(): KnowledgeNode[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_GLOBAL_NODES_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Error reading local nodes:', err);
    }
    return [];
  }

  public setLocalNodes(nodes: KnowledgeNode[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_GLOBAL_NODES_KEY, JSON.stringify(nodes));
      }
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Error saving local nodes:', err);
    }
  }

  public getLocalRelationships(): KnowledgeRelationship[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_GLOBAL_RELS_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Error reading local relationships:', err);
    }
    return [];
  }

  public setLocalRelationships(relationships: KnowledgeRelationship[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_GLOBAL_RELS_KEY, JSON.stringify(relationships));
      }
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Error saving local relationships:', err);
    }
  }

  public getLocalPersonalConnections(userId: string): PersonalKnowledgeConnection[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`${LOCAL_PERSONAL_CONNS_KEY}_${userId}`);
        if (raw) return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Error reading personal connections:', err);
    }
    return [];
  }

  public setLocalPersonalConnections(userId: string, conns: PersonalKnowledgeConnection[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${LOCAL_PERSONAL_CONNS_KEY}_${userId}`, JSON.stringify(conns));
      }
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Error saving personal connections:', err);
    }
  }

  // --- FIRESTORE PERSISTENCE ---

  /**
   * Saves a Global Knowledge Node to global/civilization/nodes/{nodeId}
   */
  public async saveKnowledgeNode(node: KnowledgeNode): Promise<void> {
    const nodes = this.getLocalNodes();
    const idx = nodes.findIndex((n) => n.id === node.id);
    if (idx >= 0) {
      nodes[idx] = node;
    } else {
      nodes.push(node);
    }
    this.setLocalNodes(nodes);

    if (isFirestoreOfflineFallbackActive || !db) return;

    try {
      const docRef = doc(db, 'global', 'civilization', 'nodes', node.id);
      await setDoc(docRef, {
        ...node,
        updatedAtServer: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Firestore save node deferred:', err);
    }
  }

  /**
   * Saves a Global Relationship to global/civilization/relationships/{relationshipId}
   */
  public async saveKnowledgeRelationship(rel: KnowledgeRelationship): Promise<void> {
    const rels = this.getLocalRelationships();
    const idx = rels.findIndex((r) => r.relationshipId === rel.relationshipId);
    if (idx >= 0) {
      rels[idx] = rel;
    } else {
      rels.push(rel);
    }
    this.setLocalRelationships(rels);

    if (isFirestoreOfflineFallbackActive || !db) return;

    try {
      const docRef = doc(db, 'global', 'civilization', 'relationships', rel.relationshipId);
      await setDoc(docRef, {
        ...rel,
        updatedAtServer: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Firestore save relationship deferred:', err);
    }
  }

  /**
   * Saves a Personal Knowledge Connection to users/{uid}/aria/personalConnections/{connectionId}
   */
  public async savePersonalConnection(userId: string, conn: PersonalKnowledgeConnection): Promise<void> {
    if (!userId || userId === 'guest_user') {
      const conns = this.getLocalPersonalConnections('guest_user');
      const idx = conns.findIndex((c) => c.connectionId === conn.connectionId);
      if (idx >= 0) conns[idx] = conn;
      else conns.push(conn);
      this.setLocalPersonalConnections('guest_user', conns);
      return;
    }

    const conns = this.getLocalPersonalConnections(userId);
    const idx = conns.findIndex((c) => c.connectionId === conn.connectionId);
    if (idx >= 0) conns[idx] = conn;
    else conns.push(conn);
    this.setLocalPersonalConnections(userId, conns);

    if (isFirestoreOfflineFallbackActive || !db) return;

    try {
      const docRef = doc(db, 'users', userId, 'aria', 'personalConnections', conn.connectionId);
      await setDoc(docRef, {
        ...conn,
        updatedAtServer: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Firestore save personal connection deferred:', err);
    }
  }

  /**
   * Fetches all Global Knowledge Nodes
   */
  public async fetchAllKnowledgeNodes(): Promise<KnowledgeNode[]> {
    const local = this.getLocalNodes();

    if (isFirestoreOfflineFallbackActive || !db) {
      return local;
    }

    try {
      const colRef = collection(db, 'global', 'civilization', 'nodes');
      const snap = await getDocs(colRef);
      const fetched: KnowledgeNode[] = [];

      snap.forEach((d) => {
        const data = d.data() as KnowledgeNode;
        if (data.id) fetched.push(data);
      });

      if (fetched.length > 0) {
        this.setLocalNodes(fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Firestore fetch nodes fallback to local:', err);
    }

    return local;
  }

  /**
   * Fetches all Global Knowledge Relationships
   */
  public async fetchAllKnowledgeRelationships(): Promise<KnowledgeRelationship[]> {
    const local = this.getLocalRelationships();

    if (isFirestoreOfflineFallbackActive || !db) {
      return local;
    }

    try {
      const colRef = collection(db, 'global', 'civilization', 'relationships');
      const snap = await getDocs(colRef);
      const fetched: KnowledgeRelationship[] = [];

      snap.forEach((d) => {
        const data = d.data() as KnowledgeRelationship;
        if (data.relationshipId) fetched.push(data);
      });

      if (fetched.length > 0) {
        this.setLocalRelationships(fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Firestore fetch relationships fallback to local:', err);
    }

    return local;
  }

  /**
   * Fetches Personal Knowledge Connections for user
   */
  public async fetchPersonalConnections(userId: string): Promise<PersonalKnowledgeConnection[]> {
    const local = this.getLocalPersonalConnections(userId);

    if (isFirestoreOfflineFallbackActive || !db || !userId || userId === 'guest_user') {
      return local;
    }

    try {
      const colRef = collection(db, 'users', userId, 'aria', 'personalConnections');
      const snap = await getDocs(colRef);
      const fetched: PersonalKnowledgeConnection[] = [];

      snap.forEach((d) => {
        const data = d.data() as PersonalKnowledgeConnection;
        if (data.connectionId) fetched.push(data);
      });

      if (fetched.length > 0) {
        this.setLocalPersonalConnections(userId, fetched);
        return fetched;
      }
    } catch (err) {
      console.warn('[CivilizationKnowledgeStorage] Firestore fetch personal connections fallback:', err);
    }

    return local;
  }
}

export const civilizationKnowledgeStorage = CivilizationKnowledgeStorage.getInstance();
