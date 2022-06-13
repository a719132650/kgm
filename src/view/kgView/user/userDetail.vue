<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-2">
        <el-descriptions class="k-mt20" title="基本信息" :column="2" size="small" border>
            <el-descriptions-item label="账号">{{user.uAccount}}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{user.uName}}</el-descriptions-item>
            <el-descriptions-item label="电话">{{user.phone}}</el-descriptions-item>
            <el-descriptions-item label="性别">{{user.sex}}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="k-mt20" title="状态信息" :column="2" size="small" border>
            <el-descriptions-item label="createAt">{{user.createAt}}</el-descriptions-item>
            <el-descriptions-item label="updateAt">{{user.updateAt}}</el-descriptions-item>
            <el-descriptions-item label="lastLoginAt">{{user.lastLoginAt}}</el-descriptions-item>
            <el-descriptions-item label="status">
                <el-tag size="small" v-if="user.status == '1'">Active</el-tag>
                <el-tag size="small" type="warning" v-if="user.status == '0'">Inactive</el-tag>
            </el-descriptions-item>
        </el-descriptions>
        <div class="k-descriptions-header-1">
            <span class="title">角色信息</span>
        </div>
        <div class="k-table">
            <el-table :data="roleList" size="small" border :header-cell-style="{background:'#fafafa'}">
                <el-table-column type="index" label="No" width="55"></el-table-column>
                <el-table-column prop="toObj.name" label="Name"></el-table-column>
                <el-table-column prop="toObj.description" label="Description"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            user:{
                uAccount:"",
                uName:"",
                phone:"",
                sex:"",
                status:"",
                lastLoginAt:"",
                createAt:"",
                updateAt:""
            },
            roleList: [] // 全部角色列表
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
            this.getUserDetail();
            this.getRoleListByUserOID();
        },
        // 用户详细信息
        getUserDetail(){
            var me = this;
            me.$kgApi.getUserDetail({
                userOID:me.$kgUtilMenu.getPageParam("oid")
            }).then((res)=>{
                me.user = res.user;
                me.user.sex = me.$kgUtilAuth.formatSex(res.user.sex);
                me.user.lastLoginAt = me.$kgUtilDate.parseTimeStampToTime(res.user.lastLoginAt);
                me.user.createAt = me.$kgUtilDate.parseTimeStampToTime(res.user.createAt);
                me.user.updateAt = me.$kgUtilDate.parseTimeStampToTime(res.user.updateAt);
            }).catch((res)=>{

            })
        },
        // 当前用户拥有角色
        getRoleListByUserOID(){
            var me = this;
            me.$kgApi.getUser2RoleByUserOID({
                userOID:me.$kgUtilMenu.getPageParam("oid")
            }).then((res)=>{
                me.roleList = res.list;
            }).catch((res)=>{

            })
        }
    }
}
</script>

<style scoped lang="scss">
</style>
