Mostra stato implementazione della fase corrente: task done vs missing.

**Procedura:**
1. Leggi `.claude/plans/phase1_foundation.md` (o specifica la fase: `$ARGUMENTS`)
2. Per ogni task (T1..T9), estrai i file che il task deve creare/modificare
3. Controlla se quei file esistono con `find app/src -name "<filename>"`
4. Controlla se i file esistenti contengono i simboli chiave del task (class name, annotation)
5. Output tabella:

```
TASK | FILE                          | STATO
T1   | libs.versions.toml            | ✓ done / ✗ missing / ~ partial
T2   | MinimalOSApplication.kt       | ...
...
```

6. Suggerisci task da eseguire successivamente (primo non-done)

**Argomento ricevuto:** $ARGUMENTS
