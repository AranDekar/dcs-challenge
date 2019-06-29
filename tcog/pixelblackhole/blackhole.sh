#!/bin/sh

if [ "$1" == 'activate' ]
then
	aws --profile news route53 change-resource-record-sets --hosted-zone-id Z20939JFZTRJAA --change-batch file://blackhole.json
elif [ "$1" == 'deactivate' ]
then
	aws --profile news route53 change-resource-record-sets --hosted-zone-id Z20939JFZTRJAA --change-batch file://remove-blackhole.json
else
	echo "Invalid syntax"
fi
