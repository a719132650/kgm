<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="kgframelogin">
        <div class="kf-login">
            <div class="kf-login-title">
                <span>研发数据平台</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item prop="account">
                    <el-input placeholder="请输入用户名" v-model="form.account" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" v-model="form.password" prefix-icon="el-icon-lock" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="k-w100p" type="primary" :loading="isLoading" @click="clickBtnlogin()">{{btnName}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form:{
                account:"", // 账户
                password:"" // 密码
            },
            isLoading:false,
            btnName:"login",
            rules: this.getFormRule(),
        }
    },
    created:function(){
        this.doInit();

    },
    methods:{
        // 初始化
        doInit(){
            //绑定回车
            this.bindEnter();
            //禁止退回
            this.$kgUtil.stopBack();
        },
        // 绑定回车键
        bindEnter(){
            var me = this;
            document.onkeydown = function (e) {
                var key = window.event.keyCode;
                if (key === 13){
                    me.clickBtnlogin();
                }
            }
        },
        // 登陆
        clickBtnlogin(){
            var me = this;
            var valid = false;
            me.$refs["form"].validate((v) => {
                valid = v;
            })
            if(valid){
                me.isLoading = true;
                me.btnName = "logging in";
                me.$kgApi.login({
                    account:me.form.account,
                    password:me.form.password
                }).then((res)=>{
                    me.isLoading = false;
                    me.btnName = "login";
                    if(res.data.code==0){
                        document.onkeydown=null;
                        var token = res.headers[me.$kgConfig.tokenName];
                        me.$kgUtilAuth.setToken(token);
                        var loginInfo = me.$kgStore.state.loginInfo;
                        loginInfo.name = res.data.data.user.uName;
                        loginInfo.headUrl = me.$kgConfig.srourceUrl + me.$kgConfig.headVisitPath + res.data.data.user.headUrl;
                        me.$kgUtilAuth.setLoginInfo(loginInfo);
                        me.$router.push({name:"HomePage"});
                    }
                }).catch((res)=>{

                }).finally(()=>{
                    me.isLoading = false;
                    me.btnName = "login";
                })
            }
        },
        // 表单规则
        getFormRule(){
            var rules = {
                account: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
            }
            return rules;
        }
    }
}
</script>
<style scoped lang="scss">
</style>
