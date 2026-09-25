const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const registerController = require('./controllers/registerController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Registration endpoint
app.post('/register', registerController);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
