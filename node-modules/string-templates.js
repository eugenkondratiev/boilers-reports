const dtUtils = require('./date-utils');

//========================================================================================
const HEADER = ["Дата", "Тепло, Гкал", "Расход воды, м3", "Темп. на город, С", "Темп. оборотной, С",  "Давление после котла, МПа", "Давление до котла, МПа", "Темп. дымовых до ЭКО, С", "Разрежение в топке, Па" ];
const HEADER2 = ["Дата", "Тепло, Гкал", "Расход воды, м3", "Темп. на город, С", "Темп. оборотной, С",  "Давление после котла, МПа", "Давление до котла, МПа", "Темп. дымовых до ЭКО, С", "Разрежение в топке, Па" ];
//dt, sum(w_38), sum(q_39),  avg(T_41), avg(T_42), avg(P_19), avg(P_18), avg(T_10), avg(P_36)
function tableHeader(eco = 1) {
    return eco ===2 
    ? HEADER2.map(el => "<th>" + el + "</th>").join("")
    : HEADER.map(el => "<th>" + el + "</th>").join("");
}

//==============================================================================
function formHourRow(row) {
    const hourRow = [];
    for (const prop in row) {
        if (row.hasOwnProperty(prop)) {
           if (prop !== "id") {
               prop == "dt" ? hourRow.push( dtUtils.getDateTimeFromMySql(row[prop]) ) : hourRow.push(row[prop].toFixed(3));
            };            
        }
    }
    return hourRow;  
};
//==============================================================================

module.exports = {
    getTableHeader: tableHeader,
    formHourRow : formHourRow
};
