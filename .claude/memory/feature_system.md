---
name: Feature - System Integration
description: Default launcher registration, permessi sistema, overlay, accessibilità
type: project
originSessionId: 90a11607-0d61-4ce7-94c5-d70bb4521585
---
<!-- Popolato quando la feature viene sviluppata -->

## Scope
- Registrazione come default launcher
- Permessi speciali (overlay, accessibilità se necessario)
- Integrazione con system UI (statusbar, notifications)

## Note tecniche
- Default launcher: intent-filter con CATEGORY_HOME in AndroidManifest
- Overlay: SYSTEM_ALERT_WINDOW (richiede grant manuale su Android 10+)
- Temi sistema: limitati su Android stock, più possibilità con root/OEM hooks
