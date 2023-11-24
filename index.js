const express = require('express')
const path = require('path');
const db = require('./db/db');




const app = express();
const port = 3001;

app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.send(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`server is running in localhost ${port}`);
});

