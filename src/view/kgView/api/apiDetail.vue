<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
<div>
    <div class="k-mc-page-2">
        <el-descriptions class="k-mt20" title="基本信息" :column="2" size="small" border>
            <el-descriptions-item label="API">{{api.name}}</el-descriptions-item>
            <el-descriptions-item label="PATH">{{api.api}}</el-descriptions-item>
            <el-descriptions-item label="业务类型">{{api.businessType}}</el-descriptions-item>
            <el-descriptions-item label="权限">{{api.authType}}</el-descriptions-item>
            <el-descriptions-item label="描述">{{api.description}}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="k-mt20" title="状态信息" :column="2" size="small" border>
            <el-descriptions-item label="createAt">{{api.createAt}}</el-descriptions-item>
            <el-descriptions-item label="updateAt">{{api.updateAt}}</el-descriptions-item>
            <el-descriptions-item label="status">
                <el-tag size="small" v-if="api.status == '1'">Active</el-tag>
                <el-tag size="small" type="warning" v-if="api.status == '0'">Inactive</el-tag>
            </el-descriptions-item>
        </el-descriptions>
        <el-row class="k-w100p" :gutter="20">
            <el-col :span="12">
                <div class="k-descriptions-header-1">
                    <span class="title">菜单信息</span>
                </div>
                <div class="k-tree" style="height: 320px;">
                    <kg-menu-tree ref="menuTree" :menuList="menuList" :defaultCheckedKeys="checkedMenuList" disabled="true" :checkStrictly="false"></kg-menu-tree>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="k-descriptions-header-1">
                    <span class="title">操作信息</span>
                </div>
                <div class="k-tree" style="height: 320px;">
                    <kg-menu-tree ref="operateTree" :menuList="operateList" :defaultCheckedKeys="checkedOperateList" disabled="true" :checkStrictly="false"></kg-menu-tree>
                </div>
            </el-col>
        </el-row>
    </div>
</div>
</template>
<script>
export default {
    data () {
        return {
            api:{}, // API信息
            menuList:[], // 关联菜单集合
            checkedMenuList:[],
            operateList:[], // 关联操作集合
            checkedOperateList:[],
        }
    },
    created:function(){
        var me = this;
        me.$kgUtil.commonInit(me).then(function(res){

        }).catch(()=>{
            me.doInit();
        })
    },
    methods:{
        // 初始化
        async doInit(){
            await this.getApiDetail();
            this.getSubMenuTreeAllForChoice();
        },
        // 获取API信息
        async getApiDetail(){
            var me = this;
            await me.$kgApi.getApiDetail({
                apiOID:me.$kgUtilMenu.getPageParam("oid")
            }).then((res)=>{
                me.api = res.api;
                me.api.authType = me.$kgUtilAuth.formatApiAuth(me.api.authType);
                me.checkedMenuList = me.getCheckedKeysForCommand(res.commandMap);
                me.checkedOperateList = me.getCheckedKeysForOperate(res.operateMap);
            }).catch((res)=>{

            })
        },
        // 获取需选中的command
        getCheckedKeysForCommand(commandMap){
            var arr = new Array();
            var commandList = commandMap.commandList;
            for(var i = 0; i < commandList.length; i++){
                arr.push(commandList[i].fromOID);
            }
            return arr;
        },
        // 获取需选中的operate
        getCheckedKeysForOperate(operateMap){
            var arr = new Array();
            var operateList = operateMap.operateList;
            for(var i = 0; i < operateList.length; i++){
                arr.push(operateList[i].oid);
            }
            return arr;
        },
        //获取菜单信息
        getSubMenuTreeAllForChoice(){
            var me = this;
            me.$kgApi.getSubMenuTreeAllForChoice({

            }).then((res)=>{
                me.menuList = res.list;
                me.operateList = JSON.parse(JSON.stringify(res.list));
                me.dealMenuTreeCommand(me.menuList);
                me.dealMenuTreeOperate(me.operateList);
            }).catch((res)=>{

            })
        },
        //处理command
        dealMenuTreeCommand(arr){
            var me =this;
            arr.map(item => {
                if(item.type == "sub menu" || item.type == "menu"){
                    item.disabled = true;
                }
                if(item.type == "command"){
                    item.children = [];
                }
                if(!me.$kgUtil.isEmpty(item.children)){
                    me.dealMenuTreeCommand(item.children);
                }
            })
        },
        //处理operate
        dealMenuTreeOperate(arr){
            var me =this;
            arr.map(item => {
                if(item.type == "sub menu" || item.type == "menu" || item.type == "command"){
                    item.disabled = true;
                }
                if(!me.$kgUtil.isEmpty(item.children)){
                    me.dealMenuTreeOperate(item.children);
                }
            })
        },
    }
}
</script>
<style scoped lang="scss">
</style>
