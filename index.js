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
        const allBooksCollection = client.db('the-story-keeper').collection("allBooks");

        // load all book data
        app.get('/allBooks', async (req, res) => {
            const query = {};
            const cursor = allBooksCollection.
                find(query);
            const allBooks = await cursor.toArray();
            res.send(allBooks);
        });

        // load single book data
        app.get('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const book = await allBooksCollection.findOne(query);
            res.send(book);
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