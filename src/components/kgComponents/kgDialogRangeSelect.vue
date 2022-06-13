<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->

<template>
    <div class="k-mc-page-1">
        <!--kg plus-->
        <el-dialog append-to-body :visible.sync="showSelectFlag" width="60%" top="8vh" @closed="clickBtnCloseSelect">
            <div slot="title" class="k-dialog-title">
                <span>- 选择Range -</span>
            </div>
            <!--kg searchtool-->
            <div class="k-searchtool">
                <div class="k-searchtool-search">
                    <div class="k-searchtool-search-item">
                        <el-input :clearable="true" placeholder="请输入内容" v-model="searchParam.condition" size="small">
                            <el-button slot="append" icon="el-icon-search" @click="clickBtnSearch()"></el-button>
                        </el-input>
                    </div>
                </div>
            </div>
            <!--kg table-->
            <div class="k-table" style="min-height: 320px;">
                <el-table ref="elTable" :data="dataList" @selection-change="selectItem" size="mini" border :header-cell-style="{background:'#fafafa'}">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="dataMode" label="dataMode"></el-table-column>
                    <el-table-column prop="rangeID" label="rangeID"></el-table-column>
                    <el-table-column prop="id" label="id"></el-table-column>
                    <el-table-column prop="label" label="label"></el-table-column>
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
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" @click="clickBtnSelect()" class="k-btn28">确 定</el-button>
                <el-button @click="clickBtnCloseSelect" class="k-btn28">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

export default {
    props:{
        RoleRelatedRangeOfRoleOID:""
    },
    data () {
        return {
            showSelectFlag:true,
            searchParam:{// 检索关键字
                condition:""
            },
            currentSearchParam:{// 当前检索关键字
                condition:""
            },
            dataList:[],
            selectionList:[],
            page:1,
            pageSize:10,
            total:0,
        }
    },
    created:function(){
        this.getDataList();
    },
    methods:{
        // 搜索
        clickBtnSearch(){
            Object.assign(this.currentSearchParam,JSON.parse(JSON.stringify(this.searchParam)))
            this.page = 1;
            this.getDataList();
        },
        // 获取Range数据
        getDataList(){
            var me = this;
            me.$kgApi.getRangeListNotByRoleOID({
                roleOID:me.RoleRelatedRangeOfRoleOID,
                condition: me.currentSearchParam.condition,
                pageSize: me.pageSize,
                page: me.page
            }).then(function(response){
                me.dataList = me.dealDataList(response.list);
                me.total = response.paging.total;
            });
        },
        // 数据显示处理
        dealDataList(arr){
            var newArr = arr;
            for(var i = 0; i< arr.length; i++){
                newArr[i].createAt = this.$kgUtilDate.parseTimeStampToTime(arr[i].createAt);
                newArr[i].updateAt = this.$kgUtilDate.parseTimeStampToTime(arr[i].updateAt);
                newArr[i].deleteAt = this.$kgUtilDate.parseTimeStampToTime(arr[i].deleteAt);
            }
            return newArr;
        },
        // 页码切换
        clickBtnChangePage(v) {
            this.getDataList();
        },
        // 选中事件
        selectItem(v){
            this.selectionList = v;
        },
        // 关闭选择窗口
        clickBtnCloseSelect(){
            this.$emit("close");
        },
        // 选择
        clickBtnSelect(){
            var me = this;
            if(me.selectionList.length > 0){
                this.$emit("select",me.selectionList);
            }else{
                me.$kgUtil.alterMessageWarning("请选择数据！");
            }
        },
    }
}
</script>
<style>
</style>
