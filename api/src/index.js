// src/index.js
const fs = require('node:fs');
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 80;

// L'adresse complète, mot de passe compris, est lue dans un fichier dont on ne
// connaît que le chemin. Rien de secret ne transite par une valeur.
const MONGO_URL = process.env.MONGO_URL_FILE
  ? fs.readFileSync(process.env.MONGO_URL_FILE, 'utf8').trim()
  : 'mongodb://db';

const client = new MongoClient(MONGO_URL);
let countCollection;

async function connectDB() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('CONNEXION DB OK !');
    countCollection = client.db('test').collection('count');
  } catch (err) {
    console.error('Erreur connexion DB', err);
    process.exit(1);
  }
}
connectDB();

app.get('/api/count', async (req, res) => {
  try {
    const doc = await countCollection.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { returnDocument: 'after', upsert: true }
    );
    res.status(200).json(doc?.count || 0);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.all('/{*splat}', (req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => console.log(`Serveur API démarré sur le port ${PORT}`));
