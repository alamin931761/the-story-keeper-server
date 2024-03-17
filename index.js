// const jwt = require("jsonwebtoken");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const port = process.env.PORT || 5000;
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const nodemailer = require("nodemailer");
// const sgTransport = require("nodemailer-sendgrid-transport");

// // middleware
// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f5vut.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });

// // JWT
// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: "UnAuthorized access" });
//   }
//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//     if (err) {
//       return res.status(403).send({ message: "Forbidden access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// }

// // send email
// const emailSenderOptions = {
//   auth: {
//     api_key: process.env.EMAIL_SENDER_KEY,
//   },
// };
// const emailClient = nodemailer.createTransport(sgTransport(emailSenderOptions));

// function sendOrderEmail(order) {
//   const { name, email, time, date } = order;
//   const OrderEmail = {
//     from: process.env.EMAIL_SENDER,
//     to: email,
//     subject: `Your order has been confirmed`,
//     text: "Your order has been confirmed",
//     html: `
//         <div>
//         <p>Hello, ${name},</p>
//         <h3>Your order has been confirmed</h3>
//         </div>
//         `,
//   };

//   emailClient.sendMail(OrderEmail, function (err, info) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("message sent: ", info);
//     }
//   });
// }

// async function run() {
//   try {
//     const allBooksCollection = client
//       .db("the-story-keeper")
//       .collection("allBooks");
//     const orderCollection = client.db("the-story-keeper").collection("order");
//     const couponCollection = client
//       .db("the-story-keeper")
//       .collection("coupon-code");
//     const userCollection = client.db("the-story-keeper").collection("users");

//     // verify admin
//     const verifyAdmin = async (req, res, next) => {
//       const requester = req.decoded.email;
//       const requesterAccount = await userCollection.findOne({
//         email: requester,
//       });
//       if (requesterAccount.role === "admin") {
//         next();
//       } else {
//         res.status(403).send({ message: "forbidden access" });
//       }
//     };

//     // create and update users
//     app.put("/user/:email", async (req, res) => {
//       const email = req.params.email;
//       const user = req.body;
//       const filter = { email: email };
//       const options = { upsert: true };
//       const updateDoc = {
//         $set: user,
//       };
//       const result = await userCollection.updateOne(filter, updateDoc, options);
//       const token = jwt.sign(
//         { email: email },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: "1h" }
//       );
//       res.send({ result, token });
//     });

//     // update profile
//     app.put("/user/:email", verifyJWT, async (req, res) => {
//       const email = req.params.email;
//       const info = req.body;
//       const filter = { email: email };
//       const updateDoc = {
//         $set: info,
//       };
//       const result = await user.updateOne(filter, updateDoc);
//       res.send(result);
//     });

//     // load user profile data
//     app.get("/user/:email", async (req, res) => {
//       const email = req.params.email;
//       const query = { email: email };
//       const result = await userCollection.find(query).toArray();
//       res.send(result);
//     });

//     // make admin
//     app.put("/user/admin/:email", verifyJWT, verifyAdmin, async (req, res) => {
//       const email = req.params.email;
//       const filter = { email: email };
//       const updateDoc = {
//         $set: { role: "admin" },
//       };
//       const result = await userCollection.updateOne(filter, updateDoc);
//       res.send(result);
//     });

//     // remove admin
//     app.patch(
//       "/user/admin/:email",
//       verifyJWT,
//       verifyAdmin,
//       async (req, res) => {
//         const email = req.params.email;
//         const filter = { email: email };
//         const updateDoc = {
//           $set: { role: "user" },
//         };
//         const result = await userCollection.updateOne(filter, updateDoc);
//         res.send(result);
//       }
//     );

//     // Check admin or not
//     app.get("/admin/:email", async (req, res) => {
//       const email = req.params.email;
//       const user = await userCollection.findOne({ email: email });
//       const isAdmin = user.role === "admin";
//       res.send({ admin: isAdmin });
//     });

//     // Stripe
//     app.post("/create-payment-intent", verifyJWT, async (req, res) => {
//       const { total } = req.body;
//       const bookPrice = total;
//       const amount = bookPrice * 100;
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: amount,
//         currency: "usd",
//         payment_method_types: ["card"],
//       });
//       res.send({ clientSecret: paymentIntent.client_secret });
//     });

//     // load all users
//     app.get("/users", verifyJWT, verifyAdmin, async (req, res) => {
//       // shortcut
//       const users = await userCollection.find().toArray();
//       res.send(users);
//     });

//     // delete user
//     app.delete("/user/:email", verifyJWT, verifyAdmin, async (req, res) => {
//       const email = req.params.email;
//       const filter = { email: email };
//       const user = await userCollection.deleteOne(filter);
//       res.send(user);
//     });

//     // Load all coupon codes
//     app.get("/couponCodes", async (req, res) => {
//       const query = {};
//       const cursor = couponCollection.find(query);
//       const coupon = await cursor.toArray();
//       res.send(coupon);
//     });

//     // add review
//     app.patch("/book/:id", verifyJWT, async (req, res) => {
//       const id = req.params.id;
//       const bookData = req.body;
//       const filter = { _id: ObjectId(id) };
//       const updateDoc = {
//         $set: bookData,
//       };
//       const result = await allBooksCollection.updateOne(filter, updateDoc);
//       res.send(result);
//     });

//     // load order of specific users
//     app.get("/order", verifyJWT, async (req, res) => {
//       const email = req.query.email;
//       const decodedEmail = req.decoded.email;
//       if (email === decodedEmail) {
//         // const query = {email:email};
//         const query = { email };
//         const cursor = orderCollection.find(query);
//         const order = await cursor.toArray();
//         return res.send(order);
//       } else {
//         return res.send(403).send({ message: "forbidden access" });
//       }
//     });

//     // send order data to database
//     app.post("/order", verifyJWT, async (req, res) => {
//       const order = req.body;
//       const result = await orderCollection.insertOne(order);
//       sendOrderEmail(order);
//       res.send(result);
//     });
//   } finally {
//   }
// }
// run().catch(console.dir);
