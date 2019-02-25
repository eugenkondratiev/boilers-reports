@echo off
echo user uploadhis> ftpcmd.dat
echo 111111>> ftpcmd.dat
echo binary>> ftpcmd.dat

echo cd /pccard/SD_MMC0_1/HourReports3/>> ftpcmd.dat

echo mget *.*>> ftpcmd.dat

echo bye>> ftpcmd.dat

ftp -n -i -s:ftpcmd.dat 192.168.1.101


del ftpcmd.dat

xcopy *.dtl E:\js\node\server\bigdata\dtl /Y
del *.dtl /q
