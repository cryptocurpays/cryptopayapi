const MYSQL = require('mysql');
const DBCONFIG = require('./../config/database');
//const connection = MYSQL.createConnection(DBCONFIG.connection);
var pool= MYSQL.createPool(DBCONFIG.connection);

var tools=require("./../app/tools")



function getPlayerByUserName(username,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }
        connection.query("SELECT * FROM "+DBCONFIG.database+ "."+ DBCONFIG.players_table +" where username='"+username+"'", function(err, rows){


            if (err){
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}

function getDepositByTxid(txid,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }
        connection.query("SELECT * FROM "+DBCONFIG.database+ "."+ DBCONFIG.app_deposits_table +" where txid='"+txid+"'", function(err, rows){


            if (err){
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}

function getDepositByPlayerid(playerid,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }
        connection.query("SELECT * FROM "+DBCONFIG.database+ "."+ DBCONFIG.app_deposits_table +" where playerid="+playerid+"", function(err, rows){


            if (err){
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}

function getWithdrawByTxid(orderid,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }
        connection.query("SELECT * FROM "+DBCONFIG.database+ "."+ DBCONFIG.app_withdraw_table +" where id='"+orderid+"'", function(err, rows){


            if (err){
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}

function getWithdrawByPlayer(player,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }
        connection.query("SELECT * FROM "+DBCONFIG.database+ "."+ DBCONFIG.app_withdraw_table +" where playerid='"+player+"'", function(err, rows){


            if (err){
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}

function getPlayerByplayerid(playerid,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }
        connection.query("SELECT * FROM "+DBCONFIG.database+ "."+ DBCONFIG.players_table +" where playerid='"+playerid+"'", function(err, rows){


            if (err){
                return done(err);
            }
            /*
             else if(rows.length==0){
             return done("No users with this username "+username+" were found!");
             }
             else if(rows.length>1){
             return done("More than one users with this username "+username+" were found!");
             }
             */
            return done(null, rows);
        });
        connection.release();
    })
}

function updateCoinByUsername(coin,username,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }

        var sql = "UPDATE " + DBCONFIG.database + "."+DBCONFIG.players_table+" SET coin = "+coin+" WHERE username = '"+username +"'"

        connection.query(sql, function (err, rows) {
            if (err) {
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}


function updateWithdrawByOrderId(orderid,data,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }

        var sql = "UPDATE " + DBCONFIG.database + "."+DBCONFIG.app_withdraw_table+" SET txid = "+codeSQLescape(data.txid) + " , status="+codeSQLescape(data.statues)+" WHERE id = '"+orderid +"'"
        console.log(sql)
        connection.query(sql, function (err, rows) {
            if (err) {
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}

function updateDeCoinByUsername(coin,username,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }

        var sql = "UPDATE " + DBCONFIG.database + "."+DBCONFIG.players_table+" SET coin = coin-"+coin+" WHERE username = '"+username +"' and coin>="+coin

        connection.query(sql, function (err, rows) {
            if (err) {
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}

function updateAddCoinByUsername(coin,username,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }

        var sql = "UPDATE " + DBCONFIG.database + "."+DBCONFIG.players_table+" SET coin = coin+"+coin+" WHERE username = '"+username +"' "

        connection.query(sql, function (err, rows) {
            if (err) {
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}

function updateAddCoinByPlayerid(coin,playerid,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }
        if(coin<0){
            let selectQ = 'SELECT * FROM '+DBCONFIG.database + "."+DBCONFIG.players_table+" WHERE playerid = "+playerid;
            connection.query(selectQ,function (err,data) {
                if(err) return done(err)
                else if(data.length!==1) return done('Cannot find the player to update Coin')
                else if((data[0].coin)<coin) return done('This player does not have enough coin to update!')
                else {
                    var sql = "UPDATE " + DBCONFIG.database + "."+DBCONFIG.players_table+" SET coin = coin+"+coin+" WHERE playerid = "+playerid +" "
                    connection.query(sql, function (err, rows) {
                        if (err) {
                            return done(err);
                        }
                        return done(null, rows);
                    });
                    connection.release();
                }
            })
        }else{
            var sql = "UPDATE " + DBCONFIG.database + "."+DBCONFIG.players_table+" SET coin = coin+"+coin+" WHERE playerid = "+playerid +" "
            connection.query(sql, function (err, rows) {
                if (err) {
                    return done(err);
                }
                return done(null, rows);
            });
            connection.release();
        }
    })
}

function updateSubmittedWithdraw(withdrawId, orderId,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }

        var sql = "UPDATE " + DBCONFIG.database + "."+DBCONFIG.app_withdraw_table+" SET withdrawid = "+withdrawId+" AND status = "+tools.WithdrawStatus.Submitted+" WHERE id = "+orderId +" "
        connection.query(sql, function (err, rows) {
            if (err) {
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();

    })
}


function addUser(newUserMysql, done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }
        var d= new Date();
        var insertQuery = "INSERT INTO "+DBCONFIG.database + "." +DBCONFIG.players_table+" ( username, password,accounttype,imei,nickname,invitationcode,createtime ) values ("+
            "'"+newUserMysql.username+"','"+newUserMysql.password+"',"+newUserMysql.accounttype+",'"+newUserMysql.imei+"','"+newUserMysql.nickname+"','"+newUserMysql.invitationcode+"',"+d.valueOf()+""+")";

        console.log(insertQuery)
        connection.query(insertQuery,function(err, rows) {
            if(err){
                return done(err);
            }
            newUserMysql.id = rows.insertId;
            return done(null, newUserMysql);
        });
        connection.release();
    })
}


function getAllTableConfig(done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }

        var sql = "SELECT * from " + DBCONFIG.database + "."+DBCONFIG.tableconfig_table+" WHERE visable =0 ORDER BY rank"

        connection.query(sql, function (err, rows) {
            if (err) {
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}


function updateAddGamesByPlayerid(playerid,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }

        var sql = "UPDATE " + DBCONFIG.database + "."+DBCONFIG.players_table+" SET playgames = playgames+"+1+" WHERE playerid = "+playerid +" "
        console.log(sql)
        connection.query(sql, function (err, rows) {
            if (err) {
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}

function updateAMaxWinCoinByPlayerid(maxwincoin,playerid,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }

        var sql = "UPDATE " + DBCONFIG.database + "."+DBCONFIG.players_table+" SET maxwincoin = +"+maxwincoin+" WHERE playerid = "+playerid +" and maxwincoin<"+maxwincoin
        console.log(sql)
        connection.query(sql, function (err, rows) {
            if (err) {
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}

function addPlayerWinLog(blocknumber, playerid,tableid,indexnumber,wincoin,bettingcoin,createtime,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }

        var sql = "INSERT INTO "+DBCONFIG.database + "." +DBCONFIG.playerwin_table+" ( blocknumber, playerid,tableid,indexnumber,wincoin,bettingcoin,createtime) values ("+
            blocknumber+", "+playerid+",'"+tableid+"',"+indexnumber+","+wincoin+","+bettingcoin+","+createtime+")";
        console.log(sql)
        connection.query(sql, function (err, rows) {
            if (err) {
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}

function addPlayerActionLog(blocknumber, playerid,tableid,createtime,winlist,loselist,done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }

        var sql = "INSERT INTO "+DBCONFIG.database + "." +DBCONFIG.playgameactionlog_table+" ( blocknumber, playerid,tableid,actionid,bettype,betnumber,betcoin,indexaction,createtime) values "


        if(winlist.length>0){
            for(var i = 0 ; i < winlist.length ; i ++){
                var b = winlist[i]
                sql = sql+"("+blocknumber+","+playerid+",'"+tableid+"',"+tools.PlayActionCode.WinBet+",'"+b.type+"','"+b.value+"',"+b.amount+","+i+","+createtime  +")"
                if(i<winlist.length-1){
                    sql = sql+","
                }
            }
        }

        if(loselist.length>0){
            sql = sql+","
            for(var i = 0 ; i < loselist.length ; i ++){
                var b = loselist[i]
                sql = sql+"("+blocknumber+","+playerid+",'"+tableid+"',"+tools.PlayActionCode.LoseBet+",'"+b.type+"','"+b.value+"',"+b.amount+","+i+","+createtime  +")"
                if(i<loselist.length-1){
                    sql = sql+","
                }
            }
        }

        console.log(sql)
        connection.query(sql, function (err, rows) {
            if (err) {
                return done(err);
            }
            return done(null, rows);
        });
        connection.release();
    })
}



function addARecord(tableName, fieldList, done) {
    pool.getConnection(function (err,connection) {
        if (err) {
            connection.release();
            return done("Error in connection database");
        }
        let keys = Object.keys(fieldList);
        let values = Object.values(fieldList);
        let fields = null;
        let field_values = null;
        for (let i = 0; i < keys.length; i++) {
            if(fields===null) fields = codeSQLescapeId(keys[i])
            else fields = fields+","+codeSQLescapeId(keys[i]);

            if (typeof values[i] === 'string'){
                if(field_values===null)
                    field_values =""+codeSQLescape(values[i])+"";
                else
                    field_values = field_values +","+""+codeSQLescape(values[i])+"";
            }
            else{
                if(field_values===null)
                    field_values =codeSQLescape(values[i]);
                else
                    field_values = field_values +","+codeSQLescape(values[i]);
            }
        }
        let insertQuery = "INSERT INTO " + DBCONFIG.database + "."+tableName+" ("+fields+") values ("+field_values+")";
        console.log(insertQuery);

        connection.query(insertQuery, function(err, data){
            if (err){
                return done(err);
            }
            return done(null, data);
        });
        connection.release();
    })
}



function codeSQLescape(value){
    return MYSQL.escape(value)
}

function codeSQLescapeId(value){
    return MYSQL.escapeId(value)
}


module.exports = {
    getPlayerByUserName:getPlayerByUserName,
    addUser:addUser,
    updateCoinByUsername:updateCoinByUsername,
    getAllTableConfig:getAllTableConfig,
    getPlayerByplayerid:getPlayerByplayerid,
    updateDeCoinByUsername:updateDeCoinByUsername,
    updateAddCoinByUsername:updateAddCoinByUsername,
    updateAddCoinByPlayerid:updateAddCoinByPlayerid,
    updateAddGamesByPlayerid:updateAddGamesByPlayerid,
    updateAMaxWinCoinByPlayerid:updateAMaxWinCoinByPlayerid,
    addPlayerWinLog:addPlayerWinLog,
    addPlayerActionLog:addPlayerActionLog,
    getDepositByTxid:getDepositByTxid,
    addARecord:addARecord,
    getWithdrawByTxid:getWithdrawByTxid,
    updateWithdrawByOrderId:updateWithdrawByOrderId,
    getWithdrawByPlayer:getWithdrawByPlayer,
    getDepositByPlayerid:getDepositByPlayerid,
    updateSubmittedWithdraw:updateSubmittedWithdraw
};
