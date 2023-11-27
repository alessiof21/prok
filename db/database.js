const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: null,
    database: 'mydb'
});

client.connect();

client.query(`Select * from users`, (err, res) => {
    if (!err) {
        console.log(res.rows);
    } else {
        console.error(err.message);
    }
    client.end();
})