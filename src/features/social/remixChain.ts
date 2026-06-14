export interface RemixNode {
  lookId: string;
  parentId?: string;
  creatorId: string;
  generationIndex: number; // For tracking depth (e.g., 1st gen fork, 2nd gen fork)
  divergencePercentage: number; // divergence factors
  timestamp: Date;
}

export class RemixChain {
  private static chainMap: { [lookId: string]: RemixNode } = {
    'remix-root': {
      lookId: 'remix-root',
      creatorId: 'c-01',
      generationIndex: 0,
      divergencePercentage: 0,
      timestamp: new Date(Date.now() - 86400000 * 3)
    }
  };

  static registerRemixFork(
    lookId: string,
    parentId: string,
    creatorId: string,
    divergencePercentage: number
  ): RemixNode {
    const parentNode = this.chainMap[parentId];
    const gen = parentNode ? parentNode.generationIndex + 1 : 1;

    const node: RemixNode = {
      lookId,
      parentId,
      creatorId,
      generationIndex: gen,
      divergencePercentage,
      timestamp: new Date()
    };

    this.chainMap[lookId] = node;
    return node;
  }

  static getGeneandAncestry(lookId: string): RemixNode[] {
    const lineage: RemixNode[] = [];
    let currentId: string | undefined = lookId;

    while (currentId && this.chainMap[currentId]) {
      const node = this.chainMap[currentId];
      lineage.unshift(node); // newest at end
      currentId = node.parentId;
    }

    return lineage;
  }
}
