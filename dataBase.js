const mongoose = require('mongoose');
require('dotenv').config();

// connect to mongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(()=>{
    console.log("Connected to MongoDB");
  })
  .catch(()=>{
    console.log("Couldn't connect to MongoDB");
  })

const Schema = mongoose.Schema;


// Create Schema instance for accounts in our AcceptTheCookies DB
let accountsSchema = new Schema({
    Email: String,
    Password: String,
    Username: String
}, {
    collection: 'Accounts',
    versionKey: false  // disable version key
});

// Here we export our module (node.js) to make it available in a different file (index.js)
module.exports.Accounts = mongoose.model('accounts', accountsSchema);
