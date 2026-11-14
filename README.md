# POŁOT

Prototyp serwisu społecznościowego w języku polskim.

## Pliki

- index.html — strona główna, aktualności, wpisy, polubienia, komentarze, znajomi i profil demonstracyjny.
- login.html — interfejs logowania i rejestracji (bez serwerowego uwierzytelniania).
- privacy.html — informacja o prywatności wersji demonstracyjnej.
- terms.html — robocze zasady korzystania z prototypu.
- 404.html — własna strona błędu.
- manifest.webmanifest i assets/icon.svg — metadane i ikona aplikacji.
- robots.txt — podstawowe reguły indeksowania.

## Publikowanie przez GitHub Pages

W repozytorium wybierz Settings → Pages → Build and deployment → Deploy from a branch, następnie branch social-network i folder /(root), po czym kliknij Save. Adres projektu: https://mlodywilkuuu.github.io/omini/.

## Ważne ograniczenie

To jest frontend demonstracyjny. Dane profilu i wpisów są przechowywane w localStorage konkretnej przeglądarki. Logowanie/rejestracja nie tworzą prawdziwych kont. Przed produkcyjnym uruchomieniem potrzebne są backend/API, baza danych, bezpieczne uwierzytelnianie i reset hasła, walidacja po stronie serwera, ochrona przed nadużyciami, moderacja i kopie zapasowe. Nie należy przechowywać haseł w localStorage.

Można podłączyć np. Supabase lub własny serwer. Wymaga to skonfigurowania projektu, kluczy/zmiennych środowiskowych oraz polityk dostępu do danych. Sekrety nie mogą trafiać do publicznych plików repozytorium.
