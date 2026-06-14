import { ExtensionManifest, ExtensionSandbox } from './extensionSandbox';

export class ExtensionLoader {
  private static STORAGE_KEY = 'fashion_companion_extensions';
  private static registry: ExtensionManifest[] = [];

  static getExtensions(): ExtensionManifest[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        this.registry = JSON.parse(raw);
        return this.registry;
      } catch {
        // use default
      }
    }

    const defaults: ExtensionManifest[] = [
      {
        id: 'ext-scandi-vibe',
        name: 'Scandi Minimalist Visualizer',
        category: 'lookbook',
        author: 'Nordic Style Labs',
        enabled: true
      },
      {
        id: 'ext-vintage-grading',
        name: 'Faded Film Color grader',
        category: 'lookbook',
        author: 'RetroTech Group',
        enabled: false
      },
      {
        id: 'ext-weather-amplifier',
        name: 'Extreme Climate Shield',
        category: 'planner',
        author: 'Alps Outfitter',
        enabled: true,
        permissionRequired: 'notifications'
      },
      {
        id: 'ext-fiber-wear-metric',
        name: 'Micro-Fiber Fatigue Score',
        category: 'scoring',
        author: 'Textile Academics',
        enabled: false
      }
    ];

    this.registry = defaults;
    this.saveRegistry();
    return defaults;
  }

  static saveRegistry(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.registry));
  }

  static toggleExtension(id: string): ExtensionManifest[] {
    const list = this.getExtensions();
    const updated = list.map(ext => {
      if (ext.id === id) {
        return { ...ext, enabled: !ext.enabled };
      }
      return ext;
    });
    this.registry = updated;
    this.saveRegistry();
    return updated;
  }

  static installExtension(ext: ExtensionManifest): ExtensionManifest[] {
    const list = this.getExtensions();
    if (!list.some(x => x.id === ext.id)) {
      list.push(ext);
      this.registry = list;
      this.saveRegistry();
    }
    return list;
  }
}
