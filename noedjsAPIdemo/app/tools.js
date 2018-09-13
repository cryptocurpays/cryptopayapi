/**
 * Created by shijiangang on 2018/5/17.
 */

var request = require('request');



const SIGNING_v1 ='ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'//36
const SIGNING_v2 ='ABCDEFGHJKMNPQRSTUVWXYZ23456789'//31
const SIGNING_v3 ='1234567890'//10
const SIGNING_v4 ='ABCDEFGHIJKLMNOPQRSTUVWXYZ'//26


const REDIS_KEY_VC='VC'//redis  存贮验证码   VC_USERNAME_TYPE
const VC_TTL_TIME=60*10


const CryptoType = {
    ETH:"ETH",
    BCH:"BCH"
}

const ERRORCODE={
    NOPLAYER:1,//没有这个玩家信息
    ERRORPASSWORD:2,//错误的密码
    HAVEPLAYERDATA:3,//已经注册了的账号信息
    VCCODE:4,//验证码错误
}



const roundStatus ={
    NEW: 0,// 新创建的块
    CLOSE: 2,//关闭投注
    RESULT: 4,//已经生成结果
    //WAITINGNEXT:5,//一轮结束 等待下一轮
    CLEAR:6//清空,暂时没用
};

const betErrCode={
    Success:0,
    NoEnoughCoins:1,
    BetDataIllegal:2,
    RoundIsClosed:3,
    RoundIsExpired:4,

    TableIdError:5,

    RevokeNoHavePlayer:6,
    RevokeNoBet:7,//没有bet可以撤销了

    TopPlayerRoundError:8,
    TopPlayerNoP:9,//前10 没有这个人
};


const MessageCode={
    SIGNUP:1,

}


const PlayActionCode={
    Bet:10,
    Revoker:20,




    WinBet:500,//牌局记录用
    LoseBet:510,//牌局记录用
}


const PLAYERACCOUNTTYPE={
    VISITOR:0,//游客
    EMAIL:5,//邮箱
    PHONE:10,//手机号
}

function sendhttppost(url,requestData,done){
    console.log(url)
    //var post = JSON.stringify(requestData)
    console.log(requestData)
    request.post({url,form:requestData},function(error, response, body) {
        if (!error && response.statusCode == 200) {
            done(null,body)
        }else{
            console.log("error:"+error)
        }
    })


}


function sendhttpget(url,done){
    console.log(url)
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            done(null,body)
        }else{
            console.log("error:"+error)
            //console.log("response:")
            //console.log(response)
        }
    })
}


function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}





function sendCodeToUser(account,type,body){
    switch (parseInt(type)){
        case PLAYERACCOUNTTYPE.PHONE:
            sendPhoneMessage(account,"测试",body)
            break;
        case PLAYERACCOUNTTYPE.EMAIL:
            sendMail(account,"测试",body)
            break;
    }
}


function sendMail(recipient, subject, html) {

    smtpTransport.sendMail({

        from: emailconfig.email.user,
        to: recipient,
        subject: subject,
        html: html

    }, function (error, response) {
        if (error) {
            console.log(error);
        }
        console.log('发送成功')
    });
}


//发送短信
function sendPhoneMessage(recipient, subject, html) {

    smsClient.sendSMS({
        PhoneNumbers: recipient,
        SignName: '阿里云短信测试专用',
        TemplateCode: 'SMS_137570053',
        TemplateParam: '{"code":"'+html+'"}'
    }).then(function (res) {
        let {Code}=res
        if (Code === 'OK') {
            //处理返回参数
            console.log(res)
        }
    }, function (err) {
        console.log(err)
    })
}


function isNullStringLength(str,min,max){
    if(isNullString(str) || str.length < min || str.length > max)
        return true
    return false
}

function isNullString(str){
    if(str === undefined || str === null || str==='')
        return true
    return false

}


function isNotNumber(number){
    if(isNullString(number)|| isNaN(number) || isNotNumber<0)
        return true
    return false
}

function isNotNumberUnsigned(number){
    if(isNullString(number) || isNaN(number))
        return true
    return false
}




module.exports={
    sendhttppost,
    sendhttpget,
    CryptoType,
    ERRORCODE,
    PLAYERACCOUNTTYPE,
    roundStatus,
    betErrCode,
    GetRandomNum,
    SIGNING_v1,
    SIGNING_v2,
    SIGNING_v3,
    SIGNING_v4,
    REDIS_KEY_VC,
    VC_TTL_TIME,
    sendCodeToUser,
    MessageCode,
    PlayActionCode,
    isNullStringLength,
    isNullString,
    isNotNumber,
    isNotNumberUnsigned
}

