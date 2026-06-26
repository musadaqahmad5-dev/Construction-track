import { auth } from '../../firebase';

export interface CreateSubscriptionParams {
  priceId: string;
  tier: string;
}

export interface CreateProductParams {
  productId: string;
  productTitle: string;
  productPrice: number;
  productImageUrl?: string;
  shopName?: string;
}

export class BillingService {
  /**
   * Generates a Stripe checkout session for a subscription tier and redirects the user.
   */
  static async startSubscriptionCheckout(params: CreateSubscriptionParams): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("You must be signed in to purchase a subscription.");
    }

    const token = await user.getIdToken();
    const response = await fetch('/api/billing/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        priceId: params.priceId,
        tier: params.tier,
        successUrl: `${window.location.origin}/?session_id={CHECKOUT_SESSION_ID}&checkout_type=subscription&tier=${params.tier}`,
        cancelUrl: `${window.location.origin}/?cancelled=true`
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create subscription checkout session.");
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error("Stripe checkout URL is missing in server response.");
    }
  }

  /**
   * Generates a Stripe checkout session for a physical garment/product and redirects the user.
   */
  static async startProductCheckout(params: CreateProductParams): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("You must be signed in to purchase products.");
    }

    const token = await user.getIdToken();
    const response = await fetch('/api/billing/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: params.productId,
        productTitle: params.productTitle,
        productPrice: params.productPrice,
        productImageUrl: params.productImageUrl,
        shopName: params.shopName,
        successUrl: `${window.location.origin}/?session_id={CHECKOUT_SESSION_ID}&checkout_type=product&product_id=${params.productId}&product_title=${encodeURIComponent(params.productTitle)}`,
        cancelUrl: `${window.location.origin}/?cancelled=true`
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create product checkout session.");
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error("Stripe checkout URL is missing in server response.");
    }
  }
}
