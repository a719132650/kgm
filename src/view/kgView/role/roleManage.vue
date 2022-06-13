<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-1">
        <!--kg title-->
        <div class="k-title">
            <div class="k-title-name">
                <span>角色管理</span>
            </div>
            <div class="k-title-tool">
                <el-button type="primary" v-if="allowOperate.createRole" @click="showCreateRoleFlag = true">创建角色</el-button>
                <el-button type="primary" v-if="allowOperate.updateRole" @click="clickBtnGotoRoleModify()">修改角色</el-button>
                <el-button type="primary" v-if="allowOperate.deleteRole" @click="clickBtnDeleteRole()">删除角色</el-button>
                <el-button type="primary" v-if="allowOperate.createUsers2Role||allowOperate.deleteUser2Role" @click="clickBtnShowRelatedUser()">分配用户</el-button>
                <el-button type="primary" v-if="allowOperate.createRole2Ranges||allowOperate.deleteRole2Range" @click="clickBtnShowRelatedRange()">分配数据</el-button>
            </div>
        </div>
        <!--kg search-->
        <div class="k-search">
            <div class="k-search-item">
                <span>名称</span>
                <el-input placeholder="请输入角色名称" v-model="searchParam.name"/>
            </div>
            <el-button type="primary" @click="clickBtnSearchRole()">查询</el-button>
            <el-button v-if="allowOperate.exportRoleList" @click="clickBtnExportRole()" class="k-searchBtnExport">导出</el-button>
            <el-button @click="resetSearch()">重置</el-button>
            <el-button @click="collapseSearchInput()" class="k-searchBtnCollapse" v-show="!showSearchInputFlag">展开<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-button @click="collapseSearchInput()" class="k-searchBtnCollapse" v-show="showSearchInputFlag">收起<i class="el-icon-arrow-up el-icon--right"></i></el-button>
        </div>
        <!--kg table-->
        <div class="k-table">
            <el-table ref="roleList" :data="roleList" @selection-change="selectRoleItem" size="small">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="name">
                    <template slot-scope="scope">
                        <a title="点击查看" @click.prevent="clickBtnGotoRoleDetail(scope.row.oid)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="description"></el-table-column>
                <el-table-column label="status">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0"
                            :disabled="!(allowOperate.updateRoleStatus && scope.row.initFlag == 0)"
                            @change="clickBtnChangeRoleStatus(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
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
        <el-dialog v-if="showCreateRoleFlag" :visible.sync="showCreateRoleFlag" width="60%" top="8vh">
            <div slot="title" class="k-dialog-title">
                <span>- 创建角色 -</span>
            </div>
            <role-create ref="roleCreate"></role-create>
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" :disabled="isDisabledCreateRole" @click="submitCreateRole()" class="k-btn32">确 定</el-button>
                <el-button @click="showCreateRoleFlag = false" class="k-btn32">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog v-if="showRelatedUserFlag" :visible.sync="showRelatedUserFlag" width="60%" top="8vh">
            <div slot="title" class="k-dialog-title">
                <span>- 已分配用户 -</span>
            </div>
            <role-related-user ref="roleRelatedUser" :roleOID="selectionRoleOID"></role-related-user>
        </el-dialog>
        <el-dialog v-if="showRelatedRangeFlag" :visible.sync="showRelatedRangeFlag" width="60%" top="8vh">
            <div slot="title" class="k-dialog-title">
                <span>- 已分配数据 -</span>
            </div>
            <role-related-range ref="roleRelatedRange" :roleOID="selectionRoleOID"></role-related-range>
        </el-dialog>
    </div>
</template>

