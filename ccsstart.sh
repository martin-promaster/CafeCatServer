#!/bin/bash
M2_REPO="~/.m2/repository"
M2_JARS="${M2_REPO}/org/apache/logging/log4j/log4j-core/2.22.0/log4j-core-2.22.0.jar:${M2_REPO}/org/apache/logging/log4j/log4j-api/2.22.0/log4j-api-2.22.0.jar"
CCS_OUTPUT="./out"
CCS_JARS="${CCS_OUTPUT}/CCSAnnotationProcessor-1.0-SNAPSHOT.jar:${CCS_OUTPUT}/CCSDataService-1.0-SNAPSHOT.jar:${CCS_OUTPUT}/CCSWebServer-1.0-SNAPSHOT.jar"
echo "CLASSPATH is:" ${CCS_JARS}:${M2_JARS}
pid=$(ps -ef|grep CCS|grep -v grep|awk '{ print $2 }')
if [ -n "$pid" ]
then
    echo Application is running with process id $pid. Do NOT re-run the application.
else
    java -classpath "${CCS_JARS}:${M2_JARS}" cn.ybits.server.CCSBootstrap >/dev/null 2>&1 &
    pid=$(ps -ef|grep CCS|grep -v grep|awk '{ print $2 }')
    echo Application is running with process id $pid.
fi
