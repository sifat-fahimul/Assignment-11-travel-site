const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_PASS}@cluster0.fj83e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect()

        const database = client.db('travellers')
        const serviceCollection = database.collection('tourist');
        const orderCollection = database.collection('order');
        const tripCollection = database.collection('trip')

        //Get API
        app.get('/booking', async (req, res) => {
            const cursor = serviceCollection.find({})
            const package = await cursor.toArray()
            res.send(package)
        })
        //get single api
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting', id);
            const query = { _id: ObjectId(id) }
            const booking = await serviceCollection.findOne(query)
            res.json(booking)

        })

        //post api order
        app.post('/orders', async (req, res) => {

            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })
        //post api added trip
        app.post('/addTrip', async (req, res) => {
            const trip = req.body;
            const result = await tripCollection.insertOne(trip)
            res.json(result)
        })
        //get added trip
        app.get('/trip', async (req, res) => {
            const cursor = tripCollection.find({})
            const trips = await cursor.toArray()
            res.send(trips)
        })
        //delete api 
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tripCollection.deleteOne(query)
            res.json(result)
        })


    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('server running')
})
app.listen(port, () => {
    console.log('running server on : ', port);
})