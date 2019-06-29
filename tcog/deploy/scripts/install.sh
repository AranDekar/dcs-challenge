#!/bin/bash
set -ex

# This script is run when pre-bake tcog-ami from SOE at the bamboo bake stage of build plan
# ===========================================
# This script will implement tasks below:
# set up proxy settings for curl/yum etc to access the internet
# install node and packages
# new relic agent stop
# remove proxy settings
# ===========================================

# =======================================
# Setup working directory
# =======================================
#=======================================
# Unpackage the application
#=======================================
untarDir=/home/ec2-user/app/current
mkdir -vp $untarDir
tar -xvzf /root/package.tar.gz -C $untarDir/
chown -R ec2-user:ec2-user $untarDir

# copy over the application's sumo collector configs
if [[ -d $untarDir/deploy/files/sumo.d ]]; then
    cp $untarDir/deploy/files/sumo.d/*.json /etc/sumo.d/
    chown -R root.root /etc/sumo.d
fi

# =============================================
# Define environment and yum update
# Set yum conf to use Bamboo Agent's prod proxy
# =============================================
sed -i "s/proxy-%NETWORKSECURITYENV%/proxy-dev/g" /etc/yum.conf
sed -i "s/proxy-%NETWORKSECURITYENV%/proxy-dev/g" /etc/profile
sed -i "s/proxy-%NETWORKSECURITYENV%/proxy-dev/g" /etc/wgetrc
source /etc/profile
yum clean all
yum -y update --security
yum -y install git

# increase the limit on the number of open files
cp $untarDir/deploy/files/tcog-limits.conf /etc/security/limits.d/
chown -R root.root /etc/security/limits.d
chmod -R 644 /etc/security/limits.d

# =======================================
# Install and configure node
# =======================================

if [[ -f $untarDir/deploy/scripts/install-node.sh ]]; then
    $untarDir/deploy/scripts/install-node.sh $untarDir
    export PATH=/usr/local/nodejs/bin:$PATH # add this to the path
fi

# install required node packages
pushd $untarDir
# Note NODE_ENV is to make it not install devDependencies, and *not* related
# to the eventual environment it will run under
NODE_ENV=production yarn install
mkdir logs
chown -R ec2-user:ec2-user /home/ec2-user
cp $untarDir/deploy/files/profile-tcog-node.sh /etc/profile.d/tcog-node.sh
chown root.root /etc/profile.d/tcog-node.sh
popd

# =======================================
# Stop Newrelic
# =======================================
service newrelic-sysmond stop

# =====================================================
# reset the proxy settings
# =====================================================
sed -i "s/proxy-dev/proxy-%NETWORKSECURITYENV%/g" /etc/yum.conf
sed -i "s/proxy-dev/proxy-%NETWORKSECURITYENV%/g" /etc/profile
sed -i "s/proxy-dev/proxy-%NETWORKSECURITYENV%/g" /etc/wgetrc

