# Telemedi — Medycyna Pracy

Demo panelu pracodawcy do obsługi badań medycyny pracy. Aplikacja pozwala zarządzać pracownikami i czynnikami narażenia, tworzyć szablony oraz wystawiać skierowania przekazywane do realizacji przez Telemedi.

Projekt jest lokalnym demonstratorem — nie zawiera logowania ani prawdziwej integracji z call center i siecią medyczną. Dane są przechowywane przez `json-server` w pliku JSON.

## Podgląd aplikacji

### Skierowania

![Lista skierowań](docs/screenshots/skierowania.png)

<details>
<summary>Zobacz pozostałe ekrany</summary>

### Wystawianie skierowania

![Formularz wystawiania skierowania](docs/screenshots/nowe-skierowanie.png)

### Pracownicy

![Lista pracowników](docs/screenshots/pracownicy.png)

### Szablony

![Szablony skierowań](docs/screenshots/szablony.png)

</details>

## Funkcje

- lista skierowań z przykładowymi statusami,
- wystawianie badań wstępnych, okresowych i kontrolnych,
- generowanie i podgląd skierowania PDF,
- dodawanie, edycja, wyszukiwanie i usuwanie pracowników,
- import oraz eksport pracowników w formacie XLSX,
- pobieranie gotowego wzoru arkusza XLSX,
- zarządzanie systemowymi i własnymi czynnikami narażenia,
- tworzenie i edycja szablonów skierowań,
- dodawanie użytkowników HR z automatycznie generowanym loginem,
- lokalne dane demonstracyjne z możliwością szybkiego resetu.

## Stos technologiczny

- React 18 + TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- `json-server` 0.17.4
- SheetJS (`xlsx`)
- `@react-pdf/renderer`
- Lucide React

## Wymagania

- Node.js 18 lub nowszy
- npm

## Uruchomienie lokalne

```bash
npm install
npm run db:reset
npm run dev
```

Aplikacja będzie dostępna pod adresem:

```text
http://localhost:5173
```

Mock API działa pod adresem:

```text
http://localhost:3001
```

Vite przekazuje zapytania z `/api` do lokalnego `json-server`.

## Dostępne skrypty

| Polecenie             | Działanie                                       |
| --------------------- | ----------------------------------------------- |
| `npm run dev`         | Uruchamia aplikację i mock API                  |
| `npm run api`         | Uruchamia wyłącznie `json-server`               |
| `npm run db:reset`    | Przywraca początkowe dane demonstracyjne        |
| `npm run build`       | Sprawdza TypeScript i tworzy build produkcyjny  |
| `npm run preview`     | Uruchamia lokalny podgląd gotowego buildu       |
| `npm run test`        | Uruchamia testy funkcji i importu XLSX w Vitest |
| `npm run test:e2e`    | Uruchamia scenariusze użytkownika w Playwright  |
| `npm run test:e2e:ui` | Otwiera interaktywny interfejs Playwright       |
| `npm run test:all`    | Uruchamia wszystkie testy jednostkowe i E2E     |

## Testy

Testy Vitest obejmują:

- generowanie i rozwiązywanie kolizji loginów,
- pełne Wystawienie skierowania: snapshot, numerację, status i błędy,
- integralność Czynników narażenia oraz Szablonów,
- pomijanie przykładowego wiersza XLSX,
- wspólną walidację i raportowanie niepełnych wierszy importu.

Testy Playwright obejmują:

- dostępność wszystkich głównych modułów z nawigacji,
- mobilną nawigację bez poziomego przewijania,
- pełny przepływ dodania pracownika,
- przejście z pracownika do nowego skierowania,
- zastosowanie szablonu i wystawienie skierowania,
- potwierdzenie zapisu, obecność skierowania na liście i utworzenie podglądu PDF.

E2E korzysta z osobnej bazy `server/db.test.json`. Jest ona tworzona z seedu przed testami i usuwana po ich zakończeniu, więc dane lokalnego demo pozostają nienaruszone.

## Import pracowników z XLSX

W module **Pracownicy** wybierz **Pobierz wzór**. Arkusz ma następujący układ:

1. pierwszy wiersz — instrukcje dotyczące kolumn,
2. drugi wiersz — nagłówki,
3. trzeci i kolejne wiersze — dane pracowników.

PESEL należy wpisać w kolumnie **C — PESEL**. Najprościej nadpisać przykładowego pracownika w trzecim wierszu. Można również dopisać osoby poniżej — niezmieniony przykładowy wiersz zostanie automatycznie pominięty.

