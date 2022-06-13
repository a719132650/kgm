/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/

import axios from 'axios'
import qs from 'qs'
import { Loading } from 'element-ui'
import kgStore from '@/store/kgStore.js'
import kgUtil from '@/util/kgUtil.js'
import kgUtilAuth from '@/util/kgUtil/kgUtilAuth.js'
import kgConfig from '@/config/kgConfig.js'

//loading设置
var loadingOptions = {
    target:document.body,
    body:true,
    fullscreen:true,
    lock:true,
    text:"loading...",
    background:"rgba(0, 0, 0, 0.8)",
}

//HTTP主函数
function HTTP(option,config) {
    //config
    let defaultConfig = {
        isRes: false,
        loading: false,
        isShowMsg: false,
        mvc:"kg",
        responseType:""
    }
    config = {...defaultConfig,
        ...config
    }

    //loading
    var loadingInstance = (config.loading)?(Loading.service(loadingOptions)):null;
    //main
    return new Promise((resolve, reject) => {
        //token
        var headerObj = {};
        headerObj[kgConfig.tokenName] = kgStore.state.token;
        //请求
        axios({
            method: option.method,
            url: option.url,
            data: option.data,
            headers: headerObj,
            mvc:config.mvc,
            responseType:config.responseType
        }).then(function (res){
            if (res.status == 200) {
                let data = res.data;
                if(data.code == "0"){
                    if (config.isRes) {
                        return resolve(res);
                    }else{
                        return resolve(data.data || true);
                    }
                }else{
                    if (data.code == "10002") { // token失效，重新登录
                        kgUtilAuth.logout();
                        kgUtil.alterMessageError("登陆超时");
                        return reject(data.msg);
                    }else if (data.code == "10500") { // 系统错误
                        config.isShowMsg && kgUtil.alterMessageError("系统错误");
                        return reject(data.msg);
                    }else if (data.code == "10501") { // 系统错误
                        config.isShowMsg && kgUtil.alterMessageError("系统错误");
                        return reject(data.msg);
                    }else{
                        config.isShowMsg && kgUtil.alterMessageError(data.msg);
                        return reject(data.msg);
                    }
                }
            }else if(res.status == 201){
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'export.xlsx');
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                return resolve(res);
            }else {
                kgUtil.alterMessageError("网络异常，请稍后再试!");
                return reject("HTTP:状态码异常！");
            }
        }).catch(function (err){
            kgUtil.alterMessageError("网络异常，请稍后再试!");
            return reject("网络异常，请稍后再试!");
        }).finally(()=>{
            if(!kgUtil.isEmpty(loadingInstance)){
                loadingInstance.close();
            }
        })
    })
}

//export
export default {
    GET:function(url,data,config){
        return HTTP({
            url,
            data:qs.stringify(data,{indices:false}),
            method:"get"
        },config);
    },
    POST:function(url,data,config){
        return HTTP({
            url,
            data:qs.stringify(data,{indices:false}),
            method:"post"
        },config);
    },
    UPLOAD:function(url,data,config){
        return HTTP({
            url,
            data,
            method:"post",
        },config);
    },
    DOWNLOAD:function(url,data,config){
        config.responseType = 'blob'
        return HTTP({
            url,
            data:qs.stringify(data,{indices:false}),
            method:"post"
        },config);
    }
}
