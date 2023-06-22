#!/bin/bash
M2_REPO="/root/.m2/repository"
M2_JARS="${M2_REPO}/org/apache/logging/log4j/log4j-core/2.20.0/log4j-core-2.20.0.jar:${M2_REPO}/org/apache/logging/log4j/log4j-api/2.20.0/log4j-api-2.20.0.jar"
CCS_OUTPUT="./out"
CCS_JARS="${CCS_OUTPUT}/CCSAnnotationProcessor-1.0-SNAPSHOT.jar:${CCS_OUTPUT}/CCSDataService-1.0-SNAPSHOT.jar:${CCS_OUTPUT}/CCSWebServer-1.0-SNAPSHOT.jar"
java -classpath "${CCS_JARS}:${M2_JARS}" cn.ybits.server.CCSBootstrap >/dev/null 2>&1 &
