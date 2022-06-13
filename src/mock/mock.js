import Mock from 'mockjs';

Mock.mock('/login', { //输出数据
    'name': '@name', //随机生成姓名
    //还可以自定义其他数据
});
Mock.mock('/logout', {});
Mock.mock('/createUser', {});
Mock.mock('/updateUser', {});
Mock.mock('/createUser2Role', {});
Mock.mock('/updateUserStatus', {});
Mock.mock('/getUserFullInfo', {
  "code": 0,
  "msg": "Success",
  "data": {
    "user":{
      "oid":"100000001",
      "u_account":"wuqing",
      "u_password":"b31892386756aa3c62f5fee1c1fae24b",
      "u_name":"wuqing",
      "phone":"123456",
      "head_url":"http://xxx.xxx/xx/png",
      "sex":"1",
      "last_login_at":"1623301804168",
      "create_at":"1623301804168",
      "update_at":"1623301804168",
      "delete_at":"1623301804168",
      "status":"1"
    }
  }
});
Mock.mock('/getMenus', {
    "code": 0,
    "msg": "Success",
    "data": {
      "list": [
        {
          "oid": "100000000000",
          "name": "系统管理",
          "sort": 1,
          "url": null,
          "children": [
            {
              "oid": "100000000001",
              "name": "Admin",
              "sort": 1,
              "url": null,
              "children": [
                {
                  "oid": "100000000011",
                  "name": "用户管理",
                  "sort": 1,
                  "url": "UserManage",
                  "children": null
                },
                {
                  "oid": "100000000012",
                  "name": "角色管理",
                  "sort": 2,
                  "url": "RoleManage",
                  "children": null
                },
                {
                  "oid": "102000000013",
                  "name": "菜单管理",
                  "sort": 3,
                  "url": "MenuManage",
                  "children": null
                },{
                  "oid": "100000222013",
                  "name": "API管理",
                  "sort": 3,
                  "url": "ApiManage",
                  "children": null
                },{
                  "oid": "100200000013",
                  "name": "操作管理",
                  "sort": 3,
                  "url": "test2",
                  "children": null
                }
              ]
            },
            {
              "oid": "100000000014",
              "name": "menu 1-2",
              "sort": 2,
              "url": null,
              "children": [
                {
                  "oid": "100000000015",
                  "name": "menu1 1-2-1",
                  "sort": 1,
                  "url": "test3",
                  "children": null
                },
                {
                  "oid": "100000000016",
                  "name": "menu1 1-2-2",
                  "sort": 2,
                  "url": "test4",
                  "children": null
                }
              ]
            },
            {
              "oid": "100000000017",
              "name": "menu 1-3",
              "sort": 3,
              "url": null,
              "children": [
                {
                  "oid": "100000000018",
                  "name": "menu1 1-3-1",
                  "sort": 1,
                  "url": "test5",
                  "children": null
                },
                {
                  "oid": "100000000019",
                  "name": "menu1 1-3-2",
                  "sort": 2,
                  "url": "test6",
                  "children": null
                }
              ]
            }
          ]
        },
        {
          "oid": "100000000020",
          "name": "系统监控",
          "sort": 2,
          "url": null,
          "children": [
            {
              "oid": "100000000021",
              "name": "menu 2-1",
              "sort": 1,
              "url": null,
              "children": [
                {
                  "oid": "100000000022",
                  "name": "menu1 2-1-1",
                  "sort": 1,
                  "url": "test7",
                  "children": null
                }
              ]
            },
            {
              "oid": "100000000023",
              "name": "menu 2-2",
              "sort": 2,
              "url": null,
              "children": [
                {
                  "oid": "100000000024",
                  "name": "menu1 2-2-1",
                  "sort": 1,
                  "url": "test8",
                  "children": null
                },
                {
                  "oid": "100000000025",
                  "name": "menu1 2-2-2",
                  "sort": 2,
                  "url": "test9",
                  "children": null
                }
              ]
            }
          ]
        },
        {
          "oid": "100000000026",
          "name": "业务模块",
          "sort": 3,
          "url": null,
          "children": [
            {
              "oid": "100000000027",
              "name": "menu 3-1",
              "sort": 1,
              "url": null,
              "children": [
                {
                  "oid": "100000000028",
                  "name": "menu1 3-1-1",
                  "sort": 1,
                  "url": "test10",
                  "children": null
                }
              ]
            },
            {
              "oid": "100000000029",
              "name": "menu 3-2",
              "sort": 2,
              "url": null,
              "children": [
                {
                  "oid": "100000000030",
                  "name": "menu1 3-2-1",
                  "sort": 1,
                  "url": "test11",
                  "children": null
                }
              ]
            },
            {
              "oid": "100000000031",
              "name": "menu 3-3",
              "sort": 3,
              "url": null,
              "children": [
                {
                  "oid": "100000000032",
                  "name": "menu1 3-3-1",
                  "sort": 1,
                  "url": "test12",
                  "children": null
                }
              ]
            }
          ]
        }
      ]
    }
  });

