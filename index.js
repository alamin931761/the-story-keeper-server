const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const port = process.env.PORT || 5000;
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
        const reviewCollection = client.db('the-story-keeper').collection("reviews");

        // verify admin 
        const verifyAdmin = async (req, res, next) => {
            const requester = req.decoded.email;
            const requesterAccount = await userCollection.findOne({ email: requester });
            if (requesterAccount.role === 'admin') {
                next();
            } else {
                res.status(403).send({ message: 'forbidden access' });
            }
        }

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

        // update profile 
        app.put('/user/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const info = req.body;
            const filter = { email: email };
            const updateDoc = {
                $set: info
            };
            const result = await user.updateOne(filter, updateDoc);
            res.send(result);
        });

        // load user profile data
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await userCollection.find(query).toArray();
            res.send(result);
        });

        // make admin
        app.put("/user/admin/:email", verifyJWT, verifyAdmin, async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'admin' }
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // remove admin 
        app.patch("/user/admin/:email", verifyJWT, verifyAdmin, async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'user' }
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // Check admin or not
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
        });

        // Stripe 
        app.post("/create-payment-intent", verifyJWT, async (req, res) => {
            const { price } = req.body;
            const bookPrice = price;
            const amount = bookPrice * 100;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                payment_method_types: ['card']
            });
            res.send({ clientSecret: paymentIntent.client_secret })
        });

        // load all users 
        app.get('/users', verifyJWT, verifyAdmin, async (req, res) => {
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

        // load edit book data
        app.get('/editBook/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const book = await allBooksCollection.findOne(query);
            res.send(book);
        });

        // send edited book data to database
        app.patch('/allBooks/:id', async (req, res) => {
            const id = req.params.id;
            const bookData = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: bookData
            }
            const result = await allBooksCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // edit order data 
        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const orderData = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: orderData
            };
            const result = await orderCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // delete books 
        app.delete('/allBooks/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const book = await allBooksCollection.deleteOne(filter);
            res.send(book);
        });

        // Load all coupon codes 
        app.get('/couponCodes', verifyJWT, async (req, res) => {
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

        // load order of specific users 
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

        // send order to database
        app.post('/order', verifyJWT, async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        // add review 
        app.post('/review', verifyJWT, async (req, res) => {
            const review = req.body;
            const result = reviewCollection.insertOne(review);
            res.send(result);
        });

        // add books 
        app.post('/allBooks', verifyJWT, verifyAdmin, async (req, res) => {
            const newBook = req.body;
            const result = allBooksCollection.insertOne(newBook);
            res.send(result);
        });

        // load all reviews
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // load all orders
        app.get('/orders', verifyJWT, verifyAdmin, async (req, res) => {
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