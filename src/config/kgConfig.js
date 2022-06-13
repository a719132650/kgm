/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/
const config = require('../../config/index.js')

// 开发模式
var developMode = config.kg.developMode; //  1 = 打开 ，0 = 关闭

// api ap server
var apServer = config.kg.apServer; //  [dev ap]=/ap  [server ap]=/ap/kgs

// 图片服务器地址
var srourceUrl = config.kg.srourceUrl;

// token
var tokenName = "token";
var tokenRefreshTime = 2*60*60;// 有效时间少于1790秒刷新 29*60+50

// 头像图片请求路径
var headVisitPath = "kgsFile/userHeader";

// 白名单路由
var routerWhiteList = ["LoginPage"]

const kgConfig = {
    developMode,
    apServer,
    tokenName,
    tokenRefreshTime,
    srourceUrl,
    headVisitPath,
    routerWhiteList
}

export default kgConfig