Mock.mock('/getAllUsers', {
  "code": 0,
  "msg": "Success",
  "data": {
    "list": [
      {
        "oid": "100000000001",
        "createAt": 0,
        "updateAt": 0,
        "deleteAt": 0,
        "uAccount": "wuqing",
        "uPassword": "b31892386756aa3c62f5fee1c1fae24b",
        "uName": "wuqing",
        "phone": null,
        "headUrl": null,
        "sex": null,
        "lastLoginAt": 1623301804168,
        "status": 1
      },
      {
        "oid": "100000000002",
        "createAt": 1620108792931,
        "updateAt": 0,
        "deleteAt": 0,
        "uAccount": "wuqing2",
        "uPassword": "b31892386756aa3c62f5fee1c1fae24b",
        "uName": "wuqing",
        "phone": "111111",
        "headUrl": "",
        "sex": "1",
        "lastLoginAt": 1620886523417,
        "status": 0
      },
      {
        "oid": "100000000003",
        "createAt": 1620109459792,
        "updateAt": 0,
        "deleteAt": 0,
        "uAccount": "wuqing3",
        "uPassword": "b31892386756aa3c62f5fee1c1fae24b",
        "uName": "wuqing",
        "phone": "111111",
        "headUrl": "",
        "sex": "1",
        "lastLoginAt": 0,
        "status": 1
      },
      {
        "oid": "100000000004",
        "createAt": 0,
        "updateAt": 0,
        "deleteAt": 0,
        "uAccount": "1",
        "uPassword": "b31892386756aa3c62f5fee1c1fae24b",
        "uName": "wuqing",
        "phone": null,
        "headUrl": null,
        "sex": null,
        "lastLoginAt": 1622773037947,
        "status": 1
      }
    ],"paging":{
      "page":1,
      "pageSize":10,
      "pageTotal":100,
      "total":99
    }
  }
});

Mock.mock('/getUserByOid', {
  "code": 0,
  "msg": "Success",
  "data": {
    "user": {
      "oid": "100000000001",
      "createAt": 0,
      "updateAt": 0,
      "deleteAt": 0,
      "uAccount": "wuqing",
      "uPassword": "b31892386756aa3c62f5fee1c1fae24b",
      "uName": null,
      "phone": null,
      "headUrl": null,
      "sex": null,
      "lastLoginAt": 1623301804168,
      "status": 1
    }
  }
});
Mock.mock('/getRoleByOid', {
  "code": 0,
  "msg": "Success",
  "data": {
    "role": {
      "oid": "100000000001",
      "name": "Admin",
      "description": "The Role For Admin",
      "status": 1,
      "create_at": "1623301804168",
      "update_at": "1623301804168",
      "delete_at": "1623301804168"
    }
  }
});

