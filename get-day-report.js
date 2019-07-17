
    // const { spawn } = require('child_process');
    // const fs = require("fs");
    // // const HTML_PATH = "bigdata/html/";
    const con = require('./connection');
    const dtUtils = require('./node-modules/date-utils');
    const headers = require('./node-modules/string-templates');
    // const  getHtmlFile = require('./node-modules/html-templates');

    const getHoursList = require('./hours-list');



function getDayReport(_con, reportDay = 15, reportMonth = 7, reportYear = 2019) {
     //==============================================================================
    // const reportDay =  parseInt(process.argv[2]) || 18;
    // const reportMonth =  parseInt(process.argv[3]) || 2;
    // const reportYear = parseInt(process.argv[4])|| 2019 ;
    return new Promise(function(resolve, reject) {
    let hoursArray =[];
    //let daysInMonth  = 30;
    //==============================================================================
    //===============================================================================
    _con.connect(function(err) {
        if (err){
        console.log(' con.connect BD connect error: ' + err.message);
        console.log(" err BD state = "+ con.state);
        _con.end();
        //throw err;
        } else {
            console.log("Connected!  BD state = "+ _con.state);
            getHoursList(con, reportDay, reportMonth, reportYear)
            // getHoursList(reportDay, reportMonth, reportYear)
            .then(function(result) {
                ;
                try {
                    hoursArray = result.map(function(row, i, arr) {
                        return headers.formHourRow(row);
                    });                               
                } catch (e) {
                    console.log(e.message);
                } finally {
                ;                
                }
                return new Promise(function(resolve, reject) {
                    resolve(hoursArray);
                })        
            })
            .catch(function(e) {
                console.log(e.message); 
            })
            .finally( function(result) {
                //forEachHour(hoursArray);
                try {   
                    _con.end();    
                            if (hoursArray.length < 1) {
                                console.log("\nДанные за этот период отсутствуют или ошибочны");
                                reject("\nДанные за этот период отсутствуют или ошибочны");
                                // return "\nДанные за этот период отсутствуют или ошибочны";
                            } else {

                                resolve(dtUtils.arrToTableRow(hoursArray));
                                // return dtUtils.arrToTableRow(hoursArray);
                            }
                        } catch (e) {
                                    console.log(e.message); 
                                    reject(e.message)
                        } finally {
                                    ;
                        }
            }

            );
        }   
    });

    _con.on('error', function(err) {
        console.log('con.on BD error: ' + err.message);
        console.log(" err BD state = "+ con.state);
        reject('con.on BD error: ' + err.message)
    });
    {
    //==============================================================================
    //let sequence = Promise.resolve();
    //const allData =[];

    //==============================================================================
    //===============================================================================
    // let htmlArr = [];

    // function forEachHour(arr){
    //     try {       
    //         if (arr.length < 1) {
    //             console.log("\nДанные за этот период отсутствуют или ошибочны",);
    //             con.end();
    //             return;
    //         } 
    //                     con.end();
    //                     htmlArr = headers.getTableHeader() + dtUtils.arrToTableRow(arr)
    //                     const htmlFile = getHtmlFile(htmlArr, reportDay, reportMonth, reportYear);
    //                     const reportFile = HTML_PATH +  reportYear  + "-"  + dtUtils.getNiceMonth(reportMonth) + "-"  + dtUtils.getNiceday(reportDay) + ".html";
    //                     fs.writeFile(reportFile, htmlFile, function(){
    //                         console.log( "Сохранено в  " + reportFile);
    //                     });

    //             // arr.forEach(function(hour, i , arr) { 
    //             //     if (i === arr.length - 1) { 
    //             //         con.end();
    //             //         htmlArr = headers.getTableHeader() + dtUtils.arrToTableRow(arr)
    //             //         const htmlFile = getHtmlFile(htmlArr, reportDay, reportMonth, reportYear);
    //             //         const reportFile = HTML_PATH +  reportYear  + "-"  + dtUtils.getNiceMonth(reportMonth) + "-"  + dtUtils.getNiceday(reportDay) + ".html";
    //             //         fs.writeFile(reportFile, htmlFile, function(){
    //             //             console.log( "Сохранено в  " + reportFile);
    //             //         });
    //             //     }
    //             // });    
    //     } catch (e) {
    //         console.log(e.message); 
    //     } finally {
    //         ;
    //     }
    // }
    //==============================================================================
    // function getHoursList(dd = 20, mm = 1, year = 2019){
    //     return new Promise( function(resolve, reject){
    //         function performQuery(dd, mm , year){
    //             const sql = dtUtils.dayReportSql(dd, mm , year);
    //             console.log("sql = ", sql);
                
    //             let query = con.query(sql,  [], function (err, result, fields) {
    //                 if (err) {
    //                     console.log(err.message);
    //                     reject(err);
    //                 } else {
    //                      resolve(result);
    //                 }
    //             });
    //         };

    //         if (con.state === 'disconnected'){
    //             con.connect(function(err) {
    //                 try {
    //                     if (err){
    //                         console.log('BD connect error: ' + err.message);
    //                         con.end();
    //                         //throw err;
    //                         } else {
    //                             performQuery(dd, mm, year);
    //                         console.log("RE-Connected! BD state = "+ con.state);
    //                         }                                            
    //                 } catch (e) {
    //                     console.log("SQL access problem : " + e.message );
    //                     //con.end();
    //                 }
    //             });
    //         } else {
    //             try {               
    //             performQuery(dd, mm, year);
    //             } catch(e) {
    //                 console.log("SQL access problem : " + e.message );
    //             } finally {
    //                 ;
    //             }
    //         };
    //     });
    // }
    // //==============================================================================
    // function formHourRow(row) {
    //     const hourRow = [];
    //     for (const prop in row) {
    //         if (row.hasOwnProperty(prop)) {
    //            if (prop !== "id") {
    //                prop == "dt" ? hourRow.push( dtUtils.getDateTimeFromMySql(row[prop]) ) : hourRow.push(row[prop].toFixed(3));
    //             };            
    //         }
    //     }
    //     return hourRow;  
    // };
    // //==============================================================================
    //===============================================================================
    }
});
}


getDayReport(con, 15, 7, 2019).then((result) => {
    console.log("result table: \n" , result);
    
})
.catch((err) => {
    console.log(err)
});




