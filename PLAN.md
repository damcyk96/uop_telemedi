# Telemedi – Medycyna Pracy (panel pracodawcy)

Plan aplikacji webowej, w której pracodawca wystawia skierowania na badania medycyny pracy, a Telemedi (przez call center) umawia je w sieci medycznej i odsyła termin.

> **Wersja: demo lokalne w ~3h.** Brak ekranu logowania (jeden domyślny koordynator), statusy zamockowane, backend to json-server. Rzeczy wycięte z pełnego MVP są w sekcji 12, otwarte kwestie w sekcji 13.

---

## 1. Kontekst

- Pracodawca (umowa o pracę, UoP) musi skierować pracownika na badania **wstępne** (przed startem pracy), **okresowe** i **kontrolne** (po L4 dłuższym niż 30 dni).
- Ubezpieczyciel tego nie obsługuje. Telemedi dostarcza aplikację, która łączy pracodawcę z siecią medyczną.
- Skierowanie musi zawierać czynniki narażenia na stanowisku (np. wysoka temperatura, prowadzenie pojazdu), bo od nich zależy zakres badania.

### Aktorzy

| Aktor | Rola | W demo? |
|---|---|---|
| **Pracodawca** (HR, kierownik) | Zarządza pracownikami, czynnikami i szablonami, wystawia skierowania | ✅ Tak |
| **Telemedi (aplikacja)** | Przyjmuje skierowanie jako zlecenie (order) | ✅ Tak |
| **Call center Telemedi** | Umawia termin w sieci medycznej | ❌ Nie, statusy są zamockowane w danych |
| **Sieć medyczna** | Wykonuje badanie, wydaje orzeczenie | ❌ Nie |

### Przepływ biznesowy

```
Pracodawca                Aplikacja Telemedi          Call center            Sieć medyczna
    │  wystawia skierowanie      │                          │                       │
    │──────────────────────────▶ │  order (skierowanie)     │                       │
    │                            │────────────────────────▶ │  "badanie w Krakowie, │
    │                            │                          │   do dnia X"          │
    │                            │                          │─────────────────────▶ │
    │                            │                          │ ◀── termin, placówka  │
    │                            │ ◀── status: UMÓWIONE     │                       │
    │ ◀── placówka, data, godz.  │                          │                       │
```

---

## 2. Zakres demo (3h)

### W zakresie
1. **Lista pracowników:** dodawanie, edycja, usuwanie, wyszukiwarka, import i eksport XLSX, wzór XLSX
2. **Czynniki narażenia:** 5 stałych kategorii, czynniki systemowe (tylko do odczytu) i własne (dodaj, usuń)
3. **Szablony skierowań:** nazwa i zestaw czynników
4. **Formularz wystawienia skierowania** na jednej stronie, z przyciskiem „Wygeneruj”
5. **Lista skierowań (tylko odczyt):** zamockowany status, podgląd PDF w modalu
6. **Zarządzanie użytkownikami:** koordynator dodaje nowe osoby HR, system generuje im login i hasło

### Założenia
- **Brak ekranu logowania.** Aplikacja otwiera się od razu jako jeden domyślny, „zalogowany” użytkownik: **koordynator** (np. dyrektor działu HR), na sztywno w danych. Nie ma przełączania między użytkownikami.
- Konta dodanych osób HR istnieją tylko jako dane (login i hasło do przekazania), nikt się na nie w demo nie loguje.
- **Dane firmy na sztywno** w danych startowych, bez ekranu edycji.
- **Statusy zamockowane i bez znaczenia dla logiki:** skierowania startowe mają różne statusy, nowe skierowanie dostaje „Wystawione”. Nic ich nie zmienia.
- **Skierowanie po wystawieniu jest tylko do odczytu:** brak edycji, duplikowania i usuwania.
- **Demo tylko lokalnie** (`npm run dev`).
- Tylko desktop, język polski.

---

## 3. Stack

| Obszar | Wybór |
|---|---|
| Build | Vite + React + TypeScript |
| Routing | React Router |
| UI | Tailwind CSS + shadcn/ui, ikony lucide-react |
| Formularze i walidacja | react-hook-form + zod |
| Backend (mock) | **json-server `0.17.4`** (plik `server/db.json`) |
| Pobieranie danych | TanStack Query + `fetch` |
| XLSX | SheetJS (`xlsx`) |
| PDF | `@react-pdf/renderer` |
| Daty | date-fns (locale `pl`) |

