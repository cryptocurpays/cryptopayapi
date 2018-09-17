// app/routes.js


var loginpath = require("./../path/loginPath");
var details = require("./../path/detailsPath")



var tools = require("./tools")

module.exports = {initRoutes: function(app, passport,worker) {
	app.use(function(req, res, next){
	    //console.log("In routers.js, the worker id is :"+worker.id);
        next();
	});

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
        //var array ={"userid":2};
        //tools.sendhttppost("http://localhost:8081/makeaddress",array)
        res.render('login.ejs'); // load the index.ejs file
        // res.render('mhlogin.html');
	});

    app.get('/userdata', function(req, res) {
        //var array ={"userid":2};
        //tools.sendhttppost("http://localhost:8081/makeaddress",array)
        //res.render('index.ejs'); // load the index.ejs file
        res.render('mhlogin.html',{user: req.user});
    });

    app.get('/login', loginpath.loginGet);


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/userdata', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
 //           res.redirect('/');
        }
    );

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/userdata', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
           // res.redirect('/');
        }
    );

/*
    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup',function(err, user, info){
            //注册失败
            if(!user){
                console.log(req.body.username+" 玩家注册失败")
                return res.send(info)
            }
            //注册成功
            //var user = req.user
            console.log(user)
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            //res.send(user)
            res.redirect('/userdata')
        })(req, res, next);
    })
*/


  //  app.get('/details',isLoggedIn, details.detailsGet);//test



    //background web


    app.get('/useraddress',details.userAddress)
    app.get('/getrates',details.getRates)
    app.get('/pendingdeposits',details.pendingDeposits)
    app.get('/outwithdraw',details.withdraw)
    app.get('/withdrawlist',details.withdrawList)
    app.get('/depositlist',details.depositList)
    app.get('/openotcurl',details.openOtcUrl)

    //restful 通知
    app.post('/deposit',details.postNewDeposit) //deposit
    app.post('/withdraw',details.postWithdraw) //deposit


}};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}
