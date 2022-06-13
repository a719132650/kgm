/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/

/*
quickMenuFlag=0 不开新页签 不缓存
quickMenuFlag=1 开新页签 不缓存
quickMenuFlag=2 开新页签 缓存
*/

import Vue from 'vue'
import Router from 'vue-router'
import kgRouterList from '@/router/kgRouterList.js'
import zuRouterList from '@/router/zuRouterList.js'
import kgUtilMenu from '@/util/kgUtil/kgUtilMenu.js'
import kgUtil from '@/util/kgUtil.js'
import kgUtilAuth from '@/util/kgUtil/kgUtilAuth.js'
import kgStore from '@/store/kgStore.js'
import kgConfig from '@/config/kgConfig.js'
import packageConfig from '../../package.json'

Vue.use(Router)

// 重复点击报错解决
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

//合并路由列表
// var routerList = new Array().concat(kgRouterList).concat(zuRouterList);
var routerList = kgRouterList;
for(var item in routerList){
    if(routerList[item].name == "MainPage"){
        routerList[item].children = routerList[item].children.concat(zuRouterList);
    }
}

// 路由配置
const router = new Router({
    base: packageConfig.name,
    mode: 'history', //@kg@ tomcat部署需注释掉 , nginx部署无需改动
    routes : routerList
})

// 导航守卫
router.beforeEach((to,from,next) =>{
    var whiteList = kgConfig.routerWhiteList;
    //white list
    if(whiteList.includes(to.name)){
        next();
    }
    else{
        //no login
        if(kgUtil.isEmpty(kgStore.state.token)){
            kgUtilAuth.logout();
        }
        else{
            //refresh
            if(kgUtil.isEmpty(from.name)){
                kgUtilMenu.setPageData(to.name,"");
            }
            //create quick menu
            if(to.meta.quickMenuFlag == "1" || to.meta.quickMenuFlag == "2"){
                if(!kgUtilMenu.hasQuickMenu(to.name)){
                    kgUtilMenu.addQuickMenu({
                        title:to.meta.pathName,
                        name:to.name,
                        isCloseable:true,
                        type:to.meta.pathType,
                        commandKey:kgStore.state.activeCommandKey,
                        subMenuKey:kgStore.state.activeSubMenuKey,
                        pageData:"",
                        pageParam:to.params.params || ""
                    });
                }
                else{
                    if(!kgUtil.isEmpty(to.params.params)){
                        kgUtilMenu.setPageParam(to.name,to.params.params);
                    }
                }
                kgUtilMenu.setActiveQuickMenuKey(to.name);
            }
            //save from端 pagedate
            !kgUtil.isEmpty(from.name) && from.meta.quickMenuFlag == "2" && kgUtilMenu.setPageData(from.name,to.params.fromPageData);
            next();
        }
    }
})

export default router
