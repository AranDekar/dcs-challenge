#!/usr/bin/env bash

# this is used in the V2 deloyment pipeline to verify we can hit the ELB endpoint to get an OK status message

set -ex

ELBDNSName=$(aws cloudformation describe-stacks --stack-name ${bamboo_product}-${bamboo_NodeENV}-${bamboo_deploy_release}-autoscale | jq -r '.Stacks[].Outputs[] | select(.OutputKey == "ELBDNSName") | .OutputValue')
ENDPOINT="${ELBDNSName}/healthcheck?t_stack=true"
echo $ENDPOINT
HC_OUTPUT=$(no_proxy=${ELBDNSName} curl --silent --retry 3 --fail ${ENDPOINT} | jq -r .status)
echo $HC_OUTPUT
if [[ ${HC_OUTPUT} == "ok" ]]
then
    echo "ELB ${ENDPOINT} healthcheck passed"
    exit 0
else
    echo "ELB ${ENDPOINT} healthcheck failed"
    exit 1
fi

