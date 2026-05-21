---
name: Project Overview
description: Cosa è MinimalOS, obiettivi, stack, stato attuale
type: project
originSessionId: 90a11607-0d61-4ce7-94c5-d70bb4521585
---
MinimalOS = **reskin estetico di Android**, non rebuild. Obiettivo: ridisegnare l'interfaccia con stile minimale fedele al prototipo React in `.claude/resources/minimalos-prototype.tsx`. Le funzionalità usano API Android esistenti, non sono reimplementate da zero.

**Why:** Creare un'interfaccia Android minimale e personalizzata, alternativa ai launcher commerciali. Focus su estetica, non su feature inedite.

**Integrazioni chiave:**
- Music → Spotify API (non player custom)
- Phone → ContentProvider Android (reskin rubrica)
- Claude → deep-link Intent verso app Claude installata
- Controls → toggle sistema WiFi/BT + slider volume/luminosità

**Stack confermato:** Kotlin + Jetpack Compose + Material3 + Hilt + DataStore + Navigation Compose

**Stato (2026-05-14):** Progetto quasi vuoto. Solo MainActivity.kt + ui/theme/ (Color, Type, Theme). Struttura package creata ma non popolata.

**Roadmap approvata (8 fasi):**
1. Foundation & Architecture (DI, Nav, DataStore, Theme, Manifest HOME)
2. Launcher Core (AppRepository, HomeScreen grid, DrawerScreen, DockBar)
3. Aesthetic System (colori, font, grid config, wallpaper, animazioni)
4. Widget & Home Customization (clock, weather, Claude card)
5. Spotify Integration (SDK, MusicScreen, mini-player)
6. Android Integrations (PhoneScreen, ControlsPanel, Claude deep-link)
7. Settings (SettingsScreen, DataStore, tutte preferenze)
8. Polish (performance, gesture, edge cases)

**Target:** Min SDK 24 / Target SDK 36. Package: `com.hina.minimalos`.

**How to apply:** Ogni decisione architetturale deve considerare che è un launcher (permessi speciali, query intent per app list, default launcher registration). Priorità: architettura pulita prima, UI dopo.
