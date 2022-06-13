<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-1">
        <div class="k-form">
            <div class="k-form-title" v-if="false">
                <span>创建参数</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
                <!--header-->
                <div class="k-form-header-2">
                    <span class="title">基本信息</span>
                </div>
                <!--1-->
                <el-form-item label="dataMode" prop="dataMode">
                    <el-autocomplete class="inline-input" v-model="form.dataMode" :fetch-suggestions="querySearchDataMode" size="small"></el-autocomplete>
                </el-form-item>
                <el-form-item label="rangeID" prop="rangeId">
                    <el-autocomplete class="inline-input" v-model="form.rangeId" :fetch-suggestions="querySearch" size="small"></el-autocomplete>
                </el-form-item>
                <el-form-item label="value" prop="id">
                    <el-input v-model="form.id" size="small"></el-input>
                </el-form-item>
                <el-form-item label="label" prop="label">
                    <el-input v-model="form.label" size="small"></el-input>
                </el-form-item>
                <el-form-item label="description">
                    <el-input v-model="form.description" size="small"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form:{
                dataMode:"",
                rangeId:"",
                id:"",
                label:"",
                description:""
            },
            restaurants:[],
            dataModeList:[],
            rules: this.getFormRule(),
        }
    },
    created:function(){
        this.doInit();
    },
    methods: {
        // 初始化
        doInit(){
            this.getRangeIds();
            this.getRangeDataModes();
        },
        getRangeDataModes(){
            var me = this;
            me.$kgApi.getRangeDataModes({

            }).then((res)=>{
                var arr = new Array();
                for(var i = 0; i < res.list.length; i++){
                    arr.push({"value":res.list[i]});
                }
                me.dataModeList = arr;
            }).catch((res)=>{

            });
        },
        // 获取rangeID集合
        getRangeIds(){
            var me = this;
            me.$kgApi.getRangeIds({

            }).then((res)=>{
                var arr = new Array();
                for(var i = 0; i < res.list.length; i++){
                    arr.push({"value":res.list[i]});
                }
                this.restaurants = arr;
            }).catch((res)=>{

            })
        },
        // 输入建议获取
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            cb(results);
        },
        // 输入建议获取
        querySearchDataMode(queryString, cb) {
            var dataModeList = this.dataModeList;
            var results = queryString ? dataModeList.filter(this.createFilter(queryString)) : dataModeList;
            cb(results);
        },
        // 过滤
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        // 重置创建表单数据
        resetForm(){
            this.form = {
                rangeId:"",
                id:"",
                label:"",
                description:""
            };
        },
        // 创建确认
        doCreateRange(){
            var me = this;
            return new Promise((resolve, reject) =>{
                var valid = false;
                me.$refs.form.validate((v) => {
                    valid = v;
                })
                if(valid){
                    me.$kgApi.createRange({
                        dataMode:me.form.dataMode,
                        rangeId:me.form.rangeId,
                        id:me.form.id,
                        label:me.form.label,
                        description:me.form.description
                    }).then((res)=>{
                        return resolve(res);
                    }).catch((res)=>{
                        return reject(res);
                    })
                }else{
                    return reject();
                }
            })
        },
        // 表单规则
        getFormRule(){
            var rules = {
                dataMode: [
                    { required: true, message: '请输入dataMode', trigger: 'blur' },
                ],
                rangeId: [
                    { required: true, message: '请输入rangeID', trigger: 'blur' },
                ],
                id: [
                    { required: true, message: '请输入value', trigger: 'blur' },
                ],
                label: [
                    { required: true, message: '请输入label', trigger: 'blur' },
                ],
            }
            return rules;
        }
    }
}
</script>
<style scoped lang="scss">
</style>
