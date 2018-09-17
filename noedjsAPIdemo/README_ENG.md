# Complete Guide to CryptoPay API Demo

CryptoPay is a platform which enables third party applications to receive/send crypto currencies to their customers.

This repository demonstrates how to implement CryptoPay API. For more details, please refer to the API document.

Visit http://demo.cryptocurpays.com:8080/ to try the demo.

If you would like to download the code and set it up for yourself, please follow the below instructions:

## Installation

1. Clone the repo: `git clone git@github.com:JeremywangCN/cryptopayapi.git`
2. Install packages: `npm install`
3. Install Mysql and Edit the database configuration: `config/database.js`
4. Install Redis and Edit Redis configuration: 'config/redisconfig.js'
5. Create the database schema: `cryptodemos.sql`


## Contact us for developer credentials

We haven't opened developer registration yet. Please contact cryptocurpay @ Telegram for registration.

After you get your credentials, login at http://www.cryptocurpays.com to create your application.

One critical info you need to specify is callback URL. When the payment gateway receive a deposit or finish a withdraw, it will post the information to the callback URL.

## Set up and launch the demo

1. Edit the application configuration: 'config/application.js' for appId, appSecret and depositSignedAddress.
2. Launch: `node web.js`
3. Visit in your browser at: `http://localhost:8080`

Licence: 1
