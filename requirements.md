# Cerințe aplicație web pentru gestionarea notelor școlare

Aplicație web pentru gestionarea notelor școlare, care permite utilizatorilor să își introducă materiile și notele, să calculeze media și să primească sugestii pentru îmbunătățirea mediei.

Scopul acestei aplicații este de a oferi elevilor un instrument simplu și eficient pentru a-și urmări performanțele școlare și pentru a primi feedback în timp real despre cum pot îmbunătăți media la diferite materii.

Designul aplicației va fi simplu și intuitiv, cu o interfață prietenoasă copiilor care să permită utilizatorilor să adauge, să editeze și să șteargă materiile și notele cu ușurință. Aplicația va fi responsive, astfel încât să poată fi utilizată atât pe desktop, cât și pe dispozitive mobile.

## Cerințe funcționale

- Utilizatorul poate introduce, edita și șterge materiile pe care le are.
- Pentru fiecare materie, utilizatorul poate introduce opțional **numele profesorului** (câmp liber, vizibil și editabil doar când cardul este expandat).
- Pentru fiecare materie, utilizatorul poate introduce, edita și șterge notele.
- Aplicația calculează automat media **rotunjită** (Math.round) pentru fiecare materie.
- Media fiecărei materii afișată în badge-ul din dreapta titlului este cea rotunjită.
- Media generală se calculează ca media aritmetică a mediilor rotunjite ale tuturor materiilor.
- Fiecare card de materie afișează numărul de note într-un badge gri, aliniat la dreapta lângă media rotunjită.
- Sortare materii după: **Alfabetic**, **Medie**, **Nr. note** — cu direcție crescătoare/descrescătoare. Clic pe butonul activ comută direcția (↑/↓).
- Cardurile de materii pot fi colapsate/expandate individual (buton chevron în header).
- Butoane globale „Restrânge tot" / „Extinde tot" deasupra grilei de materii.
- Când un card este colaps, se afișează doar titlul materiei, numărul de note și media rotunjită.
- Datele cu notele și materiile sunt salvate local (localStorage), astfel încât nu se pierd la refresh sau închidere browser.
- Fără login: datele rămân doar pe device-ul utilizatorului.
- Export notele și materiile în format **CSV** (descărcare fișier, UTF-8 cu BOM pentru compatibilitate Excel) — include coloana `Profesor` după `Materie`.
- Import note din fișier **CSV** (înlocuiește datele existente după confirmare) — suportă atât formatul nou (cu coloana `Profesor`) cât și formatul vechi (fără).
- Fișier exemplu de import furnizat: `exemplu-cl-7.csv`.
- Buton **„Materii implicite"**: la apăsare, elevul selectează clasa (1–12) dintr-un modal; materiile standard pentru acea clasă sunt adăugate automat (cele deja existente sunt ignorate). Datele sunt bazate pe programa școlară națională românească.
- Bara de jos conține: câmp adăugare materie + butoane Materii implicite / Import CSV / Export CSV.
- Media Generală afișată cu 2 zecimale.

### Funcție de „Smart hints"

- Slider interactiv (1–10) pe fiecare card de materie.
- Simulare: dacă elevul ar lua nota X în plus, media rotunjită a materiei ar deveni Y.
- Afișează delta față de media actuală rotunjită (+1, -1 etc.).
- Scopul: motivarea elevului să îmbunătățească performanța la materiile slabe.

## Cerințe non-funcționale

- Interfață prietenoasă, intuitivă și responsive (utilizabilă pe mobil și desktop).
- Aplicația va fi publicată pe GitHub Pages.
- Deployed pe GitHub Pages cu workflow automat (GitHub Actions) pentru build și deploy.
- Repository: `git@github.com:im-trainer/school-grades.git`

## Cerințe suplimentare (de validat pe parcurs)

- Statistici suplimentare sau istoric note.
- Temă light/dark (opțional).

## Documentare și mentenanță

- Toate cerințele vor fi actualizate în acest fișier pe măsură ce proiectul evoluează.