**PDF i polskie znaki:** świadomie nieobsługiwane w demo. PDF używa domyślnego fontu `@react-pdf/renderer` (Helvetica), więc znaki „ąęłśż” mogą wyświetlać się niepoprawnie. Poprawka po demo: rejestracja fontu `.ttf` z polskimi znakami (np. Manrope).

### json-server

Wystawia REST API z pliku `server/db.json`: każda tablica to zasób z pełnym CRUD, a zmiany zapisują się do pliku.

```jsonc
// server/db.seed.json – dane startowe; npm run db:reset kopiuje je do db.json
{
  "company":   { "name": "Przykładowa Firma Sp. z o.o.", "nip": "5250000000", "address": { ... } },
  "employees": [ ... ],   // ok. 8 pracowników
  "factors":   [ ... ],   // 9 systemowych
  "templates": [ ... ],   // 3 szablony
  "referrals": [ ... ],   // ok. 6 skierowań w różnych statusach
  "users":     [ ... ]    // 1 koordynator (domyślnie „zalogowany”) + ew. osoby HR
}
```

| Endpoint | Użycie |
|---|---|
| `GET /company` | Nazwa firmy w topbarze, dane pracodawcy na PDF |
| `GET/POST /users` | Lista użytkowników, dodanie osoby HR |
| `GET/POST/PUT/DELETE /employees` (`?q=` do wyszukiwania) | Pracownicy, import (POST per wiersz) |
| `GET/POST/DELETE /factors` | Czynniki |
| `GET/POST/PUT/DELETE /templates` | Szablony |
| `GET/POST /referrals` (`?_sort=createdAt&_order=desc`) | Lista i wystawienie skierowania |

```json
"dev":      "concurrently \"vite\" \"npm:api\"",
"api":      "json-server --watch server/db.json --port 3001",
"db:reset": "cp server/db.seed.json server/db.json"
```
Proxy Vite: `/api` → `http://localhost:3001`.

`0.17.4`, a nie `1.x`: wersja 1.0 jest w becie i zmieniła składnię zapytań (m.in. usunięte `q`).

---

## 4. Walidacja: co gdzie

json-server nie ma żadnej logiki: zapisze każdy JSON. **Dlatego cała walidacja w demo jest na froncie**, w schematach zod w `src/domain/schemas.ts`, używanych przez formularze i import XLSX.

| Reguła | Gdzie | Jak |
|---|---|---|
| Pola wymagane, formaty (kod pocztowy `00-000`, e-mail, telefon) | Front | zod, błąd pod polem |
| PESEL: 11 cyfr i suma kontrolna, wyliczenie daty urodzenia | Front | `lib/pesel.ts` + `refine` w zod |
| PESEL albo (dokument + data urodzenia) | Front | `superRefine` zależny od przełącznika „posiada PESEL” |
| Termin dostarczenia orzeczenia nie w przeszłości | Front | zod |
| Co najmniej pracownik, rodzaj badania i termin przy „Wygeneruj” | Front | zod |
| Wiersze importu XLSX | Front | ten sam schemat pracownika per wiersz, błędne wiersze pomijane |
| Unikalność PESEL | Front | porównanie z listą pracowników pobraną z API (przed zapisem i przy imporcie) |
| Czynnika systemowego nie można usunąć | Front | brak przycisku usuwania dla `source: "SYSTEM"` |
| Unikalna nazwa czynnika w kategorii | Front | porównanie z listą czynników |

**Uwaga na przyszłość:** walidacja na froncie służy wygodzie użytkownika, ale nie chroni danych (każdy może wysłać request z pominięciem UI). Przy prawdziwym backendzie te same reguły trzeba powtórzyć na serwerze. Przy backendzie w Node można użyć tych samych schematów zod po obu stronach. Unikalność PESEL i uprawnienia muszą być sprawdzane na serwerze.

Opcjonalnie (poza 3h): json-server `0.17` przyjmuje `--middlewares`, więc prostą walidację serwerową (np. odrzucenie duplikatu PESEL kodem 409) można dodać jednym plikiem `server/validate.js`.

---

## 5. Design (spójny z telemedi.com/pl)

Wartości wyciągnięte z CSS strony telemedi.com/pl:

