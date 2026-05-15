Compila il progetto e mostra solo gli errori rilevanti.

**Procedura:**
1. Esegui: `cd /home/hina/AndroidStudioProjects/MinimalOS && ./gradlew assembleDebug 2>&1`
2. Filtra output: mostra solo righe con `error:`, `e:`, `FAILED`, `Exception`, `Unresolved reference`, `None of the following`
3. Raggruppa errori per file
4. Per ogni errore: file:riga + messaggio + causa probabile in 1 riga
5. Se build OK: mostra `BUILD SUCCESSFUL` + dimensione APK

**Niente output Gradle verboso — solo segnale utile.**
