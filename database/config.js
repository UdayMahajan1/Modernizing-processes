require('dotenv').config();
const mongoose = require('mongoose');

function connectToMongoDB() {
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log("Connected to MongoDB."))
  .catch(err => console.log(err));
}

module.exports = connectToMongoDB;