<script>
import roleCreate from '@/view/kgView/role/roleCreate.vue'
import roleRelatedUser from '@/view/kgView/role/roleRelatedUser.vue'
import roleRelatedRange from '@/view/kgView/role/roleRelatedRange.vue'
export default {
    components: {roleCreate,roleRelatedUser,roleRelatedRange},
    data () {
        return {
            // kg search
            showSearchInputFlag:false,
            searchParam:{
                name:""
            },
            resetSearchParam:{
                name:""
            },
            currentSearchParam:{},
            // kg operate
            allowOperate:{},
            // main
            roleList:[],
            selectionRoleList:[],
            selectionRoleOID:"",
            page:1,
            pageSize:10,
            total:0,
            // create & related
            showCreateRoleFlag:false,
            showRelatedUserFlag:false,
            showRelatedRangeFlag:false,
            isDisabledCreateRole:false,
        }
    },
    created:function(){
        var me = this;
        me.$kgUtil.commonInit(me).then(function(res){
            me.$kgUtil.selectInit(me.$refs.roleList,me.roleList,me.selectionRoleList);
        })
        .catch(()=>{
            me.doInit();
        })
    },
    methods: {
        // init
        async doInit(){
            this.getRoleList();
            this.allowOperate = await this.$kgUtil.getAllowOperate();
        },
        // kg search
        clickBtnSearchRole(){
            this.page = 1;
            Object.assign(this.currentSearchParam,JSON.parse(JSON.stringify(this.searchParam)));
            this.getRoleList();
        },
        clickBtnExportRole(){
            var me = this;
            me.$kgApi.exportRoleList({
                condition: me.currentSearchParam.name
            }).then((res)=>{

            }).catch((res)=>{

            })
        },
        resetSearch(){
            Object.assign(this.searchParam,JSON.parse(JSON.stringify(this.resetSearchParam)));
        },
        collapseSearchInput(){
            this.showSearchInputFlag = !this.showSearchInputFlag;
        },
        // 获取角色
        getRoleList(){
            var me = this;
            me.$kgApi.getRoleList({
                condition: me.currentSearchParam.name,
                pageSize: me.pageSize,
                page: me.page
            }).then((res)=>{
                me.roleList = res.list;
                me.total = res.paging.total;
            }).catch((res)=>{

            })
        },
        // 切换页码
        clickBtnChangePage(v) {
            this.getRoleList();
        },
        // 创建角色
        submitCreateRole(){
            var me = this;
            me.isDisabledCreateRole = true
            me.$refs.roleCreate.doCreateRole().then(()=>{
                me.showCreateRoleFlag = false;
                me.$kgUtil.alterMessageSuccess("成功创建角色!");
                me.getRoleList();
            }).catch(()=>{
                //dosomething
            }).finally(()=>{
                me.isDisabledCreateRole = false;
            });
        },
        // 选择角色
        selectRoleItem(v){
            this.selectionRoleList = v;
        },
        // 查看详情
        clickBtnGotoRoleDetail(v){
            this.$kgUtil.kgPush(this,"RoleDetail",{oid:v});
        },
        // 修改角色状态
        clickBtnChangeRoleStatus(v){
            var me = this;
            me.$kgApi.updateRoleStatus({
                roleOID: v.oid,
                status: v.status
            }).then((res)=>{
                var msg = (v.status==1)?"启用角色成功":"禁用角色成功";
                me.$kgUtil.alterMessageSuccess(msg);
            }).catch((res)=>{

            })
        },
        // 修改角色 (@developMode@)
        clickBtnGotoRoleModify(){
            var me = this;
            if(me.selectionRoleList.length == 1){
                if(me.selectionRoleList[0].initFlag == 0 || me.$kgConfig.developMode == 1){
                    me.$kgUtil.kgPush(me,"RoleModify",{oid:me.selectionRoleList[0].oid});
                }
                else{
                    me.$kgUtil.alterMessageWarning("权限不足，无法操作");
                }
            }else{
                me.$kgUtil.alterMessageWarning("请选择一个角色！");
            }
        },
        // 删除角色
        clickBtnDeleteRole(){
            var me = this;
            if(me.selectionRoleList.length == 1){
                if(me.selectionRoleList[0].initFlag == 0){
                    me.$confirm('确认删除吗?','提示',{type: 'warning'}).then(() => {
                        me.$kgApi.deleteRole({
                            roleOID: me.selectionRoleList[0].oid
                        }).then((res)=>{
                            me.$kgUtil.alterMessageSuccess("删除角色成功!");
                            me.getRoleList();
                        }).catch((res)=>{

                        })
                    })
                    .catch(() => {})
                }
                else{
                    me.$kgUtil.alterMessageWarning("权限不足，无法操作");
                }
            }else{
                me.$kgUtil.alterMessageWarning("请选择一个角色！");
            }
        },
        // 分配用户 (@developMode@)
        clickBtnShowRelatedUser(){
            var me = this;
            if(me.selectionRoleList.length == 1){
                if(me.selectionRoleList[0].initFlag == 0 || me.$kgConfig.developMode == 1){
                    me.selectionRoleOID = me.selectionRoleList[0].oid;
                    me.showRelatedUserFlag = true;
                }
                else{
                    me.$kgUtil.alterMessageWarning("权限不足，无法操作");
                }
            }else{
                me.$kgUtil.alterMessageWarning("请选择一个角色！");
            }
        },
        // 分配数据 (@developMode@)
        clickBtnShowRelatedRange(){
            var me = this;
            if(me.selectionRoleList.length == 1){
                if(me.selectionRoleList[0].initFlag == 0 || me.$kgConfig.developMode == 1){
                    me.selectionRoleOID = me.selectionRoleList[0].oid;
                    me.showRelatedRangeFlag = true;
                }
                else{
                    me.$kgUtil.alterMessageWarning("权限不足，无法操作");
                }
            }else{
                me.$kgUtil.alterMessageWarning("请选择一个角色！");
            }
        },
    }
}
</script>
<style scoped lang="scss">
.k-table{
    width: calc(100% - 24px)!important;
    padding: 0 12px!important;
}
</style>
