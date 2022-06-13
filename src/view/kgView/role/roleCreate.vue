<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-1">
        <div class="k-form">
            <div class="k-form-title" v-if="false">
                <span>创建角色</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="20%" label-position="left">
                <!--header-->
                <div class="k-form-header-2">
                    <span class="title">基本信息</span>
                </div>
                <!--1-->
                <el-form-item label="name" prop="name">
                    <el-input v-model="form.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="desc">
                    <el-input v-model="form.description" size="small"></el-input>
                </el-form-item>
                <!--header-->
                <div class="k-form-header-2">
                    <span class="title">菜单授权</span>
                </div>
                <div class="k-form-row" style="justify-content: left;">
                    <div class="k-tree" style="height: 260px;">
                        <kg-menu-tree ref="menuTree" :menuList="menuList" :key="menuTreeKey"></kg-menu-tree>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form:{
                name:"",
                description:""
            },
            menuList:[], // 菜单数据
            menuTreeKey:0,
            rules: this.getFormRule(),
        }
    },
    created:function(){
        this.doInit();
    },
    methods: {
        // 初始化
        doInit(){
            var me = this;
            me.$kgApi.getSubMenuTreeAllForChoice({

            }).then((res)=>{
                me.menuList = res.list;
            }).catch((res)=>{

            })
        },
        // 重置创建表单数据
        resetForm(){
            this.form = {
                name:"",
                description:""
            };
            this.dealMenuTreeKey();
        },
        // 创建确认
        doCreateRole(){
            var me = this;
            return new Promise((resolve, reject) =>{
                var valid = false;
                me.$refs.form.validate((v) => {
                    valid = v;
                })
                if(valid){
                    var name = me.form.name;
                    var description = me.form.description;
                    var userOIDList = [];
                    var menuOIDList = me.$refs.menuTree.getCheckedKeyByType("command");
                    var operateOIDList = me.$refs.menuTree.getCheckedKeyByType("operate");
                    me.$kgApi.createRole({
                        name:name,
                        description:description,
                        userOIDList:userOIDList,
                        operateOIDList:operateOIDList,
                        menuOIDList:menuOIDList
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
        // 重新加载树形控件
        dealMenuTreeKey(){
            this.menuTreeKey = this.menuTreeKey+1;
        },
        // 表单规则
        getFormRule(){
            var rules = {
                name: [
                    { required: true, message: '请输入角色名', trigger: 'blur' },
                ],
            }
            return rules;
        }
    }
}
</script>

<style scoped lang="scss">
</style>
