# Phase 1 — Foundation & Architecture

**Stato:** 🔨 In pianificazione  
**Dipende da:** —  
**Sblocca:** Phase 2 (Launcher Core)

## Obiettivo

Infrastruttura completa: Hilt DI, Navigation Compose, DataStore, Theme zinc monocromatico, Manifest HOME. Deliverable: app compilabile che si imposta come launcher, mostra clock live con tema corretto.

---

## Scelte confermate

| Decisione | Scelta |
|-----------|--------|
| Font | Inter + JetBrains Mono (Google Fonts API) |
| Dark/Light | Solo dark (zinc-950 base) |
| DataStore | Preferences DataStore |
| UI Phase 1 | Placeholder navigabile con clock live |
| DI | Hilt + KSP |

---

## Task

### T1 — Gradle (libs.versions.toml + build.gradle.kts)

**`gradle/libs.versions.toml`** — aggiungere in `[versions]`:
```toml
hilt = "2.52"
ksp = "2.2.10-1.0.29"          # deve matchare kotlin = "2.2.10" esatto
hiltNavigationCompose = "1.2.0"
navigationCompose = "2.8.4"
datastore = "1.1.1"
composeGoogleFonts = "1.7.5"
```

Aggiungere in `[libraries]`:
```toml
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-android-compiler", version.ref = "hilt" }
androidx-hilt-navigation-compose = { group = "androidx.hilt", name = "hilt-navigation-compose", version.ref = "hiltNavigationCompose" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-datastore-preferences = { group = "androidx.datastore", name = "datastore-preferences", version.ref = "datastore" }
androidx-compose-ui-text-google-fonts = { group = "androidx.compose.ui", name = "ui-text-google-fonts", version.ref = "composeGoogleFonts" }
```

Aggiungere in `[plugins]`:
```toml
hilt = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

**`build.gradle.kts` (root)** — aggiungere:
```kotlin
alias(libs.plugins.hilt) apply false
alias(libs.plugins.ksp) apply false
```

**`app/build.gradle.kts`** — plugins block:
```kotlin
alias(libs.plugins.hilt)
alias(libs.plugins.ksp)
```

dependencies block — aggiungere:
```kotlin
implementation(libs.hilt.android)
ksp(libs.hilt.compiler)
implementation(libs.androidx.hilt.navigation.compose)
implementation(libs.androidx.navigation.compose)
implementation(libs.androidx.datastore.preferences)
implementation(libs.androidx.compose.ui.text.google.fonts)
```

---

### T2 — Application class

**Crea:** `app/src/main/java/com/hina/minimalos/MinimalOSApplication.kt`
```kotlin
package com.hina.minimalos

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class MinimalOSApplication : Application()
```

---

### T3 — AndroidManifest.xml

Modifiche:
1. `<application android:name=".MinimalOSApplication" ...>`
2. Activity intent-filter → aggiungere HOME + DEFAULT + `launchMode`/`stateNotNeeded`:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask"
    android:stateNotNeeded="true"
    android:label="@string/app_name"
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

### T4 — Theme (Color, Type, Theme)

**`ui/theme/Color.kt`** — sostituire tutto con palette zinc:
```kotlin
val Zinc50  = Color(0xFFFAFAFA)
val Zinc100 = Color(0xFFF4F4F5)
val Zinc200 = Color(0xFFE4E4E7)
val Zinc300 = Color(0xFFD4D4D8)
val Zinc400 = Color(0xFFA1A1AA)
val Zinc500 = Color(0xFF71717A)
val Zinc600 = Color(0xFF52525B)
val Zinc700 = Color(0xFF3F3F46)
val Zinc800 = Color(0xFF27272A)
val Zinc900 = Color(0xFF18181B)
val Zinc950 = Color(0xFF09090B)
```

**`ui/theme/Type.kt`** — Inter + JetBrains Mono via Google Fonts, scala completa:

Provider setup:
```kotlin
private val provider = GoogleFont.Provider(
    providerAuthority = "com.google.android.gms.fonts",
    providerPackage  = "com.google.android.gms",
    certificates     = R.array.com_google_android_gms_fonts_certs
)
val InterFamily      = FontFamily(GoogleFont("Inter"), provider)
val JetBrainsFamily  = FontFamily(GoogleFont("JetBrains Mono"), provider)
```

Typography mapping (fedele al prototipo):
```kotlin
Typography(
    displayLarge  = TextStyle(fontFamily=InterFamily, fontWeight=Light,  fontSize=72.sp, letterSpacing=(-2).sp),  // orologio home
    displayMedium = TextStyle(fontFamily=InterFamily, fontWeight=Light,  fontSize=48.sp),
    titleLarge    = TextStyle(fontFamily=InterFamily, fontWeight=Normal, fontSize=18.sp),
    titleMedium   = TextStyle(fontFamily=InterFamily, fontWeight=Medium, fontSize=14.sp),
    bodyLarge     = TextStyle(fontFamily=InterFamily, fontWeight=Normal, fontSize=16.sp),
    bodyMedium    = TextStyle(fontFamily=InterFamily, fontWeight=Normal, fontSize=14.sp),
    bodySmall     = TextStyle(fontFamily=InterFamily, fontWeight=Normal, fontSize=12.sp),
    labelLarge    = TextStyle(fontFamily=InterFamily, fontWeight=Medium, fontSize=11.sp, letterSpacing=1.sp),
    labelMedium   = TextStyle(fontFamily=JetBrainsFamily, fontWeight=Normal, fontSize=10.sp, letterSpacing=0.5.sp),  // timestamp, %
    labelSmall    = TextStyle(fontFamily=InterFamily, fontWeight=Medium, fontSize=10.sp, letterSpacing=2.sp),  // UPPERCASE tracking-widest
)
```

**`ui/theme/Theme.kt`** — single dark scheme, rimuovere dynamic/light:
```kotlin
private val DarkColorScheme = darkColorScheme(
    background        = Zinc950,
    surface           = Zinc950,
    surfaceVariant    = Zinc900,
    onBackground      = Zinc100,
    onSurface         = Zinc100,
    onSurfaceVariant  = Zinc400,
    primary           = Zinc100,
    onPrimary         = Zinc950,
    secondary         = Zinc400,
    onSecondary       = Zinc950,
    outline           = Zinc800,
    outlineVariant    = Zinc900,
    scrim             = Zinc950,
)

