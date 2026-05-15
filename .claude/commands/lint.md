Esegui lint Android e mostra solo warning/errori rilevanti (no boilerplate).

**Procedura:**
1. Esegui: `cd /home/hina/AndroidStudioProjects/MinimalOS && ./gradlew lint 2>&1`
2. Leggi report XML: `app/build/reports/lint-results-debug.xml`
3. Filtra: mostra solo severity `error` e `warning` — ignora `informational`
4. Ignora: `ObsoleteLintCustomCheck`, `GradleDependency` (versioni), `MissingTranslation`
5. Output per ogni issue: `file:riga — [ID] messaggio`
6. Raggruppa per categoria (Correctness, Performance, Usability)
