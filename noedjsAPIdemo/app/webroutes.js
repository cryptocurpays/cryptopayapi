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
        res.render('index.ejs'); // load the index.ejs file
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
            res.redirect('/');
        });



    app.get('/details',isLoggedIn, details.detailsGet);//test

    app.get('/useraddress',details.useraddress)  //后台向 api 请求参数
    app.get('/getrates',details.getrates)   //后台向 api 请求参数
    app.get('/pendingdeposits',details.pendingDeposits)  //后台向 api 请求参数
    app.get('/withdraw',details.withdraw)   //后台向 api 请求参数
    app.get('/withdrawlist',details.withdrawList)   //后台向 api 请求参数
    app.get('/depositlist',details.depositList) //后台向 api 请求参数

    //restful 通知
    app.post('/deposit',details.postNewDeposit) //deposit   等待接受通知
    app.post('/withdraw',details.postWithdraw) //withdraw   等待接受通知


}};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}
