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

Then open **http://localhost:3000** in your browser (see `server.js`). Checkpoint logic and exports live in **`myApp.js`** (`createAndSavePerson`, `createManyPeople`, etc.). Use **`npm run mongoose-only`** if you only want to load `myApp.js` without the web server.
