<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-2">
        <div class="k-form">
            <div class="k-form-title" v-if="false">
                <span>修改用户</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="20%" label-position="left">
                <!--header-->
                <div class="k-form-header-2">
                    <span class="title">基本信息</span>
                </div>
                <!--1-->
                <el-form-item label="Account">
                    <el-input v-model="form.uAccount" size="small" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Name" prop="uName">
                    <el-input v-model="form.uName" size="small"></el-input>
                </el-form-item>
                <!--2-->
                <el-form-item label="Phone">
                    <el-input v-model="form.phone" size="small"></el-input>
                </el-form-item>
                <el-form-item label="Sex">
                    <el-select v-model="form.sex" placeholder="请选择" size="small">
                        <el-option v-for="item in sexRange" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <!--3-->
                <el-form-item label="Status">
                    <el-select v-model="form.status" placeholder="请选择" size="small">
                        <el-option v-for="item in statusRange" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <!--header-->
                <div class="k-form-header-2">
                    <span class="title">角色信息</span>
                </div>
                <!--4-->
                <div class="k-form-row" style="justify-content: center;">
                    <template>
                        <el-transfer :titles="['All Roles','Allow Visit']" v-model="form.allowRoleList" :data="roleList"></el-transfer>
                    </template>
                </div>
            </el-form>
            <div class="k-form-footer">
                <el-button type="primary" :disabled="isDisabled" class="k-btn32 k-mt30 k-mb30" @click="submitUpdateUser()">确定</el-button>
                <el-button class="k-btn32 k-mt30 k-mb30" @click="resetForm()">重置</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {
                oid: "",
                uAccount: "",
                uName: "",
                phone: "",
                sex: "",
                status: "",
                allowRoleList: [] // 用户角色列表
            },
            oldForm: {},
            sexRange: [], // 性别下拉选项
            statusRange: [], // 状态下拉选项
            roleList: [], // 全部角色列表
            rules: this.getFormRule(),
            isDisabled:false,
        }
    },
    created:function(){
        var me = this;
        me.$kgUtil.commonInit(me).then(function(res){

        })
        .catch(()=>{
            me.doInit();
        })
    },
    methods: {
        // 初始化
        doInit(){
            this.sexRange = this.$kgRange.sexRange;
            this.statusRange = this.$kgRange.statusRange;
            this.getUserDetail();
            this.getRoleListByUserOID();
            this.getRoleListForChoice();
        },
        // 获取用户信息
        getUserDetail(){
            var me = this;
            me.$kgApi.getUserDetail({
                userOID:me.$kgUtilMenu.getPageParam("oid")
            }).then((res)=>{
                me.form.oid = res.user.oid,
                me.form.uAccount = res.user.uAccount,
                me.form.uName = res.user.uName,
                me.form.phone = res.user.phone,
                me.form.sex = res.user.sex,
                me.form.status = res.user.status
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
        // 当前用户拥有角色
        getRoleListByUserOID(){
            var me = this;
            me.$kgApi.getUser2RoleByUserOID({
                userOID:me.$kgUtilMenu.getPageParam("oid")
            }).then((res)=>{
                var data = res.list;
                var newArr = [];
                for(var i = 0; i< data.length; i++){
                    newArr.push(data[i].toObj.oid);
                }
                me.form.allowRoleList = newArr;
                Object.assign(me.oldForm,JSON.parse(JSON.stringify(me.form)));
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
        resetForm() {
            Object.assign(this.form,JSON.parse(JSON.stringify(this.oldForm)));
        },
        // 提交创建按钮
        submitUpdateUser(){
            var me = this;
            var valid = false;
            me.$refs.form.validate((v) => {
                valid = v;
            })
            if(valid){
                me.isDisabled = true;
                me.$kgApi.updateUser({
                    userOID:me.form.oid,
                    uName:me.form.uName,
                    phone:me.form.phone,
                    sex:me.form.sex,
                    status:me.form.status,
                    roleOIDList:me.form.allowRoleList
                }).then((res)=>{
                    me.$kgUtil.alterMessageSuccess("更新用户信息成功!");
                    Object.assign(me.oldForm,JSON.parse(JSON.stringify(me.form)));
                }).catch((res)=>{

                }).finally(()=>{
                    me.isDisabled = false;
                });
            }
        },
        // 表单规则
        getFormRule(){
            var rules = {
                uName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
            }
            return rules;
        }
    }
}
</script>

<style scoped lang="scss">
</style>
