<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-1">
        <!--kg searchtool-->
        <div class="k-searchtool">
            <div class="k-searchtool-search">
                <div class="k-searchtool-search-item">
                    <el-input placeholder="请输入用户名或姓名" :clearable="true" v-model="searchParam.name" size="small">
                        <el-button slot="append" icon="el-icon-search" @click="clickBtnSearchUser()"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="k-searchtool-tool">
                <el-button type="primary" icon="el-icon-plus" size="mini" v-if="allowOperate.createUsers2Role" @click="showSelectUserFlag = true" circle></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" v-if="allowOperate.deleteUser2Role" @click="clickBtnDeleteRole2User" circle></el-button>
            </div>
        </div>
        <!--kg table-->
        <div class="k-table" style="min-height: 360px;">
            <el-table :data="userList" @selection-change="selectUserItem" size="mini" border :header-cell-style="{background:'#fafafa'}">
                <el-table-column type="selection" width="55" label="No"></el-table-column>
                <el-table-column prop="toObj.uAccount" label="Account"></el-table-column>
                <el-table-column prop="toObj.uName" label="Name"></el-table-column>
            </el-table>
        </div>
        <!--kg table pagesize-->
        <div class="k-pagesize">
            <el-pagination
                @current-change="clickBtnChangePage"
                :current-page.sync="page"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>
        <!--kg plus-->
        <kg-dialog-user-select v-if="showSelectUserFlag" @close="showSelectUserFlag = false" @select="doRelatedUser" :RoleRelatedUserOfRoleOID="roleOID"></kg-dialog-user-select>
    </div>
</template>

<script>
export default {
    props:{
        roleOID:""
    },
    data () {
        return {
            showSelectUserFlag:false, // 选择用户模态框显示控制
            searchParam:{// 检索关键字
                name:""
            },
            currentSearchParam:{// 当前检索关键字
                name:""
            },
            userList:[], // 菜单数据
            selectionUserList:[], //选中的
            page:1, // 关联用户当前页码
            pageSize:10, // 关联用户每页数据数
            total:0, // 关联用户数据总数
            allowOperate:{}
        }
    },
    created:function(){
        this.doInit();
    },
    methods: {
        // 初始化
        async doInit(){
            this.getUser2RoleByRoleOID();
            this.allowOperate = await this.$kgUtil.getAllowOperate();
        },
        // 查询按钮点击
        clickBtnSearchUser(){
            Object.assign(this.currentSearchParam,JSON.parse(JSON.stringify(this.searchParam)))
            this.page = 1;
            this.getUser2RoleByRoleOID();
        },
        // 获取角色与用户关联
        getUser2RoleByRoleOID(){
            var me = this;
            me.$kgApi.getUser2RoleByRoleOID({
                roleOID:me.roleOID,
                page:me.page,
                pageSize:me.pageSize,
                condition:me.currentSearchParam.name
            }).then((res)=>{
                me.total = res.paging.total;
                me.userList = res.list;
            }).catch((res)=>{

            })
        },
        // 切换页码
        clickBtnChangePage(v) {
            this.getUser2RoleByRoleOID();
        },
        // 选择用户
        selectUserItem(v) {
            this.selectionUserList = v;
        },
        // 删除用户与角色关联
        clickBtnDeleteRole2User(){
            var me = this;
            if(me.selectionUserList.length >= 1){
                var arr = new Array();
                for(var i = 0; i < me.selectionUserList.length; i++){
                    arr.push(me.selectionUserList[i].rid);
                }
                me.$kgApi.deleteUser2Role({
                    ridList:arr
                }).then((res)=>{
                    me.getUser2RoleByRoleOID();
                }).catch((res)=>{

                })
            }else{
                me.$kgUtil.alterMessageWarning("请至少选择一个用户！");
            }
        },
        // 提交添加用户
        doRelatedUser(data){
            var me = this;
            if(data.length >= 1){
                var arr = new Array();
                for(var i = 0; i < data.length; i++){
                    arr.push(data[i].oid);
                }
                me.$kgApi.createUsers2Role({
                    roleOID:me.roleOID,
                    userOIDList:arr
                }).then((res)=>{
                    me.$kgUtil.alterMessageSuccess("成功分配用户!");
                    me.showSelectUserFlag = false;
                    me.getUser2RoleByRoleOID();
                }).catch((res)=>{

                })
            }else{
                me.$kgUtil.alterMessageWarning("请至少选择一个用户！");
            }
        },
    }
}
</script>

<style scoped lang="scss">
</style>
