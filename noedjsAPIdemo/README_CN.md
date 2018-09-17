# 密付API演示程序说明

密付是一个給第三方在线应用提供的一个收取最终用户加密货币，或者支付給第三方应用，或者最终用户加密货币的平台。

该工程演示了如何实施密付API来实现收取和支付加密货币的相关功能。更多细节请参考相关的API参考文档 CryptoPay API Reference.Doc.

如果仅仅想体验该演示，可以访问 http://demo.cryptocurpays.com:8080/.

如果想自己安装并且调试该演示，请参照下面的说明：

## 安装

1. Clone the repo: `git clone git@github.com:JeremywangCN/cryptopayapi.git`
2. Install packages: `npm install`
3. Install Mysql and Edit the database configuration: `config/database.js`
4. Install Redis and Edit Redis configuration: 'config/redisconfig.js'
5. Create the database schema: `cryptodemos.sql`


## 联系我们注册开放商账号

我们尚未开放开放商注册的权限，请联系cryptocurpay @ Telegram，我们审核开放商资料之后，会替您注册一个账号.

得到开放商账号之后，请登录 https://www.cryptocurpays.com 来注册应用.

在注册过程种，一个非常关键的信息是回调地址：callback URL. 当我们收到最终玩家的充值，或者一个提款要求被完成之后，我们将向回调地址发送相关信息.

## 设置和启动演示

1. Edit the application configuration: 'config/application.js' for appId, appSecret and depositSignedAddress.
2. Launch: `node web.js`
3. Visit in your browser at: `http://localhost:8080`

Licence: 1
