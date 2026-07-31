import {
  AIProvider,
  NormalizedGenerationResult
} from './aiProviderAdapter';

import {
  PromptPackage
} from './themePromptBuilder';

import {
  ThemeExecutionResult
} from './themeOrchestrator';

import {
  GenerationSession
} from './generationSessionManager';

export type AssetType =
  | 'image'
  | 'video'
  | 'transparent_png'
  | 'mask'
  | 'thumbnail'
  | 'reference_image'
  | 'style_reference'
  | 'character_reference'
  | 'moodboard'
  | 'preview';

export type AssetStatus = 'pending' | 'processing' | 'ready' | 'archived' | 'deleted' | 'failed';

export type AssetVisibility = 'private' | 'workspace' | 'public';

export interface AssetFileInfo {
  url: string;
  thumbnailUrl: string;
  previewUrl?: string;
  width: number;
  height: number;
  fileSizeBytes: number;
  mimeType: string;
  format: string;
  hash: string;
}

export interface AssetUsageStats {
  views: number;
  downloads: number;
  shares: number;
  edits: number;
  regenerations: number;
  referenceUsage: number;
  lastAccessedAt: number;
}

export interface AssetVersion {
  versionId: string;
  versionNumber: number;
  timestamp: number;
  fileInfo: AssetFileInfo;
  promptPackage?: PromptPackage;
  seed: number;
  notes?: string;
}

export interface AssetMetadata {
  fusedConcept: string;
  primaryEntity: string;
  category: string;
  mood: string;
  dominantColor: string;
  cameraStyle: string;
  lightingStyle: string;
  materialProfile: string;
  behaviourProfile: string;
  environmentBackground: string;
  provider: AIProvider;
  seed: number;
  generationCost: number;
  generationTimeMs: number;
  promptPackage?: PromptPackage;
  themeExecutionResult?: ThemeExecutionResult;
}

export interface Asset {
  id: string;
  sessionId: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  assetType: AssetType;
  provider: AIProvider;
  status: AssetStatus;
  metadata: AssetMetadata;
  fileInfo: AssetFileInfo;
  versions: AssetVersion[];
  activeVersionId: string;
  tags: string[];
  collections: string[];
  favorite: boolean;
  visibility: AssetVisibility;
  usageStats: AssetUsageStats;
}

export interface AssetCollection {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  coverAssetId?: string;
  assetCount: number;
}

export interface AssetSearchQuery {
  queryText?: string;
  theme?: string;
  provider?: AIProvider;
  entity?: string;
  tag?: string;
  color?: string;
  material?: string;
  mood?: string;
  assetType?: AssetType;
  collectionId?: string;
  startDate?: number;
  endDate?: number;
  status?: AssetStatus;
  favorite?: boolean;
}

export interface AssetLibraryStatistics {
  totalAssets: number;
  imageCount: number;
  videoCount: number;
  referenceCount: number;
  totalCollections: number;
  storageUsageBytes: number;
  providerUsage: Record<AIProvider, number>;
  mostUsedThemes: Array<{ theme: string; count: number }>;
  mostUsedMaterials: Array<{ material: string; count: number }>;
  mostUsedColors: Array<{ color: string; count: number }>;
  favoriteCount: number;
}

export interface AssetLibrarySnapshot {
  timestamp: number;
  assets: Asset[];
  collections: AssetCollection[];
}

export interface AssetLibraryEventListener {
  onAssetCreated?: (asset: Asset) => void;
  onAssetUpdated?: (asset: Asset) => void;
  onAssetDeleted?: (assetId: string) => void;
  onAssetArchived?: (asset: Asset) => void;
  onCollectionCreated?: (collection: AssetCollection) => void;
  onCollectionUpdated?: (collection: AssetCollection) => void;
  onCollectionDeleted?: (collectionId: string) => void;
}

export class AssetLibraryEngine {
  private assets: Map<string, Asset> = new Map();
  private collections: Map<string, AssetCollection> = new Map();
  private listeners: Set<AssetLibraryEventListener> = new Set();

