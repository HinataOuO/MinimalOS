---
name: Feedback & Validated Approaches
description: Correzioni dell'utente e approcci confermati da non ripetere o da mantenere
type: feedback
originSessionId: 90a11607-0d61-4ce7-94c5-d70bb4521585
---
<!-- Popolato progressivamente durante lo sviluppo -->
<!-- Formato: regola → Why: → How to apply: -->

## Memoria progetto va in repo

Salvare file memoria relativi a MinimalOS in `.claude/memory/` dentro il repo (`/home/hina/AndroidStudioProjects/MinimalOS/.claude/memory/`), non solo nella memoria esterna Claude Code.

**Why:** utente vuole memoria versionata con il codice, tracciata in git.
**How to apply:** quando si crea/aggiorna file memoria per MinimalOS, scrivere in `.claude/memory/` nel repo. Aggiornare anche `MEMORY.md` locale se necessario.