@Composable
fun MinimalOSTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography  = Typography,
        content     = content,
    )
}
```

---

### T5 — Navigation

**Crea:** `ui/navigation/Routes.kt`
```kotlin
package com.hina.minimalos.ui.navigation

sealed class Route(val path: String) {
    data object Home     : Route("home")
    data object Drawer   : Route("drawer")
    data object Settings : Route("settings")
}
```

**Crea:** `ui/navigation/MinimalOSNavGraph.kt`
```kotlin
@Composable
fun MinimalOSNavGraph(navController: NavHostController) {
    NavHost(navController, startDestination = Route.Home.path) {
        composable(Route.Home.path)     { HomeScreen() }
        composable(Route.Drawer.path)   { /* Phase 2 */ }
        composable(Route.Settings.path) { /* Phase 7 */ }
    }
}
```

---

### T6 — DataStore

**Crea:** `data/datastore/UserPreferencesDataStore.kt`
```kotlin
private val Context.dataStore: DataStore<Preferences> by preferencesDataStore("user_prefs")

@Singleton
class UserPreferencesDataStore @Inject constructor(
    @ApplicationContext private val context: Context
) {
    val data: Flow<UserPreferences> = context.dataStore.data
        .catch { if (it is IOException) emit(emptyPreferences()) else throw it }
        .map { UserPreferences() }  // espandere Phase 3+
}
```

**Crea:** `domain/model/UserPreferences.kt`
```kotlin
data class UserPreferences(
    // vuota Phase 1, si popola da Phase 3 in poi
)
```

---

### T7 — DI Module

**Crea:** `di/AppModule.kt`
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides @Singleton
    fun providePackageManager(@ApplicationContext ctx: Context): PackageManager =
        ctx.packageManager
}
```

---

### T8 — MainActivity refactor

```kotlin
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MinimalOSTheme {
                val navController = rememberNavController()
                MinimalOSNavGraph(navController)
            }
        }
    }
}
```

---

### T9 — HomeScreen placeholder

**Modifica:** `ui/home/HomeScreen.kt`

Clock live (HH:mm) + data italiana + label "MinimalOS" come verifica tema:
```kotlin
@Composable
fun HomeScreen() {
    var time by remember { mutableStateOf(LocalDateTime.now()) }
    LaunchedEffect(Unit) {
        while (true) {
            time = LocalDateTime.now()
            delay(1_000)
        }
    }
    val timeStr = time.format(DateTimeFormatter.ofPattern("HH:mm"))
    val dateStr = time.format(DateTimeFormatter.ofPattern("EEEE d MMMM", Locale.ITALIAN))

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 20.dp, vertical = 48.dp)
    ) {
        Text(
            text = timeStr,
            style = MaterialTheme.typography.displayLarge,
            color = MaterialTheme.colorScheme.onBackground
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = dateStr.lowercase(),
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
```

---

## Verifica end-to-end

1. `./gradlew assembleDebug` → nessun errore
2. Install su device/emulatore
3. Settings > App > Default apps > Home app → **MinimalOS** appare
4. Selezionare MinimalOS → premere Home → mostra `HH:mm` + data italiana
5. Background = `#09090B`, testo = bianco (Inter Light)
6. Clock aggiorna ogni secondo
7. Nessuna schermata viola/Material You → tema zinc puro

---

## Note implementative

- `R.array.com_google_android_gms_fonts_certs` generato automaticamente da Android Studio con il plugin Google Fonts. Se non presente: aggiungere resource manuale o usare `FontFamily.Default` temporaneamente.
- KSP version `2.2.10-1.0.29`: verificare disponibilità su [GitHub KSP releases](https://github.com/google/ksp/releases) per Kotlin 2.2.10 esatto.
- `stateNotNeeded = true` su activity evita che Android ricostruisca lo stato launcher a ogni rientro.
- `enableEdgeToEdge()` + `background(Zinc950)` → status bar trasparente su sfondo scuro corretto.
