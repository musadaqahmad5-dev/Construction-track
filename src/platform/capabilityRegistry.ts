import { ModuleInfo, PLATFORM_MODULES } from './moduleManifest';

export class CapabilityRegistry {
  private static STORAGE_KEY = 'fashion_platform_capabilities';
  private static modules: ModuleInfo[] = [];

  static loadRegistry(): ModuleInfo[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        this.modules = JSON.parse(raw);
        return this.modules;
      } catch {
        // use default fallback
      }
    }
    this.modules = [...PLATFORM_MODULES];
    this.saveRegistry();
    return this.modules;
  }

  static saveRegistry(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.modules));
  }

  static toggleModule(id: string): ModuleInfo[] {
    const list = this.loadRegistry();
    const updated = list.map(m => {
      if (m.id === id) {
        return { ...m, enabled: !m.enabled };
      }
      return m;
    });
    this.modules = updated;
    this.saveRegistry();
    return updated;
  }

  static registerExtensionModule(mod: ModuleInfo): void {
    const list = this.loadRegistry();
    if (!list.some(m => m.id === mod.id)) {
      list.push(mod);
      this.modules = list;
      this.saveRegistry();
    }
  }

  static isEnabled(id: string): boolean {
    const list = this.loadRegistry();
    const mod = list.find(m => m.id === id);
    return mod ? mod.enabled : false;
  }

  static getActiveCapabilityGraph() {
    const list = this.loadRegistry();
    const nodes = list.map(m => ({ id: m.id, label: m.name, enabled: m.enabled }));
    const edges: { source: string; target: string }[] = [];

    list.forEach(m => {
      m.dependencies.forEach(dep => {
        edges.push({ source: dep, target: m.id });
      });
    });

    return { nodes, edges };
  }
}