| Token | Wartość | Użycie |
|---|---|---|
| `--brand-primary` | `#19301E` | Sidebar, nagłówki, przyciski główne |
| `--brand-primary-hover` | `#1F4A3F` | Hover przycisków |
| `--brand-accent` | `#4EC96F` | Akcenty, aktywna pozycja menu, focus |
| `--brand-accent-strong` | `#20A869` | Linki, badge „Umówione” |
| `--brand-accent-soft` | `#E8F5ED` | Tła zaznaczeń |
| `--brand-pane` | `#F8F6F3` | Tło aplikacji |
| `--brand-cream` | `#F0EDE8` | Obramowania, tła kart drugorzędnych |
| `--text` / `--text-muted` | `#3C3F3D` / `#6B6D6C` | Tekst |
| `--warning` | `#F2BB39` | Termin blisko, „W trakcie realizacji” |
| `--danger` | `#EA4335` | Błędy, termin przekroczony |
| Font | **Manrope** (Google Fonts) | Aplikacja (PDF: domyślna Helvetica) |
| Radius | 6 / 12 / 20 px | Inputy / karty / modale |

Tokeny jako zmienne CSS w `index.css`, zmapowane na kolory shadcn (`primary`, `accent`…).

**Layout:** sidebar `#19301E` z logo Telemedi i pozycjami Skierowania, Pracownicy, Czynniki narażenia, Szablony, Użytkownicy. Topbar z nazwą firmy, przyciskiem **„+ Wystaw skierowanie”** i domyślnym użytkownikiem (np. „Katarzyna Zielińska, Koordynator HR”, bez menu i przełączania).

---

## 6. Routing

| Ścieżka | Ekran |
|---|---|
| `/` | Redirect na `/skierowania` |
| `/skierowania` | Lista skierowań |
| `/skierowania/nowe` | Formularz (`?employeeId=` do prefillu pracownika) |
| `/pracownicy` | Lista pracowników, formularz w dialogu, import i eksport |
| `/czynniki` | Czynniki narażenia |
| `/szablony` | Szablony, edytor w dialogu |
| `/uzytkownicy` | Lista użytkowników, dodanie osoby HR w dialogu |

---

## 7. Model danych

```ts
type ID = string;

interface Address { street: string; postalCode: string; city: string; }

interface Company { name: string; nip: string; address: Address; }   // tylko odczyt

interface User {
  id: ID;
  firstName: string;
  lastName: string;
  role: 'COORDINATOR' | 'HR';       // COORDINATOR = domyślny „zalogowany”, w seedzie
  login: string;                    // imie.nazwisko (+ numer przy powtórzeniu)
  password: string;                 // zawsze "Haslo123!" (mock, jawnym tekstem)
  createdAt: string;
}

interface Employee {
  id: ID;
  firstName: string;
  lastName: string;
  hasPesel: boolean;
  pesel?: string;                                   // gdy hasPesel
  documentType?: 'passport' | 'id_card' | 'residence_card' | 'other'; // gdy !hasPesel
  documentNumber?: string;                          // gdy !hasPesel
  birthDate?: string;                               // gdy !hasPesel (RRRR-MM-DD)
  address: Address;                                 // miejsce zamieszkania
  phone?: string;
  email?: string;
  position: string;                                 // stanowisko
}

type FactorCategory = 'PHYSICAL' | 'DUST' | 'CHEMICAL' | 'BIOLOGICAL' | 'OTHER';

interface ExposureFactor {
  id: ID;
  category: FactorCategory;
  name: string;
  source: 'SYSTEM' | 'CUSTOM';
}

interface ReferralTemplate {
  id: ID;
  name: string;
  factorIds: ID[];
}

type ExamType = 'INITIAL' | 'PERIODIC' | 'CONTROL';
type ReferralStatus = 'ISSUED' | 'IN_PROGRESS' | 'SCHEDULED' | 'COMPLETED';

interface Referral {
  id: ID;
  number: string;                   // SK/2026/09/0001
  examType: ExamType;
  employee: Employee;               // kopia danych z chwili wystawienia
  position: string;
  workConditions?: string;          // opis warunków pracy
  factors: ExposureFactor[];        // kopia wybranych czynników
  resultDeadline: string;           // ⭐ termin dostarczenia orzeczenia
  preferredCity: string;            // miejscowość badania (dla call center)
  notes?: string;                   // uwagi dla call center
  status: ReferralStatus;           // mock, bez wpływu na logikę
  createdAt: string;
}
```

