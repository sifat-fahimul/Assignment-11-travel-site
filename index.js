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

        //Get API
        app.get('/package', async (req, res) => {
            const cursor = serviceCollection.find({})
            const package = await cursor.toArray()
            res.send(package)
        })
        app.get('/hello', async (req, res) => {
            console.log(res);
            res.send('hello would')
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