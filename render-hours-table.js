//===============================================================================
let htmlArr = [];

function forEachHour(arr){
    try {       
        if (arr.length < 1) {
            console.log("\nДанные за этот период отсутствуют или ошибочны",);
            con.end();
            return;
        } 
            arr.forEach(function(hour, i , arr) { 
                if (i === arr.length - 1) { 
                    con.end();
                    htmlArr = headers.getTableHeader() + dtUtils.arrToTableRow(arr)
                    const htmlFile = getHtmlFile(htmlArr, reportDay, reportMonth, reportYear);
                    const reportFile = HTML_PATH +  reportYear  + "-"  + dtUtils.getNiceMonth(reportMonth) + "-"  + dtUtils.getNiceday(reportDay) + ".html";
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