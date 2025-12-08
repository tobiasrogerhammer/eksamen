# Vercel Deployment Checklist

## ✅ Filer som er opprettet/oppdatert:

- [x] `vercel.json` - Vercel konfigurasjonsfil
- [x] `api/index.js` - Serverless backend funksjon
- [x] `api/package.json` - API dependencies
- [x] `package.json` (root) - Root dependencies
- [x] `.vercelignore` - Filer som skal ignoreres
- [x] `VERCEL_DEPLOYMENT.md` - Fullstendig deployment guide

## 📋 Før du deployer:

1. **Sjekk MongoDB Atlas:**
   - [ ] Database er opprettet
   - [ ] IP whitelist tillater `0.0.0.0/0` (eller Vercel IPs)
   - [ ] Du har connection string klar

2. **Sjekk Git:**
   - [ ] Alle endringer er committet
   - [ ] Prosjektet er pushet til GitHub/GitLab/Bitbucket

3. **Sjekk Environment Variables:**
   - [ ] `MONGODB_URI` - MongoDB connection string
   - [ ] `DB_NAME` - Database navn (standard: `fakeEksamen`)
   - [ ] `REACT_APP_API_URL` - Sett etter første deploy til din Vercel URL

## 🚀 Deployment steg:

1. [ ] Gå til [vercel.com](https://vercel.com) og logg inn
2. [ ] Klikk "Add New Project"
3. [ ] Importer ditt Git repository
4. [ ] Vercel vil automatisk detektere konfigurasjonen
5. [ ] Legg til environment variables i Settings
6. [ ] Deploy!
7. [ ] Test at frontend laster
8. [ ] Test API: `https://ditt-prosjekt.vercel.app/api/health`
9. [ ] Oppdater `REACT_APP_API_URL` til din faktiske Vercel URL
10. [ ] Redeploy for å aktivere nye environment variables

## 🔍 Test etter deployment:

- [ ] Frontend laster korrekt
- [ ] API health check fungerer: `/api/health`
- [ ] Database connection fungerer
- [ ] Login/registrering fungerer
- [ ] Alle API-endepunkter fungerer

## 📚 Dokumentasjon:

Se [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detaljerte instruksjoner.

