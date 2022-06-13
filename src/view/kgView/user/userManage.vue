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
                <span>用户管理</span>
            </div>
            <div class="k-title-tool">
                <el-button type="primary" v-if="allowOperate.createUser" @click="showCreateUserFlag = true">创建用户</el-button>
                <el-button type="primary" v-if="allowOperate.updateUser" @click="clickBtnGotoUserModify()">修改用户</el-button>
                <el-button type="primary" v-if="allowOperate.updateUserPassword" @click="clickBtnUpdatePwd()">修改密码</el-button>
                <el-button type="primary" v-if="allowOperate.deleteUser" @click="clickBtnDeleteUser()">删除用户</el-button>
            </div>
        </div>
        <!--kg search-->
        <div class="k-search">
            <div class="k-search-item">
                <span>名称</span>
                <el-input placeholder="请输入用户名称" v-model="searchParam.name" />
            </div>
            <el-button type="primary" @click="clickBtnSearchUser()">查询</el-button>
            <el-button v-if="allowOperate.exportUserList" @click="clickBtnExportUser()" class="k-searchBtnExport">导出</el-button>
            <el-button @click="resetSearch()">重置</el-button>
            <el-button @click="collapseSearchInput()" class="k-searchBtnCollapse" v-show="!showSearchInputFlag">展开<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-button @click="collapseSearchInput()" class="k-searchBtnCollapse" v-show="showSearchInputFlag">收起<i class="el-icon-arrow-up el-icon--right"></i></el-button>
        </div>
        <!--kg table-->
        <div class="k-table">
            <el-table ref="userList" :data="userList" @selection-change="selectUserItem" size="small">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="uAccount" label="account">
                    <template slot-scope="scope">
                        <a title="点击查看" @click.prevent="clickBtnGotoUserDetail(scope.row.oid)">{{scope.row.uAccount}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="uName" label="name"></el-table-column>
                <el-table-column label="status">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0"
                            :disabled="!(allowOperate.updateUserStatus && scope.row.initFlag == 0)"
                            @change="clickBtnChangeUserStatus(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="lastLoginAt" label="last login"></el-table-column>
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
        <el-dialog v-if="showCreateUserFlag" :visible.sync="showCreateUserFlag" width="60%" top="8vh">
            <div slot="title" class="k-dialog-title">
                <span>- 创建用户 -</span>
            </div>
            <user-create ref="userCreate"></user-create>
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" :disabled="isDisabledCreateUser" @click="submitCreateUser()" class="k-btn28">确 定</el-button>
                <el-button @click="showCreateUserFlag = false" class="k-btn28">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import userCreate from '@/view/kgView/user/userCreate.vue'

export default {
    components: {userCreate},
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
            userList:[],
            selectionUserList:[],
            page:1,
            pageSize:10,
            total:0,
            //create user
            showCreateUserFlag: false,
            isDisabledCreateUser:false,
        }
    },
    created:function(){
        var me = this;
        me.$kgUtil.commonInit(me).then(function(res){
            me.$kgUtil.selectInit(me.$refs.userList,me.userList,me.selectionUserList);
        })
        .catch(()=>{
            me.doInit();
        })
    },
    methods: {
        // init
        async doInit(){
            this.allowOperate = await this.$kgUtil.getAllowOperate();
            this.getUserList();
        },
        // kg search
        clickBtnSearchUser(){
            Object.assign(this.currentSearchParam,JSON.parse(JSON.stringify(this.searchParam)));
            this.page = 1;
            this.getUserList();
        },
        clickBtnExportUser(){
            var me = this;
            me.$kgApi.exportUserList({
                condition: me.currentSearchParam.name,
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
        // 获取用户
        getUserList(){
            var me = this;
            me.$kgApi.getUserList({
                condition: me.currentSearchParam.name,
                pageSize: me.pageSize,
                page: me.page
            }).then((res)=>{
                me.userList = me.dealUserList(res.list);
                me.total = res.paging.total;
            }).catch((res)=>{

            })
        },
        // 处理数据
        dealUserList(arr){
            var newArr = arr;
            for(var i = 0; i< arr.length; i++){
                newArr[i].lastLoginAt = this.$kgUtilDate.parseTimeStampToTime(arr[i].lastLoginAt);
                newArr[i].createAt = this.$kgUtilDate.parseTimeStampToTime(arr[i].createAt);
                newArr[i].updateAt = this.$kgUtilDate.parseTimeStampToTime(arr[i].updateAt);
                newArr[i].deleteAt = this.$kgUtilDate.parseTimeStampToTime(arr[i].deleteAt);
            }
            return newArr;
        },
        // 切换页码
        clickBtnChangePage(v) {
            this.getUserList();
        },
        // 创建用户
        submitCreateUser(){
            var me = this;
            me.isDisabledCreateUser = true;
            me.$refs.userCreate.doCreateUser().then(()=>{
                me.showCreateUserFlag = false;
                me.getUserList();
            }).catch(()=>{
                //dosomething
            }).finally(()=>{
                me.isDisabledCreateUser = false;
            });
        },
        // 选择用户
        selectUserItem(v) {
            this.selectionUserList = v;
        },
        // 查看详情
        clickBtnGotoUserDetail(v){
           this.$kgUtil.kgPush(this,"UserDetail",{oid:v});
        },
        // 修改用户状态
        clickBtnChangeUserStatus(v){
            var me = this;
            me.$kgApi.updateUserStatus({
                userOID: v.oid,
                status: v.status
            }).then((res)=>{
                var msg = "";
                var msg = (v.status==1)?"启用用户成功":"禁用用户成功";
                me.$kgUtil.alterMessageSuccess(msg);
            }).catch((res)=>{

            })
        },
        // 修改用户 (@developMode@)
        clickBtnGotoUserModify(){
            var me = this;
            if(me.selectionUserList.length == 1){
                if(me.selectionUserList[0].initFlag == 0 || me.$kgConfig.developMode == 1){
                    me.$kgUtil.kgPush(me,"UserModify",{oid:me.selectionUserList[0].oid});
                }
                else{
                    me.$kgUtil.alterMessageWarning("权限不足，无法操作");
                }
            }else{
                me.$kgUtil.alterMessageWarning("请选择一个用户！");
            }
        },
        // 修改用户密码 (@developMode@)
        clickBtnUpdatePwd(){
            var me = this;
            if(me.selectionUserList.length == 1){
                if(me.selectionUserList[0].initFlag == 0 || me.$kgConfig.developMode == 1){
                    me.$prompt('请输入新密码', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputErrorMessage: '请输入新密码',
                        inputValidator:value=>{
                            return !me.$kgUtil.isEmpty(value);
                        }
                    }).then(({ value }) => {
                        me.$kgApi.updateUserPassword({
                            userOID:me.selectionUserList[0].oid,
                            password:value
                        }).then((res)=>{
                            me.$kgUtil.alterMessageSuccess("修改密码成功!");
                        }).catch((res)=>{

                        })
                    }).catch((e) => {
                        (e!="cancel") && me.$kgUtil.alterMessageError("系统异常");
                    });
                }
                else{
                    me.$kgUtil.alterMessageWarning("权限不足，无法操作");
                }
            }else{
                me.$kgUtil.alterMessageWarning("请选择一个用户！");
            }
        },
        // 删除用户
        clickBtnDeleteUser(){
            var me = this;
            if(me.selectionUserList.length == 1){
                if(me.selectionUserList[0].initFlag == 0){
                    me.$confirm('确认删除吗?','提示',{type: 'warning'}).then(() => {
                        me.$kgApi.deleteUser({
                            userOID: me.selectionUserList[0].oid
                        }).then((res)=>{
                            me.$kgUtil.alterMessageSuccess("删除用户成功!");
                            me.getUserList();
                        }).catch((res)=>{

                        })
                    })
                    .catch(() => {})
                }
                else{
                    me.$kgUtil.alterMessageWarning("权限不足，无法删除");
                }
            }else{
                me.$kgUtil.alterMessageWarning("请选择一个用户！");
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
