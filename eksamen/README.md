# Eksamen Prosjekt - Bølger&Skvalp

## Hurtig Start

### 1. Installer Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../client
npm install
```

### 2. Sett opp Database

**VIKTIG:** Du må sette opp MongoDB før du kan bruke applikasjonen.

Se [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detaljerte instruksjoner.

**Kortversjon:**
1. Opprett en `.env` fil i `backend/` mappen
2. Legg til din MongoDB-tilkoblingsstreng:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fakeEksamen
   ```

### 3. Start Prosjektet

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### 4. Åpne Applikasjonen

Gå til http://localhost:3000 i nettleseren din.

---

## Prosjektstruktur

```
eksamen/
├── backend/          # Express.js backend server
│   ├── index.js      # Hovedserver fil
│   ├── .env          # Database konfigurasjon (må opprettes)
│   └── ...
├── client/           # React frontend
│   ├── src/
│   └── ...
└── DATABASE_SETUP.md # Database setup guide
```

---

## Database Setup

Se [DATABASE_SETUP.md](./DATABASE_SETUP.md) for fullstendig guide om:
- MongoDB Atlas setup (cloud)
- Lokal MongoDB setup
- Konfigurasjon
- Feilsøking

---

## Feilsøking

### Backend starter ikke
- Sjekk at port 5000 ikke er opptatt
- Sjekk at alle dependencies er installert: `npm install` i `backend/`

### Frontend starter ikke
- Sjekk at port 3000 ikke er opptatt
- Sjekk at alle dependencies er installert: `npm install` i `client/`

### Database-tilkobling feiler
- Sjekk at `.env` filen eksisterer i `backend/` mappen
- Sjekk at `MONGODB_URI` er riktig satt
- Se [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detaljer

---

## Teknologier

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React, Axios
- **Database:** MongoDB (Atlas eller lokal)

