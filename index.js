const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const app = express()


//Middleware:
const corsOption = {
  origin: ['http://localhost:5173'],
  credential: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOption))
app.use(express.json())

//DATABASE CONNECTION:


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvedd86.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //Getting data from database:
    const hotelBookingCollection = client.db('hotelBooking').collection('featuredRoom')
    const roomCollection = client.db('hotelBooking').collection('rooms')
    const bookCollection = client.db('hotelBooking').collection('bookData')
    const reviewCollection = client.db('hotelBooking').collection('reviews')


    //Get six featuredRoom Data from db:
    app.get('/featuredRoom', async (req, res) => {
      const result = await hotelBookingCollection.find().toArray()
      res.send(result)
    })

    // Get rooms Data from db:
    app.get('/rooms', async (req, res) => {
      const filter = req.query.filter
      let query = {}
      if (filter) query = { pricePerNight: parseInt(filter) }
      const result = await roomCollection.find(query).toArray()

      res.send(result)
    })



    //Get a single room Data from db:
    app.get('/room/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await roomCollection.findOne(query)
      res.send(result)
    })

    //Save data to the database:
    app.post('/bookData', async (req, res) => {
      const bookData = req.body
      const result = await bookCollection.insertOne(bookData)
      res.send(result)
    })

    //Get all bookData booked by user:
    app.get('/bookData/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const result = await bookCollection.find(query).toArray()
      res.send(result)
    })

    // Save review data to the database:
    app.post('/reviews', async (req, res) => {
      const reviews = req.body
      const result = await reviewCollection.insertOne(reviews)
      res.send(result)
    })

    //Get all review data from 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Server is running now!')
})

app.listen(port, () => {
  console.log(`The server is running at the port ${port}`);
})