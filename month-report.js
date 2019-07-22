/**
 * планы.
 * 1. Сделать цепочку промисов красивее.  Пока что получается смесь промисов и колбекадового кода
 * 2. Разбить на модули. и сделать экспорт.
 * 3. done Вынести строку подключения к базе в модуль, и скрыть гитигнором.
 * 4. done Попробовать получать общие даннные за месяц не новым запросом, а обработкой полученого массива дневных данных
 * 5.  done Пока не сделал серверную часть, попробовать создавать html файл отчета по старинке, выводом в файл потоком. 
 * 6. Убрать лишние и сетовіе функции.
 */
const ECO1 = 1;
const ECO2 = 2;
const MONTH_REPORT = 2;
const DAY_REPORT = 1;

const { spawn } = require('child_process');
const fs = require("fs");
const HTML_PATH = "bigdata/html/";
const con = require('./connection');

const dtUtils = require('./node-modules/date-utils');
const stringTemplates = require('./node-modules/string-templates');
const getHtml = require('./node-modules/html-templates');
const dataHandle = require('./node-modules/data-handlers');
const getDaysList = require('./node-modules/days-list');

const forEachDay = require('./node-modules/days-data');

//==============================================================================

const reportMonth = parseInt(process.argv[2]) || 2;
const reportYear = parseInt(process.argv[3]) || 2019 ;


let DaysArray = [];
// let daysInMonth  = 30;

con.connect(function(err) {
    // let DaysArray = [];
    try {
        if (err){
            console.log(' con.connect BD connect error: ' + err.message);
            console.log(" err BD state = "+ con.state);
            con.end();
            //throw err;
            } else {
                console.log("Connected!  BD state = "+ con.state);
                getDaysList(con, reportMonth, reportYear)
                .then(function(result){
                    DaysArray = dtUtils.arrFromObjectArrray(result, "dtm");
                    const daysInMonth = DaysArray[DaysArray.length - 1].slice(8, 10);
                    console.log(daysInMonth);   
                    return   new Promise((resolve,  reject) => {
                        resolve(DaysArray);
                    });    
                })
                .catch(function(e){                    
                    if (e.message == "Cannot read property 'slice' of undefined") {
                        //console.log(e.message);
                        console.log("\nДанные за этот период отсутствуют или ошибочны");  
                    }
                    con.end();
                })
                .finally( function(){
                    const options = {
                        reportMonth : reportMonth,
                         reportYear :  reportYear,
                         ECO1: ECO1, 
                         MONTH_REPORT : MONTH_REPORT
                    };
                    
                    forEachDay(DaysArray, con, options);
                }
                );
            }             
    } catch (error) {
        console.log(error.message);
    }
});

con.on('error', function(err) {
    console.log('con.on BD error: ' + err.message);
    console.log(" err BD state = "+ con.state);
});

//==============================================================================


    //==============================================================================
{
// function forEachDay(_DaysArray){
//     let sequence = Promise.resolve();
//     const allData =[];
//     let htmlArr = [];
// // -----------------------------------------------------------------------
//     try {
//         _DaysArray.forEach(function(day, i, arr){
//             sequence = sequence.then(function(){
//                 return getDayRow(day, con);
//             })
//             .then(function(dayRow){
//                   allData.push(stringTemplates.dressUpDayRow(dayRow));
//                 if (i === arr.length - 1) {
//                   //console.log(allData);
//                     con.end();
//                     allData.push(dataHandle.calcMonthData(allData));
//                     htmlArr = stringTemplates.getTableHeader() + stringTemplates.arrToTableRow(allData);

//                     // const htmlFile = htmlStart + htmlArr + htmlEnd;
//                     const htmlFile = getHtml(htmlArr, 0 , reportMonth, reportYear, ECO1, MONTH_REPORT) ;
//                     //console.log(htmlFile);
//                     const reportFile = HTML_PATH +  reportYear  + "-"  + getNiceMonth(reportMonth) + ".html";
//                     //console.log(reportFile);
                    
//                     fs.writeFile(reportFile, htmlFile, function(){
//                         console.log( "Сохранено в  " + reportFile);
//                     });
//                 }
//             });
//         });           
//     } catch(e) {
//         console.log(e.message); 
//     } finally {
//         ;
//     }
// } 
}
//==============================================================================
{// function getDaysList(mm = 1, year = 2019){
//     return new Promise( function(resolve, reject){
//         function performQuery(mm , year){
//             const sql = dtUtils.monthDatesSql(mm , year);
//             let query = con.query(sql,  [], function (err, result, fields) {
//                 if (err) {
//                     console.log(err.message);
//                     reject(err);
//                 } else {
//                     resolve(result);
//                 }
//             });
//         };
//         if (con.state === 'disconnected'){
//             con.connect(function(err) {
//                 if (err){
//                 console.log('BD connect error: ' + err.message);
//                 con.end();
//                 //throw err;
//                 } else {
//                     performQuery(mm, year);
//                 console.log("RE-Connected! BD state = "+ con.state);
//                 }                
//             });
//         } else {
//             try {
//             performQuery(mm, year);
//             } catch(e) {
//                 console.log("SQL insert problem" + e.message );
//             } finally {
//                 ;
//             }
//         };
//     });
// }
}
//==============================================================================

// function getDayReportSql(day) {
//    return  `SELECT dt, sum(w_38), sum(q_39),  avg(T_41), avg(T_42), avg(P_19), avg(P_18), avg(T_10), avg(P_36)
//      FROM eco2.hr3 where dt between '${day}' and DATE_ADD('${day}', INTERVAL 23 hour);`

