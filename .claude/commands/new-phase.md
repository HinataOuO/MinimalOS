Crea un nuovo file di piano per una fase del progetto.

**Argomento:** nome fase e descrizione breve (es. `phase2_launcher Implementazione grid app, gestures, HomeViewModel`)

**Procedura:**
1. Leggi `.claude/plans/phase1_foundation.md` come riferimento formato
2. Chiedi (o inferisci da $ARGUMENTS): obiettivo fase, dipendenze, deliverable
3. Crea `.claude/plans/<nome_fase>.md` con struttura:
   - Header: stato, dipendenze, sblocca
   - Obiettivo + deliverable
   - Scelte confermate (tabella)
   - Task T1..TN con: file target, codice completo da implementare
   - Verifica end-to-end
   - Note implementative
4. Task devono essere atomici: un task = un file o una modifica circoscritta
5. Ogni task deve includere il codice Kotlin/XML completo — niente "aggiungi X"

**Argomento ricevuto:** $ARGUMENTS
