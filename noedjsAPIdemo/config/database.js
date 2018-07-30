// config/database.js
module.exports = {
    'connection': {
        'connectionLimit': 20,
        'host': '127.0.0.1',
        'user': 'root',
        'password': '123456'
    },
	'database': 'cryptodemo',

    'players_table': 'players',//玩家信息表
    "app_deposits_table":"app_deposits",//玩家充值
    "app_withdraw_table":"app_withdraw",//玩家转出
};


