---
name: Feature - Launcher / Home Screen
description: Stato e decisioni per home screen, grid app, gestures, wallpaper
type: project
originSessionId: 90a11607-0d61-4ce7-94c5-d70bb4521585
---
<!-- Popolato quando la feature viene sviluppata -->

## Scope
- Home screen principale
- Grid di app shortcuts
- Gesture navigation (swipe up → drawer, ecc.)
- Wallpaper management

## Note tecniche
- Richiede: `android.permission.BIND_WALLPAPER` se gestisce wallpaper
- Per essere default launcher: intent-filter ACTION_MAIN + CATEGORY_HOME + CATEGORY_DEFAULT
