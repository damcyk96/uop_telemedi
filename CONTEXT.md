# Medycyna pracy Telemedi

Panel pracodawcy do zarządzania pracownikami oraz wystawiania skierowań na badania medycyny pracy realizowane przez Telemedi.

## Language

**Pracownik**:
Osoba zatrudniona przez Pracodawcę, której dane mogą zostać zapisane w Skierowaniu jako historyczny snapshot.
_Avoid_: Pacjent, użytkownik

**Pracodawca**:
Organizacja kierująca Pracowników na badania medycyny pracy.
_Avoid_: Klient, firma-klient

**Skierowanie**:
Niezmienny po wystawieniu dokument kierujący jednego Pracownika na określony rodzaj badania. Zawiera snapshot Pracownika i wybranych Czynników narażenia.
_Avoid_: Order, zlecenie

**Wystawienie skierowania**:
Operacja, która waliduje dane, tworzy snapshoty, nadaje numer oraz zapisuje Skierowanie ze statusem „Wystawione”.
_Avoid_: Generowanie skierowania, tworzenie rekordu

**Czynnik narażenia**:
Systemowa albo własna pozycja opisująca warunki pracy istotne dla zakresu badania.
_Avoid_: Ryzyko, tag

**Szablon skierowania**:
Nazwany zestaw Czynników narażenia, który przyspiesza przygotowanie Skierowania.
_Avoid_: Preset

**Koordynator HR**:
Domyślna osoba zarządzająca dostępem do panelu Pracodawcy.
_Avoid_: Administrator

## Example dialogue

— Koordynator HR wybiera Pracownika i Szablon skierowania. Co zapisujemy?

— Wystawienie skierowania rozwiązuje Czynnik narażenia z Szablonu, tworzy snapshot Pracownika i czynników, nadaje numer, a następnie zapisuje niezmienne Skierowanie.

