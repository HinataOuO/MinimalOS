# MinimalOS — Teoria e Architettura

Documento didattico per comprendere **perché** ogni scelta tecnica è stata fatta e **come** funziona. Basato sul codice reale del progetto.

---

## Indice

1. [Cos'è un Android Launcher](#1-cosè-un-android-launcher)
2. [Kotlin — Concetti fondamentali usati nel progetto](#2-kotlin--concetti-fondamentali)
3. [Clean Architecture — Le tre stratificazioni](#3-clean-architecture)
4. [Hilt — Dependency Injection](#4-hilt--dependency-injection)
5. [Jetpack Compose — UI dichiarativa](#5-jetpack-compose--ui-dichiarativa)
6. [State e Recomposition in Compose](#6-state-e-recomposition)
7. [Material3 e il sistema di tema](#7-material3-e-il-sistema-di-tema)
8. [Navigation Compose](#8-navigation-compose)
9. [ViewModel e StateFlow](#9-viewmodel-e-stateflow)
10. [DataStore — Persistenza delle preferenze](#10-datastore--persistenza)
11. [Android Launcher APIs](#11-android-launcher-apis)
12. [Come tutto si collega — Flusso completo](#12-flusso-completo)

---

## 1. Cos'è un Android Launcher

### Il concetto

Su Android, la schermata home che vedi quando premi il tasto Home **è una normale app**. Si chiama *Launcher*. Android la tratta diversamente dalle altre solo perché dichiara un `Intent-filter` speciale nel suo `AndroidManifest.xml`:

```xml
<intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.HOME" />
    <category android:name="android.intent.category.DEFAULT" />
</intent-filter>
```

Questo dice al sistema: "quando l'utente preme Home, puoi avviare me".

### Cosa fa un launcher

1. **Mostra la home screen** — sfondo, orologio, widget, griglia app
2. **Legge le app installate** — tramite `PackageManager` (API Android)
3. **Avvia le app** — tramite `Intent`
4. **Rimane sempre attivo** — non viene mai killato dal sistema

### Cosa NON fa un launcher

Non crea un sistema operativo nuovo. Non modifica Android. Usa le stesse API di qualsiasi altra app, solo con quel `intent-filter` speciale che lo rende la "shell" visibile.

**MinimalOS è esattamente questo**: un'app con quel filtro, uno stile visivo minimale, e accesso alle stesse API che userebbe qualunque app.

---

## 2. Kotlin — Concetti fondamentali

### `val` vs `var`

```kotlin
val nome = "MinimalOS"   // immutabile — non si può riassegnare
var contatore = 0        // mutabile — si può cambiare
```

**Regola pratica**: usa sempre `val`. Usa `var` solo quando sai che il valore cambierà. L'immutabilità evita bug dove il valore cambia in modo inatteso.

### `data class`

```kotlin
// da AppInfo.kt
data class AppInfo(
    val packageName: String,
    val label: String,
    val icon: android.graphics.drawable.Drawable?,
)
```

Una `data class` è una classe il cui scopo è solo **contenere dati**. Kotlin genera automaticamente:
- `equals()` — confronto per valore, non per riferimento
- `hashCode()` — per usarla in liste e mappe
- `toString()` — stampa leggibile
- `copy()` — crea copia modificando solo certi campi

**Senza** `data class`, confrontare due `AppInfo` con lo stesso `packageName` darebbe `false` (confronto per riferimento in memoria). **Con** `data class` dà `true`.

### `sealed class`

```kotlin
// da Routes.kt
sealed class Route(val path: String) {
    data object Home     : Route("home")
    data object Drawer   : Route("drawer")
    data object Settings : Route("settings")
}
```

`sealed class` significa: "questa classe può essere solo uno di questi sottotipi, e li conosco tutti". 

**Perché è utile**: quando usi un `when` su una `sealed class`, il compilatore ti **obbliga** a gestire tutti i casi. Se aggiungi `Route.Widgets` e dimentichi di gestirlo da qualche parte, errore a compile time — non a runtime mentre l'utente usa l'app.

```kotlin
// il compilatore sa che hai coperto tutti i casi
when (route) {
    is Route.Home     -> "vai a home"
    is Route.Drawer   -> "apri drawer"
    is Route.Settings -> "apri settings"
}
```

### `object` e `data object`

```kotlin
data object Home : Route("home")
```

`object` è un **singleton** — esiste una sola istanza in tutta l'app. `data object` aggiunge anche `toString()` leggibile. Perfetto per route che non hanno parametri: non ha senso creare 100 istanze di "Home", ne basta una.

### Il simbolo `?` — Nullable

```kotlin
val icon: android.graphics.drawable.Drawable?   // può essere null
val label: String                                // NON può essere null
```

Kotlin distingue tra tipi che possono essere `null` e tipi che non possono. Se provi a usare `icon` senza controllare se è null, il compilatore ti blocca. Questo elimina i `NullPointerException` che affliggono Java.

```kotlin
// errore di compilazione — icon potrebbe essere null
val size = icon.intrinsicWidth

// corretto — prima controlla
val size = icon?.intrinsicWidth ?: 0   // se null, usa 0
```

### Coroutines — Operazioni asincrone

```kotlin
// da HomeScreen.kt
LaunchedEffect(Unit) {
    while (true) {
        time = LocalDateTime.now()
        delay(1_000)   // aspetta 1 secondo SENZA bloccare il thread UI
    }
}
```

**Il problema**: le operazioni lente (leggere file, fare rete, aspettare) non possono stare sul thread UI. Se blocchi il thread UI per 1 secondo, l'app congela.

**La soluzione tradizionale (Thread)**: crei un thread separato. Complesso, error-prone.

**La soluzione con coroutines**: funzioni che possono essere sospese e riprese. `delay(1_000)` non blocca il thread — lo "mette in pausa" e lascia libero il thread di fare altro. Quando il secondo è passato, riprende.

**`suspend fun`**: una funzione marcata `suspend` può usare `delay`, chiamare altre funzioni sospendibili, fare I/O. Può essere chiamata solo da dentro una coroutine o da un'altra `suspend fun`.

---

## 3. Clean Architecture

### Il problema che risolve

Immagina di scrivere tutto in un unico file. La UI chiama direttamente il database, calcola la logica, gestisce gli errori. Funziona, ma:
- Per testare la UI devi avere un database reale
- Per cambiare come salvi i dati devi toccare la UI
- Per riusare logica in due schermate la duplichi

**Clean Architecture** separa il codice in **strati** con regole precise su chi può parlare con chi.

### I tre strati in MinimalOS

```
┌─────────────────────────────────────┐
│  UI Layer (ui/)                     │  ← cosa vede l'utente
│  Screen + ViewModel                 │
├─────────────────────────────────────┤
│  Domain Layer (domain/)             │  ← regole di business
│  Model + UseCase                    │
├─────────────────────────────────────┤
│  Data Layer (data/)                 │  ← da dove arrivano i dati
│  Repository + DataStore             │
└─────────────────────────────────────┘
```

**Regola fondamentale**: le frecce puntano solo verso il basso. La UI conosce il Domain. Il Domain NON conosce la UI. Il Data NON conosce la UI.

### Perché questa regola?

```
UI → Domain ✅   (la schermata usa la logica di business)
Domain → UI ✗   (la logica non deve sapere come è fatta la UI)
Data → UI ✗     (il database non deve sapere che esiste una HomeScreen)
```

Se domani sostituisci Compose con un'altra UI, il Domain e il Data non cambiano. Se domani cambi il database da DataStore a SQLite, la UI non cambia. I pezzi sono **intercambiabili**.

### Nella pratica: il percorso di un dato

```
PackageManager (Android)
    ↓
AppRepository (data/repository)      ← legge le app installate
    ↓
GetInstalledAppsUseCase (domain)     ← filtra, ordina, trasforma
    ↓
HomeViewModel (ui/home)              ← espone lo stato alla UI
    ↓
HomeScreen (ui/home)                 ← mostra le app all'utente
```

Ogni strato fa **una cosa sola** e la fa bene.

### I modelli (`domain/model/`)

```kotlin
data class AppInfo(
    val packageName: String,   // "com.spotify.music"
    val label: String,         // "Spotify"
    val icon: Drawable?,       // icona da mostrare
)
```

`AppInfo` è il **modello di dominio** — la rappresentazione dell'app nel linguaggio dell'applicazione, indipendente da come Android la rappresenta internamente. Android usa `ResolveInfo` (oggetto complesso); noi lo trasformiamo in `AppInfo` (solo quello che ci serve).

---

## 4. Hilt — Dependency Injection

### Il problema

```kotlin
// HomeViewModel ha bisogno di AppRepository
// AppRepository ha bisogno di PackageManager
// PackageManager viene da Android

// Senza DI, devi costruire tutto a mano:
val pm = context.packageManager
val repo = AppRepository(pm)
val viewModel = HomeViewModel(repo)
```

Questo funziona per 2 classi. Con 20 classi, creare e passare le dipendenze a mano diventa impossibile da mantenere. E se `AppRepository` diventa un singleton (una sola istanza)? Devi gestirlo tu.

### Il concetto di Dependency Injection

Invece di creare le dipendenze dentro la classe, le **ricevi dall'esterno**:

```kotlin
// SENZA DI — la classe crea la sua dipendenza
class HomeViewModel() {
    private val repo = AppRepository(context.packageManager)  // ❌ accoppiamento forte
}

// CON DI — la classe dichiara cosa le serve
class HomeViewModel(
    private val repo: AppRepository   // ✅ qualcun altro la costruisce
) 
```

**Chi è "qualcun altro"?** Hilt. È un framework che:
1. Sa come costruire ogni classe (glielo insegni con le annotazioni)
2. Costruisce automaticamente le dipendenze nell'ordine giusto
3. Gestisce i cicli di vita (singleton, per-activity, ecc.)

### Le annotazioni di Hilt nel progetto

```kotlin
// MinimalOSApplication.kt
@HiltAndroidApp
class MinimalOSApplication : Application()
```
Dice a Hilt: "questa è l'app, inizializza il container di dipendenze qui".

```kotlin
// MainActivity.kt
@AndroidEntryPoint
class MainActivity : ComponentActivity()
```
Dice a Hilt: "puoi iniettare dipendenze in questa Activity".

```kotlin
// di/AppModule.kt
@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun providePackageManager(@ApplicationContext ctx: Context): PackageManager =
        ctx.packageManager
}
```

- `@Module` — questa classe contiene "ricette" per costruire oggetti
- `@InstallIn(SingletonComponent::class)` — le ricette vivono per tutta la vita dell'app
- `@Provides` — questa funzione è una ricetta
- `@Singleton` — costruisci questo oggetto solo una volta, poi riusalo
- `@ApplicationContext` — "inietta il Context dell'applicazione"

**Traduzione in italiano**: "Hilt, quando qualcuno ha bisogno di un `PackageManager`, ecco come crearlo: prendi il `Context` dell'app e chiedi `ctx.packageManager`. Fallo solo la prima volta, poi dai sempre lo stesso oggetto."

```kotlin
// UserPreferencesDataStore.kt
@Singleton
class UserPreferencesDataStore @Inject constructor(
    @ApplicationContext private val context: Context
)
```
`@Inject constructor` dice a Hilt: "per costruire questa classe, guarda i parametri del costruttore e iniettali automaticamente".

### Il grafico delle dipendenze

Hilt costruisce un **grafo** di dipendenze e lo risolve:

```
HomeViewModel
    └── AppRepository
            └── PackageManager ← fornito da AppModule
```

Tu dichiari solo cosa ti serve. Hilt capisce l'ordine di costruzione.

---

## 5. Jetpack Compose — UI Dichiarativa

### Imperativo vs Dichiarativo

**Imperativo** (vecchio modo con XML + View):
```java
// dici COME cambiare la UI passo per passo
TextView textView = findViewById(R.id.clock);
textView.setText("14:30");
textView.setTextColor(Color.WHITE);
textView.setVisibility(View.VISIBLE);
```

**Dichiarativo** (Compose):
```kotlin
// dici COME DEVE APPARIRE, non come cambiarla
Text(
    text = "14:30",
    color = Color.White,
)
```

Con Compose, descrivi lo **stato desiderato** dell'UI. Quando lo stato cambia, Compose aggiorna automaticamente solo le parti che sono cambiate.

### `@Composable`

```kotlin
@Composable
fun HomeScreen() {
    Column(...) {
        Text(text = timeStr, ...)
        Text(text = dateStr, ...)
    }
}
```

`@Composable` è un'annotazione che dice: "questa funzione descrive un pezzo di UI". Le funzioni Composable:
- Possono chiamare altre funzioni `@Composable`
- **Non restituiscono nulla** — non costruiscono oggetti, emettono UI
- Vengono rieseguite (ricomposte) quando i loro input cambiano

### I Composable fondamentali

```kotlin
Column { ... }    // dispone figli verticalmente (come VStack in SwiftUI)
Row { ... }       // dispone figli orizzontalmente
Box { ... }       // sovrappone figli (come ZStack)
Text("ciao")      // testo
Spacer(Modifier.height(8.dp))  // spazio vuoto
```

### `Modifier`

```kotlin
Column(
    modifier = Modifier
        .fillMaxSize()              // occupa tutto lo spazio disponibile
        .background(Color.Black)    // sfondo nero
        .padding(horizontal = 20.dp, vertical = 48.dp)  // margini interni
)
```

`Modifier` è una catena di trasformazioni applicate al componente. Si legge dall'alto verso il basso: prima occupa tutto lo spazio, poi applica sfondo, poi applica padding. **L'ordine conta**: `padding` prima di `background` dà risultato diverso da `background` prima di `padding`.

---

## 6. State e Recomposition

### Il problema dello stato

La UI deve cambiare nel tempo (l'orologio avanza ogni secondo). Come funziona in Compose?

```kotlin
// da HomeScreen.kt
var time by remember { mutableStateOf(LocalDateTime.now()) }
```

**`mutableStateOf`**: crea un oggetto "osservabile". Quando il suo valore cambia, Compose sa che deve ridisegnare i Composable che lo usano.

**`remember`**: dice a Compose "ricorda questo valore tra una ricomposizione e l'altra". Senza `remember`, ogni volta che Compose ridisegna `HomeScreen`, creerebbe un nuovo `mutableStateOf` con il tempo attuale — l'orologio non funzionerebbe.

**`by`** (Kotlin delegate): invece di scrivere `time.value = ...` e leggere `time.value`, con `by` scrivi e leggi direttamente `time`. Zucchero sintattico.

### LaunchedEffect

```kotlin
LaunchedEffect(Unit) {
    while (true) {
        time = LocalDateTime.now()
        delay(1_000)
    }
}
```

`LaunchedEffect` lancia una coroutine **legata al ciclo di vita del Composable**:
- Parte quando il Composable entra nella composizione
- Si ferma quando il Composable viene rimosso
- `Unit` come chiave significa: esegui solo una volta (non ripartire a ogni ricomposizione)

**Il flusso dell'orologio**:
1. `HomeScreen` viene composta per la prima volta
2. `LaunchedEffect` parte: aggiorna `time`, aspetta 1s, aggiorna, aspetta...
3. Ogni volta che `time` cambia, Compose ricompone solo i `Text` che usano `time`
4. Risultato: l'orologio si aggiorna ogni secondo senza bloccare nulla

### Recomposition — solo il necessario

Compose è intelligente: quando `time` cambia, **non ridisegna tutta la UI**. Ridisegna solo le funzioni Composable che leggono `time`. Questo si chiama *smart recomposition* ed è uno dei vantaggi principali di Compose rispetto al vecchio sistema.

---

## 7. Material3 e il Sistema di Tema

### Perché un sistema di tema?

Senza tema:
```kotlin
Text("ciao", color = Color(0xFF18181B))
Text("sub", color = Color(0xFFA1A1AA))
// 200 posti nel codice con colori hardcoded
// Per cambiare il tema: modifica 200 posti
```

Con Material3:
```kotlin
Text("ciao", color = MaterialTheme.colorScheme.onBackground)
Text("sub", color = MaterialTheme.colorScheme.onSurfaceVariant)
// Per cambiare il tema: modifica solo Theme.kt
```

### Il ColorScheme di Material3

```kotlin
// Theme.kt
private val DarkColorScheme = darkColorScheme(
    background       = Zinc950,    // sfondo principale
    surface          = Zinc950,    // superfici di card, sheet
    surfaceVariant   = Zinc900,    // variante leggermente più chiara
    onBackground     = Zinc100,    // testo SU sfondo
    onSurface        = Zinc100,    // testo SU superficie
    onSurfaceVariant = Zinc400,    // testo secondario
    primary          = Zinc100,    // colore primario (bottoni, accenti)
    ...
)
```

**La convenzione `on*`**: il prefisso `on` indica "colore del contenuto che sta sopra X". `onBackground` è il colore del testo che sta sopra il `background`. Così i colori sono sempre in coppia con contrasto garantito.

**Zinc**: è la scala di grigi del progetto (da Tailwind CSS). `Zinc950` è quasi nero, `Zinc100` è quasi bianco.

### Come si applica il tema

```kotlin
// MainActivity.kt
setContent {
    MinimalOSTheme {          // ← tutto dentro qui ha accesso al tema
        MinimalOSNavGraph(navController)
    }
}
```

`MinimalOSTheme` è un Composable che mette a disposizione il `ColorScheme` e la `Typography` tramite **CompositionLocal** — un meccanismo di Compose che passa dati "implicitamente" a tutti i Composable figli, senza passarli esplicitamente come parametri.

### Typography

```kotlin
// usato in HomeScreen.kt
style = MaterialTheme.typography.displayLarge   // testo grande (l'ora)
style = MaterialTheme.typography.bodySmall       // testo piccolo (la data)
```

Material3 definisce una scala tipografica: `displayLarge`, `displayMedium`, `displaySmall`, `headlineLarge`, ..., `bodySmall`, `labelSmall`. Ognuno ha size, weight e letterSpacing prestabiliti per garantire gerarchia visiva coerente.

---

## 8. Navigation Compose

### Il problema: una sola Activity

Android tradizionale: ogni schermata era una `Activity` separata (un file Java/Kotlin separato, un file XML separato). Navigare = avviare una nuova Activity.

**Il problema**: Activities sono pesanti. Passare dati tra Activity è verboso. L'animazione di transizione è difficile da personalizzare.

**La soluzione moderna**: una sola Activity (`MainActivity`), più schermate come Composable, con Navigation Compose che gestisce il routing.

### Le tre parti

**1. Routes — dove puoi andare**
```kotlin
// Routes.kt
sealed class Route(val path: String) {
    data object Home     : Route("home")
    data object Drawer   : Route("drawer")
    data object Settings : Route("settings")
}
```
Route definisce le "destinazioni" come costanti tipizzate. Usare `Route.Home.path` invece della stringa `"home"` evita typo e rende il codice refactorable.

**2. NavGraph — mappa delle connessioni**
```kotlin
// MinimalOSNavGraph.kt
@Composable
fun MinimalOSNavGraph(navController: NavHostController) {
    NavHost(navController, startDestination = Route.Home.path) {
        composable(Route.Home.path)     { HomeScreen() }
        composable(Route.Drawer.path)   { DrawerScreen() }
        composable(Route.Settings.path) { SettingsScreen() }
    }
}
```
`NavHost` è il "contenitore" delle schermate. Mostra solo la schermata corrente. `startDestination` dice quale schermata mostrare all'avvio.

**3. NavController — come navighi**
```kotlin
// per navigare da HomeScreen a Drawer:
navController.navigate(Route.Drawer.path)

// per tornare indietro:
navController.popBackStack()
```

Il `NavController` gestisce anche la **back stack** — la pila di schermate visitate. Premendo Back, si torna alla schermata precedente.

### Come arriva navController a HomeScreen?

```kotlin
// MainActivity.kt
val navController = rememberNavController()
MinimalOSNavGraph(navController)
```

`rememberNavController()` crea un NavController e lo ricorda attraverso le ricomposizioni. Viene passato al NavGraph, che lo passa a ogni schermata che ne ha bisogno.

---

## 9. ViewModel e StateFlow

### Perché ViewModel?

Problema: le Activity e i Composable vengono distrutti e ricreati spesso (rotazione schermo, cambio lingua, ecc.). Se salvi lo stato dentro la schermata, lo perdi ogni volta.

**ViewModel** sopravvive a queste ricreazioni. È il posto giusto per:
- Stato UI che non deve essere perso
- Logica di business
- Chiamate a Repository

```
Activity ricreata → ViewModel sopravvive → UI rilegge lo stato dal ViewModel
```

### StateFlow

```kotlin
class HomeViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    fun loadApps() {
        viewModelScope.launch {
            val apps = repository.getInstalledApps()
            _uiState.update { it.copy(apps = apps) }
        }
    }
}
```

**`StateFlow`**: un flusso di valori che ha sempre un valore corrente. È "osservabile" — chi lo ascolta riceve ogni aggiornamento.

**Pattern `_uiState` / `uiState`**: il campo privato mutabile (`MutableStateFlow`) è modificabile solo dal ViewModel. L'esterno vede solo `StateFlow` read-only. Impedisce alla UI di modificare direttamente lo stato.

**Nel Composable**:
```kotlin
@Composable
fun HomeScreen(viewModel: HomeViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    // uiState viene aggiornato automaticamente ogni volta che il ViewModel emette
}
```

`collectAsStateWithLifecycle()` converte un `StateFlow` in uno `State` di Compose, interrompendo la raccolta quando il Composable non è visibile (risparmio batteria).

### `viewModelScope`

```kotlin
viewModelScope.launch {
    val apps = repository.getInstalledApps()  // operazione lenta
}
```

`viewModelScope` è uno scope di coroutine legato al ciclo di vita del ViewModel. Quando il ViewModel viene distrutto (l'utente esce dall'app), tutte le coroutine lanciate con `viewModelScope` vengono cancellate automaticamente. Niente memory leak.

---

## 10. DataStore — Persistenza

### Perché non SharedPreferences?

`SharedPreferences` è la vecchia API per salvare preferenze. Problemi:
- Operazioni sincrone — blocca il thread UI
- Nessun supporto per Flow/coroutine
- Thread-unsafe in certi casi

**DataStore** risolve tutto questo:
- Asincrono (suspend + Flow)
- Thread-safe
- Supporta tipi tipizzati

### Come funziona nel progetto

```kotlin
// UserPreferencesDataStore.kt
private val Context.dataStore: DataStore<Preferences> by preferencesDataStore("user_prefs")

@Singleton
class UserPreferencesDataStore @Inject constructor(
    @ApplicationContext private val context: Context
) {
    val data: Flow<UserPreferences> = context.dataStore.data
        .catch { if (it is IOException) emit(emptyPreferences()) else throw it }
        .map { UserPreferences() }
}
```

**`by preferencesDataStore("user_prefs")`**: crea un DataStore con nome file `user_prefs.preferences_pb` sul disco. Il `by` è un Kotlin delegate — aggiunge la proprietà `dataStore` direttamente alla classe `Context`.

**`context.dataStore.data`**: restituisce un `Flow<Preferences>` — un flusso di dati che emette ogni volta che le preferenze cambiano. Leggerlo è come iscriversi a notifiche di aggiornamento.

**`.catch { ... }`**: gestione errori. Se la lettura del file fallisce con `IOException` (file corrotto, permessi), emette preferenze vuote invece di crashare.

**`.map { ... }`**: trasforma `Preferences` (formato interno DataStore) in `UserPreferences` (il modello di dominio). Per ora è vuota perché le preferenze vere arriveranno nelle fasi successive.

### Leggere e scrivere

```kotlin
// leggere (nel ViewModel)
dataStore.data.collect { prefs ->
    // prefs è un UserPreferences aggiornato
}

// scrivere
context.dataStore.edit { preferences ->
    preferences[FONT_SIZE_KEY] = 16
}
```

`edit` è una `suspend fun` — va chiamata dentro una coroutine.

---

## 11. Android Launcher APIs

### PackageManager — leggere le app installate

```kotlin
// di/AppModule.kt
@Provides
@Singleton
fun providePackageManager(@ApplicationContext ctx: Context): PackageManager =
    ctx.packageManager
```

`PackageManager` è il servizio Android che gestisce tutte le app installate. Nel progetto viene iniettato via Hilt come singleton (non ha senso crearne più istanze).

**Come si usa per ottenere le app installate** (codice che sarà nel Repository):
```kotlin
val intent = Intent(Intent.ACTION_MAIN, null).apply {
    addCategory(Intent.CATEGORY_LAUNCHER)
}
val apps: List<ResolveInfo> = packageManager.queryIntentActivities(intent, 0)
```

Questo chiede ad Android: "dimmi tutte le app che hanno un'icona nel launcher". Restituisce una lista di `ResolveInfo`, che poi convertiamo in `AppInfo`:

```kotlin
apps.map { resolveInfo ->
    AppInfo(
        packageName = resolveInfo.activityInfo.packageName,
        label = resolveInfo.loadLabel(packageManager).toString(),
        icon = resolveInfo.loadIcon(packageManager)
    )
}
```

### Avviare un'app

```kotlin
val intent = packageManager.getLaunchIntentForPackage("com.spotify.music")
context.startActivity(intent)
```

Semplice: chiedi al `PackageManager` l'Intent di avvio, poi avvialo.

### Intent — Il sistema di messaggi di Android

`Intent` è il meccanismo con cui le app comunicano su Android. Esistono due tipi:

**Esplicito**: "avvia questa specifica classe"
```kotlin
Intent(context, SettingsActivity::class.java)
```

**Implicito**: "avvia qualcosa che sa fare X"
```kotlin
Intent(Intent.ACTION_VIEW, Uri.parse("spotify://"))
// Android trova l'app giusta (Spotify) e la apre
```

Il Launcher usa principalmente Intent impliciti con `ACTION_MAIN` + `CATEGORY_LAUNCHER` per trovare le app con icona.

---

## 12. Flusso Completo

Vediamo come tutto si collega nell'app reale:

### Avvio dell'app

```
Android preme il pulsante Home
    → trova MainActivity (ha intent-filter HOME)
    → crea MinimalOSApplication (@HiltAndroidApp → Hilt si inizializza)
    → crea MainActivity (@AndroidEntryPoint)
    → onCreate():
        enableEdgeToEdge()           ← UI si estende fino ai bordi
        setContent {
            MinimalOSTheme {         ← tema applicato a tutto
                navController = rememberNavController()
                MinimalOSNavGraph(navController)  ← mostra Home
            }
        }
```

### HomeScreen — l'orologio

```
MinimalOSNavGraph
    → Route.Home → HomeScreen()
        → remember { mutableStateOf(now()) }   ← stato locale: tempo corrente
        → LaunchedEffect(Unit) {               ← coroutine che aggiorna ogni secondo
            while(true) { time = now(); delay(1000) }
          }
        → Column { Text(ora), Text(data) }     ← UI dichiarativa
        
Ogni secondo:
    delay(1000) finisce
    → time = LocalDateTime.now()
    → mutableStateOf notifica Compose
    → solo i due Text vengono ricomposti
    → schermo aggiornato
```

### Grafico delle dipendenze (Hilt)

```
Hilt gestisce:
    PackageManager    ← fornito da AppModule (@Singleton)
        ↑
    AppRepository     ← @Inject constructor(PackageManager)
        ↑
    HomeViewModel     ← @HiltViewModel @Inject constructor(AppRepository)
        ↑
    HomeScreen        ← viewModel: HomeViewModel = hiltViewModel()
```

Hilt costruisce tutto automaticamente nell'ordine giusto. Tu scrivi solo le annotazioni.

### Navigazione

```
Utente swipe verso l'alto su HomeScreen
    → navController.navigate(Route.Drawer.path)
    → NavHost mostra DrawerScreen
    → HomeScreen rimane in back stack

Utente preme Back
    → navController.popBackStack()
    → NavHost torna a HomeScreen
    → HomeScreen è già in memoria, non viene ricreata
```

---

## Riepilogo — Perché ogni scelta

| Tecnologia | Alternativa scartata | Perché questa scelta |
|---|---|---|
| Jetpack Compose | XML + View | Meno codice, state management integrato, no mismatch UI/codice |
| Hilt | Passare dipendenze a mano | Gestione automatica ciclo vita, testabilità, no boilerplate |
| DataStore | SharedPreferences | Asincrono, Flow-based, thread-safe |
| Navigation Compose | Activity multiple | Una Activity = transizioni fluide, stato condiviso facile |
| StateFlow | LiveData | Kotlin-first, coroutine-native, funziona anche fuori da Activity |
| Clean Architecture | Tutto in Activity/Fragment | Testabilità, separazione responsabilità, manutenibilità |
| `sealed class` per Route | Stringhe costanti | Type-safe, il compilatore verifica tutti i casi |
| `data class` per modelli | Classi normali | `equals`/`copy`/`toString` gratis, immutabilità |

---

*Documento generato su: 2026-05-15 — aggiorna quando il progetto evolve.*
