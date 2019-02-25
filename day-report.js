/**
 * планы.
 * 
 * 1. Разбить на модули. и сделать экспорт.
 * 2.done  Вынести строку подключения к базе в модуль, и скрыть гитигнором.
 */

const { spawn } = require('child_process');
const fs = require("fs");
const HTML_PATH = "bigdata/html/";
const con = require('./connection');

//==============================================================================
const reportDay =  parseInt(process.argv[2]) || 18;
const reportMonth =  parseInt(process.argv[3]) || 2;
const reportYear = parseInt(process.argv[4])|| 2019 ;

let hoursArray =[];
let daysInMonth  = 30;

con.connect(function(err) {
    if (err){
    console.log(' con.connect BD connect error: ' + err.message);
    console.log(" err BD state = "+ con.state);
    con.end();
    //throw err;
    } else {
        console.log("Connected!  BD state = "+ con.state);
        //forEachDay();
        getHoursList(reportDay, reportMonth, reportYear)
        .then(function(result) {
            ;
            //console.log(result); 
            //hoursArray = arrFromObjectArrray(result, "dt");
            // daysInMonth = DaysArray[DaysArray.length - 1].slice(8, 10);    
            try {
                hoursArray = result.map(function(row, i, arr) {
                    //arr.push(formHourRow(row));
                    return formHourRow(row);
                }); 
                               
            } catch (e) {
                console.log(e.message);
            } finally {
              //  console.log(hoursArray);
                
            }

  
            return new Promise(function(resolve, reject) {
                resolve(hoursArray);
            })        
        })
        // .then(function(result){
        //     console.log(result); 
        // })
        .catch(function(e) {
            console.log(e.message); 
        })
        .finally( function(result) {
           // console.log(result);
            forEachHour(hoursArray);
           ;
        }
        );
    }   
});

con.on('error', function(err) {
    console.log('con.on BD error: ' + err.message);
    console.log(" err BD state = "+ con.state);
});

//==============================================================================

let sequence = Promise.resolve();
const allData =[];
let htmlArr = [];

    //==============================================================================
function forEachHour(arr){
    try {       
        //console.log("arr :", arr);
        if (arr.length < 1) {
            console.log("\nДанные за этот период отсутствуют или ошибочны",);
            con.end();
            return;
        } 
            arr.forEach(function(hour, i , arr) { 
                if (i === arr.length - 1) { 
                    con.end();
                    htmlArr = tableHeader + arrToTableRow(arr)
                    const htmlFile = htmlStart + htmlArr + htmlEnd;
                    const reportFile = HTML_PATH +  reportYear  + "-"  + getNiceMonth(reportMonth) + "-"  + getNiceday(reportDay) + ".html";
                    fs.writeFile(reportFile, htmlFile, function(){
                        console.log( "Сохранено в  " + reportFile);
                    });
                }
            });    
    } catch (e) {
        console.log(e.message); 
    } finally {
        ;
    }
}
 
//==============================================================================
function getHoursList(dd = 20, mm = 1, year = 2019){
    return new Promise( function(resolve, reject){
        function performQuery(dd, mm , year){
            const sql = dayReportSql(dd, mm , year);
            console.log("sql = ", sql);
            
            let query = con.query(sql,  [], function (err, result, fields) {
                if (err) {
                    console.log(err.message);
                    reject(err);
                } else {
                    //console.log("result : ",  result);
                    resolve(result);
                }
            });
        };
        if (con.state === 'disconnected'){
            con.connect(function(err) {
                try {
                    if (err){
                        console.log('BD connect error: ' + err.message);
                        con.end();
                        //throw err;
                        } else {
                            performQuery(dd, mm, year);
                        console.log("RE-Connected! BD state = "+ con.state);
                        }                
                            
                } catch (e) {

                    console.log("SQL access problem : " + e.message );
                    //con.end();
                }
            });
        } else {
            try {
              //  console.log(`performQuery(${dd}, ${mm}, ${year});`);
                
            performQuery(dd, mm, year);
            } catch(e) {
                console.log("SQL access problem : " + e.message );
            } finally {
                ;
            }
        };
    });
}
//==============================================================================
function formHourRow(row) {

    const hourRow = [];
    for (const prop in row) {
        if (row.hasOwnProperty(prop)) {
           if (prop !== "id") {
               prop == "dt" ? hourRow.push( getDateTimeFromMySql(row[prop]) ) : hourRow.push(row[prop].toFixed(3));
            };            
        }
    }
    return hourRow;  
};
//========================================================================================
const HEADER = ["Дата", "Тепло, Гкал", "Расход воды, м3", "Темп. на город, С", "Темп. оборотной, С",  "Давление после котла, МПа", "Давление до котла, МПа", "Темп. дымовых до ЭКО, С", "Разрежение в топке, Па" ];
//dt, sum(w_38), sum(q_39),  avg(T_41), avg(T_42), avg(P_19), avg(P_18), avg(T_10), avg(P_36)
const tableHeader = HEADER.map(el => "<th>" + el + "</th>").join("");
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
function dayReportSql(day, month , year) {
    const startDay = formDayStr(day, month , year);
    return `SELECT dt, w_38, q_39, T_41, T_42, P_19, P_18, T_10, P_36  FROM eco2.hr3 where dt between '${startDay}' and DATE_ADD('${startDay}', INTERVAL 23 hour)`;
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
//===============================================================================
const htmlStart =`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Oтчет за ${reportDay} ${monthString(reportMonth)} ${reportYear}</title>
    <link rel="stylesheet" href="css/mainsheet.css">
    <style>
    #monthTable {
      border: 1px solid darkgrey;
      margin: auto ;
      align-content: center;
  }
  #monthTable td, th {
      border: 1px solid grey;
      padding: 2px;
      text-align: center;
  }  
  #reportDiv {
      margin: auto;
      align-content: center
  }
  #monthTable tr:nth-child(even) {
      background-color: rgb(231, 231, 231);
  }
  #monthTable tr:hover {
       background-color:darkkhaki;
  }
  #monthTable tr:nth-last-child() {
      background-color: grey;
      font-style: italic;
      font-size: 1.5em
  }
  #monthTable th {
      border: 1px solid grey;
      padding-top: 5px;
      padding-bottom: 5px;
      background-color: darkcyan;
      color: rgb(245, 245, 245);
  } 
  h1 {
      text-align: center;
  }
    </style>
  
</head>
<h1>Oтчет за ${reportDay} ${monthString(reportMonth)} ${reportYear}</h1>
<body><div style="height:10px"></div><div id="reportDiv"><table id="monthTable">`;

const htmlEnd = `
    </table>
</div>

</body>
</html>`;
