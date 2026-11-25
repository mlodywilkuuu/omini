# Silnik symulacji Market Tycoon

Kod silnika jest oddzielony od interfejsu w katalogu `src/engine/`.

## Moduły

- `index.js` — publiczny punkt wejścia silnika.
- `economy.js` — rozliczenie dnia, inicjatywy, rynek i statystyki symulacji.
- `market.js` — codzienna rotacja akcjonariuszy, oferty odkupu i nowe debiuty giełdowe.
- `time.js` — automatyczny zegar gry, pauza oraz prędkości 1×, 2×, 4× i 8×.
- `invariants.js` — kontrola integralności stanu gry i limitu 100% udziałów.

## Cykl dnia

1. Zwiększ dzień gry.
2. Rozlicz sprzedaż, koszty, wynagrodzenia, fabryki, logistykę i produkty technologiczne.
3. Zastosuj efekty aktywnych inicjatyw.
4. Przesuń udziały między inwestorami i rozpatrz aktywne oferty odkupu.
5. Wprowadź nową spółkę na giełdę.
6. Sprawdź księgę udziałów, zapisz historię gotówki i odśwież interfejs.

## Zasady akcjonariatu

- Udział gracza i wszystkich pozostałych akcjonariuszy łącznie nie może przekroczyć 100%.
- Zakup przenosi udziały od istniejących akcjonariuszy; nie tworzy dodatkowego procentu.
- Sprzedaż oddaje pakiet pozostałym akcjonariuszom.
- Każdy nowy emitent otrzymuje pełną, wygenerowaną strukturę akcjonariatu.
- Udziały inwestorów zmieniają się każdego dnia symulacji.
- Oferta odkupu ma cenę, wielkość pakietu i termin wygaśnięcia; można ją wycofać przed rozstrzygnięciem.

Zegar startuje automatycznie z prędkością 1×. Zmiana karty przeglądarki wstrzymuje naliczanie, a po powrocie zegar wznawia działanie.
