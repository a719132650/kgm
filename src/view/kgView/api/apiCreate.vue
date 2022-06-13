<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-1">
        <div class="k-form">
            <div class="k-form-title" v-if="false">
                <span>创建API</span>
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
                                <kg-menu-tree ref="menuTree" :menuList="menuList" :key="menuTreeKey" disabled="none" :checkStrictly="false"></kg-menu-tree>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="k-form-header-2">
                          <span class="title">操作授权</span>
                      </div>
                      <div class="k-form-row" style="justify-content: left;">
                          <div class="k-tree" style="height: 320px;">
                              <kg-menu-tree ref="operateTree" :menuList="operateList" :key="operateTreeKey" disabled="none" :checkStrictly="false"></kg-menu-tree>
                          </div>
                      </div>
                    </el-col>
                </el-row>
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
                businessType:""
            },
            apiAuthRange: [], // API权限下拉选项
            menuList:[], // 菜单数据
            menuTreeKey:0,
            operateList:[],
            operateTreeKey:0,
            restaurants:[],
            rules: this.getFormRule(),
        }
    },
    created:function(){
        this.doInit();
    },
    methods: {
        // 初始化
        doInit(){
            this.apiAuthRange = this.$kgRange.apiAuthRange;
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
            this.form = {
                name:"",
                description:"",
                authType:1,
            };
            this.dealMenuTreeKey();
        },
        // 创建确认
        doCreateApi(){
            var me = this;
            return new Promise((resolve, reject) =>{
                var valid = false;
                me.$refs.form.validate((v) => {
                    valid = v;
                })
                if(valid){
                    var commandOIDList = me.$refs.menuTree.getCheckedKeyByType("command");
                    var operateOIDList = me.$refs.operateTree.getCheckedKeyByType("operate");
                    me.$kgApi.createApi({
                        api:me.form.name,
                        name:me.form.name,
                        description:me.form.description,
                        businessType:me.form.businessType,
                        authType:me.form.authType,
                        commandOIDList:commandOIDList,
                        operateOIDList:operateOIDList
                    }).then((res)=>{
                        return resolve(res);
                    }).catch((res)=>{
                        return reject(res);
                    })
                }else{
                    return reject();
                }
            })
        },
        // 重新加载树形控件
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
                }else if(item.type == "operate" && !me.$kgUtil.isEmpty(item.apiOid)){
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
