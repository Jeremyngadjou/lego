const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 8092;

// URL de connexion MongoDB (remplace par ta propre URL)
const MONGODB_URI = 'mongodb+srv://<user>:<password>@<cluster-url>/lego?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'lego'; // Le nom de ta base de données

let db;

// Connexion à MongoDB
MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(MONGODB_DB_NAME);
    console.log('Connected to MongoDB');
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Endpoint pour récupérer un deal par ID
app.get('/deals/:id', async (req, res) => {
  const dealId = req.params.id;

  try {
    // Recherche du deal dans la collection 'deals'
    const deal = await db.collection('deals').findOne({ _id: new ObjectId(dealId) });

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Retourne le deal trouvé
    res.json(deal);
  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
