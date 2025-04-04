const createApp = require('./app'); 
const path = require('path');
const mongoose = require('mongoose');
const conectToDataBase = require('./database/dbConection.js');

//Import the environments values
require("dotenv").config({ path: path.join(__dirname, '.env') });
const env = process.env;

// Conect to MongoDB
conectToDataBase(env);

// If MongoDb is connected, create the app
mongoose.connection.once('connected', () => {
  const PORT = env.SERVER_PORT || 3001;
  createApp(PORT);
});
