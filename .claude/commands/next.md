Trova e implementa il prossimo task non completato della fase corrente — zero decisioni richieste.

**Procedura:**
1. Leggi `.claude/plans/phase1_foundation.md` (o specifica: `$ARGUMENTS`)
2. Per ogni task in ordine (T1, T2, ...), verifica se i file target esistono e sono implementati
3. Identifica il primo task incompleto
4. Annuncia: `→ Implemento [TX]: <descrizione task>`
5. Implementa quel task esattamente come descritto nel piano
6. Al termine: riporta cosa è stato creato/modificato

**Regola:** implementa UN solo task per volta, poi ferma e aspetta conferma.
