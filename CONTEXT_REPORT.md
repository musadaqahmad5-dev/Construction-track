# Lifestyle Context Engine Architecture Report

This report documents the design of our **Lifestyle Context Engine** built in Phase L5.

## 1. System Overview
The Lifestyle Context Engine (`contextCollector.ts`, `scheduleInterpreter.ts`, `occasionResolver.ts`, `energyModel.ts`) translates abstract human calendar slots and local climate forecasts into multi-dimensional sizing weights.

## 2. Core Capabilities & Mechanics
*   **Dynamic Sizing Matrix**: Melds parameters into a single vector of priorities (`comfort`, `formality`, `layering`, `variety`), steering recommendation engines dynamically.
*   **Calendar Agenda Interpreter**: Infers primary clothing categories and formality scores by scanning daily titles (e.g. "Boardroom Pitch" shifts formality values upwards, "CARDIO Jogging" triggers sportswear bias).
*   **Occasion Dressing Rules**: Establishes strict rules for physical locations, recommending optimal colors, structural styles, and shoe alternatives.
*   **Activity Energy Modeler**: Links metabolic performance scores (1-10 range) to fabric stretch ratios and breathability indexes, shielding users from sweltering in tailored rigid synthetics.
