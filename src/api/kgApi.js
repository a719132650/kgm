/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/

import HTTP from '@/api/kgHttp'
import kgConfig from '@/config/kgConfig.js'

var apiBaseUrl = kgConfig.apServer;
var developInit0 = kgConfig.developMode==1?2:0;
var developInit1 = kgConfig.developMode==1?2:1;

const kgApi = {
    //my (7)
    updateUserMy:function(param){return HTTP.POST(apiBaseUrl+'/auth/updateUserMy',param,{loading:true,isShowMsg:true})},
    updateUserPasswordMy:function(param){return HTTP.POST(apiBaseUrl+'/auth/updateUserPasswordMy',param,{loading:true,isShowMsg:true})},
    updateUserHeadUrlMy:function(param){return HTTP.UPLOAD(apiBaseUrl+'/auth/updateUserHeadUrlMy',param,{loading:true,isShowMsg:true})},
    getUserDetailMy:function(param){return HTTP.POST(apiBaseUrl+'/auth/getUserDetailMy',param,{loading:true,isShowMsg:true})},
    getSubMenuTreeMy:function(param){return HTTP.POST(apiBaseUrl+'/auth/getSubMenuTreeMy',param,{loading:true,isShowMsg:true})},
    getOperateByCommandOIDMy:function(param){return HTTP.POST(apiBaseUrl+'/auth/getOperateByCommandOIDMy',param,{loading:false,isShowMsg:true})},
    getDataIdsByRangeIdMy:function(param){return HTTP.POST(apiBaseUrl+'/auth/getDataIdsByRangeIdMy',param,{loading:false,isShowMsg:true})},

    //auth (3)
    login:function(param){return HTTP.POST(apiBaseUrl+'/auth/login',param,{isShowMsg:true,isRes:true,mvc:"none"})},
    logout:function(param){return HTTP.POST(apiBaseUrl+'/auth/logout',param,{loading:true})},
    changeToken:function(param){return HTTP.POST(apiBaseUrl+'/auth/changeToken',param,{isRes:true,mvc:"none"})},

    //user (10)
    createUser:function(param){return HTTP.POST(apiBaseUrl+'/admin/createUser',param,{loading:true,isShowMsg:true})},
    deleteUser:function(param){return HTTP.POST(apiBaseUrl+'/admin/deleteUser',param,{loading:true,isShowMsg:true})},
    updateUser:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateUser',param,{loading:true,isShowMsg:true})},
    updateUserStatus:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateUserStatus',param,{loading:true,isShowMsg:true})},
    updateUserPassword:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateUserPassword',param,{loading:true,isShowMsg:true})},
    getUserDetail:function(param){return HTTP.POST(apiBaseUrl+'/admin/getUserDetail',param,{loading:true,isShowMsg:true})},
    getUserList:function(param){param.init=2;return HTTP.POST(apiBaseUrl+'/admin/getUserList',param,{loading:true,isShowMsg:true});},
    getUserListForChoice:function(param){param.init=developInit0;return HTTP.POST(apiBaseUrl+'/admin/getUserList',param,{loading:true,isShowMsg:true});},
    getUserListNotByRoleOIDForChoice:function(param){param.init=developInit0;return HTTP.POST(apiBaseUrl+'/admin/getUserListNotByRoleOID',param,{loading:true,isShowMsg:true});},
    exportUserList:function(param){return HTTP.DOWNLOAD(apiBaseUrl+'/admin/exportUserList',param,{loading:true,isShowMsg:true})},

    //role (8)
    createRole:function(param){return HTTP.POST(apiBaseUrl+'/admin/createRole',param,{loading:true,isShowMsg:true})},
    deleteRole:function(param){return HTTP.POST(apiBaseUrl+'/admin/deleteRole',param,{loading:true,isShowMsg:true})},
    updateRole:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateRole',param,{loading:true,isShowMsg:true})},
    updateRoleStatus:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateRoleStatus',param,{loading:true,isShowMsg:true})},
    getRoleDetail:function(param){return HTTP.POST(apiBaseUrl+'/admin/getRoleDetail',param,{loading:true,isShowMsg:true})},
    getRoleList:function(param){param.init=2;return HTTP.POST(apiBaseUrl+'/admin/getRoleList',param,{loading:true,isShowMsg:true});},
    getRoleListForChoice:function(param){param.init=developInit0;return HTTP.POST(apiBaseUrl+'/admin/getRoleList',param,{loading:true,isShowMsg:true});},
    exportRoleList:function(param){return HTTP.DOWNLOAD(apiBaseUrl+'/admin/exportRoleList',param,{loading:true,isShowMsg:true})},

    //api (8)
    createApi:function(param){return HTTP.POST(apiBaseUrl+'/admin/createApi',param,{loading:true,isShowMsg:true})},
    deleteApi:function(param){return HTTP.POST(apiBaseUrl+'/admin/deleteApi',param,{loading:true,isShowMsg:true})},
    updateApi:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateApi',param,{loading:true,isShowMsg:true})},
    updateApiStatus:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateApiStatus',param,{loading:true,isShowMsg:true})},
    getApiDetail:function(param){return HTTP.POST(apiBaseUrl+'/admin/getApiDetail',param,{loading:true,isShowMsg:true})},
    getApiList:function(param){param.init=2;return HTTP.POST(apiBaseUrl+'/admin/getApiList',param,{loading:true,isShowMsg:true});},
    getApiListForChoice:function(param){param.init=developInit1;return HTTP.POST(apiBaseUrl+'/admin/getApiList',param,{loading:true,isShowMsg:true});},
    exportApiList:function(param){return HTTP.DOWNLOAD(apiBaseUrl+'/admin/exportApiList',param,{loading:true,isShowMsg:true})},

    //subMenu (5)
    createSubMenu:function(param){return HTTP.POST(apiBaseUrl+'/admin/createSubMenu',param,{loading:true,isShowMsg:true})},
    deleteSubMenu:function(param){return HTTP.POST(apiBaseUrl+'/admin/deleteSubMenu',param,{loading:true,isShowMsg:true})},
    updateSubMenu:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateSubMenu',param,{loading:true,isShowMsg:true})},
    updateSubMenuStatus:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateSubMenuStatus',param,{loading:true,isShowMsg:true})},
    updateSubMenuSort:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateSubMenuSort',param,{loading:true,isShowMsg:true})},

    //menu (5)
    createMenu:function(param){return HTTP.POST(apiBaseUrl+'/admin/createMenu',param,{loading:true,isShowMsg:true})},
    deleteMenu:function(param){return HTTP.POST(apiBaseUrl+'/admin/deleteMenu',param,{loading:true,isShowMsg:true})},
    updateMenu:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateMenu',param,{loading:true,isShowMsg:true})},
    updateMenuStatus:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateMenuStatus',param,{loading:true,isShowMsg:true})},
    updateMenuSort:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateMenuSort',param,{loading:true,isShowMsg:true})},

    //command (6)
    createCommand:function(param){return HTTP.POST(apiBaseUrl+'/admin/createCommand',param,{loading:true,isShowMsg:true})},
    deleteCommand:function(param){return HTTP.POST(apiBaseUrl+'/admin/deleteCommand',param,{loading:true,isShowMsg:true})},
    updateCommand:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateCommand',param,{loading:true,isShowMsg:true})},
    updateCommandStatus:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateCommandStatus',param,{loading:true,isShowMsg:true})},
    updateCommandSort:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateCommandSort',param,{loading:true,isShowMsg:true})},
    getCommandDetail:function(param){return HTTP.POST(apiBaseUrl+'/admin/getCommandDetail',param,{loading:true,isShowMsg:true})},

    //operate (5)
    createOperate:function(param){return HTTP.POST(apiBaseUrl+'/admin/createOperate',param,{loading:true,isShowMsg:true})},
    deleteOperate:function(param){return HTTP.POST(apiBaseUrl+'/admin/deleteOperate',param,{loading:true,isShowMsg:true})},
    updateOperate:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateOperate',param,{loading:true,isShowMsg:true})},
    updateOperateStatus:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateOperateStatus',param,{loading:true,isShowMsg:true})},
    getOperateDetail:function(param){return HTTP.POST(apiBaseUrl+'/admin/getOperateDetail',param,{loading:true,isShowMsg:true})},

    //menuTree (2)
    getSubMenuTree:function(param){param.init=2;return HTTP.POST(apiBaseUrl+'/admin/getSubMenuTreeAll',param,{loading:true,isShowMsg:true});},
    getSubMenuTreeAllForChoice:function(param){param.init=developInit1;return HTTP.POST(apiBaseUrl+'/admin/getSubMenuTreeAll',param,{loading:true,isShowMsg:true});},

    //rel (7)
    createUsers2Role:function(param){return HTTP.POST(apiBaseUrl+'/admin/createUsers2Role',param,{loading:true,isShowMsg:true})},
    deleteUser2Role:function(param){return HTTP.POST(apiBaseUrl+'/admin/deleteUser2Role',param,{loading:true,isShowMsg:true})},
    getUser2RoleByUserOID:function(param){return HTTP.POST(apiBaseUrl+'/admin/getUser2RoleByUserOID',param,{loading:true,isShowMsg:true})},
    getUser2RoleByRoleOID:function(param){return HTTP.POST(apiBaseUrl+'/admin/getUser2RoleByRoleOID',param,{loading:true,isShowMsg:true})},
    createRole2Ranges:function(param){return HTTP.POST(apiBaseUrl+'/admin/createRole2Ranges',param,{loading:false,isShowMsg:false})},
    deleteRole2Range:function(param){return HTTP.POST(apiBaseUrl+'/admin/deleteRole2Range',param,{loading:false,isShowMsg:false})},
    getRole2RangeByRoleOID:function(param){return HTTP.POST(apiBaseUrl+'/admin/getRole2RangeByRoleOID',param,{loading:false,isShowMsg:false})},

    //range (11)
    createRange:function(param){return HTTP.POST(apiBaseUrl+'/admin/createRange',param,{loading:true,isShowMsg:true})},
    deleteRange:function(param){return HTTP.POST(apiBaseUrl+'/admin/deleteRange',param,{loading:true,isShowMsg:true})},
    updateRange:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateRange',param,{loading:true,isShowMsg:true})},
    updateRangeStatus:function(param){return HTTP.POST(apiBaseUrl+'/admin/updateRangeStatus',param,{loading:true,isShowMsg:true})},
    getRangeList:function(param){return HTTP.POST(apiBaseUrl+'/admin/getRangeList',param,{loading:true,isShowMsg:true})},
    getRangeListByRangeId:function(param){return HTTP.POST(apiBaseUrl+'/admin/getRangeListByRangeId',param,{loading:true,isShowMsg:true})},
    getRangeListNotByRoleOID:function(param){return HTTP.POST(apiBaseUrl+'/admin/getRangeListNotByRoleOID',param,{loading:false,isShowMsg:false})},
    getRangeIds:function(param){return HTTP.POST(apiBaseUrl+'/admin/getRangeIds',param,{loading:false,isShowMsg:true})},
    getRangeIdsByDataMode:function(param){return HTTP.POST(apiBaseUrl+'/admin/getRangeIdsByDataMode',param,{loading:false,isShowMsg:false})},
    getRangeDataModes:function(param){return HTTP.POST(apiBaseUrl+'/admin/getRangeDataModes',param,{loading:false,isShowMsg:false})},
    exportRangeList:function(param){return HTTP.DOWNLOAD(apiBaseUrl+'/admin/exportRangeList',param,{loading:true,isShowMsg:true})},
}
export default kgApi