Jeżeli pracownik nie ma numeru PESEL, kolumnę PESEL należy pozostawić pustą i uzupełnić:

- rodzaj dokumentu,
- numer dokumentu,
- datę urodzenia.

Wymagane wartości rodzaju dokumentu to: `passport`, `id_card`, `residence_card` albo `other`.

## Dane demonstracyjne

Źródłem danych początkowych jest plik [`server/db.seed.json`](server/db.seed.json). Polecenie:

```bash
npm run db:reset
```

kopiuje go do `server/db.json`. Plik roboczy bazy jest pomijany przez Git, dzięki czemu lokalne zmiany nie trafiają przypadkowo do repozytorium.

Po resecie dostępne są między innymi:

- przykładowa firma,
- sześciu pracowników,
- systemowe czynniki narażenia,
- trzy szablony,
- skierowania w różnych statusach,
- domyślny koordynator HR.

## Scenariusz demonstracyjny

1. Dodaj nową osobę w module **Użytkownicy** i skopiuj wygenerowane dane logowania.
2. Pobierz wzór XLSX, uzupełnij pracowników i zaimportuj plik.
3. Dodaj własny czynnik narażenia.
4. Utwórz szablon zawierający wybrane czynniki.
5. Wystaw skierowanie dla pracownika.
6. Sprawdź nowe skierowanie na początku listy i otwórz podgląd PDF.

## Struktura projektu

```text
server/
  db.seed.json                 dane początkowe
  db.json                      lokalna baza json-server
src/
  App.tsx                      composition i routing z lazy loading
  core/api/                    klient HTTP i jeden plik na endpoint (getEmployees, postReferral…)
  core/queries/                hooki TanStack Query per endpoint, queryKeys, cacheUpdates
  domain/                      język domeny, typy, katalogi wartości i wspólne reguły
  i18n/                        tłumaczenia (locales/pl.ts), provider i useTranslation
  features/employees/          kartoteka oraz intake XLSX
  features/exposure/           katalog czynników narażenia
  features/referrals/          wystawianie, lista i dokument PDF
  features/templates/          szablony skierowań
  features/users/              dostęp osób HR
  layout/                      shell Portalu pracodawcy
  ui/atoms|molecules|organisms  design system w układzie atomic design
  index.css                    tokeny i język wizualny Telemedi
```

### Konwencja komponentów UI

Każdy komponent jest osobnym modułem (`NazwaKomponentu/NazwaKomponentu.tsx` + `index.ts`) z jawnym interfejsem `NazwaKomponentuProps`. Nazwy propsów i typy mają być samoopisujące — nie dodajemy komentarzy JSDoc; komentarz `//` zostawiamy tylko tam, gdzie wyjaśnia nieoczywiste „dlaczego”.

`src/ui` jest zbudowane według **atomic design** i nie zna domeny (bez importów z `domain`, `core`, `features`, `layout`):

| Poziom | Zawartość | Może importować |
| --- | --- | --- |
| `ui/atoms` | `Button`, `IconButton`, `TextInput`, `TextArea`, `Select`, `Checkbox`, `Switch`, `Avatar`, `Badge`, `FieldError`, `LoadingIndicator` | nic z `ui` |
| `ui/molecules` | `FormField`, `SearchField`, `EmptyState`, `Toast`, `SummaryRow`, `MetricCard`, `PersonCell`, `ChoiceCard` | atoms |
| `ui/organisms` | `Modal`, `PageHeader`, `FormSection`, `DataTable` | atoms, molecules |

- funkcje (`features/*`) i `layout` importują UI wyłącznie przez barrel poziomu: `@/ui/atoms`, `@/ui/molecules`, `@/ui/organisms`,
- komponenty domenowe (np. `ExposureFactorChecklist`, `ReferralStatus`) zostają w `features/` i składają się z elementów `ui`,
- surowe `<button>`, `<input>`, `<select>` i `<textarea>` występują tylko w `src/ui`; `Button` domyślnie ma `type="button"`, więc przycisk wysyłający formularz podaje `type="submit"`,
- strony pobierają dane i koordynują przepływ, a renderowanie delegują do modułów w `components/`,
- kierunek zależności pilnuje `tests/architecture/atomicDesign.test.ts`.

### Styl kodu: bez inline returnów

