# Eros PWA – navodila korak za korakom

Ta paket je že sestavljen kot delujoč začetni projekt. Ne ustvarjaj novega Vite projekta, ampak uporabi priloženo mapo.

---

## A. Kaj boš dobil

Po zaključku boš imel:

- spletno aplikacijo za iPhone in Android,
- dva ločena uporabniška računa,
- skupno Erosovo družino,
- sprotno sinhronizacijo dogodkov,
- dodajanje, urejanje in brisanje dogodkov,
- Erosov profil,
- koledarski pregled,
- namestitev na začetni zaslon kot PWA.

Za prvo uporabo potrebuješ računalnik. Pozneje bosta podatke vnašala samo s telefonoma.

---

## B. Priprava računalnika

### 1. Namesti Node.js

Uporabi Node.js 22 ali novejšega.

V terminalu preveri:

```bash
node -v
npm -v
```

Če ukaza ne delujeta, Node.js še ni nameščen.

### 2. Odpri projekt

Razširi arhiv in mapo `eros-pwa` odpri v Visual Studio Code ali IntelliJ IDEA.

V terminalu se moraš nahajati v mapi, kjer je `package.json`.

Primer:

```powershell
cd C:\Users\Avon\Desktop\eros-pwa
```

### 3. Namesti pakete

```bash
npm install
```

To ustvari mapo `node_modules`. Mape ni treba kopirati na GitHub.

---

## C. Ustvari Supabase projekt

### 1. Nov projekt

V Supabase nadzorni plošči:

1. izberi **New project**,
2. izberi organizacijo,
3. ime naj bo na primer `eros-pwa`,
4. nastavi močno geslo baze,
5. izberi evropsko regijo,
6. ustvari projekt.

Geslo baze shrani. React aplikacija ga sicer ne uporablja, lahko pa ga pozneje potrebuješ.

### 2. Ustvari bazo, pravila in funkcije

V projektu odpri:

**SQL Editor → New query**

Nato:

1. v projektu odpri `supabase/setup.sql`,
2. kopiraj celotno vsebino,
3. prilepi v SQL Editor,
4. pritisni **Run**.

Skripta ustvari:

- `profiles`,
- `households`,
- `household_members`,
- `pets`,
- `events`,
- RLS pravila,
- funkcijo za ustvarjanje družine,
- funkcijo za pridružitev s kodo,
- Realtime za dogodke.

V **Table Editorju** moraš nato videti vseh pet tabel.

### 3. Preveri Auth nastavitve

Odpri:

**Authentication → Sign In / Providers → Email**

Za najlažji prvi preizkus lahko začasno izklopiš zahtevo po potrditvi e-pošte. Tako se bo račun aktiviral takoj.

Če potrditev pustiš vključeno, mora vsak uporabnik po registraciji odpreti potrditveno e-pošto.

---

## D. Poveži React s Supabase

### 1. Pridobi URL in ključ

V Supabase odpri stran **Connect** ali:

**Project Settings → Data API**

Poišči:

- Project URL,
- Publishable key oziroma `anon` key.

Uporabi samo javni publishable/anon ključ.

**Ne uporabi `service_role` ključa.**

### 2. Ustvari `.env`

