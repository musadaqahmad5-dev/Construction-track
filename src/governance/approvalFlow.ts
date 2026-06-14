export interface ExecutiveApproval {
  id: string;
  scope: string; // e.g., "Extension Activation", "Wardrobe Rollback"
  details: string;
  timestamp: string;
  decision: 'approved' | 'rejected' | 'pending';
}

export class ApprovalFlow {
  private static STORAGE_KEY = 'fashion_platform_executive_approvals';

  static getApprovals(): ExecutiveApproval[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveApprovals(list: ExecutiveApproval[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
  }

  /**
   * Prompts a new system validation.
   */
  static requestApproval(scope: string, details: string): ExecutiveApproval {
    const list = this.getApprovals();
    const item: ExecutiveApproval = {
      id: `appr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      scope,
      details,
      timestamp: new Date().toISOString(),
      decision: 'pending'
    };
    list.push(item);
    this.saveApprovals(list);
    return item;
  }

  static approve(id: string): void {
    const list = this.getApprovals();
    const target = list.find(x => x.id === id);
    if (target) {
      target.decision = 'approved';
      this.saveApprovals(list);
    }
  }

  static reject(id: string): void {
    const list = this.getApprovals();
    const target = list.find(x => x.id === id);
    if (target) {
      target.decision = 'rejected';
      this.saveApprovals(list);
    }
  }
}
