const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');
const knex = require('knex')(require('./knexfile.js')['development'])
const session = require('express-session');
const bcrypt = require('bcrypt');
const PgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const pgPool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'docker',
    database: 'motorcycle_gear'
});



app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(
    session({
        store: new PgSession({
            pool: pgPool,
            tableName: 'session'
        }),
        secret: 'supersecretpassword',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1800000000,
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        }
    })
);

app.get('/', (request, response) => {
    response.status(200).send("Welcome to the API home page.")
})

// shows list of users within database
app.get('/users', (request, response) => {
    response.status(200);
    knex('users')
        .select('*')
        .then(users => {
            var usersList = users.map(user => user);
            response.json(usersList)
        })
});

// shows specific user by id
app.get('/users/:id', (request, response) => {
    const userId = request.params.id;

    knex('users')
        .where('id', userId)
        .first()
        .then((user) => {
            if(!user) {
                return response.status(404).json({ error: 'User not found' })
            }
            response.status(200).json(user)
        })
        .catch((error) => {
            response.status(500).json({
                error: 'Server error occurred.'
            })
        })
});

app.post('/users', (request, response) => {
    const { username, email, password } = request.body;

    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            return knex('users')
                    .insert({
                        username,
                        email,
                        password_hashed: hashedPassword
                    })
                    .returning([ 'id', 'username', 'email' ])
        })
        .then(newUser => response.json(newUser[0]))
        .catch((error) => response.status(500).json({ error: "Error creating user" }))
});

// GET with username param
// app.get('/users/:username', (request, response) => {
//     const userId = request.params.username;

//     knex('users')
//         .where({username})
//         .first()
//         .then((user) => {
//             if(!user) {
//                 return response.status(404).json({ error: 'User not found' })
//             }
//             response.json(user)
//         })
//         .catch((error) => {
//             return response.status(500).json({ error: 'Server error occurred.' })
//         })
// });

// shows list of gear stored within database
app.get('/gear', (request, response) => {
    response.status(200)
    knex('gear')
        .select('*')
        .then(items => {
            var itemsList = items.map(item => item);
            response.json(itemsList)
        })
});

app.post('/gear', (request, response) => {
    knex('gear')
        .insert(request.body)
        .returning('*')
        .then(newItem => response.json(newItem))
        .catch((error) => response.status(500).json({ error: 'Database error occurred' }))
});

// show gear by user_id param
app.get('/gear/:id', (request, response) => {
    const userId = request.params.id;

    knex('gear')
        .where('user_id', userId)
        .select('*')
        .then((gear) => {
            const fixedGear = gear.map(item => ({
                ...item,
                crashed: item.crashed === null || item.crashed === undefined
                    ? false
                    : item.crashed
            }))
            response.status(200).json(gear)
        })
        .catch((error) => {
            response.status(500).json({
                error: "Server error occurred"
            })
        })
});

// delete an item in the gear table within database
app.delete('/gear/:id', (request, response) => {
    const gearId = parseInt(request.params.id);
    
    knex('gear')
        .where('id', gearId)
        .del()
        .then((deleteGear) => {
            if(deleteGear === 0) {
                return response.status(404).json({ error: 'Gear not found' })
            }
            response.status(200).json({
                success: true,
                message: `Gear ID: ${gearId} has been removed.`
            })
        })
        .catch((error) => {
            response.status(500).json({ error: 'Database error occured.' })
        }) 
});

// show training records
app.get('/training', (request, response) => {
    response.status(200)
    knex('training')
        .select('*')
        .then(records => {
            var trainingList = records.map(record => record);
            response.json(trainingList)
        })
});

// retrieve training records by userid
app.get('/training/:id', (request, response) => {
    const userId = request.params.id;

    knex('training')
        .where('user_id', userId)
        .select('*')
        .then((record) => {
            if(!record) {
                return response.status(500).json({ error: 'Record not found.' })
            }
            response.status(200).json(record)
        })
        .catch((error) => {
            response.status(500).json({ error: 'Server error occurred.' })
        })
});

// Post a new training record
app.post('/training', (request, response) => {
    const newTrainingRecord = {
        user_id: request.body.userId,
        course_name: request.body.courseName,
        completion_date: request.body.completionDate
    };

    if(!newTrainingRecord.user_id && !newTrainingRecord.course_name && !newTrainingRecord.completion_date) {
        return response.status(400).json({ error: 'Missing a required field.' })
    };

    knex('training')
        .insert(newTrainingRecord)
        .returning('*')
        .then((newRecord) => {
            const newRecordId = newRecord[0];
            response.status(201).json({
                success: true,
                message: 'Record uploaded successfully',
                data: { id: newRecordId, ...newRecord}
            })
        })
        .catch((error) => {
            response.status(500).json({
                error: 'Database error occurred'
            })
        })
});

// shows list of training records within database
app.get('/training', (request, response) => {
    response.status(200)
    knex('training')
        .select('*')
        .then(records => {
            var recordsList = records.map(record => record)
            response.json(recordsList)
        })
});

// update an existing training record
app.put('/training/:id', (request, response) => {
    const recordId = request.params.id;

    const updatedFields = {
        course_name: request.body.courseName,
        completion_date: request.body.completionDate
    };

    if(request.body.courseName !== undefined) updatedFields.course_name = request.body.courseName;
    if(request.body.completionDate !== undefined) updatedFields.completion_date = request.body.completionDate;

    knex('training')
        .where('id', recordId)
        .update(updatedFields)
        .then((updatedRecords) => {
            if(updatedRecords === 0) {
                return response.status(404).json({ error: 'Record not found' })
            }
            response.status(200).json({
                success: true,
                message: `Record ID: ${recordId} has been updated.`,
                data: { id: recordId, ...updatedFields }
            })
        })
        .catch((error) => {
            response.status(500).json({ error: 'Database error occurred' })
        })
});

// delete an existing training record
app.delete('/training/:id', (request, response) => {
    const recordId = request.params.id;

    knex('training')
        .where('id', recordId)
        .del()
        .then((deletedRecord) => {
            if(deletedRecord === 0) {
                return response.status(404).json({ error: 'Training record not found.'})
            }
            response.status(200).json({
                success: true,
                message: `Record ID: ${recordId} has been deleted`
            })
        })
        .catch((error) => {
            response.status(500).json({ error: 'Database error occurred' })
        })
});

// login function that looks for the user within the users table in the database
app.post('/login', (request, response) => {
    const { username, password } = request.body;

    knex('users')
        .where({ username })
        .first()
        .then(user => {
            if(!user) {
                return response.status(401).json({ error: "Invalid login" });
            }
            return bcrypt.compare(password, user.password_hash)
                .then(match => {
                    if(!match) {
                        return response.status(401).json({ error: "Invalid login" })
                    }
                    request.session.userId = user.id;
                    request.session.username = user.username;
                    response.json({ success: true, user });
                })
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ error: "Server error" })
        })
});

// creates an entry in the session table
app.get('/session', (request, response) => {
    if(request.session.userId) {
        response.json({ 
            loggedIn: true,
            username: request.session.username,
            id: request.session.userId
        })
    } else {
        response.json({ loggedIn: false })
    }
});

// logout and kill session
app.post('/logout', (request, response) => {
    request.session.destroy(() => {
        response.json({ success: true })
    })
});

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`)
});