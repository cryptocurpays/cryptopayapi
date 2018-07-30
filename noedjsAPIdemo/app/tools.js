/**
 * Created by shijiangang on 2018/5/17.
 */

var request = require('request');



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


const MessageCode={
    SIGNUP:1,

}


const PlayActionCode={
    Bet:10,
    Revoker:20,

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
    MessageCode,
    PlayActionCode,
    isNullStringLength,
    isNullString,
    isNotNumber,
    isNotNumberUnsigned
}