// }

//==============================================================================
{
// function getDayRow(day){
//     return new Promise(function(resolve, reject){
//         function performQuery(day) {
//             const sql = dtUtils.getDayReportSql(day );
//            // console.log(sql);            
//             let query = con.query(sql,  [], function (err, result, fields) {
//                 if (err) {
//                     console.log(err.message);
//                     //con.end();
//                     reject(err);
//                             //throw err;
//                 } else {
//                    // console.log("Success. BD state = "+ con.state);
//                     //con.end();
//                     resolve(result);
//                 }
//                 }); 
//         };
//         if (con.state === 'disconnected'){
//             con.connect(function(err) {
//                 if (err){
//                 console.log('BD connect error: ' + err.message);
//                 con.end();
//                 //throw err;
//                 } else {
//                     performQuery(day);
//                 console.log("RE-Connected! BD state = "+ con.state);
//                 }               
//             });
//         } else {
//             try {
//             performQuery(day);
//             } catch(e) {
//                 console.log("SQL insert problem" + e.message );
//             } finally {
//                 ;
//             }
//         };
//     });
// };
}
//==============================================================================
// const HEADER = ["Дата", "Тепло, Гкал", "Расход воды, м3", "Темп. на город, С", "Темп. оборотной, С",  "Давление после котла, МПа", "Давление до котла, МПа", "Темп. дымовых до ЭКО, С", "Разрежение в топке, Па" ];
// //dt, sum(w_38), sum(q_39),  avg(T_41), avg(T_42), avg(P_19), avg(P_18), avg(T_10), avg(P_36)
// const tableHeader = HEADER.map(el => "<th>" + el + "</th>").join("");
  //=============================================================================

//   function getStartEndDate (dateStr = '2019-02-03') {
//     return {startDate: getStartStr (dateStr) , endDate: getEndStr(getStartStr(dateStr)) };
// }

// function monthString(month){
//     const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
//   "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
// ];
// return monthNames[month - 1];
// }

// function dressUpDayRow(result) {
//     const queryFields = Object.values(result[0]);
//     let queryDays =[];
//                        queryFields.map((el, index) => {
//                         queryDays.push(el.toString().match(/[TZ]/) ? getDateTimeFromMySql(el).slice(0, 10) : parseFloat(el).toFixed(3));
//                        });
//     return queryDays;
// }

function getStartStr (dateStr = '2019-02-04') {
    return dateStr.replace('/\//g', '-') + ' 08:00:00';
}

function getEndStr (startDtStr = '2019-02-04 08:00:00') {
    const startDt = new Date(startDtStr);
    const endDt = new Date(startDt.getTime() + 1000 * 3600 * 24 - (new Date()).getTimezoneOffset()*60000);
    return endDt.toISOString().slice(0, 19).replace('T', ' ');
}

function getDayReportWhere (dateStr = '2019-02-04') {
    return "where dt >= '" + getStartStr(dayReportStr)  +  "' and dt < '" + getEndStr (getStartStr(dayReportStr));
}

function getDateTimeFromMySql (dt) {
    //return dt.toISOString().slice(0, 19).replace('T', ' ');
    return (new Date ((new Date((new Date(new Date(dt))).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
}

function getNiceMonth(month) {
    return month > 9 ? "" + month : "0" + month;
}

//========================================================================================
// function arrFromObjectArrray(objArr, prop ="dtm") {
//     let arr = objArr.map( e => getDateTimeFromMySql (e[prop]));
//     return arr;
// }

// //==============================================================================
// function arrToTableRow(arr) {
//     const row = arr.map( day => {
//         return "<tr>" + day.map(el => "<td>" + el + "</td>").join('')  + "</tr>";
//     });
//    return row.join('');
//   //return "<table>" + row.join('') +"</table>";
// }
// //==============================================================================

//===============================================================================
// const htmlStart =`<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <meta http-equiv="X-UA-Compatible" content="ie=edge">
//     <title>Oтчет за ${monthString(reportMonth)}.${reportYear}</title>
//     <link rel="stylesheet" href="css/mainsheet.css">
//     <style>
//     #monthTable {
//       border: 1px solid darkgrey;
//       margin: auto ;
//       align-content: center;
//   }
//   #monthTable td, th {
//       border: 1px solid grey;
//       padding: 2px;
//       text-align: center;
//   }  
//   #reportDiv {
//       margin: auto;
//       align-content: center
//   }
//   #monthTable tr:nth-child(even) {
//       background-color: rgb(231, 231, 231);
//   }
//   #monthTable tr:hover {
//        background-color:darkkhaki;
//   }
//   #monthTable tr:nth-last-child() {
//       background-color: grey;
//       font-style: italic;
//       font-size: 1.5em
//   }
//   #monthTable th {
//       border: 1px solid grey;
//       padding-top: 5px;
//       padding-bottom: 5px;
//       background-color: darkcyan;
//       color: rgb(245, 245, 245);
//   } 
//   h1 {
//       text-align: center;
//   }
//     </style>
  
// </head>
// <h1>Месячный отчет за ${monthString(reportMonth)}.${reportYear}</h1>
// <body><div style="height:10px"></div><div id="reportDiv"><table id="monthTable">`;

// const htmlEnd = `
//     </table>
// </div>

// </body>
// </html>`;
