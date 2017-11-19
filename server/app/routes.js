// app/routes.js
module.exports = function(app, passport, snippetManager) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	app.get('/snippy', isLoggedIn, function (req, res) {
	    res.render('snippy.ejs', {
	        user: req.user // get the user out of session and pass to template
	    });
	});

	app.get('/getAllData', isLoggedIn, function (req, res) {
	    console.log('getAllData Called');
	    var data = [];
	    snippetManager.getAllData(
            function(data)
            {
                console.log('getAllData Data Fetched');
                res.send(data);
            }
            );
	});

	app.post('/saveSnippet', isLoggedIn, function (req, res) {
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



    // =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			failureRedirect : '/'
		}),
  function (req, res) {
      // Explicitly save the session before redirecting!
      req.session.save(() => {
          console.log('Saving Session: ' + req.user);
          req.login(req.user, err => console.log(err));
          res.redirect('/snippy');
      })
  });

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log("IsLoggedIn: " + JSON.stringify(req.user));
        return next();
    }
    console.log("Not Logged In");
	// if they aren't redirect them to the home page
	res.redirect('/');
}
