<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <div class="k-mc-page-2">
        <div class="k-form">
            <div class="k-form-title" v-if="false">
                <span>修改角色</span>
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
                <el-form-item label="description">
                    <el-input v-model="form.description" size="small"></el-input>
                </el-form-item>
                <!--2-->
                <el-form-item label="Status">
                    <el-select v-model="form.status" placeholder="请选择" size="small">
                        <el-option v-for="item in statusRange" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <!--header-->
                <div class="k-form-header-2">
                    <span class="title">菜单授权</span>
                </div>
                <div class="k-form-row" style="justify-content: left;">
                    <div class="k-tree" style="height: 260px;">
                        <kg-menu-tree ref="menuTree" :menuList="menuList" :defaultCheckedKeys="checkedMenuList" :key="menuTreeKey"></kg-menu-tree>
                    </div>
                </div>
            </el-form>
            <div class="k-form-footer">
                <el-button type="primary" :disabled="isDisabled" class="k-btn32 k-mt30 k-mb30" @click="submitUpdateRole()">确定</el-button>
                <el-button class="k-btn32 k-mt30 k-mb30" @click="resetForm()">重置</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form:{
                name:"",
                description:"",
                status:0
            },
            oldForm:{}, // 编辑前角色信息
            statusRange: [], // 状态下拉选项
            menuList:[], // 菜单树形控件数据
            checkedMenuList:[], // 默认选中菜单节点
            menuTreeKey:0, // 树形控件key 重新加载使用
            rules: this.getFormRule(),
            isDisabled:false,
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
            this.statusRange = this.$kgRange.statusRange;
            await this.getRoleDetail();
            this.getSubMenuTreeAllForChoice();
        },
        // 获取角色信息
        async getRoleDetail(){
            var me = this;
            await me.$kgApi.getRoleDetail({
                roleOID:me.$kgUtilMenu.getPageParam("oid")
            }).then((res)=>{
                me.form = res.role;
                me.form.createAt = me.$kgUtilDate.parseTimeStampToTime(me.form.createAt);
                me.form.updateAt = me.$kgUtilDate.parseTimeStampToTime(me.form.updateAt);
                me.dealCheckedMenuList(res.subMenuList);
                me.dealCheckedMenuList(res.menuList);
                me.dealCheckedMenuList(res.commandList);
                me.dealCheckedMenuList(res.operateList);
                Object.assign(me.oldForm,JSON.parse(JSON.stringify(me.form)));
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
        // 重新加载树形控件
        dealMenuTreeKey(){
            this.menuTreeKey = this.menuTreeKey+1;
        },
        // 重置表单数据
        resetForm(){
            Object.assign(this.form,JSON.parse(JSON.stringify(this.oldForm)));
            this.dealMenuTreeKey();
        },
        // 提交修改角色
        submitUpdateRole(){
            var me = this;
            var valid = false;
            me.$refs.form.validate((v) => {
                valid = v;
            })
            if(valid){
                me.isDisabled = true
                me.$kgApi.updateRole({
                    oid:me.$kgUtilMenu.getPageParam("oid"),
                    name:me.form.name,
                    description:me.form.description,
                    status:me.form.status,
                    commandOIDList:me.$refs.menuTree.getCheckedKeyByType("command"),
                    operateOIDList:me.$refs.menuTree.getCheckedKeyByType("operate")
                }).then((res)=>{
                    me.$kgUtil.alterMessageSuccess("更新角色信息成功!");
                    Object.assign(me.oldForm,JSON.parse(JSON.stringify(me.form)));
                    me.getRoleDetail();
                }).catch((res)=>{

                }).finally(()=>{
                    me.isDisabled = false;
                });
            }
        },
        // 处理CheckedMenuList
        dealCheckedMenuList(arr){
            for(var i=0;i<arr.length;i++){
                this.checkedMenuList.push(arr[i].oid || arr[i].toOID);
            }
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
