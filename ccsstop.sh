pid=$(ps -ef|grep CCS|grep -v grep|awk '{ print $2 }')
echo Applicatio is running with process id $pid
if [ -z "$pid" ]
then
	echo Application is not running.
else
	echo Killing $pid
	kill $pid
fi
