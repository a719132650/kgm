/*
author : Kigooo
verson : 0.0.3
update date : 2022-02-14
*/

/*
    parseTimeStampToTime : 时间戳转日期
*/

const kgUtilDate = {
    // 时间戳转日期
    parseTimeStampToTime(timeStamp){
        var date;
        timeStamp = timeStamp.toString();
        if(timeStamp.length==10){
            date = new Date(Number(timeStamp) * 1000);
        }else if(timeStamp.length==13){
            date = new Date(Number(timeStamp));
        }else{
            return timeStamp;
        }
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    }
}

export default kgUtilDate