  public addListener(listener: AssetLibraryEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public createAssetFromGeneration(
    generationResult: NormalizedGenerationResult,
    session?: GenerationSession,
    assetType: AssetType = 'image'
  ): Asset {
    const assetId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = Date.now();

    const url = generationResult.primaryImageUrl;
    const hash = `hash_${generationResult.seed}_${generationResult.generationId}`;

    const fileInfo: AssetFileInfo = {
      url,
      thumbnailUrl: url,
      previewUrl: url,
      width: 1024,
      height: 1024,
      fileSizeBytes: 1048576,
      mimeType: 'image/webp',
      format: 'webp',
      hash
    };

    const metadata: AssetMetadata = {
      fusedConcept: generationResult.metadata.fusedConcept || 'Theme Synthesis',
      primaryEntity: generationResult.metadata.primaryEntity || 'Identity',
      category: generationResult.metadata.category || 'Fashion',
      mood: generationResult.metadata.mood || 'Luxury',
      dominantColor: generationResult.metadata.dominantColor || '#0a192f',
      cameraStyle: session?.executionResult.cameraComposition.cameraStyle || 'Cinematic',
      lightingStyle: session?.executionResult.lighting.style || 'Specular Ray',
      materialProfile: session?.executionResult.materials.primaryMaterial || 'Silk Satin',
      behaviourProfile: session?.executionResult.behaviours[0]?.primaryBehaviour || 'Static Luminance',
      environmentBackground: session?.executionResult.environment.background || 'Cosmic Void',
      provider: generationResult.provider,
      seed: generationResult.seed,
      generationCost: generationResult.costEstimate,
      generationTimeMs: generationResult.generationTimeMs,
      promptPackage: session?.promptPackage,
      themeExecutionResult: session?.executionResult
    };

    const initialVersion: AssetVersion = {
      versionId: `v1_${now}`,
      versionNumber: 1,
      timestamp: now,
      fileInfo,
      promptPackage: session?.promptPackage,
      seed: generationResult.seed,
      notes: 'Initial generation output'
    };

    const autoTags = Array.from(new Set([
      metadata.category,
      metadata.mood,
      metadata.dominantColor,
      metadata.materialProfile,
      generationResult.provider,
      assetType
    ]));

    const usageStats: AssetUsageStats = {
      views: 1,
      downloads: 0,
      shares: 0,
      edits: 0,
      regenerations: 0,
      referenceUsage: 0,
      lastAccessedAt: now
    };

    const asset: Asset = {
      id: assetId,
      sessionId: session?.id || 'standalone',
      userId: session?.userId || 'guest_user',
      createdAt: now,
      updatedAt: now,
      assetType,
      provider: generationResult.provider,
      status: 'ready',
      metadata,
      fileInfo,
      versions: [initialVersion],
      activeVersionId: initialVersion.versionId,
      tags: autoTags,
      collections: [],
      favorite: false,
      visibility: 'private',
      usageStats
    };

    this.assets.set(assetId, asset);
    this.notifyAssetCreated(asset);
    return asset;
  }

  public getAsset(assetId: string): Asset | undefined {
    const asset = this.assets.get(assetId);
    if (asset) {
      asset.usageStats.views++;
      asset.usageStats.lastAccessedAt = Date.now();
    }
    return asset;
  }

  public updateAsset(assetId: string, updates: Partial<Asset>): Asset | undefined {
    const asset = this.assets.get(assetId);
    if (!asset) return undefined;

    const updated: Asset = {
      ...asset,
      ...updates,
      updatedAt: Date.now()
    };

    this.assets.set(assetId, updated);
    this.notifyAssetUpdated(updated);
    return updated;
  }

  public deleteAsset(assetId: string): boolean {
    const asset = this.assets.get(assetId);
    if (!asset) return false;

    const removed = this.assets.delete(assetId);
    if (removed) {
      for (const collection of this.collections.values()) {
        if (collection.coverAssetId === assetId) {
          collection.coverAssetId = undefined;
        }
      }
      this.updateCollectionCounts();
      this.notifyAssetDeleted(assetId);
    }
    return removed;
  }

  public archiveAsset(assetId: string): boolean {
    const asset = this.assets.get(assetId);
    if (!asset) return false;

    asset.status = 'archived';
    asset.updatedAt = Date.now();
    this.notifyAssetArchived(asset);
    this.notifyAssetUpdated(asset);
    return true;
  }

  public restoreAsset(assetId: string): boolean {
    const asset = this.assets.get(assetId);
    if (!asset || asset.status !== 'archived') return false;

    asset.status = 'ready';
    asset.updatedAt = Date.now();
    this.notifyAssetUpdated(asset);
    return true;
  }

  public duplicateAsset(assetId: string): Asset | undefined {
    const original = this.assets.get(assetId);
    if (!original) return undefined;

    const duplicatedId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = Date.now();

    const duplicated: Asset = {
      ...original,
      id: duplicatedId,
      createdAt: now,
      updatedAt: now,
      tags: [...original.tags, 'duplicate'],
      usageStats: {
        views: 0,
        downloads: 0,
        shares: 0,
        edits: 0,
        regenerations: 0,
        referenceUsage: 0,
        lastAccessedAt: now
      }
    };

    this.assets.set(duplicatedId, duplicated);
    this.notifyAssetCreated(duplicated);
    return duplicated;
  }

  public createVersion(
    assetId: string,
    fileInfo: AssetFileInfo,
    seed: number,
    promptPackage?: PromptPackage,
    notes?: string
  ): AssetVersion | undefined {
    const asset = this.assets.get(assetId);
    if (!asset) return undefined;

    const versionNumber = asset.versions.length + 1;
    const version: AssetVersion = {
      versionId: `v${versionNumber}_${Date.now()}`,
      versionNumber,
      timestamp: Date.now(),
      fileInfo,
      promptPackage,
      seed,
      notes
    };

    asset.versions.push(version);
    asset.activeVersionId = version.versionId;
    asset.fileInfo = fileInfo;
    asset.updatedAt = Date.now();

    this.notifyAssetUpdated(asset);
    return version;
  }

  public restoreVersion(assetId: string, versionId: string): boolean {
    const asset = this.assets.get(assetId);
    if (!asset) return false;

    const version = asset.versions.find(v => v.versionId === versionId);
    if (!version) return false;

    asset.activeVersionId = version.versionId;
    asset.fileInfo = version.fileInfo;
    asset.updatedAt = Date.now();

    this.notifyAssetUpdated(asset);
    return true;
  }

  public deleteVersion(assetId: string, versionId: string): boolean {
    const asset = this.assets.get(assetId);
    if (!asset || asset.versions.length <= 1) return false;

    const idx = asset.versions.findIndex(v => v.versionId === versionId);
    if (idx === -1) return false;

    asset.versions.splice(idx, 1);
    if (asset.activeVersionId === versionId) {
      const active = asset.versions[asset.versions.length - 1];
      asset.activeVersionId = active.versionId;
      asset.fileInfo = active.fileInfo;
    }

    asset.updatedAt = Date.now();
    this.notifyAssetUpdated(asset);
    return true;
  }

  public createCollection(name: string, description: string = '', parentId?: string): AssetCollection {
    const collectionId = `col_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = Date.now();

    const collection: AssetCollection = {
      id: collectionId,
      name,
      description,
      parentId,
      createdAt: now,
      updatedAt: now,
      tags: [name.toLowerCase()],
      assetCount: 0
    };

    this.collections.set(collectionId, collection);
    this.notifyCollectionCreated(collection);
    return collection;
  }

  public renameCollection(collectionId: string, newName: string, newDescription?: string): boolean {
    const collection = this.collections.get(collectionId);
    if (!collection) return false;

    collection.name = newName;
    if (newDescription !== undefined) {
      collection.description = newDescription;
    }
    collection.updatedAt = Date.now();

    this.notifyCollectionUpdated(collection);
    return true;
  }

  public deleteCollection(collectionId: string): boolean {
    const collection = this.collections.get(collectionId);
    if (!collection) return false;

    for (const asset of this.assets.values()) {
      asset.collections = asset.collections.filter(cId => cId !== collectionId);
    }

    const removed = this.collections.delete(collectionId);
    if (removed) {
      this.notifyCollectionDeleted(collectionId);
    }
    return removed;
  }

  public moveAssetsToCollection(assetIds: string[], collectionId: string): void {
    const collection = this.collections.get(collectionId);
    if (!collection) return;

    for (const assetId of assetIds) {
      const asset = this.assets.get(assetId);
      if (asset && !asset.collections.includes(collectionId)) {
        asset.collections.push(collectionId);
        if (!collection.coverAssetId) {
          collection.coverAssetId = asset.id;
        }
      }
    }

    this.updateCollectionCounts();
  }

  public addTags(assetId: string, tags: string[]): boolean {
    const asset = this.assets.get(assetId);
    if (!asset) return false;

    const existing = new Set(asset.tags);
    for (const t of tags) {
      existing.add(t.toLowerCase().trim());
    }
    asset.tags = Array.from(existing);
    asset.updatedAt = Date.now();

    this.notifyAssetUpdated(asset);
    return true;
  }

  public removeTags(assetId: string, tags: string[]): boolean {
    const asset = this.assets.get(assetId);
    if (!asset) return false;

    const toRemove = new Set(tags.map(t => t.toLowerCase().trim()));
    asset.tags = asset.tags.filter(t => !toRemove.has(t));
    asset.updatedAt = Date.now();

    this.notifyAssetUpdated(asset);
    return true;
  }

  public toggleFavorite(assetId: string): boolean {
    const asset = this.assets.get(assetId);
    if (!asset) return false;

    asset.favorite = !asset.favorite;
    asset.updatedAt = Date.now();

    this.notifyAssetUpdated(asset);
    return asset.favorite;
  }

  public searchAssets(query: AssetSearchQuery): Asset[] {
    return Array.from(this.assets.values()).filter(asset => {
      if (query.status && asset.status !== query.status) return false;
      if (query.favorite !== undefined && asset.favorite !== query.favorite) return false;
      if (query.provider && asset.provider !== query.provider) return false;
      if (query.assetType && asset.assetType !== query.assetType) return false;
      if (query.collectionId && !asset.collections.includes(query.collectionId)) return false;

      if (query.queryText) {
        const text = query.queryText.toLowerCase();
        const matchesConcept = asset.metadata.fusedConcept.toLowerCase().includes(text);
        const matchesEntity = asset.metadata.primaryEntity.toLowerCase().includes(text);
        const matchesTags = asset.tags.some(t => t.toLowerCase().includes(text));
        if (!matchesConcept && !matchesEntity && !matchesTags) return false;
      }

      if (query.theme && !asset.metadata.fusedConcept.toLowerCase().includes(query.theme.toLowerCase())) {
        return false;
      }
      if (query.entity && !asset.metadata.primaryEntity.toLowerCase().includes(query.entity.toLowerCase())) {
        return false;
      }
      if (query.color && !asset.metadata.dominantColor.toLowerCase().includes(query.color.toLowerCase())) {
        return false;
      }
      if (query.material && !asset.metadata.materialProfile.toLowerCase().includes(query.material.toLowerCase())) {
        return false;
      }
      if (query.mood && !asset.metadata.mood.toLowerCase().includes(query.mood.toLowerCase())) {
        return false;
      }
      if (query.tag && !asset.tags.some(t => t.toLowerCase() === query.tag!.toLowerCase())) {
        return false;
      }
      if (query.startDate && asset.createdAt < query.startDate) return false;
      if (query.endDate && asset.createdAt > query.endDate) return false;

      return true;
    });
  }

  public detectDuplicates(assetId: string): Asset[] {
    const target = this.assets.get(assetId);
    if (!target) return [];

    return Array.from(this.assets.values()).filter(other => {
      if (other.id === target.id) return false;
      if (other.fileInfo.hash === target.fileInfo.hash) return true;
      if (
        other.metadata.fusedConcept === target.metadata.fusedConcept &&
        other.metadata.seed === target.metadata.seed &&
        other.provider === target.provider
      ) {
        return true;
      }
      return false;
    });
  }

  public getStatistics(): AssetLibraryStatistics {
    const all = Array.from(this.assets.values());
    const totalAssets = all.length;
    let imageCount = 0;
    let videoCount = 0;
    let referenceCount = 0;
    let favoriteCount = 0;
    let storageUsageBytes = 0;

    const providerUsage: Record<AIProvider, number> = {
      gemini: 0,
      imagen: 0,
      sdxl: 0,
      flux: 0,
      generic: 0
    };

    const themeMap = new Map<string, number>();
    const materialMap = new Map<string, number>();
    const colorMap = new Map<string, number>();

    for (const asset of all) {
      if (asset.assetType === 'image' || asset.assetType === 'transparent_png') imageCount++;
      else if (asset.assetType === 'video') videoCount++;
      else if (asset.assetType.includes('reference')) referenceCount++;

      if (asset.favorite) favoriteCount++;
      storageUsageBytes += asset.fileInfo.fileSizeBytes;

      providerUsage[asset.provider] = (providerUsage[asset.provider] || 0) + 1;

      const theme = asset.metadata.fusedConcept;
      themeMap.set(theme, (themeMap.get(theme) || 0) + 1);

      const mat = asset.metadata.materialProfile;
      materialMap.set(mat, (materialMap.get(mat) || 0) + 1);

      const col = asset.metadata.dominantColor;
      colorMap.set(col, (colorMap.get(col) || 0) + 1);
    }

    const sortMap = (map: Map<string, number>, keyName: string) => {
      return Array.from(map.entries())
        .map(([k, count]) => ({ [keyName]: k, count } as any))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    };

    return {
      totalAssets,
      imageCount,
      videoCount,
      referenceCount,
      totalCollections: this.collections.size,
      storageUsageBytes,
      providerUsage,
      mostUsedThemes: sortMap(themeMap, 'theme'),
      mostUsedMaterials: sortMap(materialMap, 'material'),
      mostUsedColors: sortMap(colorMap, 'color'),
      favoriteCount
    };
  }

  public exportSnapshot(): AssetLibrarySnapshot {
    return {
      timestamp: Date.now(),
      assets: Array.from(this.assets.values()),
      collections: Array.from(this.collections.values())
    };
  }

  public importSnapshot(snapshot: AssetLibrarySnapshot): void {
    this.assets.clear();
    this.collections.clear();

    for (const col of snapshot.collections) {
      this.collections.set(col.id, col);
    }

    for (const asset of snapshot.assets) {
      this.assets.set(asset.id, asset);
    }

    this.updateCollectionCounts();
  }

  private updateCollectionCounts(): void {
    for (const col of this.collections.values()) {
      let count = 0;
      for (const asset of this.assets.values()) {
        if (asset.collections.includes(col.id)) {
          count++;
        }
      }
      col.assetCount = count;
    }
  }

  private notifyAssetCreated(asset: Asset): void {
    for (const listener of this.listeners) {
      try {
        listener.onAssetCreated?.(asset);
      } catch (_) {}
    }
  }

  private notifyAssetUpdated(asset: Asset): void {
    for (const listener of this.listeners) {
      try {
        listener.onAssetUpdated?.(asset);
      } catch (_) {}
    }
  }

  private notifyAssetDeleted(assetId: string): void {
    for (const listener of this.listeners) {
      try {
        listener.onAssetDeleted?.(assetId);
      } catch (_) {}
    }
  }

  private notifyAssetArchived(asset: Asset): void {
    for (const listener of this.listeners) {
      try {
        listener.onAssetArchived?.(asset);
      } catch (_) {}
    }
  }

  private notifyCollectionCreated(collection: AssetCollection): void {
    for (const listener of this.listeners) {
      try {
        listener.onCollectionCreated?.(collection);
      } catch (_) {}
    }
  }

  private notifyCollectionUpdated(collection: AssetCollection): void {
    for (const listener of this.listeners) {
      try {
        listener.onCollectionUpdated?.(collection);
      } catch (_) {}
    }
  }

  private notifyCollectionDeleted(collectionId: string): void {
    for (const listener of this.listeners) {
      try {
        listener.onCollectionDeleted?.(collectionId);
      } catch (_) {}
    }
  }
}

export const globalAssetLibrary = new AssetLibraryEngine();
