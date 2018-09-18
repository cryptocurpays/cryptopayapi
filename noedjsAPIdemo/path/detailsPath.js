/**
 * Created by shijiangang on 2018/6/12.
 */


const tools = require('./../app/tools')
const redis = require("redis");
const redisconfig = require('./../config/redisconfig')
client = redis.createClient(redisconfig.port,redisconfig.host);
const DBService =require('./../service/db_service');

const AppCfg = require('./../config/application')

var apihost=AppCfg.apiHost
var appId=AppCfg.appId
var appSecret = AppCfg.appSecret


// Get a player's deposit addresses. Need to retrieve the token and use the token to retrieve the addresses.

function userAddress(req,res){

    getUserApiToken(req.user.playerid,function(err, token){
        if(err) return res.send(err);
        let url = apihost+appId+"/users/"+req.user.playerid+"/address?token="+token
        console.log(url)
        tools.sendhttpget(url,function(err,data){
            if(err) return res.send(err)
            data = JSON.parse(data)
            if(data.type!==0)
                return res.send('API Error Code:'+data.type)
            return res.send(data.data.addresses)
        })
    })
}


function getRates(req,res){
    var fiatName = req.query.fiatName
    var url = apihost+"rates/" + fiatName
    console.log(url)
    tools.sendhttpget(url, function (err, data) {
        console.log(err)
        console.log(data)
        data = JSON.parse(data)
        res.send(data.data)

    })
}

function pendingDeposits(req,res){
    getUserApiToken(req.user.playerid,function(err,tonken){
        var url = apihost+appId+"/users/"+req.user.playerid+"/pendingdeposits?token="+tonken
        console.log(url)
        tools.sendhttpget(url,function(err,data){
            console.log(err)
            console.log(data)
            data = JSON.parse(data)
            res.send(data.data)
        })
    })
}

//A player sends a withdraw request to the game server.
// The game server deducts coins from the player's account and send a crypto withdraw request to the payment gateway.
// We assume player specify the coin amount and crypto type.
function withdraw(req,res){

    var withdrawData = {
        toaddress:req.query.toaddress,
        cryptotype:req.query.cryptoType,
        coinamount:req.query.amount,
        playerid:req.user.playerid,
        status: tools.WithdrawStatus.Created
    }

    var url = apihost+"rates/cny"

    tools.sendhttpget(url, function (err, data) {

        let dataObj = JSON.parse(data)
        if((err)||(dataObj.type!==0)){
            return res.send('Cannot handle the withdraw request because the rate service is out of service!')
        }

        withdrawData.rates = dataObj.data[withdrawData.cryptotype]
        withdrawData.cryptovalue = parseFloat(withdrawData.coinamount/withdrawData.rates);

        DBService.updateAddCoinByPlayerid(-withdrawData.coinamount,req.user.playerid,function(err,data){
            if(err) return res.send(err);
            console.log(err)

            DBService.addARecord("app_withdraw",withdrawData,function(err,d){
                if(err) return res.send(err)

                let post ={};
                var url = apihost+appId+"/tx/withdraw/"+req.query.cryptoType
                post.orderId = d.insertId;
                post.cryptoType=withdrawData.cryptotype;
                post.toAddress=withdrawData.toaddress;
                post.cryptoValue= withdrawData.cryptovalue;

                tools.sendhttppost(url,post,function(err,resData){

                    if(err) return res.send(err)
                    let data = JSON.parse(resData)
                    if(data.type!==0)
                        return res.send('API Error Code:'+data.type)

                    DBService.updateSubmittedWithdraw(data.data.withdrawId,data.data.orderId,function (err,done) {
                        if(err) return res.send(err)
                        return res.send(data.data)
                    })
                })
            })
        })
    })
}

function withdrawList(req,res){
    DBService.getWithdrawByPlayer(req.user.playerid,function(err,data){
        console.log(err)
        res.send(JSON.stringify(data))

    })
}


function depositList(req,res){
    DBService.getDepositByPlayerid(req.user.playerid,function(err,data){
        console.log(err)
        //console.log(data)
        res.send(JSON.stringify(data))

    })
}

