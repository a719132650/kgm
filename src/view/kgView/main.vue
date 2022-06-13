<!--
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
-->
<template>
    <el-container class="kgframemain">
        <el-aside width="auto" class="kf-menu">
            <div class="kf-menu-block">
                <div class="kf-menu-logo">
                    <el-image v-if="!this.$kgStore.state.KG_S001" :src="require('@/assets/kgUI/image/logo_140.png')"></el-image>
                    <el-image v-if="this.$kgStore.state.KG_S001" :src="require('@/assets/kgUI/image/logo_small.png')"></el-image>
                </div>
                <div class="kf-menu-con">
                    <el-menu
                    :collapse-transition=false
                    :default-active="this.$kgStore.state.activeCommandKey"
                    :default-openeds="this.$kgStore.state.activeMenuKey"
                    :collapse="this.$kgStore.state.KG_S001"
                    background-color="#2b2c32"
                    text-color="#cccccc"
                    @open="openMenu"
                    @close="closeMenu">
                        <el-submenu v-for="menu in menuList" :key="menu.oid" :index="menu.oid">
                            <template slot="title">
                                <i class="el-icon-s-promotion"></i>
                                <span>{{menu.name}}</span>
                            </template>
                            <el-menu-item v-for="command in menu.children" :key="command.oid" :index="command.oid" @click="clickCommand(command.url,command.oid)">{{command.name}}</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </div>
            </div>
        </el-aside>
        <el-container>
            <el-header height="auto" class="kf-header">
                <div class="kf-header-block">
                    <div class="kf-header-sub-block">
                        <div class="kf-header-collapse" @click="collapseMenu" title="展开/关闭">
                            <span class="kigooo-icon icon-unorderedlist k-fs24"></span>
                        </div>
                        <div class="kf-header-home" @click="gotoHome" title="回到主页">
                            <span class="kigooo-icon icon-home k-fs24"></span>
                        </div>
                        <div class="kf-header-submenu">
                            <el-menu
                                :default-active="this.$kgStore.state.activeSubMenuKey"
                                background-color="#204562"
                                text-color="#ffffff"
                                active-text-color="#ffffff"
                                mode="horizontal">
                                <el-menu-item v-for="subMenu in subMenuList" :key="subMenu.oid" :index="subMenu.oid" @click="clickSubMenu(subMenu.oid)">{{subMenu.name}}</el-menu-item>
                            </el-menu>
                        </div>
                        <el-dropdown placement="bottom-end" @command="clickDropMenu" class="kf-header-user">
                            <div class="kf-header-user-block">
                                  <div class="kf-header-user-head">
                                      <el-avatar :size="36" :src="this.$kgStore.state.loginInfo.headUrl"></el-avatar>
                                  </div>
                                  <div class="kf-header-user-name">
                                      {{this.$kgStore.state.loginInfo.name}}
                                  </div>
                            </div>
                            <el-dropdown-menu slot="dropdown" class="el_dropDowm">
                                <el-dropdown-item command="personal"><i class="el-icon-user"></i>个人中心</el-dropdown-item>
                                <!-- <el-dropdown-item command="msg">
                                  <el-badge :value="999" :max="99" class="item">
                                    <i class="el-icon-bell"></i>通知中心
                                  </el-badge></el-dropdown-item> -->
                                <el-dropdown-item command="logout"><i class="el-icon-switch-button"></i>注销登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="kf-header-quick-block">
                        <el-tabs :value="this.$kgStore.state.activeQuickMenuKey" type="card" @tab-remove="removeQuickMenu" @tab-click="clickQuickMenu" @contextmenu.prevent.native="clickQuickContextmenu">
                            <el-tab-pane
                              :key="item.name"
                              v-for="item in this.$kgStore.state.quickMenus"
                              :label="item.title"
                              :name="item.name"
                              :closable="item.isCloseable">
                            </el-tab-pane>
                        </el-tabs>
                        <ul class="kf-header-quick-contextmenu" :style="`top:${quickContextmenuTop}px; left:${quickContextmenuLeft}px;`" v-show="showQuickContextmenuFlag">
                            <li @click="refreshQuickMenu" v-show="showQuickContextmenuRefreshFlag">刷新</li>
                            <li @click="closeQuickMenu" v-show="showQuickContextmenuCloseFlag">关闭</li>
                            <li @click="closeQuickMenuOther">关闭其他</li>
                            <li @click="closeQuickMenuAll">关闭所有</li>
                        </ul>
                    </div>
                </div>
            </el-header>
            <el-main class="kf-content">
                <transition name="fade" mode="out-in">
                    <router-view ref="content" v-if="isRouterAlive"></router-view>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data () {
        return {
            subMenuList:[], // 三级菜单 树状结构 oid对应index
            menuList:[],// 当前sub下一级菜单列表(左侧)
            showQuickContextmenuFlag:false, //quick menu 右键菜单显示
            showQuickContextmenuRefreshFlag:false, //quick menu 右键刷新显示
            showQuickContextmenuCloseFlag:false, //quick menu 右键关闭显示
            selectedQuickMenuKey:"",  //quick menu 右键选中的item key
            quickContextmenuTop:0,
            quickContextmenuLeft:0,
            isRouterAlive : true, //router-view 是否显示 for 刷新
        }
    },
    created:function(){
        this.doInit();
    },
    watch:{
        showQuickContextmenuFlag:{
            handler(val){
                let fun = () =>{
                    this.showQuickContextmenuFlag = false;
                }
                if(val){
                    document.addEventListener('click', fun);
                }
                else{
                    document.removeEventListener('click', fun);
                }
            }
        }
    },
    methods:{
        //初始化
        async doInit(){
            var me = this;
            //初始化subMenuList
            await me.$kgApi.getSubMenuTreeMy({

            }).then((res)=>{
                me.subMenuList = res.list;
                me.$kgUtil.isEmpty(me.$kgStore.state.activeSubMenuKey) && me.$kgUtilMenu.setActiveSubMenuKey(this.subMenuList[0].oid);
            }).catch((res)=>{

            })
            //初始化menuList
            var subMenuItem = me.$kgUtil.findObjItems(me.subMenuList,"oid",me.$kgStore.state.activeSubMenuKey)
            me.menuList = !me.$kgUtil.isEmpty(subMenuItem) && subMenuItem[0].children;
        },
        // 点击submenu
        clickSubMenu:function(key){
            this.$kgUtilMenu.setActiveSubMenuKey(key);
            var subMenuItem = this.$kgUtil.findObjItems(this.subMenuList,"oid",key);
            this.menuList = !this.$kgUtil.isEmpty(subMenuItem) && subMenuItem[0].children;
        },
        // 点击command
        clickCommand:function(url,key){
            this.$kgUtilMenu.setActiveCommandKey(key);
            this.$kgUtilAuth.kgFaPush(this,url);
        },
        // 点击quick menu
        clickQuickMenu:function(obj){
            var url = obj.name;
            this.$kgUtilAuth.kgFaPush(this,url);
            var activeQuickMenu = this.$kgUtilMenu.getActiveQuickMenu();
            if((!this.$kgUtil.isEmpty(activeQuickMenu)) && (activeQuickMenu.type=="operate" || activeQuickMenu.type=="command")){
                this.$kgUtilMenu.setActiveSubMenuKey(activeQuickMenu.subMenuKey);
                var subMenuItem = this.$kgUtil.findObjItems(this.subMenuList,"oid",activeQuickMenu.subMenuKey);
                this.menuList = !this.$kgUtil.isEmpty(subMenuItem) && subMenuItem[0].children;
                this.$kgUtilMenu.setActiveCommandKey(activeQuickMenu.commandKey);
            }else{
                this.$kgUtilMenu.setActiveCommandKey("");
            }
        },
        // 关闭quick menu
        removeQuickMenu:function(key){
            this.$kgUtilMenu.delQuickMenu(key);
            if(key == this.$kgStore.state.activeQuickMenuKey){
                var quickMenus = this.$kgStore.state.quickMenus;
                var item = quickMenus[quickMenus.length-1];
                this.$kgUtilAuth.kgFaPush(this,item.name);
                if(item.type=="operate" || item.type=="command"){
                    this.$kgUtilMenu.setActiveSubMenuKey(item.subMenuKey);
                    var subMenuItem = this.$kgUtil.findObjItems(this.subMenuList,"oid",item.subMenuKey);
                    this.menuList = !this.$kgUtil.isEmpty(subMenuItem) && subMenuItem[0].children;
                    this.$kgUtilMenu.setActiveCommandKey(item.commandKey);
                }else{
                    this.$kgUtilMenu.setActiveCommandKey("");
                }
            }
        },
        clickQuickContextmenu(e){
            e.preventDefault(); //防止默认菜单弹出
            var activeQuickMenu = this.$kgUtilMenu.getActiveQuickMenu();
            var obj = e.srcElement ? e.srcElement : e.target;
            if (!this.$kgUtil.isEmpty(obj.id)){
                this.selectedQuickMenuKey = obj.id.split("-")[1];
                this.selectedQuickMenuKey == activeQuickMenu.name?this.showQuickContextmenuRefreshFlag = true : this.showQuickContextmenuRefreshFlag = false;
                this.selectedQuickMenuKey == "HomePage"? this.showQuickContextmenuCloseFlag = false : this.showQuickContextmenuCloseFlag = true;
                this.quickContextmenuLeft = e.clientX;
                this.quickContextmenuTop = e.clientY + 10;
                this.showQuickContextmenuFlag = true;
            }
        },
        refreshQuickMenu(){
            this.reload(this.selectedQuickMenuKey);
            this.selectedQuickMenuKey = "";
            this.showQuickContextmenuFlag = false;
            this.showQuickContextmenuRefreshFlag = false;
            this.showQuickContextmenuCloseFlag = false;
        },
        closeQuickMenu(){
            this.removeQuickMenu(this.selectedQuickMenuKey);
            this.selectedQuickMenuKey = "";
            this.showQuickContextmenuFlag = false;
            this.showQuickContextmenuRefreshFlag = false;
            this.showQuickContextmenuCloseFlag = false;
        },
        closeQuickMenuOther(){
            this.$kgUtilMenu.delQuickMenuOther(this.selectedQuickMenuKey);
            if(this.selectedQuickMenuKey != this.$kgStore.state.activeQuickMenuKey){
                var quickMenus = this.$kgStore.state.quickMenus;
                var item = quickMenus[quickMenus.length-1];
                this.$kgUtilAuth.kgFaPush(this,item.name);
                if(item.type=="operate" || item.type=="command"){
                    this.$kgUtilMenu.setActiveSubMenuKey(item.subMenuKey);
                    var subMenuItem = this.$kgUtil.findObjItems(this.subMenuList,"oid",item.subMenuKey);
                    this.menuList = !this.$kgUtil.isEmpty(subMenuItem) && subMenuItem[0].children;
                    this.$kgUtilMenu.setActiveCommandKey(item.commandKey);
                }else{
                    this.$kgUtilMenu.setActiveCommandKey("");
                }
            }
            this.selectedQuickMenuKey = "";
            this.showQuickContextmenuFlag = false;
            this.showQuickContextmenuRefreshFlag = false;
            this.showQuickContextmenuCloseFlag = false;
        },
        closeQuickMenuAll(){
            this.$kgUtilMenu.delQuickMenuAll();
            this.gotoHome();
            this.selectedQuickMenuKey = "";
            this.showQuickContextmenuFlag = false;
            this.showQuickContextmenuRefreshFlag = false;
            this.showQuickContextmenuCloseFlag = false;
        },
        // 点击dropmenu
        clickDropMenu(command) {
            if(command=="logout"){
                this.logout();
            }else if(command=="personal"){
                this.$kgUtilMenu.setActiveCommandKey("");
                this.$kgUtilAuth.kgFaPush(this,"PersonalCenter",{});
            }else if(command=="msg"){
                this.$kgUtilMenu.setActiveCommandKey("");
                this.$kgUtilAuth.kgFaPush(this,"MessageCenter",{});
            }
        },
        // 注销登陆
        logout(){
            var me = this;
            me.$kgApi.logout({

            }).then((res)=>{

            }).catch((res)=>{

            }).finally(()=>{
                me.$kgUtilAuth.logout();
            })
        },
        // 折叠左侧菜单
        collapseMenu(){
            this.$kgUtilMenu.doCollapseMenu();
        },
        // menu打开
        openMenu(key){
            this.$kgUtilMenu.addActiveMenuKey(key);
        },
        // menu关闭
        closeMenu(key){
            this.$kgUtilMenu.delActiveMenuKey(key);
        },
        // 返回主页
        gotoHome(){
            this.$kgUtilMenu.setActiveCommandKey("");
            this.$kgUtilAuth.kgFaPush(this,"HomePage");
        },
        //刷新content
        reload(key){
            this.$kgUtilMenu.setPageData(key,"");
            this.isRouterAlive = false;
            this.$nextTick(function(){
                this.isRouterAlive = true;
            })
        }
    }
}
</script>
<style scoped lang="scss">
</style>
