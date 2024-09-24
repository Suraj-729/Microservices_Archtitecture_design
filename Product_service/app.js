const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

app.use(express.json());

// MongoDB connection
const url = 'mongodb://localhost:27017'; // MongoDB URL
const dbName = 'products'; // Database name
let db, productsCollection;

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    productsCollection = db.collection('products');
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit the process if the database connection fails
  });

// Create Product
app.post('/products', async (req, res) => {
    try {
        const newProducts = req.body; // Expecting an array of product objects
        const result = await productsCollection.insertMany(newProducts);
        res.status(201).send(result.ops); // Send the inserted products back as a response
    } catch (error) {
        console.error('Error creating products:', error);
        res.status(500).send({ message: "Error creating products", error });
    }
});

// Get Products
app.get('/products', async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();
    res.send(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send({ message: 'Error fetching products', error: error.message });
  }
});

app.listen(3002, () => console.log('Order service running on port 3002'));
