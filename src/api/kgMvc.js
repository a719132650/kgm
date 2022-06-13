/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/

import axios from 'axios'
import jwt from 'jsonwebtoken'
import kgApi from '@/api/kgApi'
import kgConfig from '@/config/kgConfig.js'
import kgUtil from '@/util/kgUtil.js'
import kgUtilAuth from '@/util/kgUtil/kgUtilAuth.js'

//定义api访问列表
var requestList = [];

//push所有请求到数组中
function pushToRequestList(cb) {
    requestList.push(cb)
}

//刷新请求（requestList数组中的请求得到新的token之后会自执行，用新的token去请求数据
function doRequestList(token) {
    requestList.map(cb => cb(token));
}

//拦截request
axios.interceptors.request.use(function (req) {
    //过滤api，白名单无需拦截
    if (req.mvc="kg") {
        //判断是否正在changeToken
        var isChangingTokenFlag=0;
        //判断token是否过期
        var isDyingFlag = false;

        var refreshTime = kgConfig.tokenRefreshTime; // 提前刷新的秒数
        var tokenObj = jwt.decode(req.headers[kgConfig.tokenName]);
        var now = Math.round(new Date().getTime()/1000);
        if(!kgUtil.isEmpty(tokenObj) && tokenObj.exp-now>=0 && tokenObj.exp-now<=refreshTime){
            isDyingFlag = true;
        }
        //处理请求
        if(isDyingFlag){
            if(isChangingTokenFlag == 0){
                isChangingTokenFlag = 1;
                var newToken = "";
                kgApi.changeToken({

                }).then(function(res){
                    newToken = res.headers[kgConfig.tokenName];
                    kgUtilAuth.setToken(newToken);
                    doRequestList(newToken);
                    requestList = [];
                }).catch((res)=>{

                }).finally(()=>{
                    isChangingTokenFlag = 0;
                })
            }
            var retry = new Promise((resolve, reject) => {
                pushToRequestList((token) => {
                    req.headers[kgConfig.tokenName] = token;
                    resolve(req)
                })
            })
            return retry
        }
        else{
            return req;
        }
    }
    else{
        return req;
    }
}, function (err) {
    return Promise.reject(err);
});

// 拦截response
axios.interceptors.response.use(function (res) {
    return res;
}, function (err) {
    return Promise.reject(err);
});