function getUserApiToken(playerid,done){

    var url = apihost+appId+"/token/"+playerid+"?appsecret="+appSecret
    console.log(url)
    tools.sendhttpget(url,function(err,data){
        
        if(err) return done(err)
        data = JSON.parse(data)
        if(data.type!==0)
            return done('API Error Code:'+data.type)
        return done(null,data.data.token)
    })
}

function postNewDeposit(req,res){
    var body = req.body
    //console.log(body)
    if(tools.isNullString(body)){
        return res.send("{\"message\":\"err!\"}")
    }

    if(tools.isNullString(body.txId)){
        return res.send("{\"message\":\"err!\"}")
    }

    DBService.getDepositByTxid(body.txId,function(err,data){
        if(err){
            console.log(err)
            return res.send("{\"message\":\"err!\"}")
        }

        if(data.length>0){
            return res.send("{\"message\":\"received!\"}")
        }

        let postObj = {};
        postObj.appid = body.appId;
        postObj.playerid = body.userId;
        postObj.txid = body.txId;
        postObj.cryptoType = body.cryptoType;
        postObj.cryptoValue = body.cryptoValue;
        postObj.fiatCurrency = body.fiatCurrency;
        postObj.fiatRate = body.fiatRate;
        postObj.virtualValue = body.fiatRate*body.cryptoValue//body.virtualValue;
        postObj.createtime = body.timestamp;
        postObj.fromAddress = body.fromAddress;
        postObj.toAddress = body.toAddress;

        DBService.addARecord("app_deposits",postObj,function(err,data){
            if(err){
                console.log(err)
                return res.send("{\"message\":\"err!\"}")
            }

            DBService.updateAddCoinByPlayerid(this.postObj.virtualValue,this.postObj.playerid,function(err,data){

                console.log(err)
                //console.log(data)

                return res.send("{\"message\":\"received!\"}")
            }.bind({postObj}))

        }.bind({postObj}))

    }.bind({body}))
}

//This function was called by payment gateway, noticing the game server that a withdraw request has been fulfilled.


function postWithdraw(req,res){
    var body = req.body
    console.log(body)
    if(tools.isNullString(body)){
        return res.send("{\"message\":\"body fail!\"}")
    }

    if(tools.isNullString(body.orderId)){
        return res.send("{\"message\":\"txId fail!\"}")
    }

    DBService.getWithdrawByTxid(body.orderId,function(err,data){
        console.log(err)

        if(data.length <=0){
            return res.send("{\"message\":\"Order Id Error!\"}")
        }

        if(data[0].statues==tools.WithdrawStatus.Notified){
            return res.send("{\"message\":\"received!\"}")
        }

        var tx = {}
        tx.txid=body.txId;
        tx.statues =tools.WithdrawStatus.Notified;
        tx.cryptovalue = body.cryptoValue

        DBService.updateWithdrawByOrderId(data[0].id,tx,function(err,data){
            if(err)
                return res.send("{\"message\":\"Update DB Error!\"}")
            else
                return res.send("{\"message\":\"received!\"}")
        })
    }.bind({body}))
}


function openOtcUrl(req,res){
    //return res.send('{"eth":{"0x50753cdefd9d1cfb1ab004289b987ec01ef78c88136a0d98635693e911e835f4":{"from":"0x34b8fb244cee0630186ce59f5577c7cc3d8ce3f5","value":1,"confirmations":19,"need":20},"0xc5d95ca4e1fe3de8c63e37c5a81857fa5919c7abf09ad70b14261929fbca0bfa":{"from":"0x34b8fb244cee0630186ce59f5577c7cc3d8ce3f5","value":1,"confirmations":17,"need":20},"0xff9be4fb9b65e672b4e22d66ca8c3f1865da1dd5febb85611981249e13eebbbc":{"from":"0x34b8fb244cee0630186ce59f5577c7cc3d8ce3f5","value":1,"confirmations":17,"need":20}}}')
    getUserApiToken(req.user.playerid,function(err,tonken){
        var url = apihost+appId+"/otcurl/"+req.user.playerid+"?token="+tonken+"&userName="+req.user.nickname
        //console.log(url)
        tools.sendhttpget(url,function(err,data){
            console.log(err)
            console.log(data)
            data = JSON.parse(data)
            res.send(data.data)
        })
    })
}
module.exports={userAddress,getRates,pendingDeposits,withdraw,postNewDeposit,postWithdraw,withdrawList,depositList
    ,openOtcUrl
}

