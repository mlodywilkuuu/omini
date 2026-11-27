# Systemy gry

Kod gry jest uruchamiany z `js/core/game.js`. Wydzielone systemy interfejsu znajdują się w `js/systems/` i są ładowane osobno przez `index.html`.

## Obecny podział
- `core/game.js` — aktualny rdzeń rozgrywki i integracja systemów (stan, zapis, renderowanie, ekonomia, spółki, giełda, mapa, majątek, logistyka i rozwój).
- `systems/money-animation.js` — niezależna animacja zmian gotówki gracza.
- `../css/game.css` — wygląd interfejsu i animacje.

## Kierunek dalszego podziału
Logika w rdzeniu jest na razie mocno powiązana wspólnym stanem gry. Kolejne refaktoryzacje powinny wydzielać osobno: ekonomię, spółki i spółki córki, giełdę, logistykę i transport, mapę i budowę, oraz rozwój. Nie przenosimy ich mechanicznie bez testów, żeby nie zepsuć istniejącego zapisu ani przycisków.