V glavni mapi projekta kopiraj `.env.example` v `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Nato odpri `.env` in vnesi svoje podatke:

```env
VITE_SUPABASE_URL=https://abcdefghijkl.supabase.co
VITE_SUPABASE_ANON_KEY=sem-prilepi-svoj-javni-kljuc
```

Datoteka `.env` je že v `.gitignore`, zato je Git ne bo objavil.

---

## E. Zaženi aplikacijo lokalno

```bash
npm run dev
```

V terminalu se pokaže naslov, navadno:

```text
http://localhost:5173
```

Odpri ga v brskalniku.

### Prvi uporabnik – ti

1. izberi **Registracija**,
2. vpiši svoje ime,
3. vpiši e-pošto,
4. izberi geslo z najmanj šestimi znaki,
5. prijavi se,
6. na prvi nastavitvi pusti možnost **Ustvari**,
7. preveri Erosove podatke,
8. pritisni **Ustvari Erosovo družino**.

Po tem se prikaže začetni zaslon.

### Preveri osnovne funkcije

Dodaj nekaj dogodkov:

- kakanje,
- obrok,
- sprehod,
- tehtanje.

Preveri:

- da so prikazani na strani Danes,
- da jih vidiš v Koledarju,
- da jih lahko urediš,
- da jih lahko izbrišeš,
- da lahko spremeniš Erosovo težo.

---

## F. Preizkusi drugi račun

Za test uporabi zasebno okno brskalnika ali drug brskalnik.

### 1. Pridobi kodo

V svojem računu odpri **Nastavitve**.

Pod »Erosova družina« je 8-mestna koda, na primer:

```text
A1B2C3D4
```

### 2. Ustvari partnerkin račun

V zasebnem oknu:

1. registriraj drugi račun,
2. prijavi se,
3. na prvi nastavitvi izberi **Pridruži se**,
4. vnesi kodo,
5. potrdi.

Dodaj dogodek z drugim računom. V prvem brskalniku se mora zaradi Realtime prikazati samodejno ali po kratkem ponovnem odprtju aplikacije.

---

## G. Preveri produkcijski build

Pred objavo zaženi:

```bash
npm run lint
npm run build
```

Oba ukaza se morata končati brez napake.

Za lokalni ogled produkcijske različice:

```bash
npm run preview
```

---

## H. Objavi na GitHub

V glavni mapi projekta:

```bash
git init
git add .
git commit -m "Prva različica Eros PWA"
```

Na GitHubu ustvari prazen repozitorij, nato uporabi ukaze, ki ti jih prikaže GitHub.

Običajno:

```bash
git branch -M main
git remote add origin TVOJ_GITHUB_URL
git push -u origin main
```

Preveri, da `.env` ni v repozitoriju.

---

## I. Objavi na Vercel

1. prijavi se v Vercel,
2. izberi **Add New → Project**,
3. poveži GitHub,
4. izberi repozitorij,
5. Vercel mora prepoznati Vite,
6. odpri **Environment Variables**,
7. dodaj:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

8. za vsako vnesi pravo vrednost,
9. pritisni **Deploy**.

Dobiš HTTPS naslov, na primer:

```text
https://eros-pwa.vercel.app
```

Datoteka `vercel.json` v projektu poskrbi, da delujejo tudi poti, kot so `/calendar`, `/eros` in `/settings`.

---

## J. Nastavi Supabase produkcijski URL

V Supabase odpri:

**Authentication → URL Configuration**

Nastavi:

### Site URL

```text
https://eros-pwa.vercel.app
```

### Redirect URLs

Dodaj:

```text
http://localhost:5173/**
https://eros-pwa.vercel.app/**
```

Namesto primera uporabi svoj pravi Vercel naslov.

To je zlasti pomembno, če uporabljaš e-poštno potrjevanje uporabnikov.

---

## K. Namesti na iPhone

1. odpri objavljeni HTTPS naslov v Safariju,
2. pritisni **Deli**,
3. izberi **Dodaj na začetni zaslon**,
4. omogoči odpiranje kot spletna aplikacija, če je možnost prikazana,
5. pritisni **Dodaj**.

Aplikacijo nato odpiraj z ikono na začetnem zaslonu.

---

## L. Namesti na Android

1. odpri objavljeni naslov v Chromu,
2. odpri meni s tremi pikami,
3. izberi **Namesti aplikacijo** ali **Dodaj na začetni zaslon**,
4. potrdi.

---

## M. Kako so datoteke organizirane

```text
src/
├── components/        skupne komponente
├── constants/         vrste Erosovih dogodkov
├── contexts/          prijava in skupna družina
├── lib/               povezava s Supabase
├── pages/             posamezni zasloni
├── services/          branje in pisanje dogodkov
├── styles/            oblikovanje
└── utils/             delo z datumi

supabase/
└── setup.sql           baza, RLS, funkcije in Realtime
```

---

## N. Najpogostejše napake

### »Manjkajo Supabase nastavitve«

`.env` ne obstaja ali sta imeni spremenljivk napačni.

Pravilno:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Po spremembi ustavi `npm run dev` in ga ponovno zaženi.

### »Invalid API key«

Uporabljen je napačen ključ. Kopiraj publishable/anon ključ istega Supabase projekta.

### Registracija uspe, prijava pa ne

Najverjetneje je vključena potrditev e-pošte. Preveri nabiralnik ali jo začasno izklopi v Auth nastavitvah.

### Partnerkina koda ne deluje

- koda mora imeti osem znakov,
- uporabi kodo iz tvojih Nastavitev,
- partnerkin račun še ne sme biti član druge družine,
- SQL skripta mora biti uspešno izvedena.

### Dogodki se ne osvežijo takoj

Preveri, ali je tabela `events` vključena v Realtime publication. Skripta to naredi samodejno. Ponovno odprtje aplikacije vedno ponovno naloži podatke.

### Po osvežitvi `/calendar` dobim 404

Na Vercelu mora biti v korenu projekta `vercel.json`. V tem paketu je že dodan.

### PWA se ne ponudi za namestitev

- aplikacija mora biti objavljena prek HTTPS,
- ikone in manifest morajo biti dosegljivi,
- na iPhonu uporabi Safari in ročno »Dodaj na začetni zaslon«,
- razvojni `localhost` ni najboljši končni test PWA.

---

## O. Kaj bi dodala v naslednji fazi

Ko ta različica deluje:

1. fotografije dogodkov prek Supabase Storage,
2. opomniki za ampulo in razglistenje,
3. graf Erosove teže,
4. statistika kakanja in obrokov,
5. offline čakalna vrsta,
6. izvoz v CSV/PDF,
7. več hišnih ljubljenčkov.
