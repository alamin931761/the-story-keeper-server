const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

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
};

// send email 
const emailSenderOptions = {
    auth: {
        api_key: process.env.EMAIL_SENDER_KEY
    }
};
const emailClient = nodemailer.createTransport(sgTransport(emailSenderOptions));

function sendOrderEmail(order) {
    const { name, email, time, date } = order;
    const OrderEmail = {
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: `Your order has been confirmed`,
        text: "Your order has been confirmed",
        html: `
        <div>
        <p>Hello, ${name},</p>
        <h3>Your order has been confirmed</h3>
        </div>
        `
    };

    emailClient.sendMail(OrderEmail, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("message sent: ", info);
        }
    })
};

async function run() {
    try {
        const allBooksCollection = client.db('the-story-keeper').collection("allBooks");
        const orderCollection = client.db('the-story-keeper').collection("order");
        const couponCollection = client.db('the-story-keeper').collection("coupon-code");
        const userCollection = client.db('the-story-keeper').collection("users");

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
            const { total } = req.body;
            const bookPrice = total;
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
            const cursor = allBooksCollection.find(query);
            const allBooks = await cursor.toArray();
            res.send(allBooks);
        });

        // load all book data 
        app.get('/books', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const sorted = req.headers.sorted;
            const minimumSliderValue = parseInt(req.headers.minimum_slider_value);
            const maximumSliderValue = parseInt(req.headers.maximum_slider_value);
            const category = req.headers.category;

            let query;
            if (category) {
                query = {
                    "price": {
                        $gte: minimumSliderValue,
                        $lte: maximumSliderValue
                    },
                    "category": category
                }
            } else {
                query = {
                    "price": {
                        $gte: minimumSliderValue,
                        $lte: maximumSliderValue
                    }
                };
            }

            if (sorted === "low-high") {
                const cursor = await allBooksCollection.find(query).sort({ "price": 1 });
                let books = await cursor.skip(page * size).limit(size).toArray();
                const count = await allBooksCollection.countDocuments(query);
                res.send({ count, books });
            }
            else if (sorted === "high-low") {
                const cursor = await allBooksCollection.find(query).sort({ "price": -1 });
                let books = await cursor.skip(page * size).limit(size).toArray();
                const count = await allBooksCollection.countDocuments(query);
                res.send({ count, books });
            } else if (sorted === "a-z") {
                const cursor = await allBooksCollection.find(query).sort({ "title": 1 });
                let books = await cursor.skip(page * size).limit(size).toArray();
                const count = await allBooksCollection.countDocuments(query);
                res.send({ count, books });
            } else if (sorted === "z-a") {
                const cursor = await allBooksCollection.find(query).sort({ "title": -1 });
                let books = await cursor.skip(page * size).limit(size).toArray();
                const count = await allBooksCollection.countDocuments(query);
                res.send({ count, books });
            } else if (sorted === "oldest-newest") {
                const cursor = await allBooksCollection.find(query).sort({ "publication_date": 1 });
                let books = await cursor.skip(page * size).limit(size).toArray();
                const count = await allBooksCollection.countDocuments(query);
                res.send({ count, books });
            } else if (sorted === "newest-oldest") {
                const cursor = await allBooksCollection.find(query).sort({ "publication_date": -1 });
                let books = await cursor.skip(page * size).limit(size).toArray();
                const count = await allBooksCollection.countDocuments(query);
                res.send({ count, books });
            } else if (sorted === "best-selling") {
                const cursor = await allBooksCollection.find(query).sort({ "totalSales": -1 });
                let books = await cursor.skip(page * size).limit(size).toArray();
                const count = await allBooksCollection.countDocuments(query);
                res.send({ count, books });
            } else {
                const cursor = await allBooksCollection.find(query);
                let books = await cursor.skip(page * size).limit(size).toArray();
                const count = await allBooksCollection.countDocuments(query);
                res.send({ count, books });
            }
        });

        // load new arrivals book data
        app.get('/newArrivals', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const minimumSliderValue = parseInt(req.headers.minimum_slider_value);
            const maximumSliderValue = parseInt(req.headers.maximum_slider_value);
            const query = {
                "price": {
                    $gte: minimumSliderValue,
                    $lte: maximumSliderValue
                }
            }
            const cursor = await allBooksCollection.find(query).sort({ "publication_date": -1 });
            let books = await cursor.skip(page * size).limit(size).toArray();
            const count = await allBooksCollection.countDocuments(query);
            res.send({ count, books });
        });

        // load edit book data
        app.get('/editBook/:id', verifyJWT, verifyAdmin, async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const book = await allBooksCollection.findOne(query);
                res.send(book);
            } catch (err) {
                res.status(404).send('Book not found');
            }
        });

        // send edited book data to database
        app.patch('/allBooks/:id', verifyJWT, verifyAdmin, async (req, res) => {
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
        app.patch('/orders/:id', verifyJWT, verifyAdmin, async (req, res) => {
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

        // delete user 
        app.delete("/user/:email", verifyJWT, verifyAdmin, async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const user = await userCollection.deleteOne(filter);
            res.send(user);
        })

        // Load all coupon codes 
        app.get('/couponCodes', async (req, res) => {
            const query = {};
            const cursor = couponCollection.find(query);
            const coupon = await cursor.toArray();
            res.send(coupon);
        });

        // load single book data
        app.get('/book/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const book = await allBooksCollection.findOne(query);
                res.send(book);
            } catch (err) {
                res.status(404).send('Book not found');
            }
        });

        // add review 
        app.patch('/book/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const bookData = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: bookData
            }
            const result = await allBooksCollection.updateOne(filter, updateDoc);
            res.send(result);
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

        // send order data to database
        app.post('/order', verifyJWT, async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            sendOrderEmail(order);
            res.send(result);
        });

        // add books 
        app.post('/allBooks', verifyJWT, verifyAdmin, async (req, res) => {
            const newBook = req.body;
            const result = await allBooksCollection.insertOne(newBook);
            res.send(result);
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