Skierowanie przechowuje **kopię** pracownika i czynników, więc późniejsza edycja pracownika czy usunięcie czynnika nie zmienia wygenerowanego PDF-a. W json-serverze to najprostsze rozwiązanie (brak relacji).

**Numeracja:** `SK/RRRR/MM/NNNN`, gdzie `NNNN` = liczba skierowań + 1. Bez obsługi kolizji.

---

## 8. Ekrany

### 8.1 Pracownicy
- **Tabela:** imię i nazwisko, PESEL lub dokument, stanowisko, miejscowość, telefon, akcje (edytuj, wystaw skierowanie, usuń z potwierdzeniem).
- Wyszukiwarka nad tabelą (`?q=`).
- **Formularz (dialog):**
  - Imię\*, nazwisko\*
  - Przełącznik „Pracownik posiada PESEL”: tak → PESEL\*; nie → rodzaj dokumentu\*, numer dokumentu\*, data urodzenia\*
  - Ulica i nr\*, kod pocztowy\*, miejscowość\*
  - Telefon, e-mail
  - Stanowisko\*
- „Wystaw skierowanie” przechodzi do `/skierowania/nowe?employeeId=…`.

**XLSX (3 przyciski nad tabelą):**
- **Pobierz wzór** → `pracownicy_wzor.xlsx`:
  - wiersz 1: instrukcja per kolumna (np. „Wymagane, 11 cyfr. Puste, jeśli brak PESEL”)
  - wiersz 2: nagłówki
  - wiersz 3: przykładowy pracownik
  - kolumny: `Imię | Nazwisko | PESEL | Rodzaj dokumentu | Numer dokumentu | Data urodzenia | Ulica i nr | Kod pocztowy | Miejscowość | Telefon | E-mail | Stanowisko`
- **Importuj** → wybór pliku. Dane czytane od wiersza 3, każdy wiersz sprawdzany schematem zod i unikalnością PESEL. Poprawne są zapisywane, a toast pokazuje podsumowanie: „Dodano 9, pominięto 1 (wiersz 7: nieprawidłowy PESEL)”.
- **Eksportuj** → `pracownicy.xlsx` w tym samym układzie co wzór, więc da się go zaimportować z powrotem.

### 8.2 Czynniki narażenia
**Kategorie są stałe** (zgodne ze wzorem skierowania): I. Fizyczne · II. Pyły · III. Chemiczne · IV. Biologiczne · V. Inne, w tym niebezpieczne.

- Jedna strona z 5 kartami (po jednej na kategorię). W każdej lista czynników z badge „Telemedi” (kłódka, bez akcji) lub „Własny” (przycisk usuń) oraz pole „+ Dodaj czynnik”.
- **Czynniki systemowe** (nazwy zgodne z załącznikiem nr 1 do rozporządzenia MZiOS z 30.05.1996, Dz.U. 2023 poz. 607):

  | Kategoria | Czynniki |
  |---|---|
  | I. Fizyczne | Hałas · Mikroklimat gorący (wysoka temperatura) · Drgania ogólne |
  | II. Pyły | brak, tylko własne |
  | III. Chemiczne | Benzen · Formaldehyd · Mieszaniny rozpuszczalników organicznych |
  | IV. Biologiczne | brak, tylko własne |
  | V. Inne, w tym niebezpieczne | Obsługa monitora ekranowego · Prowadzenie pojazdu kat. B w ramach obowiązków służbowych · Praca na wysokości |

### 8.3 Szablony skierowań
- Lista kart: nazwa, liczba czynników, chipy z nazwami czynników, akcje (edytuj, usuń).
- **Edytor (dialog):** nazwa\* i checkboxy czynników pogrupowane w 5 kategoriach.
- Szablony startowe:
  - „Prace biurowe”: obsługa monitora ekranowego
  - „Przedstawiciel handlowy”: obsługa monitora ekranowego, prowadzenie pojazdu kat. B
  - „Pracownik produkcji”: hałas, drgania ogólne, mikroklimat gorący, mieszaniny rozpuszczalników organicznych

### 8.4 Wystawienie skierowania (jedna strona, sekcje)

