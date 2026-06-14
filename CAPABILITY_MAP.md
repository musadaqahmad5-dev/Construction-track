# Capability Topology Map

This map inventories all registered modules, versions, and clearances.

```
       [ Intelligence Platform Core ]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    [ mod-context ]        [ mod-reliability ]
         │                       │
         ├───────────────────────┤
         ▼                       ▼
    [ mod-agent ]          [ mod-governance ]
         │                       │
         └───────────┬───────────┘
                     ▼
             [ mod-sandbox ]
```

## 1. Registered Module Topology

| Module ID | Human Readable Name | Version | Clearances | Primary Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| `mod-context` | Lifestyle Context engine | 1.0.0 | `geolocation` | *None* |
| `mod-agent` | Fashion Agent coordinator | 1.1.0 | `notifications`, `database` | `mod-context` |
| `mod-reliability` | System Snapshot recovery | 1.0.0 | `database` | *None* |
| `mod-governance` | Static Policy & Risk audit | 1.0.0 | `restricted` | `mod-agent` |
| `mod-sandbox` | Extensible plugin sandbox | 1.0.0 | *None* | `mod-governance`, `mod-reliability` |

## 2. Dynamic Runtime Resolution Paths
*   **Static Manifest Initialization**: Extends platform boot logic and builds the dependency graph during module registration.
*   **Sequential Capability Checks**: Enforces runtime permissions before executing scheduling or weather routines.
