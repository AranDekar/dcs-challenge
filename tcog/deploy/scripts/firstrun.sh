#!/bin/bash -x

# ============================================
# Run as part of the cloudformation - asg.json
# ============================================
# Source env variables
untarDir=/home/ec2-user/app/current
source $untarDir/envvars

sed -i "s/proxy-%NETWORKSECURITYENV%/proxy-${NetworkSecurityEnv}/g" /etc/yum.conf
sed -i "s/proxy-%NETWORKSECURITYENV%/proxy-${NetworkSecurityEnv}/g" /etc/profile
sed -i "s/proxy-%NETWORKSECURITYENV%/proxy-${NetworkSecurityEnv}/g" /etc/wgetrc
source /etc/profile

# =======================================
# Start stack driver
# =======================================
sed -i "s/%NETWORKSECURITYENV%/${NetworkSecurityEnv}/g" /etc/sysconfig/stackdriver
# service stackdriver-agent start
# service stackdriver-extractor start

# =======================================
# Config New Relic proxy
# =======================================
# sed -i "s/%NETWORKSECURITYENV%/dev/g" /etc/newrelic/nrsysmond.cfg

# ==========================================
# Replace Variables in sumo config
# ==========================================
SUMO_CONF=/etc/sumo.conf
SUMO_JSON_FILES=/etc/sumo.d/sumo-*.json
SUMO_WRAPPER_CONF=/opt/SumoCollector/config/wrapper.conf

sed -i "s/%HOSTNAME/$(hostname)/g" $SUMO_JSON_FILES $SUMO_CONF
sed -i "s/%PRODUCT/$Product/g" $SUMO_JSON_FILES
sed -i "s/%BRANCH/$NetworkSecurityEnv/g" $SUMO_JSON_FILES
sed -i "s/%BUILDNUMBER/$Release/g" $SUMO_JSON_FILES
sed -i "s/%APPLICATION/$Application/g" $SUMO_JSON_FILES
sed -i "s/%NODE_ENV/$NODE_ENV/g" $SUMO_JSON_FILES
sed -i "s/%NETWORKSECURITYENV%/$NetworkSecurityEnv/g" $SUMO_WRAPPER_CONF

chkconfig collector on
/opt/SumoCollector/collector start

# configure SSM agent
sed -i "s/%NETWORKSECURITYENV%/$NetworkSecurityEnv/g" /etc/init/amazon-ssm-agent.conf
stop amazon-ssm-agent
start amazon-ssm-agent

# check if this is spot using the isSpot microservice and if so,
# register with the load balancer, and tag itself
instance_id=$(curl --silent --retry 3 --fail http://169.254.169.254/latest/meta-data/instance-id)
account_id=$(curl --silent --retry 3 --fail http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .accountId)
aws_region=$(curl --silent --retry 3 --fail http://169.254.169.254/latest/meta-data/placement/availability-zone | sed -e 's/.$//')
if [[ $(curl --silent --retry 3 --fail "https://is-spot.ops.cp1.news.com.au/dev/is-spot?instanceId=${instance_id}&accountId=${account_id}&region=${aws_region}") == 'true' ]]; then
    aws --region $aws_region elb register-instances-with-load-balancer --load-balancer-name $LoadBalancerName --instances $instance_id
    aws --region $aws_region ec2 create-tags --resources $instance_id --tags \
        Key=Bu,Value="$TagBusinessUnit" \
        Key=Environment,Value="$NetworkSecurityEnv" \
        Key=Product,Value="${Product}" \
        Key=TargetCapacity,Value="$TargetCapacity" \
        Key=Name,Value="$Product-$NetworkSecurityEnv-$Application-$Release"
fi

# =======================================
# Start node application as the ec2-user user
# =======================================
su -c "(cd $untarDir/ && NSOLID_APPNAME=${Product}-${NODE_ENV} NSOLID_COMMAND=$NSolidConsoleHostPort NODE_ENV=$NODE_ENV npm run daemon)" ec2-user