| Sekcja | Pola | Reguły |
|---|---|---|
| **1. Rodzaj badania** | Karty wyboru: Wstępne / Okresowe / Kontrolne | Przy „Kontrolne” podpowiedź: „po L4 dłuższym niż 30 dni” |
| **2. Pracownik** | Combobox z wyszukiwaniem, pod nim karta z danymi | Stanowisko uzupełnia się z danych pracownika i można je zmienić |
| **3. Czynniki narażenia** | Select „Szablon” + checkboxy w 5 kategoriach (zawsze widocznych) + opis warunków pracy | Wybór szablonu zaznacza jego czynniki, potem można je zmieniać. Licznik „Łączna liczba czynników: N” |
| **4. Termin** | ⭐ **Termin dostarczenia orzeczenia\*** (datepicker, wyróżnione pole), miejscowość badania\* (domyślnie miasto pracownika), uwagi dla call center | Termin nie w przeszłości |

- Przycisk **„Wygeneruj skierowanie”**: walidacja, nadanie numeru, zapis ze statusem „Wystawione”, przejście na listę, otwarcie podglądu PDF i toast „Skierowanie wystawione”.

### 8.5 Lista skierowań (tylko odczyt)
- **Tabela:** nr, pracownik, stanowisko, rodzaj badania, data wystawienia, termin orzeczenia, status (badge), akcja 👁 **Podgląd PDF**.
- Podgląd PDF w modalu z `<PDFViewer>`. Pobranie i druk są z paska wbudowanego podglądu przeglądarki, bez osobnego przycisku.
- Brak edycji, duplikowania, usuwania, filtrów i strony szczegółów. Sortowanie: najnowsze na górze.

**Statusy (zamockowane, tylko etykieta):**

| Status | Etykieta | Badge |
|---|---|---|
| ISSUED | Wystawione | niebieski |
| IN_PROGRESS | W trakcie realizacji | żółty `#F2BB39` |
| SCHEDULED | Umówione | zielony `#20A869` |
| COMPLETED | Zrealizowane | ciemnozielony `#19301E` |

### 8.6 Użytkownicy
**Cel:** domyślny użytkownik (koordynator, np. dyrektor działu HR) dodaje kolejne osoby HR. Tylko dodawanie, nic więcej.

- **Tabela:** imię i nazwisko, rola (Koordynator / HR), login, data dodania. Koordynator z seedu jest pierwszym wierszem.
- **„+ Dodaj osobę HR”** (dialog): imię\*, nazwisko\*.
- **Po zapisie** dialog pokazuje wygenerowane dane logowania z przyciskiem „Kopiuj”:
  - **login:** `imie.nazwisko` małymi literami, polskie znaki zamienione (ł→l, ś→s…), spacje i myślniki usunięte, np. „Łucja Żółkiewska” → `lucja.zolkiewska`. Przy powtórzeniu dopisywany numer: `anna.nowak2`, `anna.nowak3`
  - **hasło:** zawsze to samo hasło startowe `Haslo123!`
- Brak edycji, usuwania, resetu hasła, uprawnień i logowania na te konta.

---

## 9. PDF skierowania

Układ na podstawie urzędowego wzoru: **załącznik nr 3a** do rozporządzenia MZiOS z 30.05.1996 (Dz.U. 2023 poz. 607).

1. Nagłówek: dane pracodawcy (nazwa, adres, NIP) po lewej, miejscowość i data po prawej, nr skierowania.
2. **SKIEROWANIE NA BADANIA LEKARSKIE** z zaznaczonym rodzajem: ☒ wstępne ☐ okresowe ☐ kontrolne.
3. „Działając na podstawie art. 229 § 4a Kodeksu pracy kieruję na badania lekarskie:”
4. Imię i nazwisko, PESEL (albo dokument, jego numer i data urodzenia), adres zamieszkania.
5. Stanowisko i opis warunków pracy.
6. **Czynniki I–V, zawsze wszystkie kategorie**; przy pustej „brak”.
7. **Łączna liczba czynników wskazanych w skierowaniu: N**
8. **Termin dostarczenia orzeczenia** (wyróżniony) i miejscowość badania.
9. Stopka: miejsce na podpis pracodawcy, informacja o wydaniu w dwóch egzemplarzach.

Jeden komponent `<ReferralPdf referral company />` renderowany w `PDFViewer`. A4, domyślny font, akcent `#19301E`.

---

