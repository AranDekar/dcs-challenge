#!/usr/bin/env bash

set -ex
if [[ ! -f tcog-security-group-stack.json ]]; then
    echo "tcog-security-group-stack.json does not exist, exiting."
    exit 1
fi

AWS_PROF=${1:?"Need an AWS profile"}
AWS_VPC=${2:?"Need an AWS VPC name"}

if [[ ! -f ${AWS_VPC}.input.json ]]; then
    echo "${AWS_VPC}.input.json does not exist, exiting."
    exit 1
fi

CREATE_STACK_RESULTS=$(aws cloudformation --profile $AWS_PROF --region ap-southeast-2 create-stack \
    --cli-input-json file://${AWS_VPC}.input.json \
    --template-body file://tcog-security-group-stack.json)

echo "Stack results - $CREATE_STACK_RESULTS"
STACK_NAME=$(echo "$CREATE_STACK_RESULTS" | jq -r .StackId)
echo "Stack name - $STACK_NAME"
if [[ $STACK_NAME == "arn:aws:cloudformation"* ]]; then
    echo "Stack name is valid, waiting for it to finish.."
    aws cloudformation --profile $AWS_PROF --region ap-southeast-2 wait stack-create-complete --stack-name $STACK_NAME
    echo "Stack created."
else
    echo "Some error occurred"
    exit 1
fi


