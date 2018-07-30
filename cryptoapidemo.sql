/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Version : 50712
 Source Host           : localhost
 Source Database       : cryptodemo

 Target Server Version : 50712
 File Encoding         : utf-8

 Date: 07/27/2018 16:37:41 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `app_deposits`
-- ----------------------------
DROP TABLE IF EXISTS `app_deposits`;
CREATE TABLE `app_deposits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playerid` int(11) NOT NULL COMMENT '(所属信息的玩家id)',
  `toaddress` char(50) CHARACTER SET utf8 NOT NULL COMMENT '(转到哪个地址了)',
  `fromaddress` char(50) CHARACTER SET utf8 NOT NULL COMMENT 'address derived from public key if the transaction is from a block chain; User Id is the transaction is from house OTC',
  `txid` char(100) CHARACTER SET utf8 NOT NULL COMMENT 'TxHash if the transaction is inside a block chain; Order ID if the transaction is from house OTC ',
  `cryptotype` char(5) CHARACTER SET utf8 NOT NULL COMMENT '(加密币类型，BTC，BCH，ETH，USDT)',
  `cryptovalue` decimal(50,20) NOT NULL COMMENT '(加密币币值)',
  `createtime` bigint(15) NOT NULL COMMENT '(创建时间 时间戳)',
  `fiatcurrency` char(5) CHARACTER SET utf8 NOT NULL COMMENT '(兑换货币单位，美金，人民币。根据这个单位，回调游戏服务器，对应的充值金额)',
  `fiatrate` decimal(20,4) NOT NULL COMMENT '(收到账的时候的汇率)',
  `fiatvalue` decimal(20,0) DEFAULT NULL COMMENT '(法币实际值)',
  `virtualvalue` decimal(50,20) NOT NULL COMMENT '(代理商虚拟币币值)',
  `extendjs` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '(扩扎字段 json)',
  `appid` int(11) DEFAULT '0' COMMENT '(应用数字id)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `txhash_unique` (`txid`) USING BTREE,
  KEY `playerid_nomal` (`playerid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Records of `app_deposits`
-- ----------------------------
BEGIN;
INSERT INTO `app_deposits` VALUES ('17', '2999', '0x3b52f496628d1143e96d5c2dd53c3d80f738d17e', '0x34b8fb244cee0630186ce59f5577c7cc3d8ce3f5', '0xe356a4d7fc2a8ca6408c4930dac30c4cbf39d376553bb63759cb6194a0e882b1', 'eth', '0.00000000100000000000', '1530756922', 'usd', '505.2672', null, '505.00000000000000000000', null, '101'), ('18', '2999', '0x929b04de52553df87ab2b2c2d4639753bd72d145', '0x34b8fb244cee0630186ce59f5577c7cc3d8ce3f5', '0x6a4bd08319a41958de0256eb8a22b1f378d3a98656f3b70898ce645a6603a1f9', 'eth', '0.00000000200000000000', '1531364390', 'usd', '505.2672', null, '1010.00000000000000000000', null, '101'), ('19', '2999', '0x929b04de52553df87ab2b2c2d4639753bd72d145', '0x34b8fb244cee0630186ce59f5577c7cc3d8ce3f5', '0xf7ef76a72e9a8e1fa174e09dc278c11205f3cfffa7b3d14aded26a15de31c697', 'eth', '0.00000000200000000000', '1531364788', 'usd', '505.2672', null, '1010.00000000000000000000', null, '101'), ('20', '2999', '16uNPBmVkkVVjFv8eKRvbhxrzzruSkxjyT', '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh', 'f7fb631532b13d5069c33eac3ada28a4418915c2add39675bf18f140b74ecc0b', 'usdt', '0.00000000110000000000', '1531454602', 'usd', '1.0200', null, '1.00000000000000000000', null, '101'), ('21', '2999', '0xd73a7caeb8bb88afa768a88b04cc1d75d00891ea', '0x34b8fb244cee0630186ce59f5577c7cc3d8ce3f5', '0xb1445688f49d620e4ac4bd1cf68ad7e42aa5d26024570e9ec84e6674a5a77a71', 'eth', '0.00000000100000000000', '1531813306', 'usd', '505.2672', null, '757.00000000000000000000', null, '123');
COMMIT;

-- ----------------------------
--  Table structure for `app_withdraw`
-- ----------------------------
DROP TABLE IF EXISTS `app_withdraw`;
CREATE TABLE `app_withdraw` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderid` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'App通过API向支付网关提出提币请求的时候，可以附带一个order id，支付网关提币成功之后，会返回这个order ID',
  `appid` int(11) DEFAULT NULL COMMENT '(应用数字id)',
  `txid` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '如果是向公链发起的withdraw信息，则记录txhash，如果是向内部otc发起的，则记录otc的order id',
  `cryptotype` char(5) CHARACTER SET utf8 NOT NULL COMMENT '(加密币类型，BTC，BCH，ETH，USDT)',
  `cryptovalue` decimal(20,2) NOT NULL COMMENT '(加密币数量)',
  `createtime` bigint(15) NOT NULL COMMENT '(创建时间 时间戳)',
  `extendjs` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '(扩扎字段 json)',
  `blocknumber` int(11) DEFAULT NULL COMMENT '记录公链上的区块地址',
  `playerid` int(11) NOT NULL,
  `statues` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `appid_normal` (`appid`) USING BTREE,
  KEY `txhash_normal` (`txid`) USING BTREE,
  KEY `orderid_unique` (`orderid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Records of `app_withdraw`
-- ----------------------------
BEGIN;
INSERT INTO `app_withdraw` VALUES ('37', '1531297121195', null, '0x8237e95c7b83eff8ae02d150b52841a47b5203b0caa10f58076913286e3d23ec', 'eth', '0.09', '1531297121195', null, '219698', '2999', '10'), ('38', '1531365119965', null, null, 'eth', '0.00', '1531365119965', null, null, '2999', '0'), ('39', '1531365138661', null, null, 'eth', '0.00', '1531365138661', null, null, '2999', '0'), ('40', '1531365292400', null, null, 'eth', '0.00', '1531365292400', null, null, '2999', '0'), ('41', '1531365390199', null, '0xeef5b581f6cb3f33f33b7527c3c119d7d3102006bef04fed2d0ca10ce8948a0f', 'eth', '0.00', '1531365390199', null, '221536', '2999', '10'), ('42', '1531458412671', null, null, 'usdt', '0.10', '1531458412671', null, null, '2999', '0');
COMMIT;

-- ----------------------------
--  Table structure for `players`
-- ----------------------------
DROP TABLE IF EXISTS `players`;
CREATE TABLE `players` (
  `playerid` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id)',
  `username` char(200) NOT NULL COMMENT '(玩家登陆账号，如果是游客，则是imei)',
  `imei` varchar(1500) NOT NULL COMMENT '(玩家设备唯一识别码,主要是游客登陆用)',
  `password` char(200) NOT NULL DEFAULT '' COMMENT '(已经绑定了的玩家登陆账号的密码)',
  `accounttype` smallint(5) NOT NULL DEFAULT '0' COMMENT '(玩家账号类型，0游客5邮箱10手机号)',
  `nickname` char(50) NOT NULL DEFAULT 'hello' COMMENT '(玩家昵称)',
  `icon` varchar(500) DEFAULT NULL COMMENT '(玩家头像地址)',
  `age` smallint(5) NOT NULL DEFAULT '1' COMMENT '(玩家年龄)',
  `sex` smallint(5) NOT NULL DEFAULT '0' COMMENT '(性别)',
  `address` char(200) DEFAULT NULL COMMENT '(玩家地址)',
  `coin` bigint(15) NOT NULL DEFAULT '0' COMMENT '(金币数)',
  `invitationcode` char(20) NOT NULL COMMENT '(推荐码)',
  `createtime` bigint(15) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `playgames` int(11) NOT NULL DEFAULT '0' COMMENT '(一共玩的轮数)',
  `maxwincoin` bigint(15) NOT NULL DEFAULT '0' COMMENT '(最大单次赢取的金币数)',
  `extendjs` varchar(500) DEFAULT NULL COMMENT '(扩扎字段 json)',
  PRIMARY KEY (`playerid`),
  UNIQUE KEY `userid_unique` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11873 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `players`
-- ----------------------------
BEGIN;
INSERT INTO `players` VALUES ('2999', '1', 'askjnxqiuwb', '$2a$10$1pLD5QUekLV9QaMretaj1OI4CrCaEHcpn2RKBAoenMjAqpJKTuW4u', '0', '欢迎', null, '1', '0', null, '1004250', '123456', '1527143517992', '2018-05-24 14:31:57', '12', '52', null), ('11872', '2', 'askjnxqiuwb2', '$2a$10$YKtiPvFghmG8q0ij5PlJE./QuyIeqAlkrxLRIwfM8bbK0hHbvt.Vy', '0', '欢迎', null, '1', '0', null, '505', '123456', '1528698879877', '2018-06-11 14:34:39', '0', '0', null);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
