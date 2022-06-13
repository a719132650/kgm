/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/

import Vue from 'vue'
import Vuex from 'vuex'
import VuexAlong from 'vuex-along'

Vue.use(Vuex)
var stateInit = {
    //auth
    token:"",
    loginInfo:{
        name:"",
        headUrl:""
    },
    //menu
    activeSubMenuKey:"",  //submenu oid
    activeMenuKey:[],  //menu oids
    activeCommandKey:"",  //command oid
    activeQuickMenuKey:"",  //path name
    quickMenus:[{
        title: "首页", // 显示名
        name: "HomePage", // 跳转url
        isCloseable: false, //是否可关闭
        type: "", // 类型 menu/children/single
        commandKey:"",
        subMenuKey:"",
        pageData:"",
        pageParam:""
    }],
    //setting
    KG_S001:false  //menu is Collapse
};
const kgStore = new Vuex.Store({
    state:JSON.parse(JSON.stringify(stateInit)),
    mutations:{
        saveParamInSession(state,value){
            state[value.key] = value.value;
        },
        delParamInSession(state,_key){
            delete state[_key];
        },
        getParamInSession(state,_key){
            return state[_key];
        },
        clearStore(state){
            Object.assign(state,JSON.parse(JSON.stringify(stateInit)));
        }
    },
    getters:{

    },

    //持久
    plugins:[
        VuexAlong({
            name:"_KG_SYS_0_",
            local:false,
            session:{
                list:[],
                isFilter:true
            },
            justSession:true
        })
    ]
 })
 export default kgStore