- każdy `if` / `else` ma klamry, a `return` i `throw` stoją w osobnej linii bloku (`if (x) return y` jest niedozwolone),
- nazwane funkcje mają blok i jawny `return`: `export function getUsers() { return … }` zamiast `export const getUsers = () => …`; to samo dotyczy funkcji zwracanych z innych funkcji,
- JSX zwracamy w bloku `return (...)`,
- krótkie anonimowe callbacki przekazywane bezpośrednio do wywołania (`items.map(item => item.id)`, `onClick={() => setOpen(true)}`) są dozwolone,
- reguły (oraz brak komentarzy JSDoc) sprawdza `tests/architecture/codeStyle.test.ts` (parser TypeScript) dla `src`, `tests` i `scripts`.

### Importy

Alias `@/` wskazuje na `src/` (tsconfig, Vite, Vitest). Import wychodzący poza bieżący moduł używa aliasu (`@/core/queries`), a pliki wewnątrz tego samego modułu importujemy względnie (`./components/TopBar`).

### Tłumaczenia (`src/i18n`)

- wszystkie teksty interfejsu, komunikaty walidacji, treść arkusza XLSX i PDF są w `src/i18n/locales/pl.ts` (jeden obiekt, zagnieżdżony per moduł),
- tłumaczenia są pobierane jak z backendu: `core/api/getTranslations(locale)` symuluje odpowiedź API (opóźnienie + kopia danych), `useGetTranslations` cache'uje ją w TanStack Query, a `I18nProvider` wstrzymuje render aplikacji do czasu jej pobrania; podmiana na prawdziwe API to zmiana jednej funkcji na request `GET /translations/:locale` przez `apiClient`,
- w komponentach: `const { t } = useTranslation()` i `t('employees.page.title')`; klucze są typowane na podstawie `pl.ts`, więc literówka nie przejdzie kompilacji,
- parametry: `t('users.credentials.heading', { name })` dla `'Dostęp dla {{name}}'`,
- liczba mnoga: wartość `{ one, few, many, other }` + `t(key, { count })` (reguły `Intl.PluralRules`, np. 1 czynnik / 3 czynniki / 5 czynników),
- domena nie zna tekstów: walidacja, Wystawienie skierowania i import XLSX zwracają klucze (`TranslationKey`), a tłumaczy je UI,
- `tests/architecture/translations.test.ts` blokuje teksty wpisane poza `locales` (tekst w JSX, polskie znaki w stringach, tekstowe propsy jak `label` czy `placeholder`).

### Warstwa danych (`src/core`)

Wzorzec przeniesiony z `@betteroff/core`:

- `core/api/<verbZasób>.ts` — jedna funkcja na endpoint, oparta o `apiClient`; brak logiki Reacta,
- `core/queries/use<VerbZasób>.ts` — jeden hook na endpoint (`useQuery` / `useMutation`); mutacja sama unieważnia klucze, których dotyczy,
- `core/queries/queryKeys.ts` — jedyne źródło kluczy cache; nie używamy stringów w miejscu wywołania,
- `core/queries/cacheUpdates/` — funkcje aktualizujące cache bez refetchu (np. `prependReferral`),
- przypadki użycia łączące kilka requestów z logiką domeny (import XLSX, wystawienie skierowania) żyją przy swojej funkcji i składają się z `core/api` + `queryKeys`,
- komponenty `.tsx` nie wywołują `fetch`, `useQuery`, `useMutation` ani `core/api` — pilnuje tego `tests/architecture/dataLayer.test.ts`.

Nowy endpoint: `npm run add:api -- getReferral` tworzy plik requestu, hook i eksporty.

## Ograniczenia wersji demonstracyjnej

- brak prawdziwego logowania i uprawnień,
- konta HR istnieją wyłącznie jako dane demonstracyjne,
- statusy skierowań nie zmieniają się automatycznie,
- skierowania po wystawieniu są tylko do odczytu,
- walidacja i reguły biznesowe nie są egzekwowane przez backend,
- jednoczesne korzystanie z aplikacji przez wielu użytkowników nie jest obsługiwane,
- domyślny font dokumentu PDF może nie wyświetlać poprawnie wszystkich polskich znaków,
- aplikacja została przygotowana przede wszystkim dla widoku desktopowego.

## Build

```bash
npm run build
```

Gotowe pliki zostaną zapisane w katalogu `dist/`.

## Licencja

Projekt demonstracyjny przeznaczony do użytku wewnętrznego.
