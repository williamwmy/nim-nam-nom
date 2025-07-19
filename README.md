# 🎮 Nim-Nam-Nom

Et morsomt tospiller brettspill inspirert av Gobblet Gobblers, bygget som en Progressive Web App (PWA) med React og Vite.

## 🕹️ Spilleregler

### Mål
Målet er å få tre av dine brikker på rad (horisontalt, vertikalt eller diagonalt). Det må være øverste synlige brikke i en stabel for at den skal telle.

### Spillere
- **Spiller 1 (Grønn)**: Bruker grønne brikker
- **Spiller 2 (Oransje)**: Bruker oransje brikker

Hver spiller har 6 brikker: 2 små, 2 mellomstore, 2 store

### Hvordan spille
1. **Plassere brikker**: Dra en brikke fra din reserve til brettet
2. **Flytte brikker**: Dra en synlig brikke på brettet til en ny posisjon
3. **Sluke brikker**: Større brikker kan plasseres over mindre brikker
4. **Vinn**: Første spiller som får tre på rad vinner!

### Regler for trekk
- Du kan bare flytte dine egne brikker
- Du kan bare flytte den øverste brikken i en stabel
- Større brikker kan "sluke" mindre brikker
- Like store eller mindre brikker kan ikke plasseres over større

## 🚀 Kom i gang

### Installer avhengigheter
```bash
npm install
```

### Start utviklingsserver
```bash
npm run dev
```

### Bygg for produksjon
```bash
npm run build
```

### Forhåndsvis produksjonsbygg
```bash
npm run preview
```

## 📱 PWA-funksjonalitet

Appen kan installeres som en Progressive Web App på mobile enheter og desktop. Den fungerer også offline etter første besøk.

## 🛠️ Teknologi

- **React 18** - UI-bibliotek
- **Vite** - Build-verktøy og utviklingsserver
- **CSS3** - Styling med animasjoner og responsi design
- **PWA** - Service Worker og Web App Manifest

## 🎨 Funksjoner

- ✅ Fullt funksjonelt Nim-Nam-Nom spill
- ✅ Dual interaksjon: Både drag & drop OG klikk-for-å-velge/plassere
- ✅ Visuell tilbakemelding for lovlige trekk
- ✅ Fullskjerm mobilopplevelse uten scrolling
- ✅ Spillbrett som bruker hele skjermbredden
- ✅ Animasjoner og overgangseffekter
- ✅ Responsive design for mobil og desktop
- ✅ PWA-støtte for installasjon
- ✅ Norsk språk i hele appen
- ✅ Barnevennlig design med fargerik grafikk
- ✅ Versjonsnummer diskret plassert

## 📁 Prosjektstruktur

```
src/
├── components/          # React-komponenter
│   ├── GameBoard.jsx   # Hovedspillbrett
│   ├── PieceReserve.jsx # Spillerreserver
│   └── *.css           # Stilark
├── hooks/              # Custom React hooks
│   └── useGameState.js # Spilltilstand-logikk
├── utils/              # Hjelpefunksjoner
│   └── gameLogic.js    # Spilllogikk og vinnersjekk
├── App.jsx             # Hovedkomponent
├── App.css             # Hovedstiler
├── main.jsx            # Appens inngangspunkt
└── index.css           # Globale stiler
```

## 🎯 Fremtidige forbedringer

- 🔄 Tilbake-knapp for å angre trekk
- 📊 Poengregistrering over flere runder
- 🎵 Lydeffekter
- 🏆 Turneringsmodus
- 🤖 AI-motstandere