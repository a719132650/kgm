/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/

/*
    doCollapseMenu : 展开菜单
    setActiveSubMenuKey : 设置当前SubMenuKey
    setActiveMenuKey : 设置展开的MenuKey
    addActiveMenuKey : 展开的MenuKey
    delActiveMenuKey : 关闭的MenuKey
    setActiveCommandKey : 设置当前CommandKey
    setActiveQuickMenuKey : 设置当前QuickMenuKey
    setQuickMenus : 设置当前QuickMenus
    addQuickMenu : 新增QuickMenus
    delQuickMenu : 关闭QuickMenus
    hasQuickMenu : QuickMenus是否存在
    getActiveQuickMenu : 获取当前QuickMenus
    setPageData : 设置页面data
    getPageData : 获取页面data
    setPageParam : 设置页面param
    getPageParam : 获取页面param
*/

import kgStore from '@/store/kgStore.js'
import kgUtil from '@/util/kgUtil.js'

const kgUtilMenu = {
    // collapse menu
    doCollapseMenu:function(){
        kgStore.commit("saveParamInSession",{key:"KG_S001",value:!kgStore.state.KG_S001});
    },
    // sub menu
    setActiveSubMenuKey:function(v){
        kgStore.commit("saveParamInSession",{key:"activeSubMenuKey",value:v});
    },
    // menu
    setActiveMenuKey:function(v){
        kgStore.commit("saveParamInSession",{key:"activeMenuKey",value:v});
    },
    addActiveMenuKey:function(v){
        var arr = kgStore.state.activeMenuKey;
        kgStore.commit("saveParamInSession",{key:"activeMenuKey",value:arr});
    },
    delActiveMenuKey:function(v){
        var arr = kgStore.state.activeMenuKey;
        kgStore.commit("saveParamInSession",{key:"activeMenuKey",value:arr.filter(item => item != v)});
    },
    // command
    setActiveCommandKey:function(v){
        kgStore.commit("saveParamInSession",{key:"activeCommandKey",value:v});
    },
    // quick menu
    setActiveQuickMenuKey:function(v){
        kgStore.commit("saveParamInSession",{key:"activeQuickMenuKey",value:v});
    },
    setQuickMenus:function(obj){
        kgStore.commit("saveParamInSession",{key:"quickMenus",value:obj});
    },
    addQuickMenu:function(obj){
        var arr = kgStore.state.quickMenus;
        arr.push(obj);
        kgUtilMenu.setQuickMenus(arr);
    },
    delQuickMenu:function(v){
        var arr = kgStore.state.quickMenus;
        arr = arr.filter(item => item.name !== v);
        kgUtilMenu.setQuickMenus(arr);
    },
    delQuickMenuOther:function(v){
        var arr = kgStore.state.quickMenus;
        arr = arr.filter(item => item.name == "HomePage" || item.name == v);
        kgUtilMenu.setQuickMenus(arr);
    },
    delQuickMenuAll:function(v){
        var arr = kgStore.state.quickMenus;
        arr = arr.filter(item => item.name == "HomePage");
        kgUtilMenu.setQuickMenus(arr);
    },
    hasQuickMenu:function(v){
        let arr = kgStore.state.quickMenus;
        return arr.some(item => item.name == v);
    },
    getActiveQuickMenu:function(){
        var arr = kgStore.state.quickMenus;
        var activeQuickMenu = null;
        arr.some(item => {
            if(item.name == kgStore.state.activeQuickMenuKey){
                activeQuickMenu = item;
                return true;
            }
        })
        return activeQuickMenu;
    },
    setPageData:function(name,value){
        var arr = kgStore.state.quickMenus;
        arr.map(function(item){
            if(item.name == name){
                item.pageData = value;
            }
        });
        kgUtilMenu.setQuickMenus(arr);
    },
    // 通过key获取指定缓存数据
    getPageData:function(key){
        var value = null;
        try{
    		if(key === undefined){
    			value = kgUtilMenu.getActiveQuickMenu().pageData;
    		}
    		else{
    			value = kgUtilMenu.getActiveQuickMenu().pageData[key];
    		}
        }catch(e){

        }
        return value;
    },
    setPageParam:function(name,value){
        var arr = kgStore.state.quickMenus;
        arr.map(function(item){
            if(item.name == name){
                item.pageParam = value;
            }
        });
        kgUtilMenu.setQuickMenus(arr);
    },
    // 获取通过router params属性传递参数(缓存中获取)
    getPageParam(key){
        return (kgUtil.isEmpty(kgUtilMenu.getActiveQuickMenu().pageParam))?null:kgUtilMenu.getActiveQuickMenu().pageParam[key];
    },
}

export default kgUtilMenu
