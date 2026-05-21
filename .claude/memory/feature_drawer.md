---
name: Feature - App Drawer
description: Stato e decisioni per app drawer, lista app, ricerca, categorie
type: project
originSessionId: 90a11607-0d61-4ce7-94c5-d70bb4521585
---
<!-- Popolato quando la feature viene sviluppata -->

## Scope
- Lista completa app installate
- Ricerca real-time
- Categorie / ordinamento
- Launch app

## Note tecniche
- Richiede: `PackageManager.queryIntentActivities()` con CATEGORY_LAUNCHER
- Android 11+: aggiungere `<queries>` in AndroidManifest per visibility
