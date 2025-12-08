# Database Setup Guide

Denne guiden viser deg hvordan du setter opp MongoDB-databasen for prosjektet.

## Innhold
1. [MongoDB Atlas Setup (Anbefalt - Cloud Database)](#mongodb-atlas-setup)
2. [Lokal MongoDB Setup (Alternativ)](#lokal-mongodb-setup)
3. [Konfigurasjon av Prosjektet](#konfigurasjon-av-prosjektet)
4. [Testing av Tilkoblingen](#testing-av-tilkoblingen)

---

## MongoDB Atlas Setup

MongoDB Atlas er en gratis cloud-basert MongoDB-tjeneste. Dette er den enkleste måten å komme i gang.

### Steg 1: Opprett MongoDB Atlas-konto

1. Gå til [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Klikk "Try Free" eller "Sign Up"
3. Fyll ut skjemaet og opprett konto
4. Bekreft e-posten din

### Steg 2: Opprett et Cluster

1. Etter innlogging, klikk "Build a Database"
2. Velg **FREE** tier (M0 Sandbox)
3. Velg en cloud provider og region (velg nærmeste region, f.eks. `Europe (Frankfurt)`)
4. Klikk "Create Cluster"
5. Vent 1-3 minutter mens clusteret opprettes

### Steg 3: Opprett Database-bruker

1. I "Security" → "Database Access", klikk "Add New Database User"
2. Velg "Password" som autentiseringsmetode
3. Lag et brukernavn (f.eks. `eksamen_user`)
4. Generer et sikkert passord (klikk "Autogenerate Secure Password" eller lag ditt eget)
5. **VIKTIG:** Lagre brukernavn og passord - du trenger dette senere!
6. Under "Database User Privileges", velg "Atlas admin" eller "Read and write to any database"
7. Klikk "Add User"

### Steg 4: Whitelist IP-adressen din

1. I "Security" → "Network Access", klikk "Add IP Address"
2. Klikk "Allow Access from Anywhere" (for utvikling) eller legg til din nåværende IP
3. Klikk "Confirm"

**For produksjon:** Bruk kun din spesifikke IP-adresse for bedre sikkerhet.

### Steg 5: Få tilkoblingsstrengen

1. I "Deployment" → "Database", klikk "Connect" på clusteret ditt
2. Velg "Connect your application"
3. Velg "Node.js" som driver og versjon "5.5 or later"
4. Kopier tilkoblingsstrengen. Den ser slik ut:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Erstatt `<username>` og `<password>` med brukernavn og passord du opprettet i steg 3
6. Legg til databasenavnet på slutten: `/fakeEksamen`

**Eksempel på ferdig tilkoblingsstreng:**
```
mongodb+srv://eksamen_user:mittpassord123@cluster0.xxxxx.mongodb.net/fakeEksamen?retryWrites=true&w=majority
```

### Steg 6: Oppdater prosjektet

1. Opprett en `.env` fil i `backend/` mappen:
   ```bash
   cd backend
   touch .env
   ```

2. Legg til tilkoblingsstrengen i `.env` filen:
   ```
   MONGODB_URI=mongodb+srv://eksamen_user:mittpassord123@cluster0.xxxxx.mongodb.net/fakeEksamen?retryWrites=true&w=majority
   ```

3. **VIKTIG:** Legg `.env` til `.gitignore` for å ikke committe passordet!

---

## Lokal MongoDB Setup

Hvis du foretrekker å kjøre MongoDB lokalt på maskinen din:

### Steg 1: Installer MongoDB

**macOS (med Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
1. Last ned MongoDB Community Server fra [mongodb.com/download](https://www.mongodb.com/try/download/community)
2. Kjør installasjonsprogrammet
3. Velg "Complete" installasjon
4. MongoDB starter automatisk som en tjeneste

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Steg 2: Verifiser at MongoDB kjører

```bash
# macOS/Linux
mongosh

# Eller sjekk status
brew services list  # macOS
sudo systemctl status mongod  # Linux
```

### Steg 3: Opprett database og bruker (valgfritt)

```bash
mongosh

# I MongoDB shell:
use fakeEksamen
db.createUser({
  user: "eksamen_user",
  pwd: "mittpassord123",
  roles: [{ role: "readWrite", db: "fakeEksamen" }]
})
exit
```

### Steg 4: Oppdater prosjektet

1. Opprett `.env` fil i `backend/` mappen:
   ```bash
   cd backend
   touch .env
   ```

2. Legg til lokal tilkoblingsstreng:
   ```
   MONGODB_URI=mongodb://localhost:27017/fakeEksamen
   ```

   Eller med autentisering:
   ```
   MONGODB_URI=mongodb://eksamen_user:mittpassord123@localhost:27017/fakeEksamen
   ```

---

## Konfigurasjon av Prosjektet

### Steg 1: Installer dotenv

```bash
cd backend
npm install dotenv
```

### Steg 2: Oppdater index.js

Koden er allerede oppdatert til å bruke miljøvariabler. Sjekk at `backend/index.js` bruker `process.env.MONGODB_URI`.

### Steg 3: Opprett .gitignore

Sørg for at `backend/.gitignore` inneholder:
```
node_modules/
.env
*.log
```

### Steg 4: Opprett .env fil

Opprett `backend/.env` filen med din tilkoblingsstreng:
```
MONGODB_URI=mongodb+srv://brukernavn:passord@cluster0.xxxxx.mongodb.net/fakeEksamen?retryWrites=true&w=majority
```

---

## Testing av Tilkoblingen

### Test 1: Start backend-serveren

```bash
cd backend
npm start
```

Du skal se:
```
Connected to mongoDB
Backend server listening on port 5000
```

Hvis du ser en feilmelding, sjekk:
- At tilkoblingsstrengen er riktig
- At brukernavn og passord er korrekt
- At IP-adressen din er whitelistet (for Atlas)
- At MongoDB kjører (for lokal installasjon)

### Test 2: Test API-endepunktene

1. Start frontend:
   ```bash
   cd client
   npm start
   ```

2. Gå til http://localhost:3000
3. Prøv å opprette en bruker
4. Prøv å logge inn

### Test 3: Verifiser i MongoDB

**MongoDB Atlas:**
1. Gå til "Collections" i Atlas-dashboardet
2. Du skal se `fakeEksamen` databasen
3. Du skal se collections: `usernames`, `boats`, `meetings`, `records`, `messages`

**Lokal MongoDB:**
```bash
mongosh
use fakeEksamen
show collections
db.usernames.find()
exit
```

---

## Database Schema Oversikt

Prosjektet bruker følgende collections:

### 1. usernames (fra user.js)
- `username` (String, required, unique)
- `mailadress` (String, required, unique)
- `password` (String, required, hashed)
- `isAdmin` (Boolean, default: false)

### 2. boats (fra boatSchema.js)
- `Adresse` (String)
- `Postnummer` (Number)
- `Poststed` (String)
- `Båtplass` (Number)
- `startUse` (Date)
- `endUse` (Date)
- `mailadress` (String)

### 3. meetings (fra meetingSchema.js)
- `title` (String, required)
- `startTime` (Date, required)
- `endTime` (Date, required)
- `location` (String, required)
- `agenda` (String, required)
- `isCompleted` (Boolean, default: false)

### 4. records (fra policeSchema.js)
- `username` (String, required, unique)
- `mailadress` (String, required, unique)
- `date` (Date, required)
- `reason` (String, required)

### 5. messages (fra message.js)
- `message` (String, required)
- `username` (String, required)
- `time` (Date, required)

---

## Feilsøking

### Problem: "ENOTFOUND" feil
**Løsning:** 
- Sjekk at tilkoblingsstrengen er riktig
- Sjekk at IP-adressen din er whitelistet i Atlas
- Sjekk internettforbindelsen

### Problem: "Authentication failed"
**Løsning:**
- Sjekk at brukernavn og passord er korrekt
- Sjekk at brukeren har riktige rettigheter

### Problem: "Connection timeout"
**Løsning:**
- Sjekk at MongoDB kjører (for lokal installasjon)
- Sjekk at port 27017 er åpen (for lokal installasjon)
- Sjekk firewall-innstillinger

### Problem: Database vises ikke i Atlas
**Løsning:**
- Collections opprettes automatisk når første dokument lagres
- Prøv å opprette en bruker gjennom applikasjonen
- Vent noen sekunder og oppdater Atlas-dashboardet

---

## Sikkerhet

⚠️ **VIKTIG:**
- **ALDRI** committ `.env` filen til git
- Bruk sterke passord for database-brukere
- For produksjon: Bruk kun spesifikke IP-adresser i whitelist
- Vurder å bruke MongoDB Atlas IP Access List for bedre sikkerhet
- Roter passord regelmessig

---

## Hjelp

Hvis du fortsatt har problemer:
1. Sjekk backend-loggene for feilmeldinger
2. Sjekk MongoDB Atlas-loggene (hvis du bruker Atlas)
3. Verifiser at alle pakker er installert: `npm install` i både `backend/` og `client/`
4. Sjekk at port 5000 ikke er opptatt av noe annet

