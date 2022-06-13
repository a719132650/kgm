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
                <span>- 选择Api -</span>
            </div>
            <!--kg searchtool-->
            <div class="k-searchtool">
                <div class="k-searchtool-search">
                    <div class="k-searchtool-search-item">
                        <el-select v-model="checkedBusinessType" placeholder="请选择">
                            <el-option
                              v-for="businessType in businessTypeList"
                              :key="businessType.id"
                              :label="businessType.label"
                              :value="businessType.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="k-searchtool-search-item">
                        <el-input :clearable="true" placeholder="请输入内容" v-model="searchParam.name" size="small">
                            <el-button slot="append" icon="el-icon-search" @click="clickBtnSearch()"></el-button>
                        </el-input>
                    </div>
                </div>
            </div>
            <!--kg table-->
            <div class="k-table" style="min-height: 320px;">
                <el-table ref="elTable" :data="dataList" @selection-change="selectItem" size="mini" border :header-cell-style="{background:'#fafafa'}">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="api" label="api" width="250"></el-table-column>
                    <el-table-column prop="description" label="description"></el-table-column>
                    <el-table-column prop="authType" label="authType"></el-table-column>
                    <el-table-column prop="status" label="status"></el-table-column>
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

    },
    data () {
        return {
            showSelectFlag:true,
            searchParam:{// 检索关键字
                name:""
            },
            currentSearchParam:{// 当前检索关键字
                name:""
            },
            dataList:[],
            selectionList:[],
            page:1,
            pageSize:10,
            total:0,
            checkedBusinessType:[],
            businessTypeList:[]
        }
    },
    created:function(){
        this.getDataList();
        this.getBusinessTypeRange();
    },
    methods:{
        // 搜索
        clickBtnSearch(){
            Object.assign(this.currentSearchParam,JSON.parse(JSON.stringify(this.searchParam)))
            this.page = 1;
            this.getDataList();
        },
        getBusinessTypeRange(){
            var me = this;
            me.$kgUtil.getRange("sys_api_business_type").then(function(res){
                me.businessTypeList = res;
            }).catch((res)=>{

            })
        },
        // 获取用户数据
        getDataList(){
            var me = this;
            me.$kgApi.getApiListForChoice({
                condition: me.currentSearchParam.name,
                pageSize: me.pageSize,
                page: me.page,
                businessTypeList:me.checkedBusinessType
            }).then(function(res){
                me.dataList = res.list;
                me.dealDataList();
                me.total = res.paging.total;
            })
        },
        // 数据显示处理
        dealDataList(arr){
            var me = this;
            for(var i = 0; i < me.dataList.length; i++){
                me.dataList[i].authType = me.$kgUtilAuth.formatApiAuth(me.dataList[i].authType);
                me.dataList[i].status = me.$kgUtilAuth.formatStatus(me.dataList[i].status);
            }
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
