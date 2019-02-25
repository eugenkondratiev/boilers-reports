/*
*  ����������� ������ �� ������� ������ � ������� bat-����� � ������������ ���������
* � ������ EasyConverter.exe
* �������� � ��� �� ����� ��� � ����������� ������  
* CSV_PATH - ���������� ����������, �������� CSV ������
* DTL_PATH - 
*/
var fs = require("fs");
const { spawn } = require('child_process');

const dtlpath = "server/";
const CSV_PATH = "bigdata/csv/";
const DTL_PATH = "bigdata/dtl/";
const BAT_NAME = "dtl_par.bat";

function getDtl(path, last ,  callback){
	console.log(path);
 fs.readdir(path,function(err, files) {
   if (err) {
      return console.error(err);
   }
	const dtls = files.filter((file) => file.includes('.dtl'))
			.map((f) => f.slice(0, -4));
	if (last > 0) {
		callback(dtls.slice(last * -1));
	} else {
		callback(dtls);
	} 
 });
}


const dtlFiles = getDtl(DTL_PATH, 2, function(dtls){
		console.log(dtls);//has array of .dtl. ready to  .csv convertion
//"C:\EBpro\EasyConverter.exe" /c8 /t0 "D:\JS\nodejs\server\%~1.dtl" "D:\JS\nodejs\server\%~1.csv"
		
	dtls.forEach( function(el){
				const ls = spawn('cmd.exe', ['/c', BAT_NAME, el], {shell: true, windowsHide: false});
		ls.stdout.on('data', (data) => {
		  console.log(data.toString());
		});
		
		ls.on('close', (code) => {
			  console.log(`child process exited with code ${code}`);
		});
		ls.on('error', (err) => {
  				console.log('Failed to start subprocess. ' + err.message);
		});
	});
		
});