## 10. Struktura projektu

```
server/
  db.seed.json
  db.json                 # w .gitignore
src/
  app/                    # router, Layout (Sidebar, Topbar), QueryClientProvider
  components/ui/          # shadcn/ui
  components/             # StatusBadge, PageHeader, ConfirmDialog
  features/
    employees/            # EmployeesPage, EmployeeDialog, xlsx.ts
    factors/              # FactorsPage
    templates/            # TemplatesPage, TemplateDialog
    referrals/            # ReferralsPage, NewReferralPage, ReferralPdf.tsx, PdfPreviewDialog
    users/                # UsersPage, AddUserDialog
  api/                    # client.ts (fetch), hooks per zasób (TanStack Query)
  domain/                 # types.ts, schemas.ts (zod), labels.ts (etykiety PL)
  lib/                    # pesel.ts, referralNumber.ts, login.ts
  index.css               # tokeny brandu
```

---

## 11. Plan 3 godzin

| Czas | Zadanie | Rezultat |
|---|---|---|
| 0:00–0:20 | Vite, Tailwind, shadcn, tokeny, Manrope, layout, routing, json-server, proxy, skrypty | Pusta aplikacja w kolorach Telemedi z działającym API |
| 0:20–0:35 | `db.seed.json`, typy, schematy zod, `pesel.ts`, hooki API | Dane startowe i warstwa danych |
| 0:35–1:05 | Pracownicy: tabela, dialog, wzór, import, eksport XLSX | Moduł pracowników |
| 1:05–1:25 | Czynniki i szablony | 2 moduły |
| 1:25–2:00 | Formularz skierowania | Wystawianie skierowań |
| 2:00–2:25 | PDF skierowania (bez obsługi polskich znaków) | Podgląd |
| 2:25–2:35 | Lista skierowań (read-only), statusy, modal podglądu | Pełny przepływ skierowań |
| 2:35–2:50 | Użytkownicy: tabela, dodanie osoby HR, generowanie loginu | Moduł użytkowników |
| 2:50–3:00 | Przeklikanie scenariusza demo, poprawki | Gotowe demo |

### Scenariusz demo
1. Aplikacja otwiera się jako koordynator HR (imię w topbarze). Na liście skierowań widać przykładowe skierowania z różnymi statusami.
2. W „Użytkownicy” dodaję osobę HR „Anna Nowak”. Dialog pokazuje login `anna.nowak` i hasło `Haslo123!`, osoba pojawia się w tabeli. Druga „Anna Nowak” dostaje `anna.nowak2`.
3. Pobieram wzór XLSX, uzupełniam 3 pracowników (w tym jeden z błędnym PESEL), importuję. Dodanych 2, 1 pominięty z opisem błędu.
4. Dodaję własny czynnik „Obsługa wózków jezdniowych” w kategorii Inne.
5. Tworzę szablon „Magazynier” z tym czynnikiem i „Praca na wysokości”.
6. Wystawiam okresowe skierowanie dla zaimportowanego pracownika z szablonem „Magazynier” i terminem za 14 dni.
7. Skierowanie pojawia się na górze listy jako „Wystawione”. PDF pokazuje dane firmy i pracownika, wszystkie 5 kategorii (puste jako „brak”), łączną liczbę czynników 2 i termin orzeczenia.

---

## 12. Wycięte z pełnego MVP (kolejne kroki)

- Prawdziwe logowanie na konta HR, zmiana hasła startowego, edycja i usuwanie użytkowników
- Formularz w krokach, szkice („Niewystawione”) i ich edycja
- Edycja, duplikowanie i usuwanie skierowań, filtry listy
- Kreator importu z podglądem wierszy i aktualizacją duplikatów
- Symulacja call center (zmiana statusów, termin i placówka wizyty), oś czasu statusów, strona szczegółów skierowania
- Edycja czynników własnych, archiwizacja zamiast usuwania
- Walidacja po stronie serwera (patrz sekcja 4), logowanie, uprawnienia
- Polskie znaki w PDF (rejestracja fontu)
- Pełny słownik czynników z załącznika nr 1 i pole „wielkość narażenia” przy czynniku
- Dashboard, przypomnienia o badaniach okresowych, powiadomienia, orzeczenia, responsywność, testy

---

## 13. Do potwierdzenia
Brak otwartych kwestii. Plan gotowy do implementacji.
