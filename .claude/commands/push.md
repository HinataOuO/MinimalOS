Esegui workflow git completo: stage → commit → push.

**Procedura:**

1. Esegui `git status` e `git diff` — mostra un riepilogo compatto di cosa cambierà (file modificati/aggiunti/eliminati)
2. Se non ci sono modifiche, fermati e avvisa l'utente
3. Esegui `git add .`
4. Esegui `git diff --staged` e `git log --oneline -5` per capire il contesto
5. **Se `$ARGUMENTS` non è vuoto:** usa `$ARGUMENTS` come messaggio commit, salta la generazione
6. **Se `$ARGUMENTS` è vuoto:** genera un messaggio commit in formato Conventional Commits:
   - Tipi: `feat` / `fix` / `refactor` / `style` / `chore` / `docs` / `test`
   - Scope opzionale in parentesi: `feat(drawer):`, `fix(home):`
   - Subject ≤50 char, imperativo, lowercase dopo il tipo
   - Body solo se il "perché" non è ovvio dal subject
   - Mostra il messaggio proposto e chiedi conferma all'utente prima di procedere
7. Esegui `git commit -m "<messaggio confermato>"`
8. Esegui `git push`
9. Riporta: branch pushato, hash commit, numero file cambiati

**Esempi di messaggi validi:**
```
feat(drawer): add category filter
fix(dock): prevent null crash on empty shortcut
refactor(home): extract grid logic to ViewModel
style(theme): update surface colors M3
chore: bump compileSdk to 36
```

**Uso:**
- `/push` → genera msg automaticamente, chiede conferma
- `/push "fix(home): corregge crash su lista vuota"` → usa msg fornito direttamente
