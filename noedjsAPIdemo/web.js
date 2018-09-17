

// set up ======================================================================
// get all the tools we need
    var express = require('express');
    var session = require('express-session');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var app = express();
    var port = process.env.PORT || 8080;
    var passport = require('passport');
    var flash = require('connect-flash');
    var ejs = require('ejs');
    var RedisStore = require('connect-redis')(session);

    app.use(express.static('public'));

    // configuration ===============================================================
    // connect to our database
    require('./config/passport')(passport); // pass passport for configuration
    // set up our express application
    app.use(parseCookie = cookieParser('sjcniuw12undjkxsiu')); // read cookies (needed for auth)
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.engine('.html', ejs.__express);
    app.set('view engine', 'ejs','html'); // set up ejs for templating
    //var expressWs = require('express-ws')(app);
    // required for passport
    const redisconfig = require('./config/redisconfig')

    var sessionParser = session({
        store: new RedisStore({
            host: redisconfig.host,
            port: redisconfig.port
        }),
        secret: 'vidyapathaisalwaysrunning',
        resave: true,
        saveUninitialized: true,
        //   cookie: {secure: true, maxAge: null, httpOnly: true}
    });
    app.use(sessionParser); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session


    // routes ======================================================================
    //require('./app/routes.js').initRoutes(app, passport,cluster.worker); // load our routes and pass in our app and fully configured passport
    // launch ======================================================================


    //console.log(process.env.SSL)
    var expressWs = require('express-ws')(app)
    require('./app/webroutes.js').initRoutes(app, passport);
    app.listen(port);
    console.log('The magic happens on httpport ' + port);


