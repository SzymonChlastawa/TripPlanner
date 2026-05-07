# TriPlanner

Aplikacja do planowania podróży wykorzystująca Node.js, Express oraz MongoDB.

## Wymagania

Przed uruchomieniem projektu należy zainstalować:

- Node.js
- MongoDB Community Edition
- npm

---

## Instalacja projektu

1. Pobierz lub sklonuj repozytorium:

git clone TWOJE_REPO
cd TriPlanner

2. Zainstaluj zależności:

npm install

---

## Instalacja MongoDB (MacOS)

1. Instalacja przez Homebrew:

brew tap mongodb/brew
brew install mongodb-community@7.0

2. Uruchomienie MongoDB:

brew services start mongodb/brew/mongodb-community@7.0

3. Sprawdzenie działania:

mongosh

Jeżeli pojawi się:

test>

oznacza to, że MongoDB działa poprawnie.

---

## Uruchomienie backendu

W folderze projektu uruchom:

node server.js

Po poprawnym uruchomieniu powinien pojawić się komunikat:

MongoDB connected
http://localhost:3000

---

## Uruchomienie frontendu

W nowym terminalu uruchom:

npx serve .

lub:

python3 -m http.server 8000

---

## Otworzenie aplikacji

W przeglądarce otwórz:

http://localhost:3000

lub:

http://localhost:8000

---

## Funkcjonalności aplikacji

- tworzenie planu podróży,
- dołączanie do istniejącego planu po ID,
- dodawanie TODO,
- edycja danych,
- usuwanie danych,
- zapisywanie danych w MongoDB.

---

## Technologie

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API
- JavaScript

---

## CRUD

Aplikacja implementuje operacje CRUD:

CREATE  -> POST /plans
READ    -> GET /plans/:id
UPDATE  -> PUT /plans/:id
DELETE  -> DELETE /plans/:id

---

## Autor

Projekt zaliczeniowy TriPlanner.
```
