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
                <span>API管理</span>
            </div>
            <div class="k-title-tool">
                <el-button type="primary" v-if="allowOperate.createApi" @click="showCreateApiFlag = true">创建API</el-button>
                <el-button type="primary" v-if="allowOperate.updateApi" @click="clickBtnGotoApiModify()">修改API</el-button>
                <el-button type="primary" v-if="allowOperate.deleteApi" @click="clickBtnDeleteApi()">删除API</el-button>
            </div>
        </div>
        <!--kg search-->
        <div class="k-search">
            <div class="k-search-item">
                <span>名称</span>
                <el-input placeholder="请输入API名称" v-model="searchParam.name" />
            </div>
            <div class="k-search-item">
                <span>类型</span>
                <el-select v-model="searchParam.businessType" placeholder="请选择">
                    <el-option
                      v-for="businessType in businessTypeRange"
                      :key="businessType.id"
                      :label="businessType.label"
                      :value="businessType.id">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" @click="clickBtnSearchApi()">查询</el-button>
            <el-button v-if="allowOperate.exportApiList" @click="clickBtnExportApi()" class="k-searchBtnExport">导出</el-button>
            <el-button @click="resetSearch()">重置</el-button>
            <el-button @click="collapseSearchInput()" class="k-searchBtnCollapse" v-show="!showSearchInputFlag">展开<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-button @click="collapseSearchInput()" class="k-searchBtnCollapse" v-show="showSearchInputFlag">收起<i class="el-icon-arrow-up el-icon--right"></i></el-button>
        </div>
        <!--kg table-->
        <div class="k-table">
            <el-table ref="apiList" :data="apiList" @selection-change="selectApiItem" size="small">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="name">
                    <template slot-scope="scope">
                        <a title="点击查看" @click.prevent="clickBtnGotoApiDetail(scope.row.oid)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="api" label="api" width="250"></el-table-column>
                <el-table-column prop="businessType" label="businessType"></el-table-column>
                <el-table-column prop="authType" label="authType"></el-table-column>
                <el-table-column prop="description" label="description"></el-table-column>
                <el-table-column label="status">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0"
                            :disabled="!(allowOperate.updateApiStatus && scope.row.initFlag == 0)"
                            @change="clickBtnChangeApiStatus(scope.row)">
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
        <el-dialog v-if="showCreateApiFlag" :visible.sync="showCreateApiFlag" width="60%" top="8vh">
            <div slot="title" class="k-dialog-title">
                <span>- 创建API -</span>
            </div>
            <api-create ref="apiCreate"></api-create>
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" :disabled="isDisabledCreateApi" @click="submitCreateApi()" class="k-btn32">确 定</el-button>
                <el-button @click="showCreateApiFlag = false" class="k-btn32">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import apiCreate from '@/view/kgView/api/apiCreate.vue'

export default {
    components: {apiCreate},
    data () {
        return {
            // kg search
            showSearchInputFlag:false,
            searchParam:{
                name:"",
                businessType:[],
            },
            resetSearchParam:{
                name:"",
                businessType:[],
            },
            currentSearchParam:{},
            // kg operate
            allowOperate:{},
            // main
            apiList:[],
            selectionApiList:[],
            page:1,
            pageSize:10,
            total:0,
            // create
            showCreateApiFlag: false,
            isDisabledCreateApi:false,
            // range
            businessTypeRange:[],
        }
    },
    created:function(){
        var me = this;
        me.$kgUtil.commonInit(me).then(function(res){
            me.$kgUtil.selectInit(me.$refs.apiList,me.apiList,me.selectionApiList);
        }).catch(()=>{
            me.doInit();
        })
    },
    methods: {
        // init
        async doInit(){
            this.getApiList();
            this.getBusinessTypeRange();
            this.allowOperate = await this.$kgUtil.getAllowOperate();
        },
        getBusinessTypeRange(){
            var me = this;
            me.$kgUtil.getRange("sys_api_business_type").then(function(res){
                me.businessTypeRange = res;
            }).catch((res)=>{

            })
        },
        // kg search
        clickBtnSearchApi(){
            Object.assign(this.currentSearchParam,JSON.parse(JSON.stringify(this.searchParam)));
            this.page = 1;
            this.getApiList();
        },
        clickBtnExportApi(){
            var me = this;
            me.$kgApi.exportApiList({
                condition: me.currentSearchParam.name,
                businessTypeList:me.currentSearchParam.businessType
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
        // 获取API
        getApiList(){
            var me = this;
            me.$kgApi.getApiList({
                condition: me.currentSearchParam.name,
                pageSize: me.pageSize,
                page: me.page,
                businessTypeList:me.currentSearchParam.businessType
            }).then((res)=>{
                me.apiList = res.list;
                me.dealApiList();
                me.total = res.paging.total;
            }).catch((res)=>{

            })
        },
        // 处理数据
        dealApiList(){
            for(var i = 0; i < this.apiList.length; i++){
                this.apiList[i].authType = this.$kgUtilAuth.formatApiAuth(this.apiList[i].authType);
            }
        },
        // 切换页码
        clickBtnChangePage(v) {
            this.getApiList();
        },
        // 创建API
        submitCreateApi(){
            var me = this;
            me.isDisabledCreateApi = true;
            me.$refs.apiCreate.doCreateApi().then(()=>{
                me.showCreateApiFlag = false;
                me.$kgUtil.alterMessageSuccess("成功创建API!");
                me.getApiList();
            }).catch(()=>{
                //dosomething
            }).finally(()=>{
                me.isDisabledCreateApi = false;
            });
        },
        // 选择
        selectApiItem(v){
            this.selectionApiList = v;
        },
        // 查看详情
        clickBtnGotoApiDetail(v){
           this.$kgUtil.kgPush(this,"ApiDetail",{oid:v});
        },
        // 修改Api状态
        clickBtnChangeApiStatus(v){
            var me = this;
            me.$kgApi.updateApiStatus({
                apiOIDList: [v.oid],
                status: v.status
            }).then((res)=>{
                var msg = (v.status==1)?"启用API成功":"禁用API成功";
                me.$kgUtil.alterMessageSuccess(msg);
            }).catch((res)=>{

            })
        },
        // 修改API (@developMode@)
        clickBtnGotoApiModify(){
            var me = this;
            if(me.selectionApiList.length == 1){
                if(me.selectionApiList[0].initFlag == 0 || me.$kgConfig.developMode == 1){
                    me.$kgUtil.kgPush(me,"ApiModify",{oid:me.selectionApiList[0].oid});
                }
                else{
                    me.$kgUtil.alterMessageWarning("权限不足，无法操作");
                }
            }else{
                me.$kgUtil.alterMessageWarning("请选择一个API！");
            }
        },
        // 删除API
        clickBtnDeleteApi(){
            var me = this;
            if(me.selectionApiList.length == 1){
                if(me.selectionApiList[0].initFlag == 0){
                    me.$confirm('确认删除吗?','提示',{type: 'warning'}).then(() => {
                        me.$kgApi.deleteApi({
                            apiOID: me.selectionApiList[0].oid
                        }).then((res)=>{
                            me.$kgUtil.alterMessageSuccess("删除API成功!");
                            me.getApiList();
                        }).catch((res)=>{

                        })
                    })
                    .catch(() => {})
                }
                else{
                    me.$kgUtil.alterMessageWarning("权限不足，无法操作");
                }
            }else{
                me.$kgUtil.alterMessageWarning("请选择一个API！");
            }
        },
    }
}
</script>

<style scoped lang="scss">
</style>
