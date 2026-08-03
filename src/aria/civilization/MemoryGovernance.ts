/**
 * ARIA v2.5 Memory Governance Engine
 * Product: LOOK VISION v2.4
 */

import { MemoryNodeRef, MemoryDomainType } from './CivilizationMemoryTypes';

export class MemoryGovernance {
  public static enforcePrivacyFilter(node: MemoryNodeRef): MemoryNodeRef {
    // If domain is community_metadata, sanitize personal identifiers
    if (node.domain === 'community_metadata') {
      return {
        ...node,
        title: '[Anonymized Metadata] ' + node.title,
        summary: node.summary.replace(/guest_user|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED]')
      };
    }
    return node;
  }

  public static isDomainAccessible(domain: MemoryDomainType, userRole: string = 'user'): boolean {
    if (userRole === 'admin') return true;
    return domain !== 'community_metadata' || userRole === 'user';
  }
}
