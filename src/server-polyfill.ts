// Server-side polyfill for browser globals like localStorage and window
if (typeof global !== 'undefined') {
  // Polyfill localStorage
  if (typeof (global as any).localStorage === 'undefined') {
    const store: Record<string, string> = {};
    (global as any).localStorage = {
      getItem: (key: string): string | null => {
        return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
      },
      setItem: (key: string, value: any): void => {
        store[key] = String(value);
      },
      removeItem: (key: string): void => {
        delete store[key];
      },
      clear: (): void => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
      key: (index: number): string | null => {
        return Object.keys(store)[index] || null;
      },
      get length(): number {
        return Object.keys(store).length;
      }
    };
  }

  // Polyfill window if needed
  if (typeof (global as any).window === 'undefined') {
    (global as any).window = global;
  }
}
