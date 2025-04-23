const createApp = require('./app'); 
const path = require('path');
const mongoose = require('mongoose');
const conectToDataBase = require('./database/dbConection.js');
const fs = require('fs');

//Import the environments values if exists in the development environment
const envPath = path.join(__dirname, '.env');
if(fs.existsSync(envPath)) {require("dotenv").config({ path: envPath })};
const env = process.env;

// Conect to MongoDB
conectToDataBase(env);

// If MongoDb is connected, create the app
mongoose.connection.on('connected', () => {
  const PORT = env.PORT || 3001;
  createApp(PORT);
});
