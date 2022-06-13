/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/

/*
    kgPush : 跳转
    commonInit : 加载page date初始化
    selectInit : 配合commonInit，加载table勾选
    stopBack : 禁止退回
    alterMessageWarning : message
    alterMessageSuccess : message
    alterMessageError : message
    getRange : 获取range值
    getAllowOperate : 获取操作权限
    isEmpty : 是否未空
    findObjItems : 查找数组
    dealListDuplicate : 对象数组去重
    dealListRemove : 对象数组移除
*/

import Vue from 'vue'
import kgStore from '@/store/kgStore.js'
import kgApi from '@/api/kgApi'
import kgUtilMenu from '@/util/kgUtil/kgUtilMenu.js'

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

const kgUtil = {
    // 子页中跳转
    kgPush:function(me,url,params={}){
        var paramObj = {
            fromPageData : me._data,
            params:params,
        }
        kgUtilMenu.setPageData(url,"");
        me.$router.push({name:url,params:paramObj});
    },
    // 通用初始化方法 存在缓存即使用缓存加载 返回boolean true成功使用缓存初始化 / false缓存获取失败 需重新初始化
    commonInit(me){
        var storeDate = kgUtilMenu.getActiveQuickMenu().pageData;
        var obj = me.$data;
        return new Promise((resolve, reject) =>{
            if(!kgUtil.isEmpty(storeDate) && !kgUtil.isEmpty(obj)){
                for(var properties in obj){
                    storeDate.hasOwnProperty(properties)?(obj[properties] = storeDate[properties]):reject();
                }
                Object.assign(me.$data,JSON.parse(JSON.stringify(obj)));             
                return resolve();
            }
            else{
                return reject();
            }
        })
    },
    // 配合commonInit，恢复table默认勾选
    selectInit(ref,dataList,selectList){
        var _select = [];
        Object.assign(_select,JSON.parse(JSON.stringify(selectList)));
        dataList.forEach((item,index) => {
            var has = _select.some(i => i.oid == item.oid);
            has && ref.toggleRowSelection(dataList[index]);
        })
    },
    //禁止退回
    stopBack(){
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
        });
    },
    // 弹出警告信息(this,信息内容)
    alterMessageWarning(messageContent){
        new Vue().$message({
            showClose: true,
            message: messageContent,
            type: 'warning'
        });
    },
    // 操作成功弹出提示(this,信息内容)
    alterMessageSuccess(messageContent){
        new Vue().$message({
            showClose: true,
            message: messageContent,
            type: 'success'
        });
    },
    // 操作失败弹出提示(this,信息内容)，同时多个错误时，只会出现一个，防止重复出现
    alterMessageError(messageContent){
        if(document.getElementsByClassName('el-message').length==0){
            new Vue().$message({
                showClose: true,
                message: messageContent,
                type: 'error'
            });
        }
    },
    // 获取范围值
    getRange:async function(rangeID,sortBy){
        var rangeList = new Array;
        sortBy = kgUtil.isEmpty(sortBy)?"label":sortBy;
        await kgApi.getRangeListByRangeId({
            rangeId:rangeID,
            sortBy:sortBy
        }).then((res)=>{
            rangeList = res.list;
        }).catch((res)=>{

        })
        return rangeList;
    },
    // 获取当前command下operate权限
    getAllowOperate:async function(){
        var commandOID = kgStore.state.activeCommandKey;
        var obj = {};
        await kgApi.getOperateByCommandOIDMy({
            commandOID:commandOID
        }).then((res)=>{
            for(var i = 0; i< res.list.length; i++){
                obj[res.list[i].name] = true;
            }
        }).catch((res)=>{
            obj = {};
        })
        return obj;
    },
    // 获取指定rangeId数据权限
    getDataIds:async function(rangeId){
        var arr = [];
        await kgApi.getDataIdsByRangeIdMy({
            rangeId:rangeId
        }).then((res)=>{
            for(var i = 0; i< res.list.length; i++){
                arr.push(res.list[i]);
            }
        }).catch((res)=>{
            arr = [];
        })
        return arr;
    },
    // 判空
    isEmpty:function(v){
        if(Object.prototype.toString.call(v) === "[object String]"){
            if(v==""||v==null||v==undefined||v.length==0||v.split(" ").join("").length==0){
                return true
            }
        }else if(Object.prototype.toString.call(v) === "[object Array]"){
            if(v==""||v==null||v==undefined||v.length==0){
                return true
            }
        }else if(Object.prototype.toString.call(v) === "[object Object]"){
            if(v==""||v==null||v==undefined||Object.keys (v).length==0){
                return true
            }
        }else if(Object.prototype.toString.call(v) === "[object Number]"){
            if(v===""||v==null||v==undefined){
                return true
            }
        }else{
            if(v==null||v==undefined){
                return true
            }
        }
        return false
    },
    // 获取指定属性值对象
    findObjItems:function(obj,n,v){
        var data= obj.filter(function(item){
            return item[n] == v;
        })
        return data
    },
    //去重复
    dealListDuplicate(arr,id){
        var hash = {};
        var newArr = [];
        arr.forEach((item,index)=>{
            hash[item[id]]?'': hash[item[id]] = true && newArr.push(item) ;
        })
        return newArr;
    },
    //移除
    dealListRemove(tArr,rArr,id){
        rArr.forEach((item) => {
            var index = tArr.findIndex(i => i[id] === item[id]);
            tArr.splice(index,1);
        })
    }
}

export default kgUtil
