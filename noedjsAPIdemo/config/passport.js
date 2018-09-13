// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

var keystore = require('./../service/keystoreeth');
var bchKeyUtils = require("./../service/keystorebch");

// load up the user model
const DBSERVICE = require('./../service/db_service');
//var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var tools = require("./../app/tools")
const redis = require("redis");
const redisconfig = require('./../config/redisconfig')
client = redis.createClient(redisconfig.port,redisconfig.host);


//var dbconfig = require('./database');
//var connection = mysql.createConnection(dbconfig.connection);
//const fs = require('fs');


//connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        //console.log('user'+user)
        done(null, user.playerid);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {

        DBSERVICE.getPlayerByplayerid(id,function (err,rows) {
            //console.log(err)
            if(err)
                return
            done(err, rows[0]);
        })
        /*
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
        */
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy(
            {
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'username',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
        function(req, userid, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists

            var bodys = req.body;
            //console.log(bodys)

            if(bodys.accounttype != tools.PLAYERACCOUNTTYPE.VISITOR){
                var redie_key=tools.REDIS_KEY_VC+"_"+bodys.username+"_"+parseInt(tools.MessageCode.SIGNUP)
                console.log(redie_key)

                client.get(redie_key,function(err,currentRN){
                    //console.log(this.bodys)
                    console.log("currentRN = "  +currentRN)

                    if(currentRN != bodys.vccode){
                        return done(null, false,{type:tools.ERRORCODE.VCCODE,message:"验证码错误"}); // create the loginMessage and save it to session as flashdata
                    }
                    usersignup(this.bodys,done)


                }.bind({bodys:bodys}))
            }else{
                usersignup(bodys,done)
            }

        })
    );





    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy(
            {
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'username',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback

            },userlog)

    );

    //function userlog(){
    function userlog(req, userid, password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        //console.log(req)
        var bodys = req.body;
        console.log(bodys)
        DBSERVICE.getPlayerByUserid(bodys.username,function (err,rows) {
            if (err){
                console.log(err)
                return done(err);
            }
            if (rows.length==0) {
                return done(null, false,{type:tools.ERRORCODE.NOPLAYER,message:"没有用户"}); // create the loginMessage and save it to session as flashdata
            } else {
                var player=rows[0]
                if (!bcrypt.compareSync(password, rows[0].password)){

                    return done(null, false,{type:tools.ERRORCODE.ERRORPASSWORD,message:"密码不匹配"}); // create the loginMessage and save it to session as flashdata

                }
                console.log(rows[0])
                return done(null,rows[0])

            }
        }.bind({bodys:bodys}))
    }

    function usersignup(bodys,done){


        DBSERVICE.getPlayerByUserid(bodys.username,function (err,rows) {
            if (err)
                return done(err);
            if (rows.length) {
                console.log(rows)
                //return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                return done(null, false,{type:tools.ERRORCODE.HAVEPLAYERDATA,message:"账号已经存在"}); // create the loginMessage and save it to session as flashdata
            } else {


                var newUserMysql = {
                    username: this.bodys.username,
                    password: bcrypt.hashSync(this.bodys.password, null, null) , // use the generateHash function in our user model
                    accounttype: 10,
                    imei:'aksjnquw',
                    nickname:"欢迎",
                    invitationcode:'123456'

                };
                DBSERVICE.addUser(newUserMysql,function (err,data) {
                    console.log(data)
                    if(err){
                        console.log(err);
                        return done(err);
                    }else
                        return done(null,data)

                })
            }
        }.bind({bodys:bodys}))
    }


};
