// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var snippetSchema = mongoose.Schema({

        id           : String,
        title: String,
        text  : String,
        tags: String,
        lesson: String,
        user: String,
        userId: String,
        date: String

});


// create the model for users and expose it to our app
module.exports = mongoose.model('Snippet', snippetSchema);
