import { RenderedLook } from '../rendering/outfitRenderer';

export interface CreatorLook {
  lookId: string;
  creatorId: string;
  title: string;
  description: string;
  originalLook: RenderedLook;
  tags: string[];
  likesCount: number;
  remixesCount: number;
  publishedDate: Date;
}

export interface CreatorCollection {
  collectionId: string;
  creatorId: string;
  name: string;
  description: string;
  lookIds: string[];
  engagementFactor: number;
  rankingScore: number;
}

export class CreatorCollections {
  private static mockLooks: CreatorLook[] = [];
  private static mockCollections: CreatorCollection[] = [
    {
      collectionId: 'col-01',
      creatorId: 'c-01',
      name: 'Autumn Copenhagen Uniforms',
      description: 'Elegant heavyweight merino layers crafted for northern windproofing.',
      lookIds: ['look-scandi-01', 'look-scandi-02'],
      engagementFactor: 89,
      rankingScore: 485
    },
    {
      collectionId: 'col-02',
      creatorId: 'c-02',
      name: 'Cybernetic Monolithic Shells',
      description: 'Fully waterproof asymmetric utility suits with tactical rigs.',
      lookIds: ['look-cyber-01'],
      engagementFactor: 95,
      rankingScore: 890
    }
  ];

  static publishLook(
    creatorId: string,
    title: string,
    description: string,
    originalLook: RenderedLook,
    tags: string[]
  ): CreatorLook {
    const newLook: CreatorLook = {
      lookId: `clook-${Date.now()}`,
      creatorId,
      title,
      description,
      originalLook,
      tags,
      likesCount: 1,
      remixesCount: 0,
      publishedDate: new Date()
    };
    this.mockLooks.unshift(newLook);
    return newLook;
  }

  static getLooksByCreator(creatorId: string): CreatorLook[] {
    return this.mockLooks.filter(l => l.creatorId === creatorId);
  }

  static getAllCreatorLooks(): CreatorLook[] {
    // Return mock looks combined are some initial static seeds
    return this.mockLooks;
  }

  static getCollections(): CreatorCollection[] {
    return this.mockCollections;
  }

  static incrementRemix(lookId: string) {
    const tgt = this.mockLooks.find(l => l.lookId === lookId);
    if (tgt) tgt.remixesCount += 1;
  }
}