Mock.mock('/getAllRoles', {
  "code": 0,
  "msg": "Success",
  "data": {
    "list": [{
      "oid": "100000000001",
      "name": "ADMIN",
      "description":"The Role For Admin",
      "status":1
    },{
      "oid": "100000000002",
      "name": "USER",
      "description":"The Role For Common User",
      "status":0
    }]
  }
});
Mock.mock('/getRolesByUserOID', {
  "code": 0,
  "msg": "Success",
  "data": {
    "list": [{
      "oid": "100000000001",
      "name": "ADMIN"
    }]
  }
});
Mock.mock('/getAuthorizedOIDByRole', {
  "code": 0,
  "msg": "Success",
  "data": {
      "list":["删除操作"]
  }
});
Mock.mock('/getAuthorizedMenuOIDByRole', {
  "code": 0,
  "msg": "Success",
  "data": {
      "list":["角色管理"]
  }
});
Mock.mock('/getAuthorizedOperateOIDByRole', {
  "code": 0,
  "msg": "Success",
  "data": {
      "list":["删除操作"]
  }
});
Mock.mock('/getMenusWithOperate', {
  "code": 0,
  "msg": "Success",
  "data": {
    "list": [
      {
        "oid": "系统管理",
        "name": "系统管理",
        "sort": 1,
        "url": null,
        "type":"menu",
        "children": [
          {
            "oid": "Admin",
            "name": "Admin",
            "sort": 1,
            "url": null,
            "type":"menu",
            "children": [
              {
                "oid": "用户管理",
                "name": "用户管理",
                "sort": 1,
                "url": "UserManage",
                "type":"menu",
                "children": [{
                  "oid": "增加操作",
                  "name": "增加操作",
                  "sort": 1,
                  "url": "UserManage",
                  "type":"operate",
                  "children": null
                },{
                  "oid": "删除操作",
                  "name": "删除操作",
                  "sort": 1,
                  "url": "UserManage",
                  "type":"operate",
                  "children": null
                }]
              },
              {
                "oid": "角色管理",
                "name": "角色管理",
                "sort": 2,
                "url": "RoleManage",
                "type":"menu",
                "children": null
              },
              {
                "oid": "菜单管理",
                "name": "菜单管理",
                "sort": 3,
                "url": "test2",
                "type":"menu",
                "children": null
              },{
                "oid": "API管理",
                "name": "API管理",
                "sort": 3,
                "url": "ApiManage",
                "type":"menu",
                "children": null
              },{
                "oid": "操作管理",
                "name": "操作管理",
                "sort": 3,
                "url": "test2",
                "type":"menu",
                "children": null
              }
            ]
          },
          {
            "oid": "menu 1-2",
            "name": "menu 1-2",
            "sort": 2,
            "url": null,
            "type":"menu",
            "children": [
              {
                "oid": "100000000015",
                "name": "menu1 1-2-1",
                "sort": 1,
                "url": "test3",
                "type":"menu",
                "children": null
              },
              {
                "oid": "100000000016",
                "name": "menu1 1-2-2",
                "sort": 2,
                "url": "test4",
                "type":"menu",
                "children": null
              }
            ]
          },
          {
            "oid": "100000000017",
            "name": "menu 1-3",
            "sort": 3,
            "url": null,
            "type":"menu",
            "children": [
              {
                "oid": "100000000018",
                "name": "menu1 1-3-1",
                "sort": 1,
                "url": "test5",
                "type":"menu",
                "children": null
              },
              {
                "oid": "100000000019",
                "name": "menu1 1-3-2",
                "sort": 2,
                "url": "test6",
                "type":"menu",
                "children": null
              }
            ]
          }
        ]
      },
      {
        "oid": "100000000020",
        "name": "系统监控",
        "sort": 2,
        "url": null,
        "type":"menu",
        "children": [
          {
            "oid": "100000000021",
            "name": "menu 2-1",
            "sort": 1,
            "url": null,
            "type":"menu",
            "children": [
              {
                "oid": "100000000022",
                "name": "menu1 2-1-1",
                "sort": 1,
                "url": "test7",
                "type":"menu",
                "children": null
              }
            ]
          },
          {
            "oid": "100000000023",
            "name": "menu 2-2",
            "sort": 2,
            "url": null,
            "type":"menu",
            "children": [
              {
                "oid": "100000000024",
                "name": "menu1 2-2-1",
                "sort": 1,
                "url": "test8",
                "type":"menu",
                "children": null
              },
              {
                "oid": "100000000025",
                "name": "menu1 2-2-2",
                "sort": 2,
                "url": "test9",
                "type":"menu",
                "children": null
              }
            ]
          }
        ]
      },
      {
        "oid": "100000000026",
        "name": "业务模块",
        "sort": 3,
        "url": null,
        "type":"menu",
        "children": [
          {
            "oid": "100000000027",
            "name": "menu 3-1",
            "sort": 1,
            "url": null,
            "type":"menu",
            "children": [
              {
                "oid": "100000000028",
                "name": "menu1 3-1-1",
                "sort": 1,
                "url": "test10",
                "type":"menu",
                "children": null
              }
            ]
          },
          {
            "oid": "100000000029",
            "name": "menu 3-2",
            "sort": 2,
            "url": null,
            "type":"menu",
            "children": [
              {
                "oid": "100000000030",
                "name": "menu1 3-2-1",
                "sort": 1,
                "url": "test11",
                "type":"menu",
                "children": null
              }
            ]
          },
          {
            "oid": "100000000031",
            "name": "menu 3-3",
            "sort": 3,
            "url": null,
            "type":"menu",
            "children": [
              {
                "oid": "100000000032",
                "name": "menu1 3-3-1",
                "sort": 1,
                "url": "test12",
                "type":"menu",
                "children": null
              }
            ]
          }
        ]
      }
    ]
  }
});