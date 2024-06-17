const express = require('express');
require('dotenv').config();
const database = require('./config/database');
const bodyParser = require('body-parser')
const cors = require('cors');

const routesApiVer1 = require('./api/v1/routes/index.route');

database.connect();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// create application/json parser
app.use(bodyParser.json())

// API Routes
routesApiVer1(app);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});