# MinimalOS

A minimal Android launcher — aesthetic reskin of Android, not a rebuild. Clean UI, no bloat.

![Min SDK](https://img.shields.io/badge/Min%20SDK-24-brightgreen) ![Target SDK](https://img.shields.io/badge/Target%20SDK-36-blue) ![Kotlin](https://img.shields.io/badge/Kotlin-2.2-purple) ![Compose](https://img.shields.io/badge/Jetpack%20Compose-UI-orange)

## Features

- **Home screen** — minimal app grid, gesture navigation
- **App drawer** — searchable, categorized
- **Dock bar** — pinned shortcuts
- **Widgets** — clock, weather, Claude card
- **Spotify integration** — mini-player via Spotify SDK
- **System controls** — WiFi/BT toggles, volume/brightness sliders
- **Settings** — full customization via DataStore

## Stack

| Layer | Tech |
|-------|------|
| UI | Jetpack Compose + Material3 |
| Language | Kotlin |
| DI | Hilt |
| State | StateFlow + ViewModel |
| Preferences | DataStore |
| Navigation | Navigation Compose |
| Fonts | Inter + JetBrains Mono (Google Fonts) |

## Architecture

```
com.hina.minimalos/
├── di/              # Hilt modules
├── data/
│   ├── repository/  # AppRepository, data sources
│   └── datastore/   # UserPreferences wrapper
├── domain/
│   ├── model/       # AppInfo, data models
│   └── usecase/     # Business logic
└── ui/
    ├── theme/       # Color, Type, Theme
    ├── home/        # HomeScreen + ViewModel
    ├── drawer/      # DrawerScreen + ViewModel
    ├── dock/        # DockBar
    ├── widgets/     # Widget components
    └── settings/    # SettingsScreen + ViewModel
```

## Getting Started

1. Clone the repo
2. Open in Android Studio Hedgehog or newer
3. Run on device/emulator (API 24+)
4. Set MinimalOS as default launcher when prompted

## Requirements

- Android 7.0+ (API 24)
- Android Studio Hedgehog+
- JDK 17+

## License

MIT
