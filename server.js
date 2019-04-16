const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./config/mongoose')('securelogreg');

const user = require('./routes/user.routes');
app.use('/api/user', user);

app.listen(PORT, () => {
    console.log('Server is running on port: ', PORT);
})