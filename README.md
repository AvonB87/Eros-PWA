# Eros PWA

Mobilna PWA za skupno beleženje Erosovih dnevnih dogodkov. Deluje na iPhonu, Androidu in računalniku.

## Vključeno

- React + Vite
- Bootstrap
- Supabase Auth
- Supabase PostgreSQL + RLS
- skupna Erosova družina z vabilno kodo
- dodajanje, urejanje in brisanje dogodkov
- današnji pregled
- zgodovina/koledar
- Erosov profil
- Supabase Realtime
- PWA namestitev
- konfiguracija za Vercel

## 1. Zahteve

Namesti:

- Node.js 22 ali novejši
- Git
- brezplačen Supabase račun
- brezplačen Vercel račun, ko boš aplikacijo objavil

Preveri:

```bash
node -v
npm -v
```

## 2. Namestitev projekta

V mapi projekta:

```bash
npm install
```

## 3. Supabase projekt

1. Na Supabase ustvari nov projekt.
2. Odpri **SQL Editor**.
3. Odpri datoteko `supabase/setup.sql`.
4. Kopiraj celotno vsebino in pritisni **Run**.
5. Odpri **Project Settings > Data API** oziroma stran **Connect**.
6. Kopiraj:
   - Project URL
   - Publishable/anon key

Nikoli ne uporabi `service_role` ključa v tej aplikaciji.

### E-poštna potrditev

Za lažje lokalno testiranje lahko v Supabase pod:

`Authentication > Sign In / Providers > Email`

začasno izklopiš zahtevo po potrditvi e-pošte. Za resno uporabo jo lahko pozneje ponovno vključiš.

## 4. Datoteka .env

Kopiraj `.env.example` v `.env`:

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Nato v `.env` vnesi svoje vrednosti:

```env
VITE_SUPABASE_URL=https://tvoj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=tvoj-kljuc
```

Po spremembi `.env` vedno ponovno zaženi razvojni strežnik.

## 5. Zagon

```bash
npm run dev
```

Odpri naslov, ki ga izpiše Vite, običajno:

```text
http://localhost:5173
```

## 6. Prvi uporabnik

1. Izberi **Registracija**.
2. Vpiši ime, e-pošto in geslo.
3. Prijavi se.
4. Izberi **Ustvari**.
5. Potrdi podatke Erosa.
6. V **Nastavitvah** kopiraj 8-mestno kodo.

## 7. Partnerka

1. Odpre objavljeno aplikacijo na Androidu.
2. Ustvari svoj račun.
3. Po prijavi izbere **Pridruži se**.
4. Vnese tvojo 8-mestno kodo.
5. Oba od tega trenutka vidita iste dogodke.

## 8. Produkcijski preizkus PWA

Service worker praviloma ni polno aktiven v navadnem razvojnem načinu. Uporabi:

```bash
npm run build
npm run preview
```

Za končni preizkus je najboljša objavljena HTTPS različica na Vercelu.

## 9. Objava na GitHub in Vercel

Ustvari Git repozitorij:

```bash
git init
git add .
git commit -m "Prva različica Eros PWA"
```

Projekt objavi na GitHubu.

V Vercelu:

1. **Add New > Project**
2. izberi GitHub repozitorij
3. Framework Preset: **Vite**
4. dodaj okoljski spremenljivki:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. pritisni **Deploy**

Datoteka `vercel.json` poskrbi, da React Router deluje tudi po osvežitvi podstrani.

## 10. URL nastavitve v Supabase

Ko dobiš Vercel naslov, na primer:

```text
https://eros-pwa.vercel.app
```

ga dodaj v Supabase:

`Authentication > URL Configuration`

- Site URL: tvoj Vercel naslov
- Redirect URLs: dodaj tvoj Vercel naslov in lokalni naslov

Primer:

```text
http://localhost:5173/**
https://eros-pwa.vercel.app/**
```

## 11. Namestitev na iPhone

1. Odpri Vercel naslov v Safariju.
2. Pritisni **Deli**.
3. Izberi **Dodaj na začetni zaslon**.
4. Potrdi.

## 12. Namestitev na Android

1. Odpri aplikacijo v Chromu.
2. Pritisni meni s tremi pikami.
3. Izberi **Namesti aplikacijo** ali **Dodaj na začetni zaslon**.

## 13. Ukazi

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Varnost

- `.env` ne objavi na GitHubu.
- `VITE_SUPABASE_ANON_KEY` je lahko v odjemalcu, ker dostop omejuje RLS.
- `service_role` ključ ne sme nikoli v React, GitHub ali Vercel frontend nastavitve.
