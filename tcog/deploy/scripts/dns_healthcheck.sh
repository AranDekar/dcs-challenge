#!/usr/bin/env bash

# this is used in the V2 deloyment pipeline to verify we can hit the floating DNS endpoint and get a 200

set -ex

ENDPOINT=$(aws cloudformation describe-stacks --stack-name ${bamboo_product}-${bamboo_NodeENV}-floatingdns | jq -r '.Stacks[].Outputs[] | select(.OutputKey == "FloatingDNS") | .OutputValue')
echo $ENDPOINT
HC_OUTPUT=$(no_proxy=${ENDPOINT} curl --silent --retry 3 --fail --output /dev/null -w "%{http_code}" ${ENDPOINT})
echo $HC_OUTPUT
if [[ ${HC_OUTPUT} == "200" ]]
then
    echo "ELB ${ENDPOINT} healthcheck passed"
    exit 0
else
    echo "ELB ${ENDPOINT} healthcheck failed"
    exit 1
fi

