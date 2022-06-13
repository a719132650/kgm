<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-1">
        <div class="k-form">
            <div class="k-form-title" v-if="false">
                <span>创建Command</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="20%" label-position="left">
                <!--header-->
                <div class="k-form-header-1">
                    <span class="title">基本信息</span>
                </div>
                <!--1-->
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="PathName" prop="url">
                    <el-input v-model="form.url" size="small"></el-input>
                </el-form-item>
                <!--header-->
                <div class="k-form-header-1">
                    <span class="title">角色信息</span>
                </div>
                <!--2-->
                <div class="k-form-row" style="justify-content: center;">
                    <el-transfer :titles="['All Roles','Allow Visit']" v-model="form.allowRoleList" :data="roleList"></el-transfer>
                </div>
                <div class="k-form-header-2">
                    <span class="title">Api信息</span>
                </div>
                <!--kg searchtool-->
                <div class="k-searchtool">
                    <div class="k-searchtool-search-item"></div>
                    <div class="k-searchtool-tool">
                        <el-button title="添加Api" type="primary" icon="el-icon-plus" size="mini" @click="showSelectApiFlag = true" circle></el-button>
                        <el-button title="移除Api" type="danger" icon="el-icon-delete" size="mini" @click="clickBtnRemoveApi" circle></el-button>
                    </div>
                </div>
                <!--kg table-->
                <div class="k-form-row" style="justify-content: center;">
                    <div class="k-table">
                        <el-table :data="form.allowApiList" @selection-change="selectApiItem" size="mini" border :header-cell-style="{background:'#fafafa'}">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="api" label="api" width="250"></el-table-column>
                            <el-table-column prop="description" label="description"></el-table-column>
                            <el-table-column prop="authType" label="authType"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-form>
            <div class="k-form-footer k-mt30" v-if="false">
                <el-button type="primary" :disabled="isDisabled" class="k-btn32" @click="submitCreateCommand()" >确定</el-button>
            </div>
            <!--kg plus-->
            <kg-dialog-api-select v-if="showSelectApiFlag" @close="showSelectApiFlag = false" @select="doAddApi"></kg-dialog-api-select>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        menuOID:""
    },
    data () {
        return {
            showSelectApiFlag:false,
            form: {
                name: "",
                url: "",
                allowRoleList: [],
                allowApiList:[]
            },
            roleList: [] ,// 全部角色列表
            selectionApiList:[],
            rules: this.getFormRule(),
            isDisabled:false,
        }
    },
    created:function(){
        this.doInit();
    },
    methods: {
        // 初始化
        doInit(){
            this.getRoleListForChoice();
        },
        // 获取所有角色
        getRoleListForChoice(){
            var me = this;
            me.$kgApi.getRoleListForChoice({
                page:1,
                pageSize:9999,
                condition:""
            }).then(function(res){
                me.roleList = me.dealRoleList(res.list);
            }).catch((res)=>{

            })
        },
        // 转换角色数据填充组件
        dealRoleList(arr){
            var newArr = [];
            for(var i = 0; i< arr.length; i++){
                newArr.push({
                    "key":arr[i].oid,
                    "label":arr[i].name
                });
            }
            return newArr;
        },
        // 重置表单数据
        resetForm(){
            this.form = {
                name: "",
                url: "",
                allowRoleList: [],
                allowApiList:[]
            }
        },
        //选择
        selectApiItem(v){
            this.selectionApiList = v;
        },
        // 添加api
        doAddApi(data){
            this.showSelectApiFlag = false;
            this.form.allowApiList = this.form.allowApiList.concat(data);
            this.form.allowApiList = this.$kgUtil.dealListDuplicate(this.form.allowApiList,"oid");
        },
        // 移除api
        clickBtnRemoveApi(){
            if(this.selectionApiList.length > 0){
                this.$kgUtil.dealListRemove(this.form.allowApiList,this.selectionApiList,"oid");
            }else{
                this.$kgUtil.alterMessageWarning("请选择API！");
            }
        },
        // 提交创建按钮
        submitCreateCommand(){
            var me = this;
            me.isDisabled = true;
            me.doCreateCommand().then((res)=>{
                //dosomething
                me.$kgUtil.alterMessageSuccess("创建菜单成功!");
            }).catch((res)=>{
                //dosomething
            }).finally(()=>{
                me.isDisabled = false;
            });
        },
        // 创建Command
        doCreateCommand:function(){
            var me = this;
            return new Promise((resolve, reject) =>{
                var valid = false;
                me.$refs.form.validate((v) => {
                    valid = v;
                })
                var apiOIDList = new Array();
                for(var i = 0; i< me.form.allowApiList.length; i++){
                    apiOIDList.push(me.form.allowApiList[i].oid);
                }
                if(valid){
                    me.$kgApi.createCommand({
                        name:me.form.name,
                        url:me.form.url,
                        menuOID:me.menuOID,
                        roleOIDList:me.form.allowRoleList,
                        apiOIDList:apiOIDList
                    }).then(function(res){
                        return resolve(res);
                    }).catch((res)=>{
                        return reject(res);
                    })
                }else{
                    return reject();
                }

            })
        },
        // 表单规则
        getFormRule(){
            var rules = {
                name: [
                    { required: true, message: '请输入菜单名', trigger: 'blur' },
                ],
                url: [
                    { required: true, message: '请输入菜单URL', trigger: 'blur' },
                ],
            }
            return rules;
        }
    }
}
</script>

<style scoped lang="scss">
</style>
