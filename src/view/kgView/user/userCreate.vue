<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-1">
        <div class="k-form">
            <div class="k-form-title" v-if="false">
                <span>创建用户</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
                <!--header-->
                <div class="k-form-header-1">
                    <span class="title">基本信息</span>
                </div>
                <!--1-->
                <el-form-item label="Account" prop="uAccount">
                    <el-input v-model="form.uAccount" size="small"></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="uPassword">
                    <el-input v-model="form.uPassword" show-password size="small"></el-input>
                </el-form-item>
                <!--2-->
                <el-form-item label="Name" prop="uName">
                    <el-input v-model="form.uName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="Phone">
                    <el-input v-model="form.phone" size="small"></el-input>
                </el-form-item>
                <!--3-->
                <el-form-item label="Sex">
                    <el-select v-model="form.sex" placeholder="请选择" size="small">
                        <el-option v-for="item in sexRange" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Status">
                    <el-select v-model="form.status" placeholder="请选择" size="small">
                        <el-option v-for="item in statusRange" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <!--header-->
                <div class="k-form-header-1">
                    <span class="title">角色信息</span>
                </div>
                <!--4-->
                <div class="k-form-row" style="justify-content: center;">
                    <template>
                        <el-transfer :titles="['All Roles','Allow Visit']" v-model="form.allowRoleList" :data="roleList"></el-transfer>
                    </template>
                </div>
            </el-form>
            <div class="k-form-footer k-mt30" v-if="false">
                <el-button type="primary" :disabled="isDisabled" class="k-btn32" @click="submitCreateUser()" >确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {
                uAccount: "",
                uPassword: "",
                uName: "",
                phone: "",
                sex: "0",
                status: 1,
                allowRoleList: []
            },
            sexRange: [], // 性别下拉选项
            statusRange: [], // 状态下拉选项
            roleList: [] ,// 全部角色列表
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
            this.sexRange = this.$kgRange.sexRange;
            this.statusRange = this.$kgRange.statusRange;
            this.getRoleListForChoice();
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
            this.form = {
                uAccount: "",
                uPassword: "",
                uName: "",
                phone: "",
                sex: "0",
                status: 1,
                allowRoleList: []
            }
        },
        // 提交创建按钮
        submitCreateUser(){
            var me = this;
            me.isDisabled = true;
            me.doCreateUser().then((res)=>{
                //dosomething
            }).catch((res)=>{
                //dosomething
            }).finally(()=>{
                me.isDisabled = false;
            });
        },
        // 创建用户
        doCreateUser:function(){
            var me = this;
            return new Promise((resolve, reject) =>{
                var valid = false;
                me.$refs.form.validate((v) => {
                    valid = v;
                })
                if(valid){
                    me.$kgApi.createUser({
                        uAccount:me.form.uAccount,
                        uPassword:me.form.uPassword,
                        uName:me.form.uName,
                        phone:me.form.phone,
                        sex:me.form.sex,
                        roleOIDList:me.form.allowRoleList
                    }).then((res)=>{
                        return resolve(res);
                    }).catch((res)=>{
                        return reject(res);
                    })
                }
                else{
                    return reject();
                }
            })
        },
        // 表单规则
        getFormRule(){
            var rules = {
                uAccount: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                uPassword: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                uName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
            }
            return rules;
        }
    }
}
</script>

<style scoped lang="scss">
</style>
