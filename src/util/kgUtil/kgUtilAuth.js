/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/

/*
    logout : 登出
    kgFaPush : 跳转
    setLoginInfo : 设置登陆信息
    setToken : 设置token
    formatSex : 格式化性别
    formatStatus : 格式化状态
    formatApiAuth : 格式化api类型
*/

import router from '@/router/kgIndex'
import kgStore from '@/store/kgStore.js'
import kgRange from '@/config/kgRange.js'

const kgUtilAuth = {
    // 注销登录
    logout(){
        kgStore.commit("clearStore");
        router.push({name:"LoginPage"});
    },
    // 框架跳转
    kgFaPush:function(me,url,params={}){
        params.fromPageData = me.$refs.content._data;
        me.$router.push({name:url,params:params});
    },
    // 保存用户基本信息
    setLoginInfo:function(v){
        kgStore.commit("saveParamInSession",{key:"loginInfo",value:v});
    },
    // 保存token
    setToken:function(v){
        kgStore.commit("saveParamInSession",{key:"token",value:v});
    },
    // 性别转换
    formatSex(v){
        var arr = kgRange.sexRange;
        arr.some((item) => {
            if(item.key == v){
                v = item.label;
            }
        });
        return v;
    },
    // 状态转换
    formatStatus(v){
        var arr = kgRange.statusRange;
        arr.some((item) => {
            if(item.key == v){
                v = item.label;
            }
        });
        return v;
    },
    // aip访问权限转换
    formatApiAuth(v){
        var arr = kgRange.apiAuthRange;
        arr.some((item) => {
            if(item.key == v){
                v = item.label;
            }
        });
        return v;
    },
}

export default kgUtilAuth
