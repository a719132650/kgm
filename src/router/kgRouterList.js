/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/

const kgRouterList = [
    {
        "path": "*",
        "name": "*",
        "redirect": "/home"
    },
    {
        "path": "/",
        "name": "/",
        "redirect": "/home"
    },
    {
        "path": "/main",
        "name": "/main",
        "redirect": "/home"
    },
    {
        "path": "/login",
        "name": "LoginPage",
        "component": () => import ('@/view/kgView/login')
    },
    {
        "path": "/main",
        "name": "MainPage",
        "component": () => import ('@/view/kgView/main'),
        "children": [
            {
                "path": "/home",
                "name": "HomePage",
                "component": () => import ('@/view/kgView/home'),
                "meta":{quickMenuFlag: "2",pathType: "single",pathName:"首页"}
            },
            {
                "path": "/userManage",
                "name": "UserManage",
                "component": () => import ('@/view/kgView/user/userManage'),
                "meta":{quickMenuFlag: "2",pathType: "command",pathName:"用户管理"}
            },
            {
                "path": "/userDetail",
                "name": "UserDetail",
                "component": () => import ('@/view/kgView/user/userDetail'),
                "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"用户详情"}
            },
            {
                "path": "/userCreate",
                "name": "UserCreate",
                "component": () => import ('@/view/kgView/user/userCreate'),
                "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"用户创建"}
            },
            {
                "path": "/userModify",
                "name": "UserModify",
                "component": () => import ('@/view/kgView/user/userModify'),
                "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"用户修改"}
            },
            {
                "path": "/roleManage",
                "name": "RoleManage",
                "component": () => import ('@/view/kgView/role/roleManage'),
                "meta":{quickMenuFlag: "2",pathType: "command",pathName:"角色管理"}
            },
            {
                "path": "/roleDetail",
                "name": "RoleDetail",
                "component": () => import ('@/view/kgView/role/roleDetail'),
                "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"角色详情"}
            },
            {
                "path": "/roleModify",
                "name": "RoleModify",
                "component": () => import ('@/view/kgView/role/roleModify'),
                "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"角色修改"}
            },
            {
                "path": "/apiManage",
                "name": "ApiManage",
                "component": () => import ('@/view/kgView/api/apiManage'),
                "meta":{quickMenuFlag: "2",pathType: "command",pathName:"API管理"}
            },
            {
                "path": "/apiDetail",
                "name": "ApiDetail",
                "component": () => import ('@/view/kgView/api/apiDetail'),
                "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"API详情"}
            },
            {
                "path": "/apiCreate",
                "name": "ApiCreate",
                "component": () => import ('@/view/kgView/api/apiCreate'),
                "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"API创建"}
            },
            {
                "path": "/apiModify",
                "name": "ApiModify",
                "component": () => import ('@/view/kgView/api/apiModify'),
                "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"API修改"}
            },
            {
                "path": "/menuManage",
                "name": "MenuManage",
                "component": () => import ('@/view/kgView/menu/menuManage'),
                "meta":{quickMenuFlag: "2",pathType: "command",pathName:"菜单管理"}
            },
            {
               "path": "/commandModify",
               "name": "CommandModify",
               "component": () => import ('@/view/kgView/menu/commandModify'),
               "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"菜单修改"}
            },
            {
               "path": "/operateModify",
               "name": "OperateModify",
               "component": () => import ('@/view/kgView/menu/operateModify'),
               "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"操作修改"}
            },
            {
                "path": "/rangeManage",
                "name": "RangeManage",
                "component": () => import ('@/view/kgView/range/rangeManage'),
                "meta":{quickMenuFlag: "2",pathType: "command",pathName:"参数管理"}
            },
            {
                "path": "/rangeCreate",
                "name": "RangeCreate",
                "component": () => import ('@/view/kgView/range/rangeCreate'),
                "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"参数创建"}
            },
            {
                "path": "/rangeModify",
                "name": "RangeModify",
                "component": () => import ('@/view/kgView/range/rangeModify'),
                "meta":{quickMenuFlag: "2",pathType: "operate",pathName:"参数修改"}
            },
            {
                "path": "/personalCenter",
                "name": "PersonalCenter",
                "component": () => import ('@/view/kgView/person/person'),
                "meta":{quickMenuFlag: "2",pathType: "single",pathName:"个人中心"}
            },
        ]
    }
]

export default kgRouterList
