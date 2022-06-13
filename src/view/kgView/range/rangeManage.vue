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
                <span>参数管理</span>
            </div>
            <div class="k-title-tool">
                <el-button type="primary" v-if="allowOperate.createRange" @click="showCreateRangeFlag = true">创建参数</el-button>
                <el-button type="primary" v-if="allowOperate.updateRange" @click="clickBtnGotoRangeModify()">修改参数</el-button>
                <el-button type="primary" v-if="allowOperate.deleteRange" @click="clickBtnDeleteRange()">删除参数</el-button>
            </div>
        </div>
        <!--kg search-->
        <div class="k-search">
            <div class="k-search-item">
                <span>dataMode</span>
                <el-select v-model="searchParam.dataMode" placeholder="请选择" @change="selectDataMode()">
                    <el-option
                      v-for="dataMode in dataModeList"
                      :key="dataMode"
                      :label="dataMode"
                      :value="dataMode">
                    </el-option>
                </el-select>
            </div>
            <div class="k-search-item">
                <span>rangeID</span>
                <el-select v-model="searchParam.rangeID" placeholder="请选择">
                    <el-option
                      v-for="rangeID in rangeIDList"
                      :key="rangeID"
                      :label="rangeID"
                      :value="rangeID">
                    </el-option>
                </el-select>
            </div>
            <div class="k-search-item">
                <span>名称</span>
                <el-input placeholder="请输入参数名称" v-model="searchParam.name" />
            </div>
            <el-button type="primary" @click="clickBtnSearchRange()">查询</el-button>
            <el-button v-if="allowOperate.exportRangeList" @click="clickBtnExportRange()" class="k-searchBtnExport">导出</el-button>
            <el-button @click="resetSearch()">重置</el-button>
            <el-button @click="collapseSearchInput()" class="k-searchBtnCollapse" v-show="!showSearchInputFlag">展开<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-button @click="collapseSearchInput()" class="k-searchBtnCollapse" v-show="showSearchInputFlag">收起<i class="el-icon-arrow-up el-icon--right"></i></el-button>
        </div>
        <!--kg table-->
        <div class="k-table">
            <el-table ref="rangeList" :data="rangeList" @selection-change="selectRangeItem" size="small">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="dataMode" label="dataMode"></el-table-column>
                <el-table-column prop="rangeId" label="rangeID"></el-table-column>
                <el-table-column prop="id" label="id" width="250"></el-table-column>
                <el-table-column prop="label" label="label"></el-table-column>
                <el-table-column prop="description" label="description"></el-table-column>
                <el-table-column label="status">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0"
                            :disabled="!(allowOperate.updateRangeStatus && scope.row.initFlag == 0)"
                            @change="clickBtnChangeRangeStatus(scope.row)">
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
        <el-dialog v-if="showCreateRangeFlag" :visible.sync="showCreateRangeFlag" width="60%" top="8vh">
            <div slot="title" class="k-dialog-title">
                <span>- 创建参数 -</span>
            </div>
            <range-create ref="rangeCreate"></range-create>
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" :disabled="isDisabledDo" @click="submitCreateRange()" class="k-btn32">确 定</el-button>
                <el-button @click="showCreateRangeFlag = false" class="k-btn32">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog v-if="showModifyRangeFlag" :visible.sync="showModifyRangeFlag" width="60%" top="8vh">
            <div slot="title" class="k-dialog-title">
                <span>- 修改参数 -</span>
            </div>
            <range-modify ref="rangeModify" :rangeObj="selectionRangeObj"></range-modify>
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" :disabled="isDisabledDo" @click="submitModifyRange()" class="k-btn32">确 定</el-button>
                <el-button @click="showModifyRangeFlag = false" class="k-btn32">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import rangeCreate from '@/view/kgView/range/rangeCreate.vue'
import rangeModify from '@/view/kgView/range/rangeModify.vue'

