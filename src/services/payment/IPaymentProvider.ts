export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'CREATOR_PRO' | 'ENTERPRISE';

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid' | 'expired';

export interface CheckoutParams {
  userId: string;
  userEmail: string;
  planId: SubscriptionTier;
  billingCycle?: 'monthly' | 'yearly';
  redirectUrl?: string;
  customData?: Record<string, any>;
}

export interface CheckoutResult {
  success: boolean;
  checkoutUrl: string;
  checkoutId: string;
  provider: string;
  expiresAt?: string;
  message?: string;
}

export interface SubscriptionDetails {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  planId: SubscriptionTier;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  customerId: string;
  provider: string;
  renewalDate: string;
}

export interface WebhookProcessResult {
  success: boolean;
  eventType: string;
  userId?: string;
  planId?: SubscriptionTier;
  subscriptionStatus?: SubscriptionStatus;
  creditsAdded?: number;
  rawEvent?: any;
  message?: string;
}

export interface PaymentProduct {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  creditsMonthly: number;
  features: string[];
  isPopular?: boolean;
}

export interface IPaymentProvider {
  readonly id: string;
  readonly name: string;
  
  createCheckout(params: CheckoutParams): Promise<CheckoutResult>;
  verifySubscription(subscriptionId: string): Promise<SubscriptionDetails | null>;
  cancelSubscription(subscriptionId: string): Promise<{ success: boolean; message: string }>;
  handleWebhook(rawBody: string | Buffer, headers: Record<string, any>): Promise<WebhookProcessResult>;
  getProducts(): Promise<PaymentProduct[]>;
}
