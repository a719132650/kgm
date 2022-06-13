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
                <span>菜单管理</span>
            </div>
            <div class="k-title-tool">
                <el-button type="primary" v-if="allowOperate.createSubMenu" @click="clickBtnCreate()">创建菜单</el-button>
            </div>
        </div>
        <!--kg table-->
        <div class="k-table">
            <el-table :data="menuList" row-key="oid" :expand-row-keys="expandMenuList" @expand-change="expandFun" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" size="small">
                <el-table-column prop="name" label="name" width="250"></el-table-column>
                <el-table-column prop="sort" label="sort" width="60"></el-table-column>
                <el-table-column prop="url" label="url/description" :formatter="showUrlOrDesc"></el-table-column>
                <el-table-column prop="type" label="type" width="120"></el-table-column>
                <el-table-column prop="status" label="status" width="80">
                    <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.status"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          :active-value="1"
                          :inactive-value="0"
                          :disabled="!(getOperateDisplayFlag(scope.row,4) && scope.row.initFlag == 0)"
                          @change="clickBtnChangeStatus(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="operate">
                    <template slot-scope="scope">
                        <el-button v-if="getOperateDisplayFlag(scope.row,1)" v-show="scope.row.type!='operate'" type="primary" icon="el-icon-plus" @click="clickBtnCreate(scope.row)" size="mini" circle></el-button>
                        <el-button v-if="getOperateDisplayFlag(scope.row,2)" type="success" icon="el-icon-edit" @click="clickBtnUpdate(scope.row)" size="mini" circle></el-button>
                        <el-button v-if="getOperateDisplayFlag(scope.row,3)" v-show="scope.row.type!='operate'" type="warning" icon="el-icon-s-unfold" @click="clickBtnMoveMenu(scope.row)" size="mini" circle></el-button>
                        <el-button v-if="getOperateDisplayFlag(scope.row,5)" type="danger" icon="el-icon-delete" @click="clickBtnDelete(scope.row)" size="mini" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--kg plus-->
        <el-dialog v-if="showCreateCommandFlag" :visible.sync="showCreateCommandFlag" width="60%" top="6vh">
            <div slot="title" class="k-dialog-title">
                <span>- 创建Command -</span>
            </div>
            <command-create ref="commandCreate" :menuOID="createCommandParentOID"></command-create>
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" :disabled="isDisabled" @click="submitCreateCommand()" class="k-btn28">确 定</el-button>
                <el-button @click="showCreateCommandFlag = false" class="k-btn28">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog v-if="showCreateOperateFlag" :visible.sync="showCreateOperateFlag" width="60%" top="6vh">
            <div slot="title" class="k-dialog-title">
                <span>- 创建Operate -</span>
            </div>
            <operate-create ref="operateCreate" :commandOID="createOperateParentOID"></operate-create>
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" :disabled="isDisabled" @click="submitCreateOperate()" class="k-btn28">确 定</el-button>
                <el-button @click="showCreateOperateFlag = false" class="k-btn28">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog v-if="showMoveMenuFlag" :visible.sync="showMoveMenuFlag">
            <div slot="title" class="k-dialog-title">
                <span>- 移动菜单 -</span>
            </div>
            <div class="k-form">
                <el-form ref="form" :model="moveObj" :rules="rules" label-width="100px" label-position="left">
                    <el-form-item label="目标">
                        <el-input v-model="moveObj.name" size="small" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-input v-model="moveObj.type" size="small" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="顺序" class="k-w100p" prop="sort">
                        <el-input v-model="moveObj.sort" size="small"></el-input>
                    </el-form-item>
                    <el-form-item v-if="moveObj.type == 'menu' || moveObj.type == 'command'" label="菜单位置" class="k-w100p">
                        <el-cascader placeholder="移动至菜单" v-model="moveObj.moveTo" :options="moveObj.currentOption"  size="small" class="k-w100p"></el-cascader>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button type="primary" :disabled="isDisabled" @click="submitMoveMenu()" class="k-btn28">确 定</el-button>
                <el-button @click="showMoveMenuFlag = false" class="k-btn28">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import commandCreate from '@/view/kgView/menu/commandCreate.vue'