export default {
    components: {rangeCreate,rangeModify},
    data () {
        return {
            // kg search
            showSearchInputFlag:false,
            searchParam:{
                name:"",
                dataMode:"",
                rangeID:""
            },
            resetSearchParam:{
                name:"",
                dataMode:"",
                rangeID:""
            },
            currentSearchParam:{},
            // kg operate
            allowOperate:{},
            // main
            rangeList:[],
            selectionRangeList:[],
            selectionRangeObj:"",
            page:1,
            pageSize:10,
            total:0,
            // create & modify
            showCreateRangeFlag: false,
            showModifyRangeFlag: false,
            isDisabledDo:false,
            dataModeList:"",
            rangeIDList:""
        }
    },
    created:function(){
        var me = this;
        me.$kgUtil.commonInit(me).then(function(res){
            me.$kgUtil.selectInit(me.$refs.rangeList,me.rangeList,me.selectionRangeList);
        }).catch(()=>{
            me.doInit();
        })
    },
    methods: {
        // init
        async doInit(){
            this.getRangeDataModes();
            this.getRangeList();
            this.allowOperate = await this.$kgUtil.getAllowOperate();
        },
        getRangeDataModes(){
            var me = this;
            me.$kgApi.getRangeDataModes({

            }).then((res)=>{
                var arr = new Array();
                arr.push("");
                arr = arr.concat(res.list);
                me.dataModeList = arr;
            }).catch((res)=>{

            });
        },
        selectDataMode(){
            var me = this;
            if(me.$kgUtil.isEmpty(me.searchParam.dataMode)){
                me.rangeIDList = null;
                me.searchParam.rangeID = "";
            }else{
                me.$kgApi.getRangeIdsByDataMode({
                    dataMode:me.searchParam.dataMode
                }).then((res)=>{
                    var arr = new Array();
                    arr.push("");
                    arr = arr.concat(res.list);
                    me.searchParam.rangeID = arr[0];
                    me.rangeIDList = arr;
                }).catch((res)=>{

                });
            }

        },
        // kg search
        clickBtnSearchRange(){
            Object.assign(this.currentSearchParam,JSON.parse(JSON.stringify(this.searchParam)));
            this.page = 1;
            this.getRangeList();
        },
        clickBtnExportRange(){
            var me = this;
            me.$confirm('确认导出吗?','提示',{type: 'info'}).then(() => {
                me.$kgApi.exportRangeList({
                    condition: me.currentSearchParam.name,
                    dataMode:me.currentSearchParam.dataMode,
                    rangeID:me.currentSearchParam.rangeID,
                }).then((res)=>{

                }).catch((res)=>{

                })
            })
            .catch(() => {})
        },
        resetSearch(){
            Object.assign(this.searchParam,JSON.parse(JSON.stringify(this.resetSearchParam)));
        },
        collapseSearchInput(){
            this.showSearchInputFlag = !this.showSearchInputFlag;
        },
        // 获取参数
        getRangeList(){
            var me = this;
            me.$kgApi.getRangeList({
                condition: me.currentSearchParam.name,
                dataMode:me.currentSearchParam.dataMode,
                rangeID:me.currentSearchParam.rangeID,
                pageSize: me.pageSize,
                page: me.page
            }).then((res)=>{
                me.rangeList = res.list;
                me.total = res.paging.total;
            }).catch((res)=>{

            })
        },
        // 切换页码
        clickBtnChangePage(v) {
            this.getRangeList();
        },
        // 创建参数
        submitCreateRange(){
            var me = this;
            me.isDisabledDo = true;
            me.$refs.rangeCreate.doCreateRange().then(()=>{
                me.showCreateRangeFlag = false;
                me.$kgUtil.alterMessageSuccess("成功创建参数!");
                me.getRangeList();
            }).catch(()=>{
                //dosomething
            }).finally(()=>{
                me.isDisabledDo = false;
            });
        },
        // 选择参数
        selectRangeItem(v){
            this.selectionRangeList = v;
        },
        // 修改参数状态
        clickBtnChangeRangeStatus(v){
            var me = this;
            me.$kgApi.updateRangeStatus({
                oid: [v.oid],
                status: v.status
            }).then((res)=>{
                var msg = (v.status==1)?"启用参数成功":"禁用参数成功";
                me.$kgUtil.alterMessageSuccess(msg);
            }).catch((res)=>{

            })
        },
        // 修改参数 (@developMode@)
        clickBtnGotoRangeModify(){
            var me = this;
            if(me.selectionRangeList.length == 1){
                if(me.selectionRangeList[0].initFlag == 0 || me.$kgConfig.developMode == 1){
                    me.showModifyRangeFlag = true;
                    me.selectionRangeObj = me.selectionRangeList[0];
                }
                else{
                    me.$kgUtil.alterMessageWarning("权限不足，无法修改");
                }
            }else{
                me.$kgUtil.alterMessageWarning("请选择一个参数！");
            }
        },
        // 提交修改参数
        submitModifyRange(){
            var me = this;
            me.isDisabledDo = true;
            me.$refs.rangeModify.doModifyRange().then(()=>{
                me.showModifyRangeFlag = false;
                me.$kgUtil.alterMessageSuccess("成功修改参数!");
                me.getRangeList();
            }).catch(()=>{
                //dosomething
            }).finally(()=>{
                me.isDisabledDo = false;
            });
        },
        // 删除参数
        clickBtnDeleteRange(){
            var me = this;
            if(me.selectionRangeList.length >= 1){
                if(me.selectionRangeList[0].initFlag == 0){
                    me.$confirm('确认删除吗?','提示',{type: 'warning'}).then(() => {
                        var arr = new Array();
                        for(var i = 0; i< me.selectionRangeList.length; i++){
                            arr.push(me.selectionRangeList[i].oid);
                        }
                        me.$kgApi.deleteRange({
                            oidList: arr
                        }).then((res)=>{
                            me.$kgUtil.alterMessageSuccess("删除参数成功!");
                            me.getRangeList();
                        }).catch((res)=>{

                        })
                    })
                    .catch(() => {})
                }
                else{
                    me.$kgUtil.alterMessageWarning("权限不足，无法删除");
                }
            }else{
                me.$kgUtil.alterMessageWarning("请选择一个参数！");
            }
        },
    }
}
</script>

<style scoped lang="scss">
</style>
