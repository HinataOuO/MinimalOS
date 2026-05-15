Implementa un task specifico dal piano della fase corrente.

**Argomento:** ID task (es. `T1`, `T2`, `T3` ...) oppure `T1 phase2_launcher` per fase diversa da quella corrente.

**Procedura:**
1. Leggi il file di piano in `.claude/plans/` — se non specificato usa `phase1_foundation.md`
2. Trova la sezione del task richiesto (es. `### T1`)
3. Leggi SOLO i file sorgente menzionati in quel task — niente esplorazione aggiuntiva
4. Implementa esattamente quanto descritto nel task, niente di più
5. Verifica che il codice compili (controlla imports, syntax Kotlin/Compose)
6. Riporta: file creati/modificati + eventuali note dal piano

**Argomento ricevuto:** $ARGUMENTS
