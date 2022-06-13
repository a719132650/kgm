<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-2">
        <el-descriptions class="k-mt20" title="基本信息" :column="2" size="small" border>
            <el-descriptions-item label="角色名">{{role.name}}</el-descriptions-item>
            <el-descriptions-item label="描述">{{role.description}}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="k-mt20" title="状态信息" :column="2" size="small" border>
            <el-descriptions-item label="createAt">{{role.createAt}}</el-descriptions-item>
            <el-descriptions-item label="updateAt">{{role.updateAt}}</el-descriptions-item>
            <el-descriptions-item label="status">
                <el-tag size="small" v-if="role.status == '1'">Active</el-tag>
                <el-tag size="small" type="warning" v-if="role.status == '0'">Inactive</el-tag>
            </el-descriptions-item>
        </el-descriptions>
        <div class="k-descriptions-header-1">
            <span class="title">菜单信息</span>
        </div>
        <div class="k-tree" style="max-height: 260px;">
            <kg-menu-tree ref="menuTree" :menuList="menuList" :defaultCheckedKeys="checkedMenuList" disabled="true"></kg-menu-tree>
        </div>
        <div class="k-descriptions-header-1">
            <span class="title">用户信息</span>
        </div>
        <!--kg searchtool-->
        <div class="k-searchtool">
            <div class="k-searchtool-search">
                <div class="k-searchtool-search-item">
                    <el-input placeholder="请输入用户名或姓名" v-model="searchParam.name" size="small">
                        <el-button slot="append" icon="el-icon-search" @click="clickBtnSearchUser()"></el-button>
                    </el-input>
                </div>
            </div>
        </div>
        <!--kg table-->
        <div class="k-table">
            <el-table :data="userList" size="small" border :header-cell-style="{background:'#fafafa'}">
                <el-table-column type="index" width="55" label="No"></el-table-column>
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
    </div>
</template>

<script>
export default {
    data () {
        return {
            role:{
                name:"",
                description:"",
                createAt:"",
                updateAt:"",
                status:""
            },
            menuList:[], // 菜单树形控件数据
            checkedMenuList:[], // 默认选中菜单节点
            searchParam:{// 检索关键字
                name:""
            },
            currentSearchParam:{// 当前检索关键字
                name:""
            },
            userList:[], // 关联角色
            page:1, // 关联用户当前页码
            pageSize:10, // 关联用户每页数据数
            total:0, // 关联用户数据总数
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
        async doInit(){
            await this.getRoleDetail();
            this.getSubMenuTreeAllForChoice();
            this.getUser2RoleByRoleOID();
        },
        // 获取角色信息
        async getRoleDetail(){
            var me = this;
            await me.$kgApi.getRoleDetail({
                roleOID:me.$kgUtilMenu.getPageParam("oid")
            }).then((res)=>{
                me.role = res.role;
                me.role.createAt = me.$kgUtilDate.parseTimeStampToTime(me.role.createAt);
                me.role.updateAt = me.$kgUtilDate.parseTimeStampToTime(me.role.updateAt);
                me.dealCheckedMenuList(res.subMenuList);
                me.dealCheckedMenuList(res.menuList);
                me.dealCheckedMenuList(res.commandList);
                me.dealCheckedMenuList(res.operateList);
            }).catch((res)=>{

            })
        },
        //获取菜单
        getSubMenuTreeAllForChoice(){
            var me = this;
            me.$kgApi.getSubMenuTreeAllForChoice({

            }).then((res)=>{
                me.menuList = res.list;
            }).catch((res)=>{

            })
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
                roleOID:me.$kgUtilMenu.getPageParam("oid"),
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
        // 处理CheckedMenuList
        dealCheckedMenuList(arr){
            for(var i=0;i<arr.length;i++){
                this.checkedMenuList.push(arr[i].oid || arr[i].toOID);
            }
        },
    }
}
</script>

<style scoped lang="scss">
</style>
