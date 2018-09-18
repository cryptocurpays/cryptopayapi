/*
 Navicat Premium Data Transfer

 Source Server         : Local  MacOS
 Source Server Type    : MySQL
 Source Server Version : 50721
 Source Host           : localhost
 Source Database       : cryptodemo

 Target Server Type    : MySQL
 Target Server Version : 50721
 File Encoding         : utf-8

 Date: 09/18/2018 00:07:00 AM
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
  `virtualvalue` int(50) NOT NULL COMMENT '(代理商虚拟币币值)',
  `extendjs` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '(扩扎字段 json)',
  `appid` int(11) DEFAULT '0' COMMENT '(应用数字id)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `txhash_unique` (`txid`) USING BTREE,
  KEY `playerid_nomal` (`playerid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Table structure for `app_withdraw`
-- ----------------------------
DROP TABLE IF EXISTS `app_withdraw`;
CREATE TABLE `app_withdraw` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `txid` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '如果是向公链发起的withdraw信息，则记录txhash，如果是向内部otc发起的，则记录otc的order id',
  `cryptotype` char(5) CHARACTER SET utf8 NOT NULL COMMENT '(加密币类型，BTC，BCH，ETH，USDT)',
  `cryptovalue` decimal(20,2) NOT NULL COMMENT '(加密币数量)',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '(创建时间 时间戳)',
  `playerid` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `toaddress` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `withdrawtype` smallint(6) DEFAULT NULL,
  `withdrawid` int(11) DEFAULT NULL COMMENT 'This is the id from the payment gateway',
  `coinamount` int(11) DEFAULT NULL,
  `rates` decimal(50,20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `txhash_normal` (`txid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Table structure for `players`
-- ----------------------------
DROP TABLE IF EXISTS `players`;
CREATE TABLE `players` (
  `playerid` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id)',
  `username` char(200) NOT NULL COMMENT '(玩家登陆账号，如果是游客，则是imei)',
  `imei` varchar(1500) DEFAULT NULL COMMENT '(玩家设备唯一识别码,主要是游客登陆用)',
  `password` char(200) NOT NULL DEFAULT '' COMMENT '(已经绑定了的玩家登陆账号的密码)',
  `accounttype` smallint(5) DEFAULT '0' COMMENT '(玩家账号类型，0游客5邮箱10手机号)',
  `nickname` char(50) DEFAULT 'hello' COMMENT '(玩家昵称)',
  `icon` varchar(500) DEFAULT NULL COMMENT '(玩家头像地址)',
  `age` smallint(5) DEFAULT '1' COMMENT '(玩家年龄)',
  `sex` smallint(5) DEFAULT '0' COMMENT '(性别)',
  `address` char(200) DEFAULT NULL COMMENT '(玩家地址)',
  `coin` bigint(15) DEFAULT '0' COMMENT '(金币数)',
  `invitationcode` char(20) DEFAULT NULL COMMENT '(推荐码)',
  `createtime` bigint(15) DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `playgames` int(11) DEFAULT '0' COMMENT '(一共玩的轮数)',
  `maxwincoin` bigint(15) DEFAULT '0' COMMENT '(最大单次赢取的金币数)',
  `extendjs` varchar(500) DEFAULT NULL COMMENT '(扩扎字段 json)',
  PRIMARY KEY (`playerid`),
  UNIQUE KEY `userid_unique` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11883 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
