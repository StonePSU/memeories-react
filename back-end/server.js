const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const routes = require(path.join(process.cwd(), 'app', 'routes', 'routes.js'));
const auth = require(path.join(process.cwd(), 'app', 'security', 'passport.js'));
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

app.set('x-powered-by', false);

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.use('/', express.static('./build'))

// Initialize Passport
auth(passport);

// Handle Routes
routes(app, passport);

// error handler for any uncaught errors
app.use((err, req, res, next) => {
  res.status(500).send(`<h1>${err}</h1>`);
})

app.listen(8080, () => {
  console.log("The server is running");
})
