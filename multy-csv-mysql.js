const { spawn } = require('child_process');

const dtlpath = "server/";
const CSV_PATH = "bigdata/csv/";
const DTL_PATH = "bigdata/dtl/";
const BAT_NAME = "dtl_par.bat";
const CSV_NAME = "20190108";

let fs = require('fs');
const con = require('./connection');


 /* 
const csv_arr = [
    "20190110",
    "20190108",
    "20190104",
    "20190103"
];
*/

const csvFiles = fs.readdirSync(CSV_PATH);
const csvs = csvFiles.filter((file) => file.includes('.csv'))
			.map((f) => f.slice(0, -4));
//console.log(csvs);
//const csv_arr =  csvs.slice(-5);
const csv_arr =  csvs;

console.log(csv_arr);


let csv = require('fast-csv');
const csvPath = (csv_path, csv_name) => csv_path + csv_name + ".csv";


let sequence = Promise.resolve();
const allData =[];

// csv parsing chaining
try {
    csv_arr.forEach(function(filename, i, arr){
        sequence = sequence.then(function(){
            return getDataFromCSV(filename);
        })
        .then(function(alldt){
            console.log(i + "    :     " + arr.length);  
            console.log("Final success BD state = "+ con.state); 
            if (i === arr.length - 1) {
                con.end();
            }
        });
    });
        
} catch(e) {
    console.log(e.message); 
} finally {
    ;
   // con.end(); we can perform in last forEach action
}


/*
 * 
 * --------------------------------------------------------
 */
const ROWS_ARRAY = [`dt`, `Q_39`, `T_41`, `T_42`, `P_19`, `P_18`, `P_36`, `T_10`, `T_6`, `T_7`, `T_4`, `W_38`];

function getDuplicateUpadateString(rec, rows){
    const keyupdate = (acc, key, index, arr) => {
        const coma = index < arr.length -1 ? `,` : ``;
        return acc + `  ${key} = VALUES(${key})` + coma;
    } 		
		const noDate = rows;
			noDate.shift();

		const ins = "INSERT INTO `hr3` (`dt`, `Q_39`, `T_41`, `T_42`, `P_19`, `P_18`, `P_36`, `T_10`, `T_6`, `T_7`, `T_4`, `W_38`) VALUES ? "
		const str = " ON DUPLICATE KEY UPDATE";
		//ON DUPLICATE KEY UPDATE name = VALUES(name), rank = VALUES(rank)
		const dupStr = noDate.reduce(keyupdate, str);
		return ins + dupStr;
}

/*
 * --------------------------------------------------------
 */
function putRecordsInMySQL(records){
    return new Promise( function(resolve,reject){

        function performQuery(){
            const sql = getDuplicateUpadateString(records, ROWS_ARRAY );
            let query = con.query(sql,  [values], function (err, result, fields) {
                if (err) {
                    console.log(err.message);
                    //con.end();
                    reject(err);
                            //throw err;
                } else {
                    console.log("Success. BD state = "+ con.state);
                    //con.end();
                    resolve(result);
                }
                });

        }
        const values = records;
    if (con.state === 'disconnected'){
        con.connect(function(err) {
            if (err){
            console.log('BD connect error: ' + err.message);
            con.end();
            //throw err;
            } else {
                performQuery();
            console.log("RE-Connected! BD state = "+ con.state);
            }
            
        });
    } else {
        try {
        performQuery();
        } catch(e) {
            console.log("SQL insert problem" + e.message );
        } finally {
            ;
        }
    };
        
    });
}


con.on('error', function(err) {
    console.log('BD error: ' + err.message);
    console.log(" err BD state = "+ con.state);
});

con.connect(function(err) {
    if (err){
    console.log('BD connect error: ' + err.message);
    console.log(" err BD state = "+ con.state);
    con.end();
    //throw err;
    } else {
        console.log("Connected!  BD state = "+ con.state);
    }
    
});

/**
 * 
 * --------------------------------------------------------
 */
function prepareRecord(arr){
    const dt = arr[0].replace(/[\/]/g , "-" ) 
                + " " 
                + arr[1].slice(0,-5) 
                + "00:00";
    const record = arr.slice(2);
    record.unshift(dt);
    return record;
}
/**
 * 
 * --------------------------------------------------------
 */

function getDataFromCSV(filename){
    return new Promise(function(resolve, reject){
        let fs = require('fs');
        const dataarr =[];

        fs.createReadStream(csvPath(CSV_PATH, filename))
        .pipe(csv())
        .on('data', function(data){
            if (!isNaN(parseFloat(data[3]))){
                const rec = prepareRecord(data);
                dataarr.push(rec);
            } else {
                console.log(csvPath(CSV_PATH, filename));      
            }
        })
        .on('end', function(data){
            console.log(dataarr.length);       
            console.log('read finished');

            putRecordsInMySQL(dataarr)
            .then(function(result){
                resolve(dataarr);
                console.log('OK ' + csvPath(CSV_PATH, filename));               
            } )
            .catch(function(error){
                console.log(error.message);  
            });

        });

    });
};
