const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');
const knex = require('knex')(require('./knexfile.js')['development'])

app.use(express.json());
app.use(cors());

app.get('/users', (request, response) => {
    response.status(200);
    knex('users')
        .select('*')
        .then(users => {
            var usersList = users.map(user => user);
            response.json(usersList)
        })
});

app.get('/gear', (request, response) => {
    response.status(200)
    knex('gear')
        .select('*')
        .then(items => {
            var itemsList = items.map(item => item);
            response.json(itemsList)
        })
});

app.get('/training', (request, response) => {
    response.status(200)
    knex('training')
        .select('*')
        .then(records => {
            var recordsList = records.map(record => record)
            response.json(recordsList)
        })
});

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`)
});