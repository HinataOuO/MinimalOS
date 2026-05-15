# MinimalOS

Launcher Android + customizzazioni sistema (tema globale, font, icone). Kotlin + Jetpack Compose.

## Stack
- Kotlin + Jetpack Compose + Material3
- Hilt (DI)
- DataStore (preferenze)
- Navigation Compose

## Package: `com.hina.minimalos`
```
di/          → Hilt modules
data/
  repository/  → AppRepository, data sources
  datastore/   → UserPreferences, DataStore wrapper
domain/
  model/       → AppInfo, altri modelli
  usecase/     → use cases
ui/
  theme/       → Color.kt, Type.kt, Theme.kt
  home/        → HomeScreen.kt, HomeViewModel.kt
  drawer/      → DrawerScreen.kt, DrawerViewModel.kt
  dock/        → DockBar.kt
  widgets/     → widget management
  settings/    → SettingsScreen.kt, SettingsViewModel.kt
```

## Conventions
- ViewModel per ogni screen, StateFlow per UI state
- Compose-only, zero XML
- Feature package = Screen + ViewModel + components locali
- Repository pattern per data layer

## Min SDK 24 / Target SDK 36
