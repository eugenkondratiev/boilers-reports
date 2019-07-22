module.exports = {
    monthString :monthString,
    getDateTimeFromMySql: getDateTimeFromMySql,
    getNiceMonth : getNiceMonth,
    getNiceday : getNiceday,
    dayReportSql : dayReportSql,
    formDayStr : formDayStr,
    arrToTableRow : arrToTableRow
}

//==============================================================================
function monthString(month){
    const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
                        "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
    ];
return monthNames[month - 1];
}
//==============================================================================
function getDateTimeFromMySql (dt) {
    //return dt.toISOString().slice(0, 19).replace('T', ' ');
    return (new Date ((new Date((new Date(new Date(dt))).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
}
//==============================================================================
function getNiceMonth(month) {
    return month > 9 ? "" + month : "0" + month;
}
//==============================================================================
function getNiceday(day) {
    return day > 9 ? "" + day : "0" + day;
}
//==============================================================================
function dayReportSql(day, month , year, eco = 1) {
    const startDay = formDayStr(day, month , year);
    return eco == 2 
    ? /**change for eco2 */  `SELECT dt, w_38, q_39, T_41, T_42, P_19, P_18, T_10, P_36  FROM eco2.hr3 where dt between '${startDay}' and DATE_ADD('${startDay}', INTERVAL 23 hour)`
    :   `SELECT dt, w_38, q_39, T_41, T_42, P_19, P_18, T_10, P_36  FROM eco2.hr3 where dt between '${startDay}' and DATE_ADD('${startDay}', INTERVAL 23 hour)`;
}
//========================================================================================
function formDayStr(day = 20, month = 1, fullyear = 2019) {
    return `${fullyear}-${getNiceMonth(month)}-${getNiceday(day)} 08:00:00`;
}

//==============================================================================
function arrToTableRow(arr) {
    const row = arr.map( record => {
        return "<tr>" + record.map(el => "<td>" + el + "</td>").join('')  + "</tr>";
    });
   return row.join('');
}
//==============================================================================