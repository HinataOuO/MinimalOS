# MinimalOS — Android Productivity Launcher

> Memoria di progetto. Tenere in root come `CLAUDE.md` (o `PROJECT.md`).
> Aggiornare man mano che progetto evolve.

---

## 1. Vision

**MinimalOS** è launcher Android minimalista per trasformare smartphone in **strumento di produttività**. Riduce distrazioni, mostra solo ciò che serve.

Non è app dentro launcher: **è il launcher**. Sostituisce home screen Android.

### Principi guida
- **Less is more** — niente icone colorate, badge, bloat
- **Tipografia come UI** — testo primo cittadino, icone secondarie
- **Monocromia** — tutto zinc, nessun accento colorato
- **Funzionale prima di tutto** — ogni elemento ha scopo chiaro

---

## 2. Estetica & Design System

Ispirazione: **[shadcn/ui](https://ui.shadcn.com/)** + **Hyprland**.

### Palette
- Background: `zinc-950` (#09090b)
- Surface / borders: `zinc-800` / `zinc-900`
- Text primario: `zinc-100` / `zinc-200`
- Text secondario: `zinc-400` / `zinc-500`
- Text muted: `zinc-600` / `zinc-700`
- Accento attivo: `zinc-100` su `zinc-950` (inverso)

### Tipografia
- **Sans-serif**: Inter o Geist Sans (UI generale)
- **Monospace**: Geist Mono o JetBrains Mono (orari, percentuali, dati tecnici, tag UPPERCASE)
- Pesi: `font-light` (300), `font-normal` (400), `font-medium` (500)
- Tracking ampio (`tracking-wide` / `tracking-widest`) per label uppercase

### Componenti
- Bordi sottili (`1px solid zinc-800`), raggio `rounded-md` (6px)
- Niente ombre, glow, gradient (eccetto placeholder copertina musica)
- Spaziatura generosa, mai compressa
- Toggle attivi → inversione totale (bg bianco, testo nero) come shadcn

---

## 3. Funzionalità (MVP)

### Schermate principali
| # | Schermata | Funzione |
|---|---|---|
| 1 | **Home** | Orologio, data, meteo, prossimo evento, card Claude, lista app |
| 2 | **Calendario** | Vista settimana + eventi giorno/domani, integrazione Google/Outlook Calendar |
| 3 | **Musica (Spotify)** | Now playing, controlli base, coda |
| 4 | **Telefono** | Chiamate recenti, ricerca contatti, accesso rubrica/messaggi |
| 5 | **Controlli rapidi** | Wi-Fi, Bluetooth (+ dispositivi), Aereo, Non disturbare, Volume, Luminosità |

### Integrazione Claude (deep link)
- Card dedicata su home con 3 shortcut: **Nuova chat**, **Recenti**, **Projects**
- Utente usa app Claude ufficiale (chat, memoria, project già nel suo account)
- Fallback Play Store se app non installata

---

## 4. Stack Tecnico

- **Linguaggio**: Kotlin
- **UI**: Jetpack Compose + Material 3
- **Architettura**: MVVM con `ViewModel` + `StateFlow`
- **DI**: Hilt
- **Build**: Gradle (Kotlin DSL)
- **Min SDK**: 28 (Android 9) · **Target SDK**: 34 (Android 14)

### Librerie chiave
| Categoria | Libreria |
|---|---|
| Calendar | `CalendarContract` (Android Calendar Provider) |
| Spotify | Spotify Android SDK + Spotify App Remote |
| Bluetooth | `BluetoothAdapter` + `BluetoothManager` |
| Wi-Fi | `WifiManager` |
| Volume / brightness | `AudioManager` / `Settings.System` |
| Contatti | `ContactsContract` |
| Permessi runtime | Accompanist Permissions |
| Icone | Lucide (compose port) o Material Icons Extended |
| Font | Geist via Google Fonts in Compose |

---

## 5. Permessi necessari (AndroidManifest.xml)

```xml
<!-- Launcher base -->
<category android:name="android.intent.category.HOME" />
<category android:name="android.intent.category.DEFAULT" />

<!-- Calendar -->
<uses-permission android:name="android.permission.READ_CALENDAR" />
<uses-permission android:name="android.permission.WRITE_CALENDAR" />

<!-- Telefono / contatti -->
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.READ_CALL_LOG" />
<uses-permission android:name="android.permission.CALL_PHONE" />

<!-- Bluetooth -->
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />

<!-- Wi-Fi (alcune azioni richiedono settings panel su Android 10+) -->
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />

<!-- Brightness -->
<uses-permission android:name="android.permission.WRITE_SETTINGS" />

<!-- Spotify SDK -->
<uses-permission android:name="android.permission.INTERNET" />
```

---

## 6. Struttura progetto suggerita

```
app/
├── src/main/
│   ├── AndroidManifest.xml
│   ├── kotlin/com/example/minimalos/
│   │   ├── MinimalOSApp.kt              # @HiltAndroidApp
│   │   ├── MainActivity.kt              # Activity launcher (single)
│   │   ├── ui/
│   │   │   ├── theme/                   # Color, Type, Theme.kt
│   │   │   ├── components/              # Button, Card, Toggle, Slider...
│   │   │   ├── screens/
│   │   │   │   ├── home/
│   │   │   │   ├── calendar/
│   │   │   │   ├── music/
│   │   │   │   ├── phone/
│   │   │   │   └── controls/
│   │   │   ├── navigation/              # NavGraph
│   │   │   └── statusbar/
│   │   ├── data/
│   │   │   ├── calendar/                # CalendarRepository
│   │   │   ├── contacts/
│   │   │   ├── spotify/
│   │   │   ├── bluetooth/
│   │   │   ├── wifi/
│   │   │   └── system/                  # volume, brightness, dnd
│   │   ├── domain/                      # use cases
│   │   ├── di/                          # Hilt modules
│   │   └── util/
│   │       ├── ClaudeLauncher.kt        # deep link a app Claude
│   │       └── PermissionUtils.kt
│   └── res/
└── build.gradle.kts
```

---

## 7. Snippet chiave già definiti

### Launcher Claude
```kotlin
object ClaudeLauncher {
    private const val PACKAGE = "com.anthropic.claude"

    fun launch(context: Context, action: Action = Action.OPEN) {
        val uri = when (action) {
            Action.NEW -> "anthropic.claude://new"
            Action.RECENT -> "anthropic.claude://recents"
            Action.PROJECTS -> "anthropic.claude://projects"
            Action.OPEN -> "anthropic.claude://"
        }.toUri()

        val intent = Intent(Intent.ACTION_VIEW, uri).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        try {
            context.startActivity(intent)
        } catch (e: ActivityNotFoundException) {
            // fallback Play Store
            context.startActivity(Intent(Intent.ACTION_VIEW,
                "market://details?id=$PACKAGE".toUri()).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            })
        }
    }

    enum class Action { OPEN, NEW, RECENT, PROJECTS }
}
```

> ⚠️ Deep link esatti app Claude vanno verificati. Alternativa: lancio activity via `packageManager.getLaunchIntentForPackage("com.anthropic.claude")`.

### Manifest dell'Activity launcher
```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask"
    android:stateNotNeeded="true"
    android:theme="@style/Theme.MinimalOS">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.HOME" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

---

## 8. Roadmap & Piani Dettagliati

> Ogni fase ha un piano separato in `.claude/plans/`. Leggere quello per implementare, non tutto memory.md.

### Progressione

| Fase | Titolo | Stato | Piano |
|------|--------|-------|-------|
| 0 | Mockup React | ✅ Fatto | `.claude/resources/minimalos-prototype.tsx` |
| 1 | Foundation & Architecture | 🔨 In corso | [phase1_foundation.md](plans/phase1_foundation.md) |
| 2 | Launcher Core (Home + Drawer + Dock) | ⏳ Prossimo | — |
| 3 | Aesthetic System | ⏳ | — |
| 4 | Widget & Home Customization | ⏳ | — |
| 5 | Spotify Integration | ⏳ | — |
| 6 | Android Integrations (Phone, Controls) | ⏳ | — |
| 7 | Settings | ⏳ | — |
| 8 | Polish & Edge Cases | ⏳ | — |

### 📍 Fase corrente: **Phase 1 — Foundation**
Piano dettagliato: `.claude/plans/phase1_foundation.md`  
Task: T1 Gradle · T2 Application · T3 Manifest · T4 Theme · T5 Navigation · T6 DataStore · T7 DI · T8 MainActivity · T9 HomeScreen placeholder

---

### Vecchia roadmap (riferimento)
- **Fase 1 setup base** = nostro Phase 1 + inizio Phase 2
- **Fase 2 schermate statiche** = Phase 2 + 3
- **Fase 3 integrazioni** = Phase 5 + 6
- **Fase 4 Claude** = Phase 4 (widget)
- **Fase 5 polish** = Phase 8

---

## 9. Decisioni di design già prese

- **Niente AI custom dentro launcher** — si integra app Claude ufficiale via deep link, utente sfrutta chat/memoria/project esistenti.
- **Niente colori accentati** — solo monocromia zinc, anche stati attivi (inversione bianco/nero).
- **Niente icone app personalizzate** — lista app solo testo (font-light), chevron sottile a destra.
- **Bottom nav 5 voci** — Home / Calendar / Music / Phone / Controls. Niente label, solo icone.
- **Status bar custom** — nascondiamo quella di sistema, mostriamo nostra in monospace per coerenza estetica.

---

## 10. Riferimenti utili

- [shadcn/ui](https://ui.shadcn.com/) — design system di riferimento
- [Hyprland](https://hyprland.org/) — ispirazione window/layout feel
- [Android Launcher development guide](https://developer.android.com/guide/topics/manifest/category-element)
- [Spotify Android SDK](https://developer.spotify.com/documentation/android)
- [Jetpack Compose docs](https://developer.android.com/jetpack/compose)
- [Material 3 Compose](https://developer.android.com/jetpack/androidx/releases/compose-material3)

---

## 11. Prima task per Claude Code in VS Code

Primo prompt da dare a Claude Code dopo apertura progetto:

> Leggi `CLAUDE.md` nella root. Crea scaffold Android Studio con:
> - Kotlin + Jetpack Compose + Material 3
> - Hilt configurato
> - Theme MinimalOS (palette zinc, tipografia Geist)
> - MainActivity registrata come launcher (HOME intent-filter)
> - NavGraph con 5 destinazioni vuote: home, calendar, music, phone, controls
> - Componenti base in `ui/components`: MinCard, MinToggle, MinSlider, MinHeader, StatusBar, NavBar
    > Mostrami struttura finale e file principali.