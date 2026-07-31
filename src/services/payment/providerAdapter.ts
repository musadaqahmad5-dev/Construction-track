import { IPaymentProvider } from './IPaymentProvider';
import { LemonSqueezyAdapter } from './LemonSqueezyAdapter';

export class PaymentProviderRegistry {
  private static instance: PaymentProviderRegistry;
  private providers: Map<string, IPaymentProvider> = new Map();
  private defaultProviderId: string = 'lemonsqueezy';

  private constructor() {
    // Register primary Lemon Squeezy provider
    const lemonSqueezy = new LemonSqueezyAdapter();
    this.registerProvider(lemonSqueezy);
  }

  public static getInstance(): PaymentProviderRegistry {
    if (!PaymentProviderRegistry.instance) {
      PaymentProviderRegistry.instance = new PaymentProviderRegistry();
    }
    return PaymentProviderRegistry.instance;
  }

  public registerProvider(provider: IPaymentProvider): void {
    this.providers.set(provider.id.toLowerCase(), provider);
    console.log(`[Payment Registry] Registered payment provider: ${provider.name} (${provider.id})`);
  }

  public getProvider(providerId?: string): IPaymentProvider {
    const targetId = (providerId || this.defaultProviderId).toLowerCase();
    const provider = this.providers.get(targetId);

    if (!provider) {
      console.warn(`[Payment Registry] Provider '${targetId}' not found. Falling back to default '${this.defaultProviderId}'`);
      const defaultProv = this.providers.get(this.defaultProviderId);
      if (!defaultProv) {
        throw new Error(`[Payment Registry Fatal] Default provider '${this.defaultProviderId}' is not registered`);
      }
      return defaultProv;
    }

    return provider;
  }

  public setDefaultProvider(providerId: string): void {
    if (this.providers.has(providerId.toLowerCase())) {
      this.defaultProviderId = providerId.toLowerCase();
      console.log(`[Payment Registry] Set default payment provider to: ${providerId}`);
    } else {
      throw new Error(`Cannot set default provider '${providerId}'. Provider is not registered.`);
    }
  }

  public listRegisteredProviders(): { id: string; name: string }[] {
    return Array.from(this.providers.values()).map(p => ({
      id: p.id,
      name: p.name
    }));
  }
}

export const paymentRegistry = PaymentProviderRegistry.getInstance();
