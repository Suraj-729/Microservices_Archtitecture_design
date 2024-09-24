const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

app.use(express.json());

// MongoDB connection
const url = 'mongodb://localhost:27017'; // MongoDB URL
const dbName = 'orders'; // Database name
let db, ordersCollection;

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    ordersCollection = db.collection('orders');
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit the process if the database connection fails
  });

// Create Order
app.post('/orders', async (req, res) => {
  try {
    const newOrder = req.body;
    const result = await ordersCollection.insertOne(newOrder);
    newOrder._id = result.insertedId; // Return the new order with the inserted ID
    res.status(201).send(newOrder);
  } catch (error) {
    res.status(500).send({ message: 'Error creating order', error: error.message });
  }
});

// Get Orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await ordersCollection.find().toArray();
    res.send(orders);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching orders', error: error.message });
  }
});

app.listen(3003, () => console.log('Order service running on port 3003'));
