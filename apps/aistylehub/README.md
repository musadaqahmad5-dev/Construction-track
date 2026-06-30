# AIStyleHub Application Module

AIStyleHub is the customer-facing SaaS portal of the EAOS platform. It provides fashion consumers with access to private digital wardrobes, recommendations, style predictions, and collaborative styling feeds.

## Project Structure

```
apps/aistylehub/
├── public/                 # Static visual assets
├── src/
│   ├── components/         # Wardrobe widgets and styling interfaces
│   ├── hooks/              # Profile sync and API polling hooks
│   ├── services/           # Gateway client connections
│   ├── App.tsx             # Root dashboard controller
│   └── main.tsx            # React application entry point
├── package.json            # Hub-specific package manifest
└── tsconfig.json           # Compiler rules extending workspace root
```

## Integration Map

1. **Authentication:** Leverages centralized OAuth 2.0 / Firebase Auth token generation passed via the root API Gateway.
2. **AI Pipelines:** Proxies image and prompt creation workflows through the `/api/v1/intelligence/generate` endpoint.
3. **Synchronization:** Uses the global state synchronization engine to publish digital wardrobe assets to distributed caches.
