Review compresso di un file Kotlin specifico — solo problemi reali, no elogio.

**Argomento:** path relativo del file (es. `ui/home/HomeScreen.kt`)

**Procedura:**
1. Costruisci path completo: `app/src/main/java/com/hina/minimalos/$ARGUMENTS`
2. Leggi il file
3. Review con focus su:
   - Correttezza Kotlin/Compose (recomposition, state hoisting, side effects)
   - Hilt DI corretto (scope, inject, module)
   - DataStore usage (coroutine scope, error handling)
   - Violazioni architettura progetto (ViewModel ↔ Repository ↔ UseCase)
   - Performance Compose (remember, derivedStateOf, keys)
4. Output formato: `riga: 🔴 CRITICO / 🟡 WARNING / 🔵 INFO — problema. Fix.`
5. Niente praise, niente commenti su stile formattazione

**Argomento ricevuto:** $ARGUMENTS
