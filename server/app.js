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
            var userNames = users.map(user => user.name);
            response.json(userNames)
        })
});

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`)
});