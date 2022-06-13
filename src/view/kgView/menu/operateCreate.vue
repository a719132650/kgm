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
                <el-form-item label="描述">
                    <el-input v-model="form.description" size="small"></el-input>
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
                            <el-table-column prop="authType" label="authType"></el-table-column>
                            <el-table-column prop="description" label="description"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-form>
            <div class="k-form-footer k-mt30" v-if="false">
                <el-button type="primary" :disabled="isDisabled" class="k-btn32" @click="submitCreateOperate()" >确定</el-button>
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
                description: "",
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
            }).then((res)=>{
                me.roleList = me.dealRoleList(res.list);
            }).catch((res)=>{
                reject(res);
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
                description: "",
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
            if(this.form.allowApiList.length == 0 && data.length == 1){
                this.showSelectApiFlag = false;
                this.form.allowApiList = this.form.allowApiList.concat(data);
                this.form.allowApiList = this.$kgUtil.dealListDuplicate(this.form.allowApiList,"oid");
            }else{
                this.$kgUtil.alterMessageWarning("只能选择1个API！");
            }
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
        submitCreateOperate(){
            var me = this;
            me.isDisabled = true;
            me.doCreateOperate().then((res)=>{
                //dosomething
                me.$kgUtil.alterMessageSuccess("创建操作成功!");
            }).catch((res)=>{
                //dosomething
            }).finally(()=>{
                me.isDisabled = false;
            });
        },
        // 创建操作
        doCreateOperate:function(){
            var me = this;
            return new Promise((resolve, reject) =>{
                var valid = false;
                me.$refs.form.validate((v) => {
                    valid = v;
                })
                if(valid){
                    me.$kgApi.createOperate({
                        name:me.form.name,
                        description:me.form.description,
                        commandOID:me.commandOID,
                        roleOIDList:me.form.allowRoleList,
                        apiOID:(me.form.allowApiList.length==1)?(me.form.allowApiList[0].oid):(null),
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
        // 表单规则
        getFormRule(){
            var rules = {
                name: [
                    { required: true, message: '请输入操作名', trigger: 'blur' },
                ],
            }
            return rules;
        }
    }
}
</script>

<style scoped lang="scss">
</style>