import operateCreate from '@/view/kgView/menu/operateCreate.vue'

export default {
    components: {commandCreate,operateCreate},
    data () {
        return {
            menuList:[], // 菜单数据
            expandMenuList:[], // 展开项
            showCreateCommandFlag:false, // 创建command模态框显示
            createCommandParentOID:"", // 创建command的ParentOID
            showCreateOperateFlag:false, // 创建operate模态框显示
            createOperateParentOID:"", // 创建operate的ParentOID
            showMoveMenuFlag:false,
            moveObj:{},
            moveObjOld:{},
            moveOption:{
                subMenuOption:[],
                menuOption:[],
            },
            rules: this.getFormRule(),
            isDisabled:false,
            allowOperate:{}
        }
    },
    created:function(){
        var me = this;
        me.$kgUtil.commonInit(me).then(function(res){

        }).catch(()=>{
            me.doInit();
        })
    },
    mounted:function(){

    },
    methods:{
        // 初始化
        async doInit(){
            await this.getMenuList();
            this.dealMoveMenu();
            this.allowOperate = await this.$kgUtil.getAllowOperate();
        },
        // 获取不同type对应按钮权限 (@developMode@)
        getOperateDisplayFlag(data,operateType){
            // operateType 1->create(child) 2->update 3->updateSort 4->updateStatus 5->delete
            var flag = false;
            var allowOperate = this.allowOperate;
            var dataType = data.type;
            if(data.initFlag == 0 || this.$kgConfig.developMode == 1){
                switch (dataType){
                    case "sub menu":
                        if(operateType==1){
                            flag = allowOperate.createMenu;
                        }else if(operateType==2){
                            flag = allowOperate.updateSubMenu;
                        }else if(operateType==3){
                            flag = allowOperate.updateSubMenuSort;
                        }else if(operateType==4){
                            flag = allowOperate.updateSubMenuStatus;
                        }else if(operateType==5){
                            flag = allowOperate.deleteSubMenu;
                        }
                        break;
                    case "menu":
                        if(operateType==1){
                            flag = allowOperate.createCommand;
                        }else if(operateType==2){
                            flag = allowOperate.updateMenu;
                        }else if(operateType==3){
                            flag = allowOperate.updateMenuSort;
                        }else if(operateType==4){
                            flag = allowOperate.updateMenuStatus;
                        }else if(operateType==5){
                            flag = allowOperate.deleteMenu;
                        }
                        break;
                    case "command":
                        if(operateType==1){
                            flag = allowOperate.createOperate;
                        }else if(operateType==2){
                            flag = allowOperate.updateCommand;
                        }else if(operateType==3){
                            flag = allowOperate.updateCommandSort;
                        }else if(operateType==4){
                            flag = allowOperate.updateCommandStatus;
                        }else if(operateType==5){
                            flag = allowOperate.deleteCommand;
                        }
                        break;
                    case "operate":
                        if(operateType==1){
                            flag = true;
                        }else if(operateType==2){
                            flag = allowOperate.updateOperate;
                        }else if(operateType==3){
                            flag = true;
                        }else if(operateType==4){
                            flag = allowOperate.updateOperateStatus;
                        }else if(operateType==5){
                            flag = allowOperate.deleteOperate;
                        }
                        break;
                }
            }
            return flag;
        },
        // 获取菜单数据
        async getMenuList(){
            var me = this;
            await me.$kgApi.getSubMenuTree({

            }).then((res)=>{
                me.menuList = res.list;
            }).catch((res)=>{

            })
        },
        // 创建菜单判断
        clickBtnCreate(v){
            if(v === undefined){
                this.doCreateSubMenu();
            }else{
                (v.type == "sub menu") && this.doCreateMenu(v);
                (v.type == "menu") && (this.createCommandParentOID = v.oid) && (this.showCreateCommandFlag = true);
                (v.type == "command") && (this.createOperateParentOID = v.oid) && (this.showCreateOperateFlag = true);
            }
        },
        // 创建SubMenu
        doCreateSubMenu(){
            var me = this;
            me.$prompt('root -> SubMenu名称：', '新增 SubMenu', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputErrorMessage: '请输入菜单名',
                inputValidator:value=>{
                    return !me.$kgUtil.isEmpty(value);
                }
            }).then(({ value }) => {
                me.$kgApi.createSubMenu({
                    name:value
                }).then((res)=>{
                    me.getMenuList();
                    me.$kgUtil.alterMessageSuccess("创建菜单成功!");
                }).catch((res)=>{
                    me.$kgUtil.alterMessageError("系统异常");
                })
            }).catch(() => {
                (e!="cancel") && me.$kgUtil.alterMessageError("系统异常");
            })
        },
        // 创建Menu
        doCreateMenu(v){
            var me = this;
            me.$prompt('SubMenu['+v.name+'] -> Menu名称：', '新增 Menu', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputErrorMessage: '请输入菜单名',
                inputValidator:value=>{
                    return !me.$kgUtil.isEmpty(value);
                }
            }).then(({ value }) => {
                me.$kgApi.createMenu({
                    subMenuOID:v.oid,
                    name:value
                }).then((res)=>{
                    me.getMenuList();
                    me.$kgUtil.alterMessageSuccess("创建菜单成功!");
                }).catch((res)=>{
                    me.$kgUtil.alterMessageError("系统异常");
                })
            }).catch(() => {
                (e!="cancel") && me.$kgUtil.alterMessageError("系统异常");
            })
        },
        // 创建Command
        submitCreateCommand(){
            var me = this;
            me.isDisabled = true;
            me.$refs.commandCreate.doCreateCommand().then(()=>{
                me.showCreateCommandFlag = false;
                me.$kgUtil.alterMessageSuccess("创建Command成功!");
                me.getMenuList();
            }).catch(()=>{
                //dosomething
            }).finally(()=>{
                me.isDisabled = false;
            });
        },
        // 创建Operate
        submitCreateOperate(){
            var me = this;
            me.isDisabled = true;
            me.$refs.operateCreate.doCreateOperate().then(()=>{
                me.showCreateOperateFlag = false;
                me.$kgUtil.alterMessageSuccess("创建Operate成功!");
                me.getMenuList();
            }).catch(()=>{
                //dosomething
            }).finally(()=>{
                me.isDisabled = false;
            });
        },
        //修改菜单判断
        clickBtnUpdate(v){
            (v.type == "sub menu") && this.doUpdateSubMenu(v);
            (v.type == "menu") && this.doUpdateMenu(v);
            (v.type == "command") && (this.$kgUtil.kgPush(this,"CommandModify",{oid:v.oid}));
            (v.type == "operate") && (this.$kgUtil.kgPush(this,"OperateModify",{oid:v.oid}));
        },
        //修改SubMenu
        doUpdateSubMenu(v){
            var me = this;
            me.$prompt("名称：", '修改 SubMenu', {
                inputValue:v.name,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputErrorMessage: '请输入菜单名',
                inputValidator:value=>{
                    return !me.$kgUtil.isEmpty(value);
                }
            }).then(({ value }) => {
                me.$kgApi.updateSubMenu({
                    oid:v.oid,
                    name:value
                }).then((res)=>{
                    me.getMenuList();
                    me.$kgUtil.alterMessageSuccess("修改菜单成功!");
                }).catch((res)=>{
                    me.$kgUtil.alterMessageError("系统异常");
                })
            }).catch(() => {
                (e!="cancel") && me.$kgUtil.alterMessageError("系统异常");
            })
        },
        //修改Menu
        doUpdateMenu(v){
            var me = this;
            me.$prompt("名称：", '修改 Menu', {
                inputValue:v.name,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputErrorMessage: '请输入菜单名',
                inputValidator:value=>{
                    return !me.$kgUtil.isEmpty(value);
                }
            }).then(({ value }) => {
                me.$kgApi.updateMenu({
                    oid:v.oid,
                    name:value
                }).then((res)=>{
                    me.getMenuList();
                    me.$kgUtil.alterMessageSuccess("修改菜单成功!");
                }).catch((res)=>{

                })
            }).catch(() => {
                (e!="cancel") && me.$kgUtil.alterMessageError("系统异常");
            })
        },
        // 修改菜单状态
        clickBtnChangeStatus(v){
            var me = this;
            (v.type == "sub menu") && me.$kgApi.updateSubMenuStatus({
                subMenuOIDList:[v.oid],
                status:v.status
            }).then((res)=>{
                var msg = (v.status==1)?"启用SubMenu成功":"禁用SubMenu成功";
                me.$kgUtil.alterMessageSuccess(msg);
                me.getMenuList();
            }).catch((res)=>{

            });
            (v.type == "menu") && me.$kgApi.updateMenuStatus({
                menuOIDList:[v.oid],
                status:v.status
            }).then((res)=>{
                var msg = (v.status==1)?"启用Menu成功":"禁用Menu成功";
                me.$kgUtil.alterMessageSuccess(msg);
                me.getMenuList();
            }).catch((res)=>{

            });
            (v.type == "command") && me.$kgApi.updateCommandStatus({
                commandOIDList:[v.oid],
                status:v.status
            }).then((res)=>{
                var msg = (v.status==1)?"启用Command成功":"禁用Command成功";
                me.$kgUtil.alterMessageSuccess(msg);
                me.getMenuList();
            }).catch((res)=>{

            });
            (v.type == "operate") && me.$kgApi.updateOperateStatus({
                operateOIDList:[v.oid],
                status:v.status
            }).then((res)=>{
                var msg = (v.status==1)?"启用Operate成功":"禁用Operate成功";
                me.$kgUtil.alterMessageSuccess(msg);
                me.getMenuList();
            }).catch((res)=>{

            });
        },
        // 删除菜单
        clickBtnDelete(v){
            var me = this;
            if(v.initFlag == 0){
                me.$confirm('确认删除吗?','提示',{type: 'warning'}).then(() => {
                    (v.type == "sub menu") && me.$kgApi.deleteSubMenu({
                        subMenuOID:v.oid
                    }).then((res)=>{
                        me.$kgUtil.alterMessageSuccess("删除SubMenu成功");
                        me.getMenuList();
                    }).catch((res)=>{

                    });
                    (v.type == "menu") && me.$kgApi.deleteMenu({
                        menuOID:v.oid
                    }).then((res)=>{
                        me.$kgUtil.alterMessageSuccess("删除Menu成功");
                        me.getMenuList();
                    }).catch((res)=>{

                    });
                    (v.type == "command") && me.$kgApi.deleteCommand({
                        commandOID:v.oid
                    }).then((res)=>{
                        me.$kgUtil.alterMessageSuccess("删除Command成功");
                        me.getMenuList();
                    }).catch((res)=>{

                    });
                    (v.type == "operate") && me.$kgApi.deleteOperate({
                        operateOID:v.oid
                    }).then((res)=>{
                        me.$kgUtil.alterMessageSuccess("删除Operate成功");
                        me.getMenuList();
                    }).catch((res)=>{

                    });
                }).catch(()=>{
                    //dosomething
                })
            }
            else{
                me.$kgUtil.alterMessageWarning("权限不足，无法操作");
            }
        },
        // 点击移动菜单
        clickBtnMoveMenu(v){
            var me = this;
            me.showMoveMenuFlag = true;
            me.moveObj = v;
            if(v.type == "menu"){
                me.moveObj.currentOption = me.moveOption.subMenuOption;
                me.moveObj.moveTo = [v.subMenuOid]
            }
            if(v.type == "command"){
                me.moveObj.currentOption = me.moveOption.menuOption;
                var subMenuOid = "";
                me.moveObj.currentOption.some(item => {
                    !me.$kgUtil.isEmpty(item.children) && item.children.some(c =>{
                        c.value == v.menuOid?(subMenuOid = item.value):'';
                    })
                })
                me.moveObj.moveTo = [subMenuOid,v.menuOid];
            }
            Object.assign(me.moveObjOld,JSON.parse(JSON.stringify(me.moveObj)));
        },
        // 提交移动菜单
        async submitMoveMenu(){
            var me = this;
            me.isDisabled = true;
            if(me.moveObj.type == "sub menu"){
                await me.$kgApi.updateSubMenuSort({
                    subMenuOID:me.moveObj.oid,
                    sort:me.moveObj.sort
                }).then((res)=>{
                    me.$kgUtil.alterMessageSuccess("移动菜单成功!");
                }).catch((res)=>{

                }).finally(()=>{
                    me.isDisabled = false;
                });
            }else if(me.moveObj.type == "menu"){
                await me.$kgApi.updateMenuSort({
                    oid:me.moveObj.oid,
                    name:me.moveObj.name,
                    sort:me.moveObj.sort,
                    status:me.moveObj.status,
                    subMenuOID:me.moveObj.moveTo
                }).then((res)=>{
                    me.$kgUtil.alterMessageSuccess("移动菜单成功!");
                }).catch((res)=>{

                }).finally(()=>{
                    me.isDisabled = false;
                });
            }else if(me.moveObj.type == "command"){
                await me.$kgApi.updateCommandSort({
                    oid:me.moveObj.oid,
                    name:me.moveObj.name,
                    sort:me.moveObj.sort,
                    status:me.moveObj.status,
                    url:me.moveObj.url,
                    menuOID:me.moveObj.moveTo[1]
                }).then((res)=>{
                    me.$kgUtil.alterMessageSuccess("移动菜单成功!");
                }).catch((res)=>{

                }).finally(()=>{
                    me.isDisabled = false;
                });
            }
            me.showMoveMenuFlag = false;
            me.getMenuList();
        },
        // 处理移动菜单选项
        dealMoveMenu(){
            var subMenuOption = [];
            var menuOption = [];
            this.menuList.forEach(item => {
                subMenuOption.push({value:item.oid,label:item.name});
                var children = [];
                !this.$kgUtil.isEmpty(item.children) && item.children.forEach(c => {
                    children.push({value:c.oid,label:c.name});
                })
                menuOption.push({value:item.oid,label:item.name,children:children});
            })
            this.moveOption.subMenuOption = subMenuOption;
            this.moveOption.menuOption = menuOption;
        },
        // 表格url/desc栏位显示
        showUrlOrDesc(row,index){
            return row.url || row.description;
        },
        // 数据域展开
        expandFun(row,behaviour){
            if(behaviour){
                this.expandMenuList.push(row.oid);
            }else{
                this.expandMenuList.remove(row.oid);
            }
        },
        // 表单规则
        getFormRule(){
            var rules = {
                sort: [
                    { required: true, trigger: 'blur',validator:this.validatorSort},
                ],
            }
            return rules;
        },
        validatorSort(rule, value, callback){
            if(this.$kgUtil.isEmpty(value)){
                callback(new Error('请输入顺位'));
            }else{
                if(isNaN(value) || value<=0){
                    callback(new Error('请输入大于零的数值'));
                }else{
                    callback();
                }
            }
        }
    }
}
</script>
<style scoped lang="scss">
.k-table{
    width: calc(100% - 24px)!important;
    padding: 0 12px!important;
}
</style>
