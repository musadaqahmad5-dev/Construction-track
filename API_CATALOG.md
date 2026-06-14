# API Catalog & Endpoint Registry
**Version**: 2.0.0 (Production-Ready)  
**Host Context**: Server-Side Node.js Hub (`server.ts`) bound to Port `3000`  
**Security Mandate**: All secret environment configurations (such as `GEMINI_API_KEY` and Shopify tokens) remain strict server secrets and are never exposed to client browsers.

---

## 1. System Health Checker
* **Endpoint**: `GET /api/health`
* **Method**: `GET`
* **Consumer**: Cloud Run Ingress Monitoring & local sanity checkers.
* **Authentication**: `Public`
* **Request Spec**: None
* **Success Output (JSON)**:
```json
{
  "status": "ok",
  "time": "2026-06-12T09:30:15.120Z"
}
```

---

## 2. Outfit Coordination recommender
* **Endpoint**: `POST /api/ai/recommend`
* **Method**: `POST`
* **Consumer**: `App.tsx` navigation displays (`TodaySuggestionCard`, `TomorrowPlanner`).
* **Authentication**: Server-side `process.env.GEMINI_API_KEY` validated. Automatically activates OutfitReasoner fallback when missing.
* **Request Spec (JSON)**:
```json
{
  "wardrobe": [
    { "id": "w1", "title": "Tailored Blazer", "category": "Formal", "primaryColor": "Beige" }
  ],
  "condition": "Rainy",
  "tempRange": "12°C - 16°C",
  "vibe": "classic",
  "agenda": "Client Presentation"
}
```
* **Success Output (JSON)**:
```json
{
  "todaySuggestion": ["w1"],
  "tomorrowSuggestion": [],
  "confidence": 0.95,
  "reasoning": "Standard tailored classic blazer fits presentation context, paired with outer rain shell layers for microclimate comfort."
}
```

---

## 3. Styling Strategy Assistant
* **Endpoint**: `POST /api/ai/strategy`
* **Method**: `POST`
* **Consumer**: `StyleAssistantPanel.tsx` detail cards and closet popups.
* **Authentication**: Lazily initialized Gemini key check, fallback state if missing.
* **Request Spec (JSON)**:
```json
{
  "title": "Loopback Heavy Cotton Hoodie",
  "category": "Casual",
  "description": "Organic loopback classic knit."
}
```
* **Success Output (JSON)**:
```json
{
  "strategy": "**AI STYLING CARD**\n- **Palette**: Pair with dry sage pants.\n- **Silhouette**: Boxy oversize fit balance."
}
```

---

## 4. Multimodal Garment Vision Analysis
* **Endpoint**: `POST /api/ai/analyze-visual`
* **Method**: `POST`
* **Consumer**: Camera capture uploaders and drag-and-drop frames in `VisualAnalysisPanel.tsx`.
* **Authentication**: Strict `process.env.GEMINI_API_KEY` required. Fires multi-modal Gemini 3.5 Flash schema parsing.
* **Request Spec (JSON)**:
```json
{
  "base64Image": "iVBORw0KGgoAAAANSUhEUgAAAA..."
}
```
* **Success Output (JSON)**:
```json
{
  "name": "Camel Knitted Trench",
  "category": "Outerwear",
  "primaryColor": "Oatmeal Beige",
  "secondaryColor": "Minimalist White",
  "pattern": "Solid",
  "material": "Wool Knit",
  "season": "Winter",
  "formality": "Semi-formal",
  "description": "Premium double breasted wrap coat with relaxed wool fabric loops.",
  "confidence": 0.94
}
```

---

## 5. High-Aesthetic Image Generation
* **Endpoint**: `POST /api/image-generation/generate`
* **Method**: `POST`
* **Consumer**: Design studio triggers and generated lookbooks.
* **Authentication**: Server-side Imagen 4.0 validation cascading to Picsum deterministic seeds.
* **Request Spec (JSON)**:
```json
{
  "theme": "Avant-Garde",
  "vibe": "edgy, high-end, futuristic",
  "garments": [
    { "title": "Technical shell jacket", "category": "Outerwear", "primaryColor": "Navy Blue" }
  ],
  "gender": "female",
  "formality": "Formal",
  "season": "Autumn",
  "setting": "concrete brutalist studio daylight",
  "provider": "Google-Imagen-4.0"
}
```
* **Success Output (JSON)**:
```json
{
  "success": true,
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "provider": "Google-Imagen-4.0"
}
```

---

## 6. Live Trend Aggregator
* **Endpoint**: `GET /api/trends/live`
* **Method**: `GET`
* **Consumer**: Active design metrics displays inside `AIStyleHub.tsx`.
* **Authentication**: None for public rss feed; optional server key for Search Grounding.
* **Request parameters**: `?region=US` (Default)
* **Success Output (JSON)**:
```json
{
  "trends": [
    {
      "term": "Oversized Silk Shells",
      "category": "Casual",
      "score": 87,
      "confidence": 0.90,
      "volumeLabel": "Active High Interest",
      "growthIndicator": "+130%",
      "sources": ["Google Trends Active US Feed"],
      "isHot": true,
      "freshnessOffset": 0.96
    }
  ]
}
```

---

## 7. Merchant Inventory Catalog Sync
* **Endpoint**: `POST /api/catalog/sync`
* **Method**: `POST`
* **Consumer**: Merchant inventory connectors in administrative layouts.
* **Authentication**: Storefront API mock access credentials.
* **Request Spec**: None
* **Success Output (JSON)**:
```json
{
  "success": true,
  "count": 1,
  "catalog": [
    {
      "id": "gid://shopify/Product/123",
      "title": "Minimalist Silk Tee",
      "description": "Premium design vestments.",
      "category": "Casual",
      "price": 92.0,
      "currency": "USD",
      "imageUrl": "https://picsum.photos/seed/shop/400/400",
      "sku": "SFY-SILK-TEE",
      "source": "Shopify Storefront"
    }
  ]
}
```

---

## 8. Reality & Compliance Audit Trace
* **Endpoint**: `GET /api/system/reality-audit`
* **Method**: `GET`
* **Consumer**: Forensic dashboard checking actual runtime connectivity in visual modules.
* **Authentication**: None (audits sandbox properties read-only).
* **Request Spec**: None
* **Success Output (JSON)**:
```json
{
  "success": true,
  "report": {
    "timestamp": "2026-06-12T09:30:15.120Z",
    "evaluation": {
      "realityRatio": 88,
      "evidenceRatio": 85,
      "unsupportedCount": 1,
      "totalCapabilities": 10,
      "blockers": [
        "3D TryOn physics canvas uses static model classes. Need to upgrade to WebGL."
      ]
    },
    "evidence": [
      {
        "systemLabel": "Durable Cloud Persistence",
        "isVerifiedReal": true,
        "activeHandler": "firebase/firestore::FirestoreInstance",
        "debugDump": { "databaseId": "(default)" }
      }
    ],
    "scoreNotes": "Dynamic score metrics compiled successfully. Reality state ratio stands at 88%."
  }
}
```
