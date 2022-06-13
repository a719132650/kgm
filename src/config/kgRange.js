/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/

// 性别选项值
var sexRangeMale = {key:"1",label:"Male"};
var sexRangeFemale = {key:"2",label:"Female"};
var sexRangeUnknow = {key:"0",label:"Unknow"};
var sexRange = [sexRangeUnknow,sexRangeMale,sexRangeFemale];

// 状态选项值
var statusInactive = {key:0,label:"Inactive"};
var statusActive = {key:1,label:"Active"};
var statusRange = [statusActive,statusInactive];

// api权限选项值
var apiAuthRangeUnProtected = {key:0,label:"unProtected"};
var apiAuthRangePublic = {key:1,label:"public"};
var apiAuthRangePrivate = {key:2,label:"private"};
var apiAuthRange = [apiAuthRangeUnProtected,apiAuthRangePublic,apiAuthRangePrivate];

const kgRange = {
    sexRange,
    statusRange,
    apiAuthRange
}

export default kgRange