// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var snippetManager = require('./config/SnippetManager');
var User = require('./app/models/user');
var Snippet = require('./app/models/snippet');
var flash = require('connect-flash');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database
mongoose.set('debug', true);

const app = express();
var secret = 'snippySecret23423FBLogin';
    
// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

app.use(methodOverride());

//app.enable('trust proxy'); // add this line
// parse application/json
var MongoStore = require('connect-mongo')(session);

app.use(cookieParser(secret));

app.use(session({
    resave: true, saveUninitialized: true,
    secret: secret,
    proxy: true, // add this line
    store: new MongoStore({
        url: configDB.url,
        collection: 'sessions'
    }),

    cookie: {
        maxAge: 3600000
    }
}));

app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

var multer = require('multer');
var upload = multer({ dest: './uploads' });

app.post('/getSnippets', function (req, res) {
    console.log('getAllData Called');
    var data = [];
    snippetManager.getAllData(req.body,
        function (data) {
            console.log('getAllData Data Fetched');
            res.send(data);
        }
        );
});

app.post('/saveSnippet', function (req, res) {
    console.log('saveSnippet Called');
    console.log(req.body);
    var data = [];

    snippetManager.saveSnippet(req.body,
        function (data) {
            console.log('Saved');
            res.send(data);
        }
        );
});

app.post('/deleteSnippets', function (req, res) {
    console.log('deleteSnippet Called');
    console.log(req.body);
    var data = [];

    snippetManager.deleteSnippet(req.body,
        function (data) {
            console.log('deleted');
            res.send(data);
        }
        );
});


app.post('/addUser', function (req, res) {
    var profile = req.body;
    console.log(JSON.stringify(profile));
    User.findOne({ 'facebook.id': profile.id }, function (err, user) {
        if (err)
            res.send(err);

        if (user) {
            console.log("User Found: " + JSON.stringify(user));
            User.count({}, function (err, count) {
                if (err)
                    res.send(err);
                console.log("Number of user: ", count);
                Snippet.count({}, function (err, scount) {
                    if (err)
                        res.send(err);
                    console.log("Number of Snippets: ", scount);

                    res.send({ user: count, snippet: scount });
                });
            });
        } else {

            // if there is no user found with that facebook id, create them
            var newUser = new User();

            // set all of the facebook information in our user model
            newUser.facebook.id = profile.id; // set the users facebook id                   
            newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
            newUser.facebook.photo = profile.photos[0].value;
            newUser.avatar = `https://graph.facebook.com/${profile.id}/picture?type=large`;

            newUser.approved = "N";
            // save our user to the database
            newUser.save(function (err) {
                if(err)
                res.send(err);
                //get statistics
                User.count({}, function (err, count) {
                    if (err)
                        res.send(err);
                    console.log("Number of user: ", count);
                    Snippet.count({}, function (err, scount) {
                        if (err)
                            res.send(err);
                        console.log("Number of Snippets: ", scount);

                        res.send({ user: count, snippet: scount });
                    });
                });
            });
        }

    });
});
console.log(__dirname);
// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;