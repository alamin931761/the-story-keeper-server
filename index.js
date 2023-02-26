const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f5vut.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// JWT 
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: "Forbidden access" });
        }
        req.decoded = decoded;
        next();
    });
}

async function run() {
    try {
        const allBooksCollection = client.db('the-story-keeper').collection("allBooks");
        const orderCollection = client.db('the-story-keeper').collection("order");
        const couponCollection = client.db('the-story-keeper').collection("coupon-code");
        const userCollection = client.db('the-story-keeper').collection("users");

        // create and update users
        app.put("/user/:email", async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token });
        });

        // load all users 
        app.get('/users', async (req, res) => {
            // shortcut 
            const users = await userCollection.find().toArray();
            res.send(users);
        });

        // load all book data
        app.get('/allBooks', async (req, res) => {
            const query = {};
            const cursor = allBooksCollection.
                find(query);
            const allBooks = await cursor.toArray();
            res.send(allBooks);
        });

        // Load all coupon codes
        app.get('/couponCodes', async (req, res) => {
            const query = {};
            const cursor = couponCollection.find(query);
            const coupon = await cursor.toArray();
            res.send(coupon);
        });

        // load single book data
        app.get('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const book = await allBooksCollection.findOne(query);
            res.send(book);
        });

        // order API 
        app.get('/order', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email === decodedEmail) {
                // const query = {email:email};
                const query = { email };
                const cursor = orderCollection.find(query);
                const order = await cursor.toArray();
                return res.send(order);
            }
            else {
                return res.send(403).send({ message: 'forbidden access' });
            }
        });

        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        app.get('/orders', async (req, res) => {
            const query = {};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
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