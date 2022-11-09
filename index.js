const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f5vut.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // await client.connect();
        const rareBooksCollection = client.db('the-story-keeper').collection("rareBooks");
        const essaysCollection = client.db("the-story-keeper").collection("essays");

        // load all rare book data
        app.get('/rareBooks', async (req, res) => {
            const query = {};
            const cursor = rareBooksCollection.
                find(query);
            const rareBooks = await cursor.toArray();
            res.send(rareBooks);
        });

        // load single rare book data
        app.get('/rareBook/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const rareBook = await rareBooksCollection.findOne(query);
            res.send(rareBook);
        });

        // load all essays data 
        app.get('/essays', async (req, res) => {
            const query = {};
            const cursor = essaysCollection.find(query);
            const essays = await cursor.toArray();
            res.send(essays);
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from The Story Keeper!')
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});