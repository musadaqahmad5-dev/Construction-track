/**
 * ARIA v2.5 Memory Indexer
 * Product: LOOK VISION v2.4
 */

import { MemoryNodeRef, MemoryDomainType } from './CivilizationMemoryTypes';

export class MemoryIndexer {
  private static domainIndex: Map<MemoryDomainType, Set<string>> = new Map();
  private static tagIndex: Map<string, Set<string>> = new Map();

  public static indexNodes(nodes: MemoryNodeRef[]): void {
    this.domainIndex.clear();
    this.tagIndex.clear();

    nodes.forEach((node) => {
      // Domain Indexing
      if (!this.domainIndex.has(node.domain)) {
        this.domainIndex.set(node.domain, new Set());
      }
      this.domainIndex.get(node.domain)!.add(node.nodeId);

      // Tag Indexing
      node.tags.forEach((tag) => {
        const cleanTag = tag.toLowerCase().trim();
        if (!this.tagIndex.has(cleanTag)) {
          this.tagIndex.set(cleanTag, new Set());
        }
        this.tagIndex.get(cleanTag)!.add(node.nodeId);
      });
    });
  }

  public static getNodesByDomain(domain: MemoryDomainType): string[] {
    const set = this.domainIndex.get(domain);
    return set ? Array.from(set) : [];
  }

  public static getNodesByTag(tag: string): string[] {
    const set = this.tagIndex.get(tag.toLowerCase().trim());
    return set ? Array.from(set) : [];
  }
}
