const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const PORT = 3000;
const MONGODB_URI = 'mongodb+srv://admin:admin1234@lego.mjxy4lw.mongodb.net/Writes=true&writeConcern=majority'; // Remplace avec tes infos
const MONGODB_DB_NAME = 'lego';
let db;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.options('*', cors());

// Connexion à MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    db = client.db(MONGODB_DB_NAME);
    console.log('📡 MongoDB Connected');
  })
  .catch(error => {
    console.error('❌ MongoDB connection failed', error);
    process.exit(1);
  });

// Routes API
app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/deals', async (request, response) => {
  try {
    const deals = await db.collection('deals').find().toArray();
    response.json(deals);
  } catch (error) {
    console.error('❌ Error fetching deals', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/deals/search', async (req, res) => {
  const { title, limit, price, date, filterBy } = req.query;  // Destructure and set default values
  const query = {};  // Query to be passed to MongoDB

  try {
    // Limit the number of results
    const options = {
      limit: parseInt(limit),  // Ensure that the limit is a number
    };

    // Handle title search
    if (title) {
      query.title = { $regex: title, $options: 'i' };  // Case-insensitive title search
    }

    // Handle price filter
    if (price) {
      query.price = parseFloat(price);  // Convert price to float
    }

    // Handle date filter
    if (date) {
      const dateObject = new Date(date);  // Convert date string to Date object
      if (!isNaN(dateObject.getTime())) {
        query.datePosted = { $gte: dateObject };  // Filter deals posted on or after the given date
      }
    }

    // Handle filterBy for sorting or specific filtering
    if (filterBy) {
      if (filterBy === 'best-discount') {
        // Assuming you have a field like `discount` in your deal objects
        query.discount = { $gt: 0 };  // Filter by deals with a discount
      } else if (filterBy === 'most-commented') {
        // Assuming you have a field like `commentsCount` to sort by
        options.sort = { commentsCount: -1 };  // Sort by most comments
      } else {
        return res.status(400).json({ message: 'Invalid filterBy value' });
      }
    }

    // Perform the search in the 'deals' collection
    const deals = await db.collection('deals').find(query, options).toArray();

    if (deals.length === 0) {
      return res.status(404).json({ message: 'No deals found' });
    }

    res.json(deals);  // Return the found deals as the response
  } catch (error) {
    console.error('❌ Error searching for deals:', error);  // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// Route GET /deals/:id
app.get('/deals/:id', async (req, res) => {
  try {
    const dealId = req.params.id;
    
    // Convertir l'ID en ObjectId si nécessaire
    const objectId = new ObjectId(dealId);

    // Chercher dans la base de données avec l'ObjectId
    const deal = await db.collection('deals').findOne({ _id: objectId });

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.json(deal);
  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({ message: "Server error" });
  }
});


// Lancer le serveur
app.listen(PORT, () => {
  console.log(`📡 Running on port ${PORT}`);
});
