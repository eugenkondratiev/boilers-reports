const { spawn } = require('child_process');

const dtlpath = "server/";
const CSV_PATH = "bigdata/csv/";
const DTL_PATH = "bigdata/dtl/";
const BAT_NAME = "dtl_par.bat";
const CSV_NAME = "20190108";

let fs = require('fs');
//var mysql = require('mysql');

const testRecord = [ 
    '2019-01-23 10:00:00',
    '301.943787',
    '75.208054',
    '53.366096',
    '0.633749',
    '0.967865',
    '-4.991719',
    '416.070374',
    '90.442993',
    '111.941872',
    '14.920410',
    '11.799445' 
];

const con = require('./connection');


let csv = require('fast-csv');
const csvPath = CSV_PATH + CSV_NAME + ".csv";
const dataarr =[];

fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', function(data){
	if (!isNaN(parseFloat(data[3]))){
         const rec = prepareRecord(data);
         dataarr.push(rec);
     	 }
	})
    .on('end', function(data){
        console.log(dataarr.length);
        
        console.log('read finished');

        //insertToDB(dataarr);// array of all records from file!! 

        //insertToDB(dataarr[1]);
        //promise for future use;
        putRecordsInMySQL(dataarr)
            .then(function(result){
                setTimeout(() => {
                    insertToDB(dataarr);
                }, 3000);
                
                console.log('OK 1');               
            } )
            .catch(function(error){
                console.log(error.message);  
            })

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
function insertToDB(records){
    const values = records;
    
	con.connect(function(err) {
		if (err){
		console.log(err.message);
		con.end();
		//throw err;
		} else {
        const sql = getDuplicateUpadateString(records, ROWS_ARRAY );
		let query = con.query(sql,  [values], function (err, result, fields) {
			if (err) {
				console.log(err.message);
				con.end();
						//throw err;
			} else {
				console.log("Success");
				con.end();
			}
			});
		console.log("Connected!");
		}
		
	});

	con.on('error', function(err) {
		console.log(err.message)
	});
}

/*
 * --------------------------------------------------------
 */
function putRecordsInMySQL(records){
    return new Promise( function(resolve,reject){
        const values = records;
    
        con.connect(function(err) {
            if (err){
            console.log(err.message);
            con.end();
            //throw err;
            } else {
            const sql = getDuplicateUpadateString(records, ROWS_ARRAY );
            let query = con.query(sql,  [values], function (err, result, fields) {
                if (err) {
                    console.log(err.message);
                    //con.end();
                    reject(err);
                            //throw err;
                } else {
                    console.log("Success");
                    con.end();
                    resolve(result);
                }
                });
            console.log("Connected!");
            }
            
        });
    
        con.on('error', function(err) {
            console.log(err.message)
        });
    });
}