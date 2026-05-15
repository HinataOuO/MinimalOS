# MinimalOS — Comandi Claude

Tutti i comandi usano `/nome` nella chat. Ottimizzati per scope preciso e token minimi.

---

## Workflow principale

| Comando | Argomento | Cosa fa | Token saving |
|---------|-----------|---------|--------------|
| `/push` | *(opz)* messaggio commit | `git add .` + genera commit msg Conventional Commits + `git push`. Arg opzionale: messaggio custom salta la generazione. | **Basso** — solo git |
| `/next` | *(opz)* nome piano | Trova e implementa il prossimo task non fatto della fase — zero decisioni | **Alto** — legge solo piano + file target |
| `/impl` | `T3` o `T3 phase2_launcher` | Implementa task specifico dal piano. Legge solo i file di quel task. | **Alto** — scope chirurgico |
| `/phase-status` | *(opz)* nome piano | Tabella done/missing per ogni task della fase. Mostra cosa fare dopo. | **Medio** — solo check esistenza file |
| `/new-phase` | `phase2_launcher Descrizione` | Crea file piano nuova fase nel formato standard con task atomici e codice completo | **N/A** — crea documentazione |

---

## Qualità codice

| Comando | Argomento | Cosa fa |
|---------|-----------|---------|
| `/review-kt` | `ui/home/HomeScreen.kt` | Review compresso file Kotlin. Solo problemi reali: correttezza Compose, DI, architettura. Formato `riga: 🔴/🟡/🔵 — problema. Fix.` |
| `/focus` | `home` \| `drawer` \| `dock` \| `settings` \| `theme` \| `di` \| `data` \| `domain` \| `navigation` | Carica solo file del package specificato. Per domande/fix mirati senza caricare tutto il codebase. |

---

## Build & analisi

| Comando | Argomento | Cosa fa |
|---------|-----------|---------|
| `/build` | — | `./gradlew assembleDebug` — mostra solo errori Kotlin, raggruppa per file. Niente output Gradle verboso. |
| `/lint` | — | `./gradlew lint` — mostra solo error/warning reali. Ignora GradleDependency, MissingTranslation, boilerplate. |

---

## Flusso tipico di sviluppo

```
1. /phase-status          → vedi cosa manca nella fase corrente
2. /next                  → implementa prossimo task automaticamente
3. /build                 → verifica compilazione
4. /review-kt ui/home/HomeScreen.kt  → review file appena creato
5. /next                  → task successivo
```

---

## Package validi per `/focus`

```
home       → ui/home/          (HomeScreen, HomeViewModel)
drawer     → ui/drawer/        (DrawerScreen, DrawerViewModel)
dock       → ui/dock/          (DockBar)
settings   → ui/settings/      (SettingsScreen, SettingsViewModel)
widgets    → ui/widgets/
theme      → ui/theme/         (Color, Type, Theme)
navigation → ui/navigation/    (Routes, NavGraph)
di         → di/               (AppModule, Hilt modules)
data       → data/             (repository, datastore)
domain     → domain/           (model, usecase)
```
