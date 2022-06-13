<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-2">
        <div class="k-form">
            <div class="k-form-title" v-if="false">
                <span>修改API</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
                <!--header-->
                <div class="k-form-header-2">
                    <span class="title">基本信息</span>
                </div>
                <!--1-->
                <el-form-item label="API" prop="name">
                    <el-input v-model="form.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <el-select v-model="form.authType" placeholder="请选择" size="small">
                        <el-option v-for="item in apiAuthRange" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务类型">
                    <el-autocomplete class="inline-input" v-model="form.businessType" :fetch-suggestions="querySearch" size="small"></el-autocomplete>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" size="small"></el-input>
                </el-form-item>
                <!--header-->
                <el-row class="k-w100p" :gutter="20">
                    <el-col :span="12">
                        <div class="k-form-header-2">
                            <span class="title">菜单授权</span>
                        </div>
                        <div class="k-form-row" style="justify-content: left;">
                            <div class="k-tree" style="height: 320px;">
                                <kg-menu-tree ref="menuTree" :menuList="menuList" :key="menuTreeKey" :defaultCheckedKeys="form.checkedMenuList" disabled="none" :checkStrictly="false"></kg-menu-tree>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="k-form-header-2">
                          <span class="title">操作授权</span>
                      </div>
                      <div class="k-form-row" style="justify-content: left;">
                          <div class="k-tree" style="height: 320px;">
                              <kg-menu-tree ref="operateTree" :menuList="operateList" :key="operateTreeKey" :defaultCheckedKeys="form.checkedOperateList" disabled="none" :checkStrictly="false"></kg-menu-tree>
                          </div>
                      </div>
                    </el-col>
                </el-row>
                <div class="k-form-footer">
                    <el-button type="primary" :disabled="isDisabled" class="k-btn32 k-mt30 k-mb30" @click="submitUpdateApi()">确定</el-button>
                    <el-button class="k-btn32 k-mt30 k-mb30" @click="resetForm()">重置</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form:{
                name:"",
                description:"",
                authType:1,
                businessType:"",
                checkedMenuList:[], // 默认选中菜单节点
                checkedOperateList:[], // 默认选中操作节点
            },
            oldForm:{}, // 编辑前角色信息
            apiAuthRange: [], // API权限下拉选项
            menuList:[], // 菜单数据
            menuTreeKey:0,
            operateList:[],
            operateTreeKey:0,
            rules: this.getFormRule(),
            isDisabled:false,
            restaurants:[],
        }
    },
    created:function(){
        var me = this;
        me.$kgUtil.commonInit(me).then(function(res){

        }).catch(()=>{
            me.doInit();
        })
    },
    methods: {
        // 初始化
        async doInit(){
            this.apiAuthRange = this.$kgRange.apiAuthRange;
            await this.getApiDetail();
            this.getSubMenuTreeAllForChoice();
            this.getBusinessTypeRange();
        },
        getBusinessTypeRange(){
            var me = this;
            me.$kgUtil.getRange("sys_api_business_type").then(function(res){
                var arr = new Array();
                for(var i = 0; i < res.length; i++){
                    arr.push({"value":res[i].id});
                }
                me.restaurants = arr;
            }).catch((res)=>{

            })
        },
        // 输入建议获取
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            cb(results);
        },
        // 过滤
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        // 获取API信息
        async getApiDetail(){
            var me = this;
            await me.$kgApi.getApiDetail({
                apiOID:me.$kgUtilMenu.getPageParam("oid")
            }).then((res)=>{
                me.form.name = res.api.api;
                me.form.description = res.api.description;
                me.form.authType = res.api.authType;
                me.form.businessType = res.api.businessType;
                me.form.checkedMenuList = me.getCheckedKeysForCommand(res.commandMap);
                me.form.checkedOperateList = me.getCheckedKeysForOperate(res.operateMap);
                Object.assign(me.oldForm,JSON.parse(JSON.stringify(me.form)));
                me.dealMenuTreeKey();
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
        // 重置创建表单数据
        resetForm(){
            Object.assign(this.form,JSON.parse(JSON.stringify(this.oldForm)));
            this.dealMenuTreeKey();
        },
        // 修改确认
        submitUpdateApi(){
            var me = this;
            var commandOIDList = me.$refs.menuTree.getCheckedKeyByType("command");
            var operateOIDList = me.$refs.operateTree.getCheckedKeyByType("operate");
            var valid = false;
            me.$refs.form.validate((v) => {
                valid = v;
            })
            if(valid){
                me.isDisabled = true;
                me.$kgApi.updateApi({
                    oid:me.$kgUtilMenu.getPageParam("oid"),
                    api:me.form.name,
                    name:me.form.name,
                    description:me.form.description,
                    authType:me.form.authType,
                    commandOIDList:commandOIDList,
                    operateOIDList:operateOIDList,
                    businessType:me.form.businessType
                }).then((res)=>{
                    me.$kgUtil.alterMessageSuccess("成功修改API!");
                    me.getApiDetail();
                }).catch((res)=>{

                }).finally(()=>{
                    me.isDisabled = false;
                });
            }
        },
        // 组件重新渲染
        dealMenuTreeKey(){
            this.menuTreeKey = this.menuTreeKey+1;
            this.operateTreeKey = this.operateTreeKey+1;
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
                }else if(item.type == "operate" && !me.$kgUtil.isEmpty(item.apiOid) && item.apiOid != me.$kgUtilMenu.getPageParam("oid")){
                    item.disabled = true;
                }
                if(!me.$kgUtil.isEmpty(item.children)){
                    me.dealMenuTreeOperate(item.children);
                }
            })
        },
        // 表单规则
        getFormRule(){
            var rules = {
                name: [
                    { required: true, message: '请输入API', trigger: 'blur' },
                ],
            }
            return rules;
        }
    }
}
</script>

<style scoped lang="scss">
</style>
