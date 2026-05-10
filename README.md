# Mongoose checkpoint

## Setup

1. Install dependencies:

```bash
npm install
```

2. Edit `.env` and set `MONGO_URI` to your MongoDB Atlas connection string.
   - Use quotes around the URI.
   - No spaces around `=` (example: `MONGO_URI='mongodb+srv://...'`).

3. Run:

```bash
npm start
```

The entry file is `myApp.js`. Exported helpers match the checkpoint tasks (`createAndSavePerson`, `createManyPeople`, etc.).
