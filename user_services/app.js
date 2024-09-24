const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

app.use(express.json());

// MongoDB connection
const url = 'mongodb://localhost:27017'; // MongoDB URL
const dbName = 'user_services'; // Database name
let db, userServicesCollection;

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    userServicesCollection = db.collection('user_services');
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit the process if the database connection fails
  });

// Create User Services
app.post('/user_services', async (req, res) => {
    try {
        const newUserServices = req.body; // Expecting an array of user service objects
        const result = await userServicesCollection.insertMany(newUserServices);
        res.status(201).send(result.ops); // Send the inserted user services back as a response
    } catch (error) {
        console.error('Error creating user services:', error);
        res.status(500).send({ message: "Error creating user services", error });
    }
});

// Get User Services
app.get('/user_services', async (req, res) => {
  try {
    const userServices = await userServicesCollection.find().toArray();
    res.send(userServices);
  } catch (error) {
    console.error('Error fetching user services:', error);
    res.status(500).send({ message: 'Error fetching user services', error: error.message });
  }
});

app.listen(3001, () => console.log('User service running on port 3001'));
