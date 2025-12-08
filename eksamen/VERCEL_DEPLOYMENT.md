# Vercel Deployment Guide

Denne guiden viser deg hvordan du deployer prosjektet til Vercel med både frontend og backend fungerende.

## Forutsetninger

1. Vercel-konto (gratis på [vercel.com](https://vercel.com))
2. MongoDB Atlas database (se [DATABASE_SETUP.md](./DATABASE_SETUP.md))
3. Git repository (GitHub, GitLab, eller Bitbucket)

## Steg 1: Forbered Prosjektet

### 1.1 Sjekk at alt er på plass

Sørg for at følgende filer eksisterer:

- ✅ `vercel.json` (konfigurasjonsfil)
- ✅ `api/index.js` (serverless backend)
- ✅ `package.json` (root)
- ✅ `.vercelignore`

### 1.2 Bygg frontend lokalt (valgfritt, for testing)

```bash
cd client
npm install
npm run build
```

## Steg 2: Push til Git Repository

1. Commit alle endringer:

   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   ```

2. Push til ditt Git repository:
   ```bash
   git push origin main
   ```

## Steg 3: Deploy til Vercel

### Metode 1: Via Vercel Dashboard (Anbefalt)

1. Gå til [vercel.com](https://vercel.com) og logg inn
2. Klikk "Add New Project"
3. Importer ditt Git repository
4. **VIKTIG - Root Directory:**
   - La "Root Directory" stå **tomt** (eller sett til `.` eller `eksamen/` hvis du har prosjektet i en undermappe)
   - Dette skal peke til mappen som inneholder `vercel.json`, `api/`, `client/`, og `backend/`
5. Vercel vil automatisk oppdage konfigurasjonen fra `vercel.json`

### Metode 2: Via Vercel CLI

1. Installer Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Logg inn:

   ```bash
   vercel login
   ```

3. Deploy:

   ```bash
   vercel
   ```

   Følg instruksjonene:

   - Set up and deploy? **Yes**
   - Which scope? Velg din konto
   - Link to existing project? **No** (første gang)
   - Project name? (trykk Enter for default)
   - **Directory?** La stå **tomt** eller sett til `.` (root directory)
   - Override settings? **No**

## Steg 4: Konfigurer Environment Variables

**VIKTIG:** Du må sette opp miljøvariabler i Vercel dashboard.

1. Gå til ditt prosjekt i Vercel dashboard
2. Klikk på "Settings" → "Environment Variables"
3. Legg til følgende variabler:

### Påkrevde Environment Variables:

```
MONGODB_URI=mongodb+srv://brukernavn:passord@cluster0.xxxxx.mongodb.net/fakeEksamen?retryWrites=true&w=majority
DB_NAME=fakeEksamen
NODE_ENV=production
```

### For Frontend (Client):

```
REACT_APP_API_URL=https://ditt-prosjekt.vercel.app/api
```

**VIKTIG:**

- Erstatt `ditt-prosjekt.vercel.app` med din faktiske Vercel URL
- Du finner URL-en i Vercel dashboard etter første deploy

### Hvordan legge til Environment Variables:

1. I Vercel dashboard, gå til **Settings** → **Environment Variables**
2. Klikk **Add New**
3. Legg til hver variabel:
   - **Key:** `MONGODB_URI`
   - **Value:** Din MongoDB connection string
   - **Environment:** Velg alle (Production, Preview, Development)
4. Gjenta for alle variabler

## Steg 5: Oppdater Vercel Build Settings

1. Gå til **Settings** → **General** → **Build & Development Settings**
2. Sjekk at følgende er satt:

   - **Root Directory:** La stå **tomt** (eller `.` hvis prosjektet er i root)
   - **Framework Preset:** Other (eller la Vercel auto-detect)
   - **Build Command:** `cd backend && npm install && cd ../client && npm install && npm run build`
   - **Output Directory:** `client/build`
   - **Install Command:** `npm install` (eller la stå tomt)

   **Merk:** Disse innstillingene er allerede definert i `vercel.json`, så Vercel skal automatisk bruke dem. Du trenger bare å sjekke at de er riktige.

## Steg 6: Redeploy

Etter å ha lagt til environment variables:

1. Gå til **Deployments** i Vercel dashboard
2. Klikk på "..." ved siden av siste deployment
3. Velg **Redeploy**
4. Huk av **Use existing Build Cache** (valgfritt)
5. Klikk **Redeploy**

## Steg 7: Test Deployment

1. Gå til din Vercel URL (f.eks. `https://ditt-prosjekt.vercel.app`)
2. Test at frontend laster
3. Test API-endepunkter:
   - `https://ditt-prosjekt.vercel.app/api/health` (skal returnere `{"status":"ok"}`)
   - Test login/registrering

## Steg 8: Oppdater Frontend API URL

Hvis du ikke har satt `REACT_APP_API_URL` environment variable:

1. Oppdater `client/src/config.js` hvis nødvendig
2. Eller sett `REACT_APP_API_URL` i Vercel environment variables til din Vercel URL

## Feilsøking

### Problem: Frontend vises ikke

**Løsning:**

- Sjekk at `outputDirectory` i `vercel.json` er satt til `client/build`
- Sjekk at build command kjører uten feil
- Sjekk Vercel build logs

### Problem: API-endepunkter returnerer 404

**Løsning:**

- Sjekk at `api/index.js` eksisterer
- Sjekk at routes i `vercel.json` er korrekt konfigurert
- Sjekk at API-filer er inkludert i deployment (ikke i `.vercelignore`)

### Problem: Database connection feiler

**Løsning:**

- Sjekk at `MONGODB_URI` er satt i Vercel environment variables
- Sjekk at MongoDB Atlas IP whitelist tillater alle IPs (0.0.0.0/0) for testing
- Sjekk at connection string er korrekt formatert

### Problem: CORS errors

**Løsning:**

- Sjekk at `api/index.js` har riktig CORS-konfigurasjon
- Sjekk at frontend URL er inkludert i allowed origins
- CORS er allerede konfigurert til å tillate alle origins i produksjon

### Problem: Build feiler

**Løsning:**

- Sjekk Vercel build logs for spesifikke feilmeldinger
- Sjekk at alle dependencies er oppdatert
- Prøv å bygge lokalt: `cd client && npm run build`

## Viktige Notater

### MongoDB Atlas IP Whitelist

For at Vercel serverless functions skal kunne koble til MongoDB Atlas:

1. Gå til MongoDB Atlas → **Network Access**
2. Legg til IP: `0.0.0.0/0` (tillater alle IPs)
   - **Advarsel:** Dette er mindre sikkert, men nødvendig for serverless
   - For produksjon, vurder å bruke MongoDB Atlas Network Peering

### Serverless Function Limits

Vercel serverless functions har noen begrensninger:

- **Timeout:** 10 sekunder (Hobby plan), 60 sekunder (Pro plan)
- **Memory:** 1024 MB (Hobby plan)
- **Cold starts:** Første request kan ta litt lengre tid

### Environment Variables

- Environment variables er **case-sensitive**
- Endringer i environment variables krever **redeploy**
- Bruk **Production**, **Preview**, og **Development** miljøer for forskjellige verdier

## Neste Steg

Etter vellykket deployment:

1. ✅ Test alle funksjoner i produksjon
2. ✅ Sett opp custom domain (valgfritt)
3. ✅ Konfigurer MongoDB Atlas IP whitelist for produksjon
4. ✅ Sett opp monitoring og logging
5. ✅ Vurder å oppgradere til Vercel Pro for bedre ytelse

## Hjelp

Hvis du fortsatt har problemer:

1. Sjekk Vercel build logs
2. Sjekk Vercel function logs
3. Test API-endepunkter direkte med curl eller Postman
4. Sjekk MongoDB Atlas logs

---

**Lykke til med deployment! 🚀**
