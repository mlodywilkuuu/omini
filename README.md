# OUTLANDS

Repozytorium podzielone na trzy niezależne części:

- `engine/` — fundament silnika 3D: renderer, kamera, sterowanie i scena testowa.
- `gry2/` — właściwa gra OUTLANDS i jej mechaniki.
- `anticheat/` — osobny moduł AntiCheat, docelowo oparty na walidacji serwerowej.

## Uruchomienie prototypu silnika
Wymagany Node.js 20.19+ lub 22.12+.

```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

Aktualnie uruchamiany jest prototyp silnika. Gra i AntiCheat mają osobne katalogi i będą rozwijane niezależnie.
