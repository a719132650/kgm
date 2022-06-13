<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-2">
        <div class="k-form">
            <div class="k-tool">
                <el-button type="primary" @click="showUpdatePwdFlag = true">重置密码</el-button>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="20%" label-position="left">
                <!--header-->
                <div class="k-form-header-2">
                    <span class="title">基本信息</span>
                </div>
                <el-row class="k-w100p">
                    <el-col :span="4">
                        <el-upload
                          class="avatar-uploader"
                          action="fakeaction"
                          :show-file-list="false"
                          :http-request="submitUpload"
                          :on-success="handleAvatarSuccess"
                          :before-upload="beforeAvatarUpload">
                          <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-col>
                    <el-col :span="20" style="display: flex; align-items: center; flex-wrap: wrap;">
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
                          <el-form-item style="text-align: left;">
                              <el-button type="primary" :disabled="isDisabled" class="k-btn28" @click="submitUpdateMy()">确定</el-button>
                              <el-button class="k-btn28" @click="resetForm()">重置</el-button>
                          </el-form-item>
                    </el-col>
                </el-row>
                <!--header-->
                <div class="k-form-header-2">
                    <span class="title">角色信息</span>
                </div>
                <div class="k-table">
                    <el-table ref="roleList" :data="roleList" size="mini" border :header-cell-style="{background:'#fafafa'}">
                        <el-table-column type="index" width="55"></el-table-column>
                        <el-table-column prop="name" label="name"></el-table-column>
                        <el-table-column prop="description" label="description"></el-table-column>
                        <el-table-column prop="status" label="status"></el-table-column>
                    </el-table>
                </div>
                <!--header-->
                <div v-if="false" class="k-form-header-2">
                    <span class="title">个人设定</span>
                </div>
            </el-form>
        </div>
        <!--kg plus-->
        <el-dialog v-if="showUpdatePwdFlag" :visible.sync="showUpdatePwdFlag" @close="clickBtnCloseUpdatePwd">
            <div slot="title" class="k-dialog-title">
                <span>- 重置密码 -</span>
            </div>
            <div class="k-form">
                <el-form ref="formPwd" :model="pwdForm" :rules="rulesPwd" label-width="100px" label-position="left">
                    <el-form-item label="旧密码" class="k-w100p" prop="oldPwd">
                        <el-input v-model="pwdForm.oldPwd" size="small" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" class="k-w100p" prop="new1Pwd">
                        <el-input v-model="pwdForm.new1Pwd" size="small" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="重复新密码" class="k-w100p" prop="new2Pwd">
                        <el-input v-model="pwdForm.new2Pwd" size="small" show-password></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" :disabled="isDisabled" @click="submitUpdatePwd()" class="k-btn28">确 定</el-button>
                <el-button @click="clickBtnCloseUpdatePwd" class="k-btn28">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            showUpdatePwdFlag:false,
            form: {
                uAccount: "",
                uName: "",
                phone: "",
                sex: "",
                imageUrl:""
            },
            pwdForm:{
                oldPwd:"",
                new1Pwd:"",
                new2Pwd:"",
            },
            sexRange: [], // 性别下拉选项
            roleList: [], // 全部角色列表
            oldForm: {},
            rules: this.getFormRule(),
            rulesPwd: this.getFormRulePwd(),
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
            var me = this;
            me.sexRange = me.$kgRange.sexRange;
            me.getUserDetailMy();
        },
        // 获取用户信息
        getUserDetailMy(){
            var me = this;
            me.$kgApi.getUserDetailMy({
            }).then((res)=>{
                me.form.oid = res.user.oid,
                me.form.uAccount = res.user.uAccount,
                me.form.uName = res.user.uName,
                me.form.phone = res.user.phone,
                me.form.sex = res.user.sex,
                me.form.status = res.user.status
                me.roleList = res.roleList;
                me.form.imageUrl = me.$kgConfig.srourceUrl+me.$kgConfig.headVisitPath+res.user.headUrl;
                Object.assign(me.oldForm,JSON.parse(JSON.stringify(me.form)));
            }).catch((res)=>{

            })
        },
        resetForm() {
            Object.assign(this.form,JSON.parse(JSON.stringify(this.oldForm)));
        },
        // 提交创建按钮
        submitUpdateMy(){
            var me = this;
            var valid = false;
            me.$refs.form.validate((v) => {
                valid = v;
            })
            if(valid){
                me.isDisabled = true;
                me.$kgApi.updateUserMy({
                    uName: me.form.uName,
                    phone: me.form.phone,
                    sex: me.form.sex
                }).then((res)=>{
                    me.$kgUtil.alterMessageSuccess("修改个人信息成功!");
                    Object.assign(me.oldForm,JSON.parse(JSON.stringify(me.form)));
                    me.reSetLoginInfo();
                }).catch((res)=>{

                }).finally(()=>{
                    me.isDisabled = false;
                });
            }
        },
        clickBtnCloseUpdatePwd(){
            this.showUpdatePwdFlag = false;
            this.pwdForm= {oldPwd:"",new1Pwd:"",new2Pwd:"",};
        },
        submitUpdatePwd(){
            var me = this;
            var valid = false;
            me.$refs.formPwd.validate((v) => {
                valid = v;
            })
            if(valid){
                me.isDisabled = true;
                me.$kgApi.updateUserPasswordMy({
                    oldPassword: me.pwdForm.oldPwd,
                    newPassword: me.pwdForm.new1Pwd
                }).then((res)=>{
                    me.$kgUtil.alterMessageSuccess("密码重置成功！");
                    me.clickBtnCloseUpdatePwd();
                }).catch((res)=>{

                }).finally(()=>{
                    me.isDisabled = false;
                });
            }
        },
        beforeAvatarUpload(file){
            var allowUpload = true;
            if(file.size / 1024 / 1024 > 2){
                this.$message.error('上传头像图片大小不能超过 2MB!');
                allowUpload = false;
            }
            if(file.type === 'image/jpeg'){
                this.$message.error('请上传图片格式文件!');
                allowUpload = false;
            }
            return allowUpload;
        },
        submitUpload(params){
            var me = this;
            var fromData = new FormData();
            fromData.append("fileList",params.file);
            me.$kgApi.updateUserHeadUrlMy(fromData).then((res)=>{
                me.form.imageUrl = me.$kgConfig.srourceUrl+me.$kgConfig.headVisitPath+res.list[0].visitPath;
                me.$kgUtil.alterMessageSuccess("修改头像成功!");
                me.reSetLoginInfo();
            }).catch((res)=>{

            })
        },
        handleAvatarSuccess(){

        },
        reSetLoginInfo(){
            var loginInfo = this.$kgStore.state.loginInfo;
            loginInfo.name = this.form.uName;
            loginInfo.headUrl = this.form.imageUrl;
            this.$kgUtilAuth.setLoginInfo(loginInfo);
        },
        // 表单规则
        getFormRule(){
            var rules = {
                uName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
            }
            return rules;
        },
        getFormRulePwd(){
            var rules = {
                oldPwd: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' },
                ],
                new1Pwd: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                ],
                new2Pwd: [
                    { required: true, trigger: 'blur', validator:this.validatorNew2Pwd},
                ],
            }
            return rules;
        },
        validatorNew2Pwd(rule, value, callback){
            if(this.$kgUtil.isEmpty(value)){
                callback(new Error('请重复新密码'));
            }else{
                if(value!=this.pwdForm.new1Pwd){
                    callback(new Error('两次密码输入不一致'));
                }else{
                    callback();
                }
            }
        }
    }
}
</script>

<style lang="scss">
  .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
</style>
