const con = require('./connection');


// con.connect(function(err) {
//     if (err){
//       console.log(err.message);
//     } else {
//         console.log("Connected!");
//     }
    
//   });
  
// con.on('error', function(err) {
//       console.log(err.message)
//   });

 const dt = new Date(); 
let day = dt.getDate();
console.log(day);
console.log(dt.getDay());
console.log(dt.getMonth());

/*
 * --------------------------------------------------------
 */
function getRecordsFromMySQL(records){
    return new Promise( function(resolve,reject){

        function performQuery(){
            const sql = getDuplicateUpadateString(records, ROWS_ARRAY );
            
            
            let query = con.query(sql,  [values], function (err, result, fields) {
               // console.log(query.sql);
                if (err) {
                    console.log(err.message);
                    reject(err);
                            //throw err;
                } else {
                    console.log("Success. BD state = "+ con.state);
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
