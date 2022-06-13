import Vue from 'vue'
import Vuex from 'vuex'
import VuexAlong from 'vuex-along'

Vue.use(Vuex)

const zuStore = new Vuex.Store({
    state:{

    },
    mutations:{
        saveParamInSession(state,value){
            state[value.key] = value.value;
        },
        delParamInSession(state,_key){
            delete state[_key];
        },
        getParamInSession(state,_key){
            return state[key];
        }
    },

    //持久
    plugins:[
        VuexAlong({
            name:"_KG_CU_0_",
            local:false,
            session:{
                list:[],
                isFilter:true
            },
            justSession:true
        })
    ]
 })
 export default zuStore
