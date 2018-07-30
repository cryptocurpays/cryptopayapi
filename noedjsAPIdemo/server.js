var cluster = require('cluster');
//https://rl.doorwaygame.cn:1100/
// Code to run if we're in the master process
if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('message', (worker, message, handle) => {
        console.log("Master receives message: "+JSON.stringify(message));
        if(message.rouletteResult||message.rouletteClose){
            for (const id in cluster.workers) {
                cluster.workers[id].send(message);
            }
        }
        // ...
    });

// Code to run if we're in a worker process
} else {
    console.log('The worker ID is '+cluster.worker.id);
// server.js

// set up ======================================================================
// get all the tools we need
    var express = require('express');
    var session = require('express-session');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var morgan = require('morgan');
    var app = express();
    var port = process.env.PORT || 8080;
    var passport = require('passport');
    var flash = require('connect-flash');

    var RedisStore = require('connect-redis')(session);

    app.use(express.static('public'));

//Bitcoin Cash and Ethereum node =============================
// Initiate Ethereum Keystore and Eth Web3 instance. Start to check node for new unrecorded transactions.
// Init BCH HD Public key and wallet accounts


    if(cluster.worker.id===1){
        //var Eth = require('./app/eth_transactions');
        //Eth.init();
        //
        ////Roulette Service =============================
        //RouletteCtl = require('./roulette/roundController');
        //setInterval(function () {
        //    RouletteCtl.intervalService(cluster.worker)
        //}, 5000);
    }else {
        // configuration ===============================================================
        // connect to our database
        require('./config/passport')(passport); // pass passport for configuration
        // set up our express application
        app.use(morgan('dev')); // log every request to the console
        app.use(parseCookie = cookieParser('vidyapathaisalwaysrunning')); // read cookies (needed for auth)
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());
        app.set('view engine', 'ejs'); // set up ejs for templating
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



        if(process.env.SSL==undefined){
            //console.log(process.env.SSL)
            var expressWs = require('express-ws')(app)
            require('./app/routes.js').initRoutes(app, passport,cluster.worker);
            app.listen(port);
            console.log('The magic happens on httpport ' + port);
        }else{
            var fs = require('fs');
            var https = require('https');
            var publicConfig = require("./config/publicconfig")
            var httpsServer = https.createServer({
                key: fs.readFileSync(publicConfig.sslprivatekey, 'utf8'),
                cert: fs.readFileSync(publicConfig.sslpublickey, 'utf8')
            }, app);
            var SSLPOST = process.env.SSLPOST || 443;
            var expressWs = require('express-ws')(app,httpsServer);
            require('./app/routes.js').initRoutes(app, passport,cluster.worker);
            var server = httpsServer.listen(SSLPOST, function() {
                console.log('HTTPS Server is running on: https://localhost:'+SSLPOST);
            });


        }

        // Worker handles the master's message
        const RouletteCtl = require('./roulette/roundController');
        cluster.worker.on('message',function (message) {
            if(message.rouletteClose){
                RouletteCtl.closeRound(message);
            }else if(message.rouletteResult){
                RouletteCtl.payout(message);
            }
        });
    }
}