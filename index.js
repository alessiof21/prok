const express = require('express')
const path = require('path');
const db = require('./db/db');
const bodyParser = require('body-parser');

const cache = require('./ex1/cache');

const main = require('./ex1/ex1.js');


const app = express();
const port = 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', async (req, res) => {
    res.render(path.join(__dirname, 'public', 'index.html'));
});

app.post('/', async (req, res) => {
    const arr = main(req.body);
    //cache.updateDb();
    cache.emit('changeDb');
    res.send(arr)
});

app.listen(port, () => {
    console.log(`server is running in localhost ${port}`);
});

