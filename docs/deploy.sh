# This script is used to automate the build and deploy processes of 
# the slate documentation to the S3 bucket that's been setup. 

#!/usr/bin/env bash
set -o errexit #abort if any command fails

run_build_internal() {
  echo "Building internal docs"
  cd internal-docs
  bundle exec middleman build --clean
}

run_build_api() {
  echo "Building api docs"
  cd api-docs
  bundle exec middleman build --clean
}

generate_keys() {
  echo "Generating keys"
  cd node_modules
  cd keys
  npm install --production
  export PATH=$PATH:$(pwd)/bin
  keys
  cd ..
  cd ..
}

push_to_s3_internal() {
  echo "Deploying internal docs"
  AWS_PROFILE="Digital:PROD:TCOGAdminsRole" aws s3 cp build/ s3://internal.docs.dcs.digprod.cp1.news.com.au/ --recursive
}

push_to_s3_api() {
  echo "Deploying api docs"
  AWS_PROFILE="Digital:PROD:TCOGAdminsRole" aws s3 cp build/ s3://docs.dcs.digprod.cp1.news.com.au/ --recursive
}

if [ "$1" = "internal" ]
then
    generate_keys
    run_build_internal
    push_to_s3_internal
elif [ "$1" = "api" ]
then
    generate_keys
    run_build_api
    push_to_s3_api
else
    echo "Invalid argument. Valid arguments are: internal or api"
fi
