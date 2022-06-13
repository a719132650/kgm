<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-2">
        <div class="k-form">
            <div class="k-form-title" v-if="false">
                <span>修改Command</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="20%" label-position="left">
                <!--header-->
                <div class="k-form-header-2">
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
                <div class="k-form-header-2">
                    <span class="title">角色信息</span>
                </div>
                <!--2-->
                <div class="k-form-row" style="justify-content: center;">
                    <template>
                        <el-transfer :titles="['All Roles','Allow Visit']" v-model="form.allowRoleList" :data="roleList"></el-transfer>
                    </template>
                </div>
                <div class="k-form-header-2">
                    <span class="title">Api信息</span>
                </div>
                <!--kg searchtool-->
                <div class="k-searchtool">
                    <div class="k-searchtool-search-item">
                    </div>
                    <div class="k-searchtool-tool">
                        <el-button title="添加Api" type="primary" icon="el-icon-plus" size="mini" @click="showSelectApiFlag = true" circle></el-button>
                        <el-button title="移除Api" type="danger" icon="el-icon-delete" size="mini" @click="clickBtnRemoveApi" circle></el-button>
                    </div>
                </div>
                <!--kg table-->
                <div class="k-form-row" style="justify-content: center;">
                    <div class="k-table">
                        <el-table ref="allowApiList" :data="form.allowApiList" @selection-change="selectApiItem" size="mini" border :header-cell-style="{background:'#fafafa'}">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="api" label="api" width="250"></el-table-column>
                            <el-table-column prop="description" label="description"></el-table-column>
                            <el-table-column prop="authType" label="authType"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-form>
            <div class="k-form-footer">
                <el-button type="primary" :disabled="isDisabled" class="k-btn32 k-mt30 k-mb30" @click="submitUpdateCommand()">确定</el-button>
                <el-button class="k-btn32 k-mt30 k-mb30" @click="resetForm()">重置</el-button>
            </div>
            <!--kg plus-->
            <kg-dialog-api-select v-if="showSelectApiFlag" @close="showSelectApiFlag = false" @select="doAddApi"></kg-dialog-api-select>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        commandOID:""
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
            oldForm: {},
            roleList: [] , // 全部角色列表
            apiList: [], // 关联api列表
            selectionApiList:[],
            rules: this.getFormRule(),
            isDisabled:false,
        }
    },
    created:function(){
        var me = this;
        me.$kgUtil.commonInit(me).then(function(res){
            me.$kgUtil.selectInit(me.$refs.allowApiList,me.form.allowApiList,me.selectionApiList);
        }).catch(()=>{
            me.doInit();
        })
    },
    methods: {
        // 初始化
        doInit(){
            this.getCommandDetail();
            this.getRoleListForChoice();
        },
        //获取Command信息
        getCommandDetail(){
            var me = this;
            me.$kgApi.getCommandDetail({
                commandOID:me.$kgUtilMenu.getPageParam("oid")
            }).then((res)=>{
                me.form.name = res.command.name;
                me.form.url = res.command.url;
                me.form.allowApiList = res.apiList;
                //deal authType
                for(var i = 0; i < me.form.allowApiList.length; i++){
                    me.form.allowApiList[i].authType = me.$kgUtilAuth.formatApiAuth(me.form.allowApiList[i].authType);
                }
                //deal allowRoleList
                var arr = new Array();
                for(var i = 0; i< res.roleList.length; i++){
                    arr.push(res.roleList[i].oid);
                }
                me.form.allowRoleList = arr;
                Object.assign(me.oldForm,JSON.parse(JSON.stringify(me.form)));
            }).catch((res)=>{

            })
        },
        // 获取所有角色
        getRoleListForChoice(){
            var me = this;
            me.$kgApi.getRoleListForChoice({
                page:1,
                pageSize:9999,
                condition:""
            }).then((res)=>{
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
            Object.assign(this.form,JSON.parse(JSON.stringify(this.oldForm)));
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
        submitUpdateCommand(){
            var me = this;
            me.isDisabled = true;
            me.doUpdateCommand().then((res)=>{
                //dosomething
                me.$kgUtil.alterMessageSuccess("修改菜单成功!");
                Object.assign(me.oldForm,JSON.parse(JSON.stringify(me.form)));
            }).catch((res)=>{
                //dosomething
            }).finally(()=>{
                me.isDisabled = false;
            });
        },
        // 修改Command
        doUpdateCommand:function(){
            var me = this;
            var arr = new Array();
            for(var i = 0; i < me.form.allowApiList.length; i++){
                arr.push(me.form.allowApiList[i].oid);
            }
            return new Promise((resolve, reject) =>{
                var valid = false;
                me.$refs.form.validate((v) => {
                    valid = v;
                })
                if(valid){
                    me.$kgApi.updateCommand({
                        oid:me.$kgUtilMenu.getPageParam("oid"),
                        name:me.form.name,
                        url:me.form.url,
                        roleOIDList:me.form.allowRoleList,
                        apiOIDList:arr
                    }).then((res)=>{
                        Object.assign(me.oldForm,JSON.parse(JSON.stringify(me.form)));
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
