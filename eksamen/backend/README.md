# Backend Setup

## Database Configuration

1. Opprett en `.env` fil i denne mappen:
   ```bash
   touch .env
   ```

2. Legg til din MongoDB-tilkoblingsstreng i `.env` filen:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fakeEksamen?retryWrites=true&w=majority
   ```

3. Se `../DATABASE_SETUP.md` for detaljerte instruksjoner om hvordan du setter opp MongoDB.

## Start Serveren

```bash
npm start
```

Serveren vil kjøre på port 5000 (eller porten spesifisert i `PORT` miljøvariabelen).

## Miljøvariabler

- `MONGODB_URI` - MongoDB tilkoblingsstreng (påkrevd)
- `DB_NAME` - Database navn (valgfritt, standard: fakeEksamen)
- `PORT` - Server port (valgfritt, standard: 5000)

