# Security Specification: AI Fashion Marketplace

## 1. Data Invariants

1. **Owner Isolation**: Users can read and write only their own user metadata, orders, and styling history logs (`/users`, `/orders`, `/outfitHistory`, `/visualInteractions`, `/decisionOutcomes`, `/constructions`, `/wardrobe`).
2. **Order Immutability**: No custom update or deletion exists for orders once submitted and logged.
3. **Product Integrity**: Buyers can read any product, but only matching authenticated boutique owners (`ownerId == auth.uid`) can create, update, or remove lists. A product's price must be numeric and non-negative.
4. **Seller Legitimacy**: Anyone can browse local sellers, but only the matching seller ID (`sellerId == auth.uid`) can create or modify custom shop profiles.
5. **Analytics and Looks Collections**: Guests can initiate guest clicks and save visual logs, but authenticated users must align their logged user identity precisely with their authenticated account credentials.

---

## 2. The "Dirty Dozen" Payloads

Here are 12 specific payloads designed to breach integrity, validation, and identity constraints—which our security rules will mathematically block:

### Identity Violations (Spoofing)
1. **Malicious Order Creation for Another User**  
   *Attempt*: User `attacker-123` tries to place an order setting `userId: "victim-456"`.  
   *Expected Outcome*: `PERMISSION_DENIED` (Rule enforces `request.resource.data.userId == request.auth.uid`).

2. **Poaching Another Seller's Listing**  
   *Attempt*: User `hacker-123` tries to create/update a product setting `ownerId: "hacker-123"` but using another seller's ID or trying to edit a product where `resource.data.ownerId == "victim-789"`.  
   *Expected Outcome*: `PERMISSION_DENIED` (Rule enforces `resource.data.ownerId == request.auth.uid`).

3. **Modifying Another User's Wardrobe**  
   *Attempt*: Write to `/wardrobe/item-987` setting items for user `victim-abc`.  
   *Expected Outcome*: `PERMISSION_DENIED`.

---

### Integrity & Validation Violations
4. **Altering Locked Order Prices After Creation**  
   *Attempt*: Malicious update to `/orders/order-111` to lower the price or change the status.  
   *Expected Outcome*: `PERMISSION_DENIED` (No updates allowed on orders!).

5. **Negative Product Price Injection**  
   *Attempt*: Posting a product with `price: -250.00`.  
   *Expected Outcome*: `PERMISSION_DENIED` (Rule enforces `price >= 0`).

6. **Invalid Product Type Price Input**  
   *Attempt*: Creating a product with `price: "One Thousand Dollars"`.  
   *Expected Outcome*: `PERMISSION_DENIED` (Rule enforces numeric type checks).

7. **Unbounded Title Memory Exhaustion**  
   *Attempt*: Adding a wardrobe item with a title parameter 20,000 characters long to deplete reader memory (Denial of Wallet).  
   *Expected Outcome*: `PERMISSION_DENIED` (Rule restricts size limits, e.g., `title.size() <= 200`).

8. **Shadow Field Injection**  
   *Attempt*: Adding a wardrobe item containing a ghost privilege key such as `{ adminOverride: true }`.  
   *Expected Outcome*: `PERMISSION_DENIED` (Rule validates strict map key size and properties limit).

---

### Phase & Actions Violations
9. **Bypassing Structured Product Roles**  
   *Attempt*: Setting user profile `role` to `'manager'` or foreign values.  
   *Expected Outcome*: `PERMISSION_DENIED` (Rule restricts `role in ['client', 'seller']`).

10. **Direct Modification of System-Generated Look Prompts**  
    *Attempt*: Direct client update to edit metadata prompt in `/generatedLooks/xyz`.  
    *Expected Outcome*: `PERMISSION_DENIED` (Immutability enforced on generation logs).

11. **Injecting Foreign Outlets into Decision Outcomes**  
    *Attempt*: Writing a decision outcome record with a fake action: `'master_admin'`.  
    *Expected Outcome*: `PERMISSION_DENIED` (Value bounded in enum constraints).

12. **Timestamp Poisoning**  
    *Attempt*: Setting `createdAt` to a point in the distant future (`2045-01-01`).  
    *Expected Outcome*: `PERMISSION_DENIED` (Temporal integrity validation against `request.time`).

---

## 3. The Test Runner

All tests are verified against local/production Firebase emulator rules. We enforce:
1. Every write block begins with validation helper constraints (`isValidConstruction`, `isValidWardrobeItem`, `isValidOrder`, `isValidProduct`, `isValidSeller`, `isValidUser`, etc.).
2. The catch-all default is set to full denial: `match /{document=**} { allow read, write: if false; }`.
