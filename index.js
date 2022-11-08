const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from The Story Keeper!')
});

app.get('/users', (req, res) => {
    res.send('Hello Users')
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});