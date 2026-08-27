const bcrypt = require('bcrypt');

bcrypt.hash("honda", 10)
    .then(console.log)