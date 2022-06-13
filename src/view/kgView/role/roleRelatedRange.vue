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
                    <el-input placeholder="请输入range值" :clearable="true" v-model="searchParam.condition" size="small">
                        <el-button slot="append" icon="el-icon-search" @click="clickBtnSearchRange()"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="k-searchtool-tool">
                <el-button type="primary" icon="el-icon-plus" size="mini" v-if="allowOperate.createRole2Ranges" @click="showSelectRangeFlag = true" circle></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" v-if="allowOperate.deleteRole2Range" @click="clickBtnDeleteRole2Range" circle></el-button>
            </div>
        </div>
        <!--kg table-->
        <div class="k-table" style="min-height: 360px;">
            <el-table :data="rangeList" @selection-change="selectRangeItem" size="mini" border :header-cell-style="{background:'#fafafa'}">
                <el-table-column type="selection" width="55" label="No"></el-table-column>
                <el-table-column prop="toObj.dataMode" label="dataMode"></el-table-column>
                <el-table-column prop="toObj.rangeId" label="rangeId"></el-table-column>
                <el-table-column prop="toObj.id" label="id"></el-table-column>
                <el-table-column prop="toObj.label" label="label"></el-table-column>
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
        <kg-dialog-range-select v-if="showSelectRangeFlag" @close="showSelectRangeFlag = false" @select="doRelatedRange" :RoleRelatedRangeOfRoleOID="roleOID"></kg-dialog-range-select>
    </div>
</template>

<script>
export default {
    props:{
        roleOID:""
    },
    data () {
        return {
            showSelectRangeFlag:false, // 选择Range模态框显示控制
            searchParam:{// 检索关键字
                condition:""
            },
            currentSearchParam:{// 当前检索关键字
                condition:""
            },
            rangeList:[], // Range数据
            selectionRangeList:[], //选中的
            page:1, // 关联Range当前页码
            pageSize:10, // 关联Range每页数据数
            total:0, // 关联Range数据总数
            allowOperate:{}
        }
    },
    created:function(){
        this.doInit();
    },
    methods: {
        // 初始化
        async doInit(){
            this.getRole2RangeByRoleOID();
            this.allowOperate = await this.$kgUtil.getAllowOperate();
        },
        // 查询按钮点击
        clickBtnSearchRange(){
            Object.assign(this.currentSearchParam,JSON.parse(JSON.stringify(this.searchParam)))
            this.page = 1;
            this.getRole2RangeByRoleOID();
        },
        // 获取角色与Range关联
        getRole2RangeByRoleOID(){
            var me = this;
            me.$kgApi.getRole2RangeByRoleOID({
                roleOID:me.roleOID,
                // page:me.page,
                // pageSize:me.pageSize,
                // condition:me.currentSearchParam.condition
            }).then((res)=>{
                // me.total = res.paging.total;
                me.rangeList = res.list;
                console.log(me.rangeList);
            }).catch((res)=>{
                console.log(res);
            })
        },
        // 切换页码
        clickBtnChangePage(v) {
            this.getRole2RangeByRoleOID();
        },
        // 选择Range
        selectRangeItem(v) {
            this.selectionRangeList = v;
        },
        // 删除角色与Range关联
        clickBtnDeleteRole2Range(){
            var me = this;
            if(me.selectionRangeList.length >= 1){
                var arr = new Array();
                for(var i = 0; i < me.selectionRangeList.length; i++){
                    arr.push(me.selectionRangeList[i].rid);
                }
                me.$kgApi.deleteRole2Range({
                    ridList:arr
                }).then((res)=>{
                    me.getRole2RangeByRoleOID();
                }).catch((res)=>{

                })
            }else{
                me.$kgUtil.alterMessageWarning("请至少选择一个Range！");
            }
        },
        // 提交添加Range
        doRelatedRange(data){
            var me = this;
            if(data.length >= 1){
                var arr = new Array();
                for(var i = 0; i < data.length; i++){
                    arr.push(data[i].oid);
                }
                me.$kgApi.createRole2Ranges({
                    roleOID:me.roleOID,
                    rangeOIDList:arr
                }).then((res)=>{
                    me.$kgUtil.alterMessageSuccess("成功分配Range!");
                    me.showSelectRangeFlag = false;
                    me.getRole2RangeByRoleOID();
                }).catch((res)=>{

                })
            }else{
                me.$kgUtil.alterMessageWarning("请至少选择一个Range！");
            }
        },
    }
}
</script>

<style scoped lang="scss">
</style